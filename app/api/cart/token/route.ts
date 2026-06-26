import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('wc_cart_token')?.value ?? '';
  return Response.json({ token });
}
