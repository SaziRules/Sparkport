import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oserakooknnthfsuezge.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const NEW_PASSWORD = 'Sparkport@031'

async function main() {
  const { data: managers, error } = await supabase
    .from('managers')
    .select('name, email, auth_user_id')
    .eq('is_active', true)

  if (error) throw error

  for (const m of managers ?? []) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      m.auth_user_id,
      { password: NEW_PASSWORD }
    )
    if (updateError) {
      console.error(`❌ ${m.email}: ${updateError.message}`)
    } else {
      console.log(`✅ ${m.email} (${m.name})`)
    }
  }
}

main().catch(console.error)
