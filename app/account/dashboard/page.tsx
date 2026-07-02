'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getUserPrescriptions, getPresignedImageUrl } from '@/app/actions/prescriptions';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

type PrescriptionImage = {
  id: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
};

type DeliveryAddress = {
  street_address: string;
  suburb: string | null;
  city: string;
  province: string;
  postal_code: string;
};

type Prescription = {
  id: string;
  prescription_number: string;
  patient_name: string;
  patient_id_number: string | null;
  patient_phone: string;
  contact_email: string | null;
  doctor_name: string;
  doctor_practice_number: string | null;
  prescription_date: string;
  is_chronic: boolean;
  chronic_repeats_remaining: number | null;
  delivery_method: string;
  special_instructions: string | null;
  medical_aid_claim: boolean;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at: string;
  prescription_images: PrescriptionImage[];
  delivery_addresses: DeliveryAddress | null;
};

type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  postcode: string | null;
};

type Order = {
  id: number;
  number: string;
  status: string;
  date: string;
  total: string;
  currency_symbol: string;
  items: { id: number; name: string; quantity: number }[];
};

type JourneyEntry = {
  id: string;
  status: string;
  actor: string;
  note: string | null;
  created_at: string;
};

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS: Record<string, { label: string; badge: string; dot: string; step: number; hint: string }> = {
  submitted:     { label: 'Submitted',        badge: 'bg-teal-50    border-teal-200    text-teal-700',    dot: 'bg-teal-500',    step: 0, hint: 'Received — awaiting pharmacist review' },
  verifying:     { label: 'Under Review',     badge: 'bg-amber-50   border-amber-200   text-amber-700',   dot: 'bg-amber-500',   step: 1, hint: 'Our pharmacist is reviewing your prescription' },
  verified:      { label: 'Verified',         badge: 'bg-blue-50    border-blue-200    text-blue-700',    dot: 'bg-blue-500',    step: 1, hint: 'Your prescription has been verified' },
  dispensing:    { label: 'Being Prepared',   badge: 'bg-indigo-50  border-indigo-200  text-indigo-700',  dot: 'bg-indigo-500',  step: 2, hint: 'Your medication is being dispensed' },
  ready_collect: { label: 'Ready to Collect', badge: 'bg-green-50   border-green-200   text-green-700',   dot: 'bg-green-500',   step: 3, hint: 'Ready for collection from your pharmacy' },
  out_delivery:  { label: 'Out for Delivery', badge: 'bg-purple-50  border-purple-200  text-purple-700',  dot: 'bg-purple-500',  step: 3, hint: 'Your order is on its way to you' },
  completed:     { label: 'Completed',        badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-600', step: 5, hint: 'Prescription fulfilled successfully' },
  rejected:      { label: 'Rejected',         badge: 'bg-red-50     border-red-200     text-red-700',     dot: 'bg-red-500',     step: -1, hint: 'Please contact your pharmacy for more information' },
  cancelled:     { label: 'Cancelled',        badge: 'bg-red-50     border-red-200     text-red-700',     dot: 'bg-red-500',     step: -1, hint: 'Contact us for more information' },
  on_hold:       { label: 'On Hold',          badge: 'bg-orange-50  border-orange-200  text-orange-700',  dot: 'bg-orange-500',  step: -1, hint: 'We may need to contact you for more details' },
  // legacy aliases
  pending:       { label: 'Under Review',     badge: 'bg-amber-50   border-amber-200   text-amber-700',   dot: 'bg-amber-500',   step: 1, hint: 'Our pharmacist is reviewing your prescription' },
  processing:    { label: 'Being Prepared',   badge: 'bg-indigo-50  border-indigo-200  text-indigo-700',  dot: 'bg-indigo-500',  step: 2, hint: 'Your medication is being prepared' },
  ready:         { label: 'Ready',            badge: 'bg-green-50   border-green-200   text-green-700',   dot: 'bg-green-500',   step: 3, hint: 'Ready for collection or dispatch' },
  dispatched:    { label: 'Out for Delivery', badge: 'bg-purple-50  border-purple-200  text-purple-700',  dot: 'bg-purple-500',  step: 3, hint: 'Your order is on its way' },
};

const TIMELINE = [
  { key: 'submitted',    label: 'Submitted' },
  { key: 'verifying',   label: 'Reviewing' },
  { key: 'dispensing',  label: 'Preparing' },
  { key: 'ready_collect', label: 'Ready' },
  { key: 'completed',   label: 'Complete' },
];

function cfg(status: string) { return STATUS[status] ?? STATUS.submitted; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(d);
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const c = cfg(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${c.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function StatusTimeline({ status }: { status: string }) {
  const step = cfg(status).step;

  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-red-800 text-sm">Prescription Cancelled</p>
          <p className="text-xs text-red-600 mt-0.5">Please contact the pharmacy for assistance</p>
        </div>
      </div>
    );
  }

  if (status === 'on_hold') {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-orange-800 text-sm">On Hold</p>
          <p className="text-xs text-orange-600 mt-0.5">We may need to contact you — please check your WhatsApp</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-start px-2">
      {TIMELINE.map((tStep, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={tStep.key} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div className={`absolute top-3.5 right-1/2 w-full h-0.5 -z-0 ${done || active ? 'bg-[#009eb9]' : 'bg-neutral-200'}`} />
            )}
            <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              done    ? 'bg-[#009eb9] text-white shadow' :
              active  ? 'bg-[#009eb9] text-white ring-4 ring-[#009eb9]/25 shadow-lg' :
                        'bg-neutral-100 text-neutral-400 border border-neutral-200'
            }`}>
              {done
                ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                : <span>{i + 1}</span>
              }
            </div>
            <p className={`mt-2 text-[10px] text-center font-semibold leading-tight max-w-[52px] ${
              active ? 'text-[#009eb9]' : done ? 'text-neutral-600' : 'text-neutral-400'
            }`}>{tStep.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Prescription card (grid) ─────────────────────────────────────────────────

function PrescriptionCard({ rx, onClick }: { rx: Prescription; onClick: () => void }) {
  const c = cfg(rx.status);
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-left overflow-hidden w-full"
    >
      {/* colour strip */}
      <div className={`h-1 w-full ${c.dot}`} />

      <div className="p-5">
        {/* top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <StatusBadge status={rx.status} />
          {rx.is_chronic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-bold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Chronic
            </span>
          )}
        </div>

        {/* Rx number */}
        <p className="font-black text-[#184363] text-base tracking-tight mb-0.5 truncate">
          {rx.prescription_number}
        </p>

        {/* Doctor */}
        <p className="text-sm font-semibold text-neutral-700 truncate mb-0.5">
          {rx.doctor_name}
        </p>

        {/* Patient */}
        <p className="text-xs text-neutral-500 truncate mb-4">{rx.patient_name}</p>

        {/* Prescription date */}
        {rx.prescription_date && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
            <svg className="w-3.5 h-3.5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Rx date: {fmtDate(rx.prescription_date)}</span>
          </div>
        )}

        <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            {rx.delivery_method === 'delivery'
              ? <svg className="w-3.5 h-3.5 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              : <svg className="w-3.5 h-3.5 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            }
            <span className="capitalize">{rx.delivery_method}</span>
          </div>
          <span className="text-xs text-neutral-400">{timeAgo(rx.created_at)}</span>
        </div>
      </div>

      {/* hover cta */}
      <div className="flex items-center justify-center gap-1.5 py-2.5 bg-[#009eb9]/5 border-t border-[#009eb9]/10 text-[#009eb9] text-xs font-bold group-hover:bg-[#009eb9]/10 transition-colors">
        View Details
        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
      </div>
    </button>
  );
}

// ─── Prescription row (list) ──────────────────────────────────────────────────

function PrescriptionRow({ rx, onClick }: { rx: Prescription; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-[#009eb9]/30 transition-all duration-150 text-left"
    >
      <div className="flex items-center gap-4 p-4">
        <div className={`w-1 self-stretch rounded-full ${cfg(rx.status).dot} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-black text-[#184363] text-sm">{rx.prescription_number}</p>
            <StatusBadge status={rx.status} />
            {rx.is_chronic && (
              <span className="px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-bold">Chronic</span>
            )}
          </div>
          <p className="text-xs text-neutral-600 truncate">{rx.doctor_name} · {rx.patient_name}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end shrink-0 gap-1">
          <span className="text-xs text-neutral-500 capitalize flex items-center gap-1">
            {rx.delivery_method === 'delivery'
              ? <svg className="w-3 h-3 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              : <svg className="w-3 h-3 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            }
            {rx.delivery_method}
          </span>
          <span className="text-xs text-neutral-400">{timeAgo(rx.created_at)}</span>
        </div>
        <svg className="w-4 h-4 text-[#009eb9] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// ─── Detail section helper ────────────────────────────────────────────────────

function DetailSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-[#009eb9]/10 rounded-lg flex items-center justify-center text-[#009eb9]">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-neutral-100 last:border-0">
      <span className="text-xs text-neutral-500 shrink-0">{label}</span>
      <span className="text-xs font-semibold text-neutral-800 text-right">{value}</span>
    </div>
  );
}

const SA_PROVINCES = ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','North West','Northern Cape','Western Cape'];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeModal, setActiveModal] = useState<'prescription' | 'submit' | 'profile' | null>(null);
  const [selected, setSelected] = useState<Prescription | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [copied, setCopied] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity]         = useState('');
  const [province, setProvince] = useState('');
  const [postcode, setPostcode] = useState('');
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [journeyLog, setJourneyLog] = useState<JourneyEntry[]>([]);
  const [journeyLoading, setJourneyLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/account'); return; }

      const [{ data: profileData }, prescriptionsData] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        getUserPrescriptions(user.id),
      ]);

      setProfile(profileData);
      setFirstName(profileData?.first_name ?? '');
      setLastName(profileData?.last_name ?? '');
      setPhone(profileData?.phone ?? '');
      setAddress1(profileData?.address1 ?? '');
      setAddress2(profileData?.address2 ?? '');
      setCity(profileData?.city ?? '');
      setProvince(profileData?.province ?? '');
      setPostcode(profileData?.postcode ?? '');
      setPrescriptions(prescriptionsData as Prescription[]);

      fetch('/api/account/orders')
        .then(r => r.ok ? r.json() : [])
        .then((orders: Order[]) => setRecentOrders(orders.slice(0, 3)))
        .finally(() => setOrdersLoading(false));

      // Realtime: reflect status updates from manager immediately
      const channel = supabase
        .channel('patient-prescription-updates')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'prescriptions', filter: `user_id=eq.${user.id}` },
          (payload) => {
            const updated = payload.new as Partial<Prescription> & { id: string };
            setPrescriptions(prev =>
              prev.map(p => p.id === updated.id ? { ...p, ...updated } : p)
            );
            setSelected(prev =>
              prev?.id === updated.id ? { ...prev, ...updated } : prev
            );
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selected?.prescription_images?.length) {
      setImageUrls({});
      return;
    }
    setLoadingImages(true);
    setImageUrls({});
    Promise.all(
      selected.prescription_images.map(async (img) => {
        const url = await getPresignedImageUrl(img.storage_path);
        return { id: img.id, url };
      })
    ).then((results) => {
      const map: Record<string, string> = {};
      results.forEach(({ id, url }) => { if (url) map[id] = url; });
      setImageUrls(map);
      setLoadingImages(false);
    });
  }, [selected]);

  useEffect(() => {
    if (!selected) { setJourneyLog([]); return; }
    setJourneyLoading(true);
    fetch(`/api/account/prescriptions/${selected.id}/log`)
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setJourneyLog(data) : setJourneyLog([]))
      .catch(() => setJourneyLog([]))
      .finally(() => setJourneyLoading(false));
  }, [selected]);

  const handlePrint = () => {
    window.print();
  };

  const openModal = (rx: Prescription) => { setSelected(rx); setActiveModal('prescription'); };
  const closeModal = () => { setActiveModal(null); setSelected(null); setImageUrls({}); };

  const copyRx = async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(selected.prescription_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    total:     prescriptions.length,
    active:    prescriptions.filter(p => ['submitted','pending','processing'].includes(p.status)).length,
    ready:     prescriptions.filter(p => p.status === 'ready').length,
    completed: prescriptions.filter(p => ['completed','dispatched'].includes(p.status)).length,
  };

  const filterOpts = [
    { label: 'All',        value: 'all',        count: prescriptions.length },
    { label: 'Active',     value: 'active',      count: stats.active },
    { label: 'Ready',      value: 'ready',       count: stats.ready },
    { label: 'Completed',  value: 'completed',   count: 0 },
    { label: 'Cancelled',  value: 'cancelled',   count: 0 },
  ].map(o => {
    const c = o.value === 'active'
      ? prescriptions.filter(p => ['submitted','pending','processing'].includes(p.status)).length
      : o.value === 'completed'
      ? prescriptions.filter(p => ['completed','dispatched'].includes(p.status)).length
      : o.value === 'all'
      ? prescriptions.length
      : prescriptions.filter(p => p.status === o.value).length;
    return { ...o, count: c };
  });

  const filtered = (() => {
    if (statusFilter === 'all') return prescriptions;
    if (statusFilter === 'active') return prescriptions.filter(p => ['submitted','pending','processing'].includes(p.status));
    if (statusFilter === 'completed') return prescriptions.filter(p => ['completed','dispatched'].includes(p.status));
    return prescriptions.filter(p => p.status === statusFilter);
  })();

  const getInitials = () => {
    if (!profile) return 'U';
    return ((profile.first_name?.[0] || '') + (profile.last_name?.[0] || '')).toUpperCase() || profile.email[0].toUpperCase();
  };

  const whatsappMsg = selected
    ? encodeURIComponent(`Hi Sparkport Pharmacy, I'm following up on my prescription ${selected.prescription_number}. Could you please give me an update?`)
    : '';

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/heart-health.jpg')", backgroundAttachment: 'fixed' }} />
      <div className="fixed inset-0 -z-10 bg-white/80" />

      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-1 py-6 lg:py-8">

        {/* Hero */}
        <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-6 md:p-8 lg:p-12 mb-6 lg:mb-8 text-center text-white">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold rounded-full mb-3 text-xs lg:text-sm">
            Your Health Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold! mb-3">
            Welcome back, {profile?.first_name || 'there'}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-white/90! max-w-3xl mx-auto mb-6">
            Manage your prescriptions, track your orders, and stay on top of your health journey.
          </p>
          <Link
            href="/fill-script"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#184363] font-bold rounded-lg hover:bg-neutral-100 transition-all shadow-lg text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Submit New Prescription
          </Link>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:sticky lg:top-6">

              <div className="text-center mb-6 pb-6 border-b border-neutral-100">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {getInitials()}
                </div>
                <p className="font-bold text-[#184363] text-base">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{profile?.email}</p>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-2">Menu</p>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#009eb9] text-white font-semibold rounded-lg text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  Dashboard
                </div>
                <Link href="/account/orders" className="flex items-center gap-2 px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg text-sm transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  My Orders
                </Link>
                <Link href="/fill-script" className="flex items-center gap-2 px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg text-sm transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Submit Prescription
                </Link>
                <button onClick={() => setActiveModal('profile')} className="w-full flex items-center gap-2 px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg text-sm transition-all text-left">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile Settings
                </button>
                <Link href="/" className="flex items-center gap-2 px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg text-sm transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Back to Home
                </Link>
              </div>

              <div className="mb-6 bg-neutral-50 rounded-xl border border-neutral-100 p-4">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Prescriptions</p>
                <div className="space-y-2">
                  {[
                    { label: 'Total', val: stats.total, color: 'text-[#009eb9]' },
                    { label: 'Active', val: stats.active, color: 'text-amber-600' },
                    { label: 'Ready', val: stats.ready, color: 'text-green-600' },
                    { label: 'Completed', val: stats.completed, color: 'text-emerald-700' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">{label}</span>
                      <span className={`font-bold ${color}`}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form action="/api/auth/signout" method="post">
                <button type="submit" className="w-full px-4 py-2 border-2 border-red-400 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm">
                  Sign Out
                </button>
              </form>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* Stats bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total', val: stats.total, color: 'text-[#184363]', bg: 'bg-[#009eb9]/10', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
                { label: 'Active', val: stats.active, color: 'text-amber-600', bg: 'bg-amber-100', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                { label: 'Ready', val: stats.ready, color: 'text-green-600', bg: 'bg-green-100', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                { label: 'Completed', val: stats.completed, color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> },
              ].map(({ label, val, color, bg, icon }) => (
                <div key={label} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`p-1.5 rounded-lg ${bg}`}>
                      <svg className={`w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
                    </div>
                    <span className={`text-2xl font-extrabold ${color}`}>{val}</span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Filter tabs + view toggle */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {filterOpts.map(o => (
                  <button
                    key={o.value}
                    onClick={() => setStatusFilter(o.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      statusFilter === o.value
                        ? 'bg-[#009eb9] text-white shadow'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {o.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${statusFilter === o.value ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                      {o.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {(['grid','list'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`p-2 rounded-lg transition-all ${viewMode === m ? 'bg-[#009eb9] text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                  >
                    {m === 'grid'
                      ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" /></svg>
                      : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    }
                  </button>
                ))}
              </div>
            </div>

            {/* Prescriptions */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-neutral-800 mb-1">
                  {statusFilter === 'all' ? 'No prescriptions yet' : `No ${statusFilter} prescriptions`}
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  {statusFilter === 'all' ? 'Submit your first prescription to get started' : 'Try a different filter'}
                </p>
                <Link href="/fill-script" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Submit Prescription
                </Link>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(rx => <PrescriptionCard key={rx.id} rx={rx} onClick={() => openModal(rx)} />)}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(rx => <PrescriptionRow key={rx.id} rx={rx} onClick={() => openModal(rx)} />)}
              </div>
            )}

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#184363]">Recent Orders</h2>
                <Link href="/account/orders" className="text-xs font-bold text-[#009eb9] hover:text-[#184363] transition-colors flex items-center gap-1">
                  View all
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>

              {ordersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-neutral-600 mb-1">No orders yet</p>
                  <Link href="/" className="text-xs text-[#009eb9] font-bold hover:underline">Visit the shop →</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(order => {
                    const statusColor: Record<string, string> = {
                      completed:  'bg-emerald-50 border-emerald-200 text-emerald-700',
                      processing: 'bg-blue-50 border-blue-200 text-blue-700',
                      'on-hold':  'bg-amber-50 border-amber-200 text-amber-700',
                      pending:    'bg-neutral-100 border-neutral-200 text-neutral-600',
                      cancelled:  'bg-red-50 border-red-200 text-red-600',
                      refunded:   'bg-purple-50 border-purple-200 text-purple-700',
                    };
                    const badgeCls = statusColor[order.status] ?? 'bg-neutral-100 border-neutral-200 text-neutral-600';
                    const label = order.status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                    return (
                      <div key={order.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200 hover:border-[#009eb9]/30 hover:shadow-sm transition-all">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className="font-black text-[#184363] text-sm">#{order.number}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeCls}`}>
                              {label}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 truncate">
                            {order.items.length === 1
                              ? order.items[0].name
                              : `${order.items[0]?.name} +${order.items.length - 1} more`}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-[#184363] text-sm">{order.currency_symbol}{parseFloat(order.total).toFixed(2)}</p>
                          <p className="text-[10px] text-neutral-400">{fmtDate(order.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ── Prescription detail modal ───────────────────────────────────────── */}
      {activeModal === 'prescription' && selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 overflow-hidden animate-[slideUp_0.25s_ease-out]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-6 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-black text-[#184363] truncate">{selected.prescription_number}</h2>
                    <StatusBadge status={selected.status} />
                  </div>
                  <p className="text-xs text-neutral-500">{cfg(selected.status).hint}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={copyRx}
                    title="Copy prescription number"
                    className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-[#009eb9] transition-colors"
                  >
                    {copied
                      ? <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    }
                  </button>
                  <button onClick={closeModal} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">

              {/* Timeline */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Progress</p>
                <StatusTimeline status={selected.status} />
                <p className="text-xs text-neutral-500 text-center mt-3">
                  Submitted {timeAgo(selected.created_at)} · Last updated {timeAgo(selected.updated_at)}
                </p>
              </div>

              {/* Patient + Doctor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailSection title="Patient" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                  <DetailRow label="Name" value={selected.patient_name} />
                  <DetailRow label="Phone" value={selected.patient_phone} />
                  {selected.contact_email && <DetailRow label="Email" value={selected.contact_email} />}
                  {selected.patient_id_number && <DetailRow label="ID Number" value={selected.patient_id_number} />}
                </DetailSection>

                <DetailSection title="Doctor" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}>
                  <DetailRow label="Name" value={selected.doctor_name} />
                  {selected.doctor_practice_number && <DetailRow label="Practice No." value={selected.doctor_practice_number} />}
                  <DetailRow label="Rx Date" value={fmtDate(selected.prescription_date)} />
                  <DetailRow label="Type" value={selected.is_chronic ? `Chronic${selected.chronic_repeats_remaining != null ? ` (${selected.chronic_repeats_remaining} repeats left)` : ''}` : 'Once-off'} />
                </DetailSection>
              </div>

              {/* Delivery + Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailSection title="Delivery / Collection" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}>
                  <DetailRow label="Method" value={<span className="capitalize">{selected.delivery_method}</span>} />
                  {selected.delivery_addresses && selected.delivery_method === 'delivery' && (
                    <DetailRow
                      label="Address"
                      value={[
                        selected.delivery_addresses.street_address,
                        selected.delivery_addresses.suburb,
                        selected.delivery_addresses.city,
                        selected.delivery_addresses.province,
                        selected.delivery_addresses.postal_code,
                      ].filter(Boolean).join(', ')}
                    />
                  )}
                </DetailSection>

                <DetailSection title="Payment" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}>
                  <DetailRow label="Medical Aid" value={selected.medical_aid_claim ? 'Yes' : 'Self-pay'} />
                  <DetailRow label="Payment Status" value={<span className="capitalize">{selected.payment_status?.replace(/_/g, ' ')}</span>} />
                </DetailSection>
              </div>

              {/* Special instructions */}
              {selected.special_instructions && (
                <DetailSection title="Special Instructions" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}>
                  <div className="space-y-1.5">
                    {selected.special_instructions.split(' | ').map((line, i) => (
                      <p key={i} className={`text-xs ${line.startsWith('ALLERGIES') ? 'text-red-700 font-bold' : 'text-neutral-700'}`}>{line}</p>
                    ))}
                  </div>
                </DetailSection>
              )}

              {/* Prescription images */}
              {selected.prescription_images?.length > 0 && (
                <DetailSection title="Prescription Image" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                  {selected.prescription_images.map(img => (
                    <div key={img.id} className="mt-2">
                      {loadingImages ? (
                        <div className="h-48 bg-neutral-100 rounded-xl flex items-center justify-center">
                          <div className="animate-spin w-6 h-6 border-2 border-[#009eb9] border-t-transparent rounded-full" />
                        </div>
                      ) : imageUrls[img.id] ? (
                        img.mime_type === 'application/pdf' ? (
                          <a
                            href={imageUrls[img.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                          >
                            <svg className="w-8 h-8 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-neutral-800 truncate">{img.file_name}</p>
                              <p className="text-xs text-neutral-500">{fmtBytes(img.file_size)} · Click to open PDF</p>
                            </div>
                          </a>
                        ) : (
                          <a href={imageUrls[img.id]} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-neutral-200 hover:opacity-90 transition-opacity">
                            <img src={imageUrls[img.id]} alt={img.file_name} className="w-full max-h-80 object-contain bg-neutral-50" />
                            <p className="text-xs text-neutral-500 px-3 py-2 bg-neutral-50">{img.file_name} · {fmtBytes(img.file_size)}</p>
                          </a>
                        )
                      ) : (
                        <div className="h-20 bg-neutral-100 rounded-xl flex items-center justify-center text-xs text-neutral-500">
                          Image unavailable
                        </div>
                      )}
                    </div>
                  ))}
                </DetailSection>
              )}

              {/* Prescription Journey */}
              <DetailSection title="Prescription Journey" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}>
                {journeyLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => <div key={i} className="h-10 bg-neutral-100 rounded-lg animate-pulse" />)}
                  </div>
                ) : journeyLog.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-3">Your prescription journey will appear here as it progresses.</p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-neutral-200" />
                    <div className="space-y-3">
                      {journeyLog.map((entry, i) => (
                        <div key={entry.id} className="relative flex gap-3 pl-8">
                          <div className={`absolute left-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm mt-0.5 shrink-0 ${i === journeyLog.length - 1 ? 'bg-[#009eb9]' : 'bg-neutral-300'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#184363]">{entry.status}</span>
                              <span className="text-[10px] text-neutral-400">by {entry.actor}</span>
                            </div>
                            {entry.note && <p className="text-xs text-neutral-500 mt-0.5 italic">{entry.note}</p>}
                            <p className="text-[10px] text-neutral-400 mt-0.5">{new Date(entry.created_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#184363] border border-neutral-200 rounded-lg hover:border-[#009eb9] hover:text-[#009eb9] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print
                      </button>
                      {typeof navigator !== 'undefined' && 'share' in navigator && (
                        <button
                          onClick={() => navigator.share({ title: `Prescription ${selected?.prescription_number}`, text: journeyLog.map(e => `${e.status} — ${new Date(e.created_at).toLocaleString('en-ZA')}`).join('\n') })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#184363] border border-neutral-200 rounded-lg hover:border-[#009eb9] hover:text-[#009eb9] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                          Share
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </DetailSection>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`https://wa.me/27000000000?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Contact Pharmacist
                </a>
                <Link
                  href="/fill-script"
                  onClick={closeModal}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#009eb9] hover:bg-[#184363] text-white font-bold rounded-xl transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Submit Another
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold! text-[#184363]">Profile Settings</h2>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile?.email ?? ''}
                  readOnly
                  className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                />
              </div>

              {/* Address section */}
              <div className="border-t border-neutral-100 pt-4 mt-2">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Delivery & Billing Address</p>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address1}
                    onChange={e => setAddress1(e.target.value)}
                    placeholder="12 Main Road"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-neutral-700 mb-1">
                    Apartment / Unit <span className="font-normal text-neutral-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={address2}
                    onChange={e => setAddress2(e.target.value)}
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Durban"
                      className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Province</label>
                    <select
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                    >
                      <option value="">Select province</option>
                      {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={e => setPostcode(e.target.value)}
                    placeholder="4001"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>
              </div>

              {saveMsg && (
                <p className={`text-sm font-semibold ${saveMsg === 'Saved!' ? 'text-green-600' : 'text-red-500'}`}>
                  {saveMsg}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  disabled={isSaving}
                  onClick={async () => {
                    setIsSaving(true);
                    setSaveMsg('');
                    try {
                      const res = await fetch('/api/account/profile', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ first_name: firstName, last_name: lastName, phone, address1, address2, city, province, postcode }),
                      });
                      if (!res.ok) throw new Error();
                      setProfile(prev => prev ? { ...prev, first_name: firstName, last_name: lastName, phone, address1, address2, city, province, postcode } : prev);
                      setSaveMsg('Saved!');
                    } catch {
                      setSaveMsg('Failed — please try again');
                    } finally {
                      setIsSaving(false);
                      setTimeout(() => setSaveMsg(''), 3000);
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </button>
                <button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2.5 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:border-neutral-400 transition-colors text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
