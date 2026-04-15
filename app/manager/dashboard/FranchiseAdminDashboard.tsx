'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { managerSignOut } from '../actions';

type Prescription = {
  id: string;
  prescription_number: string;
  patient_name: string;
  patient_phone: string;
  contact_email: string;
  delivery_method: string;
  status: string;
  is_anonymous: boolean;
  preferred_pharmacy_id: string;
  created_at: string;
  updated_at: string;
  delivery_address_id?: string | null;
};

type Pharmacy = {
  id: string;
  name: string;
  city: string;
  street_address: string;
  phone: string | null;
};

type Manager = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type StoreStats = {
  pharmacy_id: string;
  pharmacy_name: string;
  total: number;
  submitted: number;
  verifying: number;
  dispensing: number;
  ready_collect: number;
  completed: number;
};

export default function FranchiseAdminDashboard() {
  const [manager, setManager] = useState<Manager | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStore, setFilterStore] = useState<string>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // New state variables for image viewing
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Load prescription details when modal opens
  useEffect(() => {
    if (selectedPrescription && showModal) {
      loadPrescriptionDetails(selectedPrescription.id);
    }
  }, [selectedPrescription, showModal]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/manager/login';
        return;
      }

      // Get manager profile
      const { data: managerData, error: managerError } = await supabase
        .from('managers')
        .select('*')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single();

      if (managerError || !managerData || managerData.role !== 'franchise_admin') {
        console.error('Not a franchise admin:', managerError);
        window.location.href = '/manager/login';
        return;
      }

      setManager(managerData);

      // Get all pharmacies
      const { data: pharmaciesData, error: pharmaciesError } = await supabase
        .from('pharmacies')
        .select('id, name, city, street_address, phone')
        .order('name');

      if (pharmaciesError) {
        console.error('Pharmacies error:', pharmaciesError);
      } else {
        setPharmacies(pharmaciesData || []);
      }

      // Get all prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (prescriptionsError) {
        console.error('Prescriptions error:', prescriptionsError);
      } else {
        setPrescriptions(prescriptionsData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrescriptionDetails = async (prescriptionId: string) => {
    setImageLoading(true);
    setPrescriptionImage(null);
    setDeliveryAddress(null);

    try {
      // Load prescription image (get first one if multiple exist)
      const { data: imageData, error: imageError } = await supabase
        .from('prescription_images')
        .select('*')
        .eq('prescription_id', prescriptionId)
        .limit(1);

      if (imageError) {
        console.error('❌ Image Query Error:', imageError.message);
      } else if (!imageData || imageData.length === 0) {
        // No image on record
      } else {
        const firstImage = imageData[0];
        const { data: urlData } = supabase.storage
          .from('prescriptions')
          .getPublicUrl(firstImage.storage_path);
        
        if (urlData?.publicUrl) {
          try {
            const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              setPrescriptionImage(urlData.publicUrl);
            }
          } catch (fetchError) {
            console.error('❌ URL test failed:', fetchError);
          }
        }
      }

      // Load delivery address if exists
      if (selectedPrescription?.delivery_address_id) {
        const { data: addressData, error: addressError } = await supabase
          .from('delivery_addresses')
          .select('*')
          .eq('id', selectedPrescription.delivery_address_id)
          .single();

        if (!addressError && addressData) {
          setDeliveryAddress(addressData);
        }
      }
    } catch (error) {
      console.error('❌ UNEXPECTED ERROR:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const updatePrescriptionStatus = async (prescriptionId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', prescriptionId)
        .select();

      if (error) {
        console.error('Update status error:', error);
        alert('Failed to update status: ' + error.message);
        return;
      }

      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const reassignPrescription = async (prescriptionId: string, newPharmacyId: string) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .update({ 
          preferred_pharmacy_id: newPharmacyId,
          updated_at: new Date().toISOString()
        })
        .eq('id', prescriptionId)
        .select();

      if (error) {
        console.error('Reassign error:', error);
        alert('Failed to reassign prescription: ' + error.message);
        return;
      }

      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error reassigning:', error);
      alert('Failed to reassign prescription');
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterStore !== 'all' && p.preferred_pharmacy_id !== filterStore) return false;
    return true;
  });

  const stats = {
    total: prescriptions.length,
    submitted: prescriptions.filter(p => p.status === 'submitted').length,
    verifying: prescriptions.filter(p => p.status === 'verifying').length,
    dispensing: prescriptions.filter(p => p.status === 'dispensing').length,
    ready_collect: prescriptions.filter(p => p.status === 'ready_collect').length,
    completed: prescriptions.filter(p => p.status === 'completed').length,
  };

  const storeStats: StoreStats[] = pharmacies.map(pharmacy => {
    const storePrescriptions = prescriptions.filter(p => p.preferred_pharmacy_id === pharmacy.id);
    return {
      pharmacy_id: pharmacy.id,
      pharmacy_name: pharmacy.name,
      total: storePrescriptions.length,
      submitted: storePrescriptions.filter(p => p.status === 'submitted').length,
      verifying: storePrescriptions.filter(p => p.status === 'verifying').length,
      dispensing: storePrescriptions.filter(p => p.status === 'dispensing').length,
      ready_collect: storePrescriptions.filter(p => p.status === 'ready_collect').length,
      completed: storePrescriptions.filter(p => p.status === 'completed').length,
    };
  });

  const getPharmacyName = (pharmacyId: string) => {
    const pharmacy = pharmacies.find(p => p.id === pharmacyId);
    if (!pharmacy) return 'Unknown Store';
    return pharmacy.name;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'border-yellow-300 bg-yellow-50 text-yellow-700';
      case 'verifying':
        return 'border-blue-300 bg-blue-50 text-blue-700';
      case 'verified':
        return 'border-purple-300 bg-purple-50 text-purple-700';
      case 'dispensing':
        return 'border-indigo-300 bg-indigo-50 text-indigo-700';
      case 'ready_collect':
        return 'border-green-300 bg-green-50 text-green-700';
      case 'out_delivery':
        return 'border-cyan-300 bg-cyan-50 text-cyan-700';
      case 'completed':
        return 'border-neutral-300 bg-neutral-50 text-neutral-700';
      case 'rejected':
        return 'border-red-300 bg-red-50 text-red-700';
      case 'cancelled':
        return 'border-neutral-300 bg-neutral-50 text-neutral-700';
      default:
        return 'border-red-300 bg-red-50 text-red-700';
    }
  };

  const getInitials = () => {
    if (!manager) return 'FA';
    const parts = manager.name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return manager.name[0].toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009eb9] mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Manager not found</p>
          <button
            onClick={() => window.location.href = '/manager/login'}
            className="px-4 py-2 bg-[#009eb9] text-white rounded-lg hover:bg-[#184363] transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Hero Banner */}
        <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-6 md:p-8 lg:p-12 mb-6 lg:mb-8 text-center text-white">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold rounded-full mb-3 lg:mb-4 text-xs lg:text-sm">
            Franchise Admin Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 lg:mb-4">
            Sparkport Pharmacy Network
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-3xl mx-auto mb-4 lg:mb-6">
            Manage all store prescriptions, monitor performance, and oversee operations across your entire pharmacy network.
          </p>
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
            <p className="text-sm font-semibold">{manager.name} - {pharmacies.length} Stores</p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:sticky lg:top-6">
              
              {/* Manager Info */}
              <div className="text-center mb-6 pb-6 border-b border-neutral-200">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {getInitials()}
                </div>
                <p className="font-bold text-[#184363] text-lg mb-1">
                  {manager.name}
                </p>
                <p className="text-sm text-neutral-600">{manager.email}</p>
                <p className="text-xs text-[#009eb9] font-semibold mt-2">
                  Franchise Administrator
                </p>
              </div>

              {/* Network Stats */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-3">
                  Network Stats
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Total Stores</span>
                    <span className="font-bold text-[#009eb9]">{pharmacies.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Total Rx</span>
                    <span className="font-bold text-[#009eb9]">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Submitted</span>
                    <span className="font-bold text-yellow-600">{stats.submitted}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Verifying</span>
                    <span className="font-bold text-blue-600">{stats.verifying}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Dispensing</span>
                    <span className="font-bold text-indigo-600">{stats.dispensing}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Ready</span>
                    <span className="font-bold text-green-600">{stats.ready_collect}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Completed</span>
                    <span className="font-bold text-neutral-600">{stats.completed}</span>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <form action={managerSignOut}>
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
                Showing <span className="font-bold text-[#184363]">{filteredPrescriptions.length}</span> prescription{filteredPrescriptions.length !== 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="verifying">Verifying</option>
                  <option value="verified">Verified</option>
                  <option value="dispensing">Dispensing</option>
                  <option value="ready_collect">Ready for Collection</option>
                  <option value="out_delivery">Out for Delivery</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] text-sm"
                >
                  <option value="all">All Stores</option>
                  {pharmacies.map(pharmacy => (
                    <option key={pharmacy.id} value={pharmacy.id}>
                      {pharmacy.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#009eb9] text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                  title="Grid View"
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
                  title="List View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'table'
                      ? 'bg-[#009eb9] text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                  title="Store Performance Table"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
              
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

              {/* Submitted */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-yellow-600">{stats.submitted}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Submitted</p>
                </div>
              </div>

              {/* Verifying */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-blue-600">{stats.verifying}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Verifying</p>
                </div>
              </div>

              {/* Dispensing */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-indigo-600">{stats.dispensing}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Dispensing</p>
                </div>
              </div>

              {/* Ready */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-green-600">{stats.ready_collect}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Ready</p>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-2xl md:text-3xl font-extrabold text-neutral-600">{stats.completed}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600">Completed</p>
                </div>
              </div>
            </div>

            {/* Content Based on View Mode */}
            {viewMode === 'table' ? (
              /* Store Performance Table */
              <div className="bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h2 className="text-xl font-extrabold text-[#184363]">Store Performance</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Store</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">Submitted</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">Verifying</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">Dispensing</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">Ready</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-neutral-600 uppercase tracking-wider">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {storeStats.map((store) => (
                        <tr key={store.pharmacy_id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-bold text-[#184363]">{store.pharmacy_name}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-bold text-[#009eb9]">{store.total}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-bold text-yellow-600">{store.submitted}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-bold text-blue-600">{store.verifying}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-bold text-indigo-600">{store.dispensing}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-bold text-green-600">{store.ready_collect}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-bold text-neutral-600">{store.completed}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : filteredPrescriptions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">No prescriptions found</h3>
                <p className="text-neutral-600">Try adjusting your filters</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                {filteredPrescriptions.map((prescription) => (
                  <button
                    key={prescription.id}
                    onClick={() => {
                      setSelectedPrescription(prescription);
                      setShowModal(true);
                    }}
                    className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 hover:shadow-xl transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#184363] text-base truncate">
                          {prescription.prescription_number}
                        </p>
                        <p className="text-sm text-neutral-600 mt-0.5 truncate">{prescription.patient_name}</p>
                        <p className="text-xs text-[#009eb9] font-semibold mt-0.5 truncate">
                          {getPharmacyName(prescription.preferred_pharmacy_id)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(prescription.status)}`}>
                        {prescription.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-neutral-600">
                      <p className="truncate">Phone: {prescription.patient_phone}</p>
                      <p className="truncate">Email: {prescription.contact_email}</p>
                      <p className="text-xs text-neutral-500 mt-2">
                        {new Date(prescription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPrescriptions.map((prescription) => (
                  <button
                    key={prescription.id}
                    onClick={() => {
                      setSelectedPrescription(prescription);
                      setShowModal(true);
                    }}
                    className="w-full bg-white rounded-xl shadow-md border border-neutral-200 p-4 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#184363] text-base mb-1 truncate">
                          {prescription.prescription_number}
                        </p>
                        <p className="text-sm text-neutral-600 mb-0.5 truncate">{prescription.patient_name}</p>
                        <p className="text-xs text-[#009eb9] font-semibold mb-2 truncate">
                          {getPharmacyName(prescription.preferred_pharmacy_id)}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(prescription.status)}`}>
                            {prescription.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {new Date(prescription.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[#009eb9] sm:ml-auto shrink-0">
                        <span className="text-sm font-semibold">Manage</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODERN WIDE MODAL */}
      {showModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#184363] to-[#009eb9] px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedPrescription.prescription_number}</h2>
                <p className="text-white/80">{selectedPrescription.patient_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(selectedPrescription.status)}`}>
                  {selectedPrescription.status.replace('_', ' ').toUpperCase()}
                </span>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                
                {/* Patient Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[#184363] text-sm">Patient</h3>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <p className="text-neutral-600">Name</p>
                      <p className="font-bold text-[#184363]">{selectedPrescription.patient_name}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Phone</p>
                      <p className="font-bold text-[#184363]">{selectedPrescription.patient_phone}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Email</p>
                      <p className="font-bold text-[#184363] text-[10px] break-all">{selectedPrescription.contact_email}</p>
                    </div>
                  </div>
                </div>

                {/* Prescription Info */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#009eb9] to-[#184363] rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[#184363] text-sm">Prescription</h3>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <p className="text-neutral-600">Number</p>
                      <p className="font-bold text-[#184363]">{selectedPrescription.prescription_number}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Submitted</p>
                      <p className="font-bold text-[#184363]">{new Date(selectedPrescription.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Updated</p>
                      <p className="font-bold text-[#184363]">{new Date(selectedPrescription.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Store Info */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[#184363] text-sm">Store</h3>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <p className="text-neutral-600">Assigned Store</p>
                      <p className="font-bold text-[#184363]">{getPharmacyName(selectedPrescription.preferred_pharmacy_id)}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[#184363] text-sm">Delivery</h3>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <p className="text-neutral-600">Method</p>
                      <p className="font-bold text-[#184363] capitalize">{selectedPrescription.delivery_method}</p>
                    </div>
                    {deliveryAddress && (
                      <div>
                        <p className="text-neutral-600">Address</p>
                        <p className="font-semibold text-[#184363] leading-tight">
                          {deliveryAddress.street_address}, {deliveryAddress.city}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 mb-5">
                <h3 className="font-bold text-[#184363] mb-3 text-sm">Update Status</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { status: 'submitted', label: 'Submitted' },
                    { status: 'verifying', label: 'Verifying' },
                    { status: 'verified', label: 'Verified' },
                    { status: 'dispensing', label: 'Dispensing' },
                    { status: 'ready_collect', label: 'Ready' },
                    { status: 'completed', label: 'Completed' },
                  ].map(({ status, label }) => (
                    <button
                      key={status}
                      onClick={() => updatePrescriptionStatus(selectedPrescription.id, status)}
                      className={`px-3 py-2 rounded-lg font-bold transition-all text-xs border-2 ${getStatusColor(status)} hover:shadow-md`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reassign Store Section */}
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
                <h3 className="font-bold text-amber-900 mb-3 text-sm">Reassign to Different Store</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {pharmacies.map(pharmacy => (
                    <button
                      key={pharmacy.id}
                      onClick={() => reassignPrescription(selectedPrescription.id, pharmacy.id)}
                      disabled={pharmacy.id === selectedPrescription.preferred_pharmacy_id}
                      className={`px-3 py-2 text-xs rounded-lg font-bold transition-all ${
                        pharmacy.id === selectedPrescription.preferred_pharmacy_id
                          ? 'bg-[#009eb9] text-white border-2 border-[#009eb9] cursor-not-allowed'
                          : 'bg-white text-neutral-700 border-2 border-amber-300 hover:border-[#009eb9] hover:text-[#009eb9]'
                      }`}
                    >
                      {pharmacy.name}
                      {pharmacy.id === selectedPrescription.preferred_pharmacy_id && ' ✓'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer - Action Buttons */}
            <div className="border-t border-neutral-200 p-4 bg-neutral-50 rounded-b-3xl flex gap-3">
              {imageLoading ? (
                <button
                  disabled
                  className="flex-1 px-6 py-3 bg-neutral-300 text-neutral-600 font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-neutral-600 border-t-transparent"></div>
                  Loading Script...
                </button>
              ) : prescriptionImage ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const lightbox = document.createElement('div');
                    lightbox.className = 'fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4';
                    lightbox.onclick = () => lightbox.remove();
                    
                    const img = document.createElement('img');
                    img.src = prescriptionImage;
                    img.className = 'max-w-full max-h-full object-contain';
                    img.onclick = (e) => e.stopPropagation();
                    
                    const closeBtn = document.createElement('button');
                    closeBtn.innerHTML = `
                      <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    `;
                    closeBtn.className = 'absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors';
                    closeBtn.onclick = () => lightbox.remove();
                    
                    lightbox.appendChild(img);
                    lightbox.appendChild(closeBtn);
                    document.body.appendChild(lightbox);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#184363] to-[#009eb9] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Script
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 px-6 py-3 bg-neutral-300 text-neutral-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                  title="No prescription image found"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No Script Image
                </button>
              )}
              
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-neutral-600 text-white font-bold rounded-xl hover:bg-neutral-700 transition-all"
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