import { createClient } from '@/lib/supabase/server';
import { calculateTier } from '@/lib/rewards';
import { sendWelcomeEmail } from '@/lib/email';

const TIER_THRESHOLDS = { bronze: 0, silver: 500, gold: 2000, platinum: 5000 };

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const [{ data: rewards }, { data: transactions }] = await Promise.all([
    supabase.from('rewards').select('points, tier').eq('user_id', user.id).single(),
    supabase
      .from('rewards_transactions')
      .select('id, points, type, description, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const points = rewards?.points ?? 0;
  const tier = (rewards?.tier ?? calculateTier(points)) as keyof typeof TIER_THRESHOLDS;

  const tierOrder: (keyof typeof TIER_THRESHOLDS)[] = ['bronze', 'silver', 'gold', 'platinum'];
  const nextTierIndex = tierOrder.indexOf(tier) + 1;
  const nextTier = tierOrder[nextTierIndex] as keyof typeof TIER_THRESHOLDS | undefined;
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;
  const currentThreshold = TIER_THRESHOLDS[tier];
  const progressPct = nextThreshold
    ? Math.min(100, Math.round(((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100))
    : 100;

  return Response.json({
    points,
    tier,
    enrolled: !!rewards,
    nextTier: nextTier ?? null,
    nextThreshold,
    progressPct,
    transactions: transactions ?? [],
  });
}

// Existing customer opts into rewards
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Idempotency — already enrolled
  const { data: existing } = await supabase.from('rewards').select('user_id').eq('user_id', user.id).single();
  if (existing) return Response.json({ error: 'Already enrolled' }, { status: 409 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, email, member_number')
    .eq('id', user.id)
    .single();

  const SIGNUP_BONUS = 50;

  await Promise.all([
    supabase.from('rewards').insert({
      user_id: user.id,
      points: SIGNUP_BONUS,
      tier: calculateTier(SIGNUP_BONUS),
      updated_at: new Date().toISOString(),
    }),
    supabase.from('rewards_transactions').insert({
      user_id: user.id,
      points: SIGNUP_BONUS,
      type: 'signup',
      description: 'Welcome bonus',
      reference: null,
    }),
  ]);

  if (profile?.email && profile?.member_number) {
    sendWelcomeEmail({
      to: profile.email,
      firstName: profile.first_name ?? 'there',
      memberNumber: profile.member_number,
      points: SIGNUP_BONUS,
    }).catch(err => console.error('Welcome email failed:', err));
  }

  return Response.json({ success: true });
}
