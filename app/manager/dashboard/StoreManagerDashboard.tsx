'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { managerSignOut } from '../actions';

type Prescription = {
  id: string;
  prescription_number: string;
  patient_name: string;
  patient_phone: string;
  patient_id_number: string | null;
  contact_email: string | null;
  doctor_name: string;
  doctor_practice_number: string | null;
  prescription_date: string;
  is_chronic: boolean;
  chronic_repeats_remaining: number | null;
  delivery_method: string;
  status: string;
  is_anonymous: boolean;
  user_id: string | null;
  preferred_pharmacy_id: string | null;
  collection_pharmacy_id: string | null;
  delivery_address_id: string | null;
  special_instructions: string | null;
  medical_aid_claim: boolean;
  payment_status: string;
  created_at: string;
  updated_at: string;
};

type PrescriptionImage = {
  id: string;
  prescription_id: string;
  storage_path: string;  // Actual column name
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
};

type DeliveryAddress = {
  street_address: string;
  suburb: string | null;
  city: string;
  province: string;
  postal_code: string;
};

type Manager = {
  id: string;
  name: string;
  email: string;
  role: string;
  assigned_pharmacy_id: string;
  pharmacy: {
    id: string;
    name: string;
    city: string;
  } | null;
};

export default function StoreManagerDashboard() {
  const [manager, setManager] = useState<Manager | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPrescription && showModal) {
      loadPrescriptionDetails(selectedPrescription.id);
    }
  }, [selectedPrescription, showModal]);

  const loadPrescriptionDetails = async (prescriptionId: string) => {
    setImageLoading(true);
    setPrescriptionImage(null);
    setDeliveryAddress(null);

    try {
      // Load prescription image
      const { data: imageData, error: imageError } = await supabase
        .from('prescription_images')
        .select('*')
        .eq('prescription_id', prescriptionId)
        .limit(1)
        .single();

      if (!imageError && imageData) {
        // Get public URL from storage
        // NOTE: Column is 'storage_path', not 'image_url'
        const { data: urlData } = supabase.storage
          .from('prescriptions')
          .getPublicUrl(imageData.storage_path);
        
        if (urlData?.publicUrl) {
          setPrescriptionImage(urlData.publicUrl);
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
      console.error('Error loading prescription details:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/manager/login';
        return;
      }

      // Get manager details
      const { data: managerData, error: managerError } = await supabase
        .from('managers')
        .select(`
          id,
          name,
          email,
          role,
          assigned_pharmacy_id,
          pharmacy:pharmacies(id, name, city)
        `)
        .eq('auth_user_id', user.id)
        .single();

      if (managerError || !managerData) {
        console.error('Manager error:', managerError);
        return;
      }

      // Fix Supabase join (returns array)
      const manager = {
        ...managerData,
        pharmacy: Array.isArray(managerData.pharmacy) 
          ? managerData.pharmacy[0] || null 
          : managerData.pharmacy
      };

      setManager(manager);

      // Get prescriptions for this pharmacy
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('preferred_pharmacy_id', managerData.assigned_pharmacy_id)
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

  const updatePrescriptionStatus = async (prescriptionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', prescriptionId);

      if (error) {
        console.error('Update status error:', error);
        alert('Failed to update status: ' + (error.message || 'Unknown error'));
        return;
      }

      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredPrescriptions = filterStatus === 'all'
    ? prescriptions
    : prescriptions.filter(p => p.status === filterStatus);

  const stats = {
    total: prescriptions.length,
    submitted: prescriptions.filter(p => p.status === 'submitted').length,
    verifying: prescriptions.filter(p => p.status === 'verifying').length,
    dispensing: prescriptions.filter(p => p.status === 'dispensing').length,
    ready_collect: prescriptions.filter(p => p.status === 'ready_collect').length,
    completed: prescriptions.filter(p => p.status === 'completed').length,
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
    if (!manager) return 'M';
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
      <div className="max-w-360 mx-auto px-2 sm:px-2 lg:px-2 py-6 lg:py-8">
        
        {/* Hero Banner */}
        <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-6 md:p-8 lg:p-12 mb-6 lg:mb-8 text-center text-white">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold rounded-full mb-3 lg:mb-4 text-xs lg:text-sm">
            Store Manager Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold! mb-3 lg:mb-4">
            {manager.pharmacy?.name || 'Store Manager'}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-white/90! max-w-3xl mx-auto mb-4 lg:mb-6">
            Manage your store's prescriptions, update statuses, and provide exceptional service to your customers.
          </p>
          <div className="inline-block px-4 py-2 bg-white/10! backdrop-blur-sm rounded-lg">
            <p className="text-sm font-semibold! text-white/90!">{manager.name}</p>
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
                  {manager.pharmacy?.name}
                </p>
              </div>

              {/* Prescription Stats */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-3">
                  Prescription Stats
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Total</span>
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
              
              <div className="flex items-center gap-2">
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

            {/* Prescriptions */}
            {filteredPrescriptions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">No prescriptions found</h3>
                <p className="text-neutral-600">
                  {filterStatus !== 'all' ? 'Try changing the filter' : 'Prescriptions will appear here'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                {filteredPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 hover:shadow-xl transition-all"
                  >
                    {/* Header with Status Pill on Right */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#184363] text-base truncate">
                          {prescription.prescription_number}
                        </p>
                        <p className="text-sm text-neutral-600 mt-0.5 truncate">{prescription.patient_name}</p>
                      </div>
                      <span className={`ml-2 shrink-0 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(prescription.status)}`}>
                        {prescription.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-neutral-500 mb-4">
                      {new Date(prescription.created_at).toLocaleDateString()}
                    </p>

                    {/* Process Button */}
                    <button
                      onClick={() => {
                        setSelectedPrescription(prescription);
                        setShowModal(true);
                      }}
                      className="w-full px-4 py-2.5 bg-[#009eb9] text-white font-semibold rounded-lg hover:bg-[#184363] transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Process
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#184363] text-base mb-1 truncate">
                              {prescription.prescription_number}
                            </p>
                            <p className="text-sm text-neutral-600 truncate">{prescription.patient_name}</p>
                          </div>
                          <span className={`ml-2 shrink-0 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(prescription.status)}`}>
                            {prescription.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-xs text-neutral-500">
                          {new Date(prescription.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedPrescription(prescription);
                          setShowModal(true);
                        }}
                        className="px-6 py-2.5 bg-[#009eb9] text-white font-semibold rounded-lg hover:bg-[#184363] transition-colors flex items-center justify-center gap-2 shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Process
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* PREMIUM COMPACT MODAL - NO SCROLLING */}
      {/* SLEEK WIDE MODAL */}
      {showModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="bg-linear-to-r from-[#184363] to-[#009eb9] px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold! text-white mb-1">{selectedPrescription.prescription_number}</h2>
                <p className="text-white/80!">{selectedPrescription.patient_name}</p>
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

            {/* Content - Optimized for Width */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              
              {/* Top Row: Info Cards in 4 columns */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                
                {/* Prescription Details */}
                <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-linear-to-br from-[#009eb9] to-[#184363] rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[#184363] text-sm">Prescription</h3>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <p className="text-neutral-600">Date Issued</p>
                      <p className="font-bold text-[#184363]">{new Date(selectedPrescription.prescription_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Type</p>
                      <p className="font-bold text-[#184363]">
                        {selectedPrescription.is_chronic 
                          ? `Chronic (${selectedPrescription.chronic_repeats_remaining || 0})` 
                          : 'Acute'}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Submitted</p>
                      <p className="font-bold text-[#184363]">{new Date(selectedPrescription.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
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
                    {selectedPrescription.patient_id_number && (
                      <div>
                        <p className="text-neutral-600">ID Number</p>
                        <p className="font-bold text-[#184363]">{selectedPrescription.patient_id_number}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-neutral-600">Phone</p>
                      <p className="font-bold text-[#184363]">{selectedPrescription.patient_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[#184363] text-sm">Doctor</h3>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <p className="text-neutral-600">Name</p>
                      <p className="font-bold text-[#184363]">{selectedPrescription.doctor_name}</p>
                    </div>
                    {selectedPrescription.doctor_practice_number && (
                      <div>
                        <p className="text-neutral-600">Practice #</p>
                        <p className="font-bold text-[#184363]">{selectedPrescription.doctor_practice_number}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
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

              {/* Bottom Row: Payment + Special Instructions (if exists) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                
                {/* Payment Info */}
                <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-linear-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[#184363] text-sm">Payment</h3>
                  </div>
                  <div className="flex gap-8 text-xs">
                    <div>
                      <p className="text-neutral-600">Status</p>
                      <p className="font-bold text-[#184363] capitalize">{selectedPrescription.payment_status.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Medical Aid</p>
                      <p className="font-bold text-[#184363]">{selectedPrescription.medical_aid_claim ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedPrescription.special_instructions && (
                  <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-amber-900 text-sm">Special Instructions</h3>
                    </div>
                    <p className="text-xs text-amber-900 font-semibold leading-relaxed">{selectedPrescription.special_instructions}</p>
                  </div>
                )}
              </div>

              {/* Status Update Section */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                <h3 className="font-bold text-[#184363] mb-3 text-sm">Update Status</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                  {[
                    { status: 'submitted', label: 'Submitted' },
                    { status: 'verifying', label: 'Verifying' },
                    { status: 'verified', label: 'Verified' },
                    { status: 'dispensing', label: 'Dispensing' },
                    { status: 'ready_collect', label: 'Ready' },
                    { status: 'out_delivery', label: 'Delivery' },
                    { status: 'completed', label: 'Completed' },
                    { status: 'rejected', label: 'Rejected' },
                    { status: 'cancelled', label: 'Cancelled' },
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
            </div>

            {/* Footer - Action Buttons Side by Side */}
            <div className="border-t border-neutral-200 p-4 bg-neutral-50 rounded-b-3xl flex gap-3">
              {/* Always show button - different states based on loading/image status */}
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
                    // Open image in lightbox
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
                  className="flex-1 px-6 py-3 bg-linear-to-r from-[#184363] to-[#009eb9] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
                  title="No prescription image found for this prescription"
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