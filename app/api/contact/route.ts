import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

const CATEGORY_MAP: Record<string, string> = {
  'General Enquiry': 'general',
  'Prescription Enquiry': 'prescription',
  'Order Support': 'order',
  'Product Information': 'product',
  'Rewards Programme': 'rewards',
  'Other': 'other',
}

const HIGH_PRIORITY_CATEGORIES = new Set(['prescription', 'order'])

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, phone, subject, category: rawCategory, message } = body as Record<string, string>

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return NextResponse.json({ error: 'Message must be at least 10 characters' }, { status: 400 })
  }

  const category = CATEGORY_MAP[rawCategory] ?? CATEGORY_MAP[rawCategory?.toLowerCase()] ?? 'general'
  const priority = HIGH_PRIORITY_CATEGORIES.has(category) ? 'high' : 'normal'

  const { data, error } = await admin()
    .from('enquiries')
    .insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      category,
      message: message.trim(),
      priority,
    })
    .select('ticket_number')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, ticket_number: data.ticket_number })
}
