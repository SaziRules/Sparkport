export type Prescription = {
  id: string
  prescription_number: string
  patient_name: string
  patient_phone: string
  contact_email: string
  delivery_method: string
  status: string
  is_anonymous: boolean
  preferred_pharmacy_id: string
  created_at: string
  updated_at: string
  delivery_address_id?: string | null
}

export type Pharmacy = {
  id: string
  name: string
  city: string
  street_address: string
  phone: string | null
}

export type Manager = {
  id: string
  name: string
  email: string
  role: 'franchise_admin' | 'store_manager'
  pharmacy?: { id: string; name: string; city: string } | null
}

export type Enquiry = {
  id: string
  ticket_number: string
  name: string
  email: string
  phone: string | null
  subject: string
  category: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assigned_pharmacy_id: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
  replies?: EnquiryReply[]
}

export type EnquiryReply = {
  id: string
  enquiry_id: string
  author_type: 'customer' | 'staff'
  author_name: string
  message: string
  is_internal: boolean
  created_at: string
}

export type Banner = {
  id: string
  image_url: string
  title: string
  description: string
  cta_text: string
  cta_link: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Subscriber = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  source: string
  is_active: boolean
  tags: string[]
  consent_marketing: boolean
  consent_date: string
  user_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Analytics = {
  kpis: {
    today: number
    thisMonth: number
    lastMonth: number
    growthPct: number | null
    totalOrders: number
  }
  revenueByDay: { date: string; revenue: number }[]
  ordersByStatus: { status: string; count: number; total: number }[]
  topProducts: { product_name: string; qty: number; revenue: number }[]
  customerGrowth: { month: string; new_customers: number }[]
  recentOrders: {
    id: number
    number: string
    status: string
    billing_name: string
    total: number
    date_created: string
  }[]
  prescriptionMetrics: { status: string; count: number }[]
  prescriptionsByDay: { date: string; count: number }[]
}
