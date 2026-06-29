'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  total: string;
  image: string;
};

type Order = {
  id: number;
  number: string;
  status: string;
  date: string;
  updated: string;
  total: string;
  currency_symbol: string;
  payment_method: string;
  billing: { name: string; email: string; address: string };
  shipping_address: string;
  items: OrderItem[];
};

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending:    'border-yellow-300 bg-yellow-50 text-yellow-700',
  processing: 'border-blue-300 bg-blue-50 text-blue-700',
  'on-hold':  'border-amber-300 bg-amber-50 text-amber-700',
  completed:  'border-green-300 bg-green-50 text-green-700',
  cancelled:  'border-red-300 bg-red-50 text-red-700',
  refunded:   'border-purple-300 bg-purple-50 text-purple-700',
  failed:     'border-red-300 bg-red-50 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
  pending:    'Awaiting Payment',
  processing: 'Processing',
  'on-hold':  'On Hold',
  completed:  'Completed',
  cancelled:  'Cancelled',
  refunded:   'Refunded',
  failed:     'Failed',
};

function getStatusStyle(status: string) {
  return STATUS_STYLES[status] ?? 'border-neutral-300 bg-neutral-50 text-neutral-700';
}

function getStatusLabel(status: string) {
  return STATUS_LABEL[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
}

export default function OrdersPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/account');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      try {
        const res = await fetch('/api/account/orders');
        if (res.ok) {
          const data = await res.json() as Order[];
          setOrders(data);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const stats = {
    total:      orders.length,
    pending:    orders.filter(o => o.status === 'pending' || o.status === 'on-hold').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed:  orders.filter(o => o.status === 'completed').length,
  };

  const getInitials = () => {
    if (!profile) return 'U';
    return ((profile.first_name?.[0] ?? '') + (profile.last_name?.[0] ?? '')).toUpperCase()
      || profile.email?.[0]?.toUpperCase()
      || 'U';
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/heart-health.jpg')", backgroundAttachment: 'fixed' }}
      />
      <div className="fixed inset-0 -z-10 bg-white/80" />

      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-1 py-6 lg:py-8">

        {/* Hero Banner */}
        <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-6 md:p-8 lg:p-12 mb-6 lg:mb-8 text-center text-white">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold rounded-full mb-3 lg:mb-4 text-xs lg:text-sm">
            Order History
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold! mb-3 lg:mb-4">
            My Orders
          </h1>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-white/90! max-w-3xl mx-auto mb-4 lg:mb-6">
            Track your purchases, view order details, and stay up to date with your deliveries.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#184363] font-bold rounded-lg hover:bg-neutral-100 transition-all shadow-lg text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Products
          </Link>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:sticky lg:top-6">

              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-neutral-200">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {getInitials()}
                </div>
                <p className="font-bold text-[#184363] text-lg mb-1">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-sm text-neutral-600">{profile?.email}</p>
              </div>

              {/* Navigation */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-3">Menu</label>
                <div className="space-y-2">
                  <Link
                    href="/account/dashboard"
                    className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                  <button className="w-full text-left px-3 py-2 bg-[#009eb9] text-white font-semibold rounded-lg text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </button>
                  <Link
                    href="/fill-script"
                    className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Submit Prescription
                  </Link>
                  <Link
                    href="/shop"
                    className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Shop Products
                  </Link>
                  <Link
                    href="/"
                    className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Order Stats */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-3">Orders</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Total</span>
                    <span className="font-bold text-[#009eb9]">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Awaiting</span>
                    <span className="font-bold text-yellow-600">{stats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Processing</span>
                    <span className="font-bold text-blue-600">{stats.processing}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Completed</span>
                    <span className="font-bold text-green-600">{stats.completed}</span>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full px-4 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-neutral-600 text-sm">
                {isLoading
                  ? 'Loading orders...'
                  : <><span className="font-bold text-[#184363]">{orders.length}</span> order{orders.length !== 1 ? 's' : ''} found</>
                }
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#009eb9] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#009eb9] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
              {[
                { label: 'Total', value: stats.total, color: 'text-[#009eb9]', bg: 'bg-[#009eb9]/10', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />, iconColor: 'text-[#009eb9]' },
                { label: 'Awaiting', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />, iconColor: 'text-yellow-600' },
                { label: 'Processing', value: stats.processing, color: 'text-blue-600', bg: 'bg-blue-100', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />, iconColor: 'text-blue-600' },
                { label: 'Completed', value: stats.completed, color: 'text-green-600', bg: 'bg-green-100', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />, iconColor: 'text-green-600' },
              ].map(({ label, value, color, bg, icon, iconColor }) => (
                <div key={label} className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 ${bg} rounded-lg`}>
                        <svg className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {icon}
                        </svg>
                      </div>
                      <span className={`text-2xl md:text-3xl font-extrabold ${color}`}>{value}</span>
                    </div>
                    <p className="text-xs font-bold text-neutral-600">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading skeleton */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md border border-neutral-200 p-5 md:p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-32 h-4 bg-neutral-200 rounded" />
                      <div className="w-20 h-4 bg-neutral-100 rounded" />
                    </div>
                    <div className="mt-3 w-24 h-6 bg-neutral-100 rounded-full" />
                    <div className="mt-3 w-16 h-4 bg-neutral-200 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && orders.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">No orders yet</h3>
                <p className="text-neutral-600 mb-6">Your order history will appear here once you've made a purchase.</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Start Shopping
                </Link>
              </div>
            )}

            {/* Grid view */}
            {!isLoading && orders.length > 0 && viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                {orders.map((order) => {
                  const symbol = order.currency_symbol;
                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white rounded-2xl shadow-md border border-neutral-200 p-5 md:p-6 hover:shadow-xl transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-[#184363] text-base md:text-lg">Order #{order.number}</p>
                          <p className="text-sm text-neutral-500 mt-0.5">
                            {new Date(order.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <p className="text-lg font-extrabold text-[#009eb9]">{symbol}{parseFloat(order.total).toFixed(2)}</p>
                      </div>
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        {order.items[0] ? ` · ${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}` : ''}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* List view */}
            {!isLoading && orders.length > 0 && viewMode === 'list' && (
              <div className="space-y-4">
                {orders.map((order) => {
                  const symbol = order.currency_symbol;
                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="w-full bg-white rounded-2xl shadow-md border border-neutral-200 p-5 md:p-6 hover:shadow-lg transition-all text-left"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <p className="font-bold text-[#184363] text-base md:text-lg">Order #{order.number}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-500 mb-1">
                            {new Date(order.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            {order.items[0] ? ` · ${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 sm:ml-auto shrink-0">
                          <p className="text-xl font-extrabold text-[#009eb9]">{symbol}{parseFloat(order.total).toFixed(2)}</p>
                          <div className="flex items-center gap-1 text-[#009eb9]">
                            <span className="text-sm font-semibold hidden sm:block">View</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-extrabold! text-[#184363]">Order #{selectedOrder.number}</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {new Date(selectedOrder.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getStatusStyle(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold! text-neutral-500 uppercase tracking-wide mb-1">Order Total</p>
                  <p className="text-2xl font-extrabold! text-[#009eb9]">
                    {selectedOrder.currency_symbol}{parseFloat(selectedOrder.total).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold! text-neutral-500 uppercase tracking-wide mb-1">Payment</p>
                  <p className="font-semibold! text-[#184363]">{selectedOrder.payment_method || '—'}</p>
                </div>
                {selectedOrder.billing.address && (
                  <div>
                    <p className="text-xs font-bold! text-neutral-500 uppercase tracking-wide mb-1">Billing Address</p>
                    <p className="text-sm text-neutral-600">{selectedOrder.billing.address}</p>
                  </div>
                )}
                {selectedOrder.shipping_address && (
                  <div>
                    <p className="text-xs font-bold! text-neutral-500 uppercase tracking-wide mb-1">Shipping Address</p>
                    <p className="text-sm text-neutral-600">{selectedOrder.shipping_address}</p>
                  </div>
                )}
              </div>

              {/* Line items */}
              <div>
                <p className="text-xs font-bold! text-neutral-500 uppercase tracking-wide mb-3">Items</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      {item.image && (
                        <div className="relative w-12 h-12 shrink-0 bg-white rounded-lg overflow-hidden border border-neutral-200">
                          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold! text-[#184363] line-clamp-2">{item.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold! text-[#184363] shrink-0">
                        {selectedOrder.currency_symbol}{parseFloat(item.total).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200">
                  <span className="font-bold! text-[#184363]">Order Total</span>
                  <span className="text-xl font-extrabold! text-[#009eb9]">
                    {selectedOrder.currency_symbol}{parseFloat(selectedOrder.total).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-6 py-3 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
