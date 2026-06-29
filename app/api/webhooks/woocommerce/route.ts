import { createHmac } from 'crypto'
import { upsertOrder, upsertCustomer, awardOrderPoints, WcWebhookOrder, WcWebhookCustomer } from '@/lib/supabase/wc-sync'

export async function POST(request: Request) {
  const body = await request.text()

  // Validate HMAC signature
  const sig = request.headers.get('x-wc-webhook-signature')
  const secret = process.env.WC_WEBHOOK_SECRET

  if (!secret) {
    console.error('WC_WEBHOOK_SECRET is not set')
    return Response.json({}, { status: 200 }) // still 200 so WC doesn't retry forever
  }

  if (sig) {
    const expected = createHmac('sha256', secret).update(body).digest('base64')
    if (sig !== expected) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const topic = request.headers.get('x-wc-webhook-topic') ?? ''

  try {
    const payload = JSON.parse(body)

    switch (topic) {
      case 'order.created':
      case 'order.updated': {
        const order = payload as WcWebhookOrder
        await upsertOrder(order)
        if (order.status === 'completed') {
          await awardOrderPoints(order)
        }
        break
      }

      case 'customer.created':
      case 'customer.updated': {
        await upsertCustomer(payload as WcWebhookCustomer)
        break
      }

      default:
        // Unknown topic — log and ignore
        console.log(`Unhandled WC webhook topic: ${topic}`)
    }
  } catch (err) {
    // Log but always return 200 — WC retries on non-200
    console.error('Webhook processing error:', err)
  }

  return Response.json({}, { status: 200 })
}
