// Brevo-ready email utility. Set BREVO_API_KEY in env to activate.
// All functions are fire-and-forget safe — errors are logged, never thrown.

const SENDER = { name: 'Sparkport Pharmacy', email: 'hello@sparkport.co.za' };
const SITE_URL = process.env.SITE_URL ?? 'https://sparkport.co.za';

async function sendBrevo(payload: object) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return; // silent no-op until Brevo is wired in
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function sendWelcomeEmail(params: {
  to: string;
  firstName: string;
  memberNumber: string;
  points: number;
}) {
  const { to, firstName, memberNumber, points } = params;
  try {
    await sendBrevo({
      sender: SENDER,
      to: [{ email: to, name: firstName }],
      subject: `Welcome to Sparkport, ${firstName}!`,
      htmlContent: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#184363,#009eb9);padding:48px 32px;text-align:center;">
            <h1 style="color:white;margin:0 0 8px;font-size:28px;font-weight:900;">Welcome to Sparkport!</h1>
            <p style="color:rgba(255,255,255,0.85);margin:0;font-size:16px;">Your health, our priority.</p>
          </div>
          <div style="padding:40px 32px;">
            <p style="font-size:16px;color:#374151;margin:0 0 24px;">Hi ${firstName}, your account is ready.</p>

            <div style="background:white;border:2px solid #e5e7eb;border-radius:14px;padding:28px;text-align:center;margin-bottom:20px;">
              <p style="color:#6b7280;margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Your Member Number</p>
              <p style="color:#184363;font-size:36px;font-weight:900;margin:0;letter-spacing:3px;">${memberNumber}</p>
              <p style="color:#9ca3af;font-size:13px;margin:8px 0 0;">Keep this for pharmacy correspondence and prescription queries.</p>
            </div>

            <div style="background:linear-gradient(135deg,#009eb9,#0891b2);border-radius:14px;padding:24px;text-align:center;margin-bottom:28px;">
              <p style="color:rgba(255,255,255,0.8);margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Welcome Bonus</p>
              <p style="color:white;font-size:40px;font-weight:900;margin:0;">${points} pts</p>
              <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:4px 0 0;">Bronze member · Earn more with every order</p>
            </div>

            <a href="${SITE_URL}/account/dashboard"
               style="display:block;background:#184363;color:white;font-weight:700;padding:16px 32px;border-radius:10px;text-decoration:none;text-align:center;font-size:15px;">
              Go to My Dashboard →
            </a>

            <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:28px;line-height:1.6;">
              Sparkport Pharmacy · sparkport.co.za<br>
              You received this because you created an account with us.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('[email] sendWelcomeEmail failed:', err);
  }
}

export async function sendPrescriptionStatusEmail(params: {
  to: string;
  firstName: string;
  rxNumber: string;
  status: string;
  hint: string;
}) {
  const { to, firstName, rxNumber, status, hint } = params;
  try {
    await sendBrevo({
      sender: SENDER,
      to: [{ email: to, name: firstName }],
      subject: `Prescription ${rxNumber} — ${status}`,
      htmlContent: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#184363,#009eb9);padding:40px 32px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:24px;font-weight:900;">Prescription Update</h1>
          </div>
          <div style="padding:36px 32px;">
            <p style="font-size:16px;color:#374151;">Hi ${firstName},</p>
            <p style="font-size:16px;color:#374151;">Your prescription <strong>${rxNumber}</strong> has been updated:</p>
            <div style="background:white;border-left:4px solid #009eb9;border-radius:8px;padding:20px 24px;margin:20px 0;">
              <p style="font-size:18px;font-weight:700;color:#184363;margin:0 0 4px;">${status}</p>
              <p style="font-size:14px;color:#6b7280;margin:0;">${hint}</p>
            </div>
            <a href="${SITE_URL}/account/dashboard"
               style="display:block;background:#009eb9;color:white;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;text-align:center;font-size:15px;">
              View My Dashboard →
            </a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('[email] sendPrescriptionStatusEmail failed:', err);
  }
}
