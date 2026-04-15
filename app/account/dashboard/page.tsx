'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

type Prescription = {
  id: string;
  prescription_number: string;
  patient_name: string;
  patient_phone: string;
  delivery_method: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeModal, setActiveModal] = useState<'prescription' | 'submit' | 'profile' | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);

        const { data: prescriptionsData } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setPrescriptions(prescriptionsData || []);
      }
    }

    loadData();
  }, []);

  const stats = {
    total: prescriptions.length,
    pending: prescriptions.filter(p => p.status === 'pending').length,
    processing: prescriptions.filter(p => p.status === 'processing').length,
    ready: prescriptions.filter(p => p.status === 'ready').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-300 bg-yellow-50 text-yellow-700';
      case 'processing':
        return 'border-blue-300 bg-blue-50 text-blue-700';
      case 'ready':
        return 'border-green-300 bg-green-50 text-green-700';
      default:
        return 'border-neutral-300 bg-neutral-50 text-neutral-700';
    }
  };

  const openPrescriptionModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setActiveModal('prescription');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPrescription(null);
  };

  const getInitials = () => {
    if (!profile) return 'U';
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    return (first + last).toUpperCase() || profile.email[0].toUpperCase();
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/heart-health.jpg')",
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-white/80" />

      {/* Content Container */}
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-1 py-6 lg:py-8">
        
        {/* Hero Banner */}
        <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-6 md:p-8 lg:p-12 mb-6 lg:mb-8 text-center text-white">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold rounded-full mb-3 lg:mb-4 text-xs lg:text-sm">
            Your Health Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold! mb-3 lg:mb-4">
            Welcome back, {profile?.first_name || 'there'}
          </h1>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-white/90! max-w-3xl mx-auto mb-4 lg:mb-6 font">
            Manage your prescriptions, track your orders, and stay on top of your health journey all in one place.
          </p>
          <button
            onClick={() => setActiveModal('submit')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#184363] font-bold rounded-lg hover:bg-neutral-100 transition-all shadow-lg text-sm lg:text-base cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit New Prescription
          </button>
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
                  <button className="w-full text-left px-3 py-2 bg-[#009eb9] text-white font-semibold rounded-lg text-sm">
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveModal('submit')}
                    className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Submit Prescription
                  </button>
                  <button
                    onClick={() => setActiveModal('profile')}
                    className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </button>
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

              {/* Prescription Stats */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-3">Prescriptions</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Total</span>
                    <span className="font-bold text-[#009eb9]">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Pending</span>
                    <span className="font-bold text-yellow-600">{stats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Processing</span>
                    <span className="font-bold text-blue-600">{stats.processing}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Ready</span>
                    <span className="font-bold text-green-600">{stats.ready}</span>
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
                Showing <span className="font-bold text-[#184363]">{prescriptions.length}</span> prescription{prescriptions.length !== 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#009eb9] text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#009eb9] text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Stats Cards - 100% Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
              
              {/* Total */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-[#009eb9]/10 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-[#184363]">{stats.total}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Total</p>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-yellow-600">{stats.pending}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Pending</p>
                </div>
              </div>

              {/* Processing */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-blue-600">{stats.processing}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Processing</p>
                </div>
              </div>

              {/* Ready */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-green-600">{stats.ready}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Ready</p>
                </div>
              </div>
            </div>

            

            {/* Prescriptions */}
            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">No prescriptions yet</h3>
                <p className="text-neutral-600 mb-6">Submit your first prescription to get started</p>
                <button
                  onClick={() => setActiveModal('submit')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Submit Prescription
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                {prescriptions.map((prescription) => (
                  <button
                    key={prescription.id}
                    onClick={() => openPrescriptionModal(prescription)}
                    className="bg-white rounded-2xl shadow-md border border-neutral-200 p-5 md:p-6 hover:shadow-xl transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#184363] text-base md:text-lg truncate">
                          {prescription.prescription_number}
                        </p>
                        <p className="text-sm text-neutral-600 mt-1 truncate">{prescription.patient_name}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(prescription.status)}`}>
                        {prescription.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{new Date(prescription.created_at).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <button
                    key={prescription.id}
                    onClick={() => openPrescriptionModal(prescription)}
                    className="w-full bg-white rounded-2xl shadow-md border border-neutral-200 p-5 md:p-6 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#184363] text-base md:text-lg mb-2 truncate">
                          {prescription.prescription_number}
                        </p>
                        <p className="text-sm text-neutral-600 mb-3 truncate">{prescription.patient_name}</p>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(prescription.status)}`}>
                            {prescription.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-neutral-500 truncate">
                            {new Date(prescription.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[#009eb9] sm:ml-auto shrink-0">
                        <span className="text-sm font-semibold">View Details</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Coming Soon Section */}
            <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-6 md:p-8 mt-8 opacity-60">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#184363]">E-Commerce Features</h2>
                <span className="px-3 py-1 bg-neutral-200 text-neutral-600 text-xs font-bold rounded-full shrink-0">
                  Coming Soon
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Orders */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                      <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-neutral-700">Orders</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Pending</span>
                      <span className="font-bold text-neutral-400">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Shipped</span>
                      <span className="font-bold text-neutral-400">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Delivered</span>
                      <span className="font-bold text-neutral-400">0</span>
                    </div>
                  </div>
                </div>

                {/* Wishlist */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                      <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-neutral-700">Wishlist</h3>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Save your favorite products
                  </p>
                </div>

                {/* Rewards */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                      <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-neutral-700">Rewards</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Points</span>
                      <span className="font-bold text-neutral-400">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Coupons</span>
                      <span className="font-bold text-neutral-400">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      
      {/* Prescription Detail Modal */}
      {activeModal === 'prescription' && selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-extrabold! text-[#184363]">Prescription Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(selectedPrescription?.status || 'pending')}`}>
                  {selectedPrescription?.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold! text-neutral-600 mb-1">Prescription Number</p>
                  <p className="text-lg font-extrabold! text-[#184363]">{selectedPrescription?.prescription_number}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-600 mb-1">Patient Name</p>
                  <p className="text-lg font-extrabold text-[#184363]">{selectedPrescription?.patient_name}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-600 mb-1">Phone</p>
                  <p className="text-lg font-extrabold text-[#184363]">{selectedPrescription?.patient_phone}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-600 mb-1">Delivery Method</p>
                  <p className="text-lg font-extrabold text-[#184363]">{selectedPrescription?.delivery_method}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-600 mb-1">Submitted</p>
                  <p className="text-lg font-extrabold text-[#184363]">{selectedPrescription?.created_at ? new Date(selectedPrescription.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-600 mb-1">Last Updated</p>
                  <p className="text-lg font-extrabold text-[#184363]">{selectedPrescription?.updated_at ? new Date(selectedPrescription.updated_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-200">
                <button
                  onClick={closeModal}
                  className="w-full px-6 py-3 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Prescription Modal */}
      {activeModal === 'submit' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-extrabold! text-[#184363]">Submit Prescription</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-neutral-600 mb-6">You'll be redirected to the prescription submission form.</p>
              <div className="space-y-3">
                <Link
                  href="/fill-script"
                  className="block w-full px-6 py-3 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors text-center"
                >
                  Go to Form
                </Link>
                <button
                  onClick={closeModal}
                  className="w-full px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:border-neutral-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-extrabold! text-[#184363]">Profile Settings</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={profile?.first_name}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={profile?.last_name}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={profile?.email}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={profile?.phone}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                />
              </div>
              <div className="pt-4 border-t border-neutral-200 flex gap-3">
                <button className="flex-1 px-6 py-3 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors">
                  Save Changes
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:border-neutral-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}