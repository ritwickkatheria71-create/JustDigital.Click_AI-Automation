/**
 * /api/notify.js — Booking Notification Handler
 * Receives booking data → forwards to Make.com → triggers WhatsApp + Email
 *
 * Setup:
 * Vercel Environment Variables:
 *   MAKE_WEBHOOK_URL = https://hook.eu1.make.com/xxxxxxxxxx
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const makeUrl = process.env.MAKE_WEBHOOK_URL;
  if (!makeUrl) return res.status(200).json({ ok: true, skipped: 'no webhook configured' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const r = await fetch(makeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.status(200).json({ ok: true, makeStatus: r.status });
  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message }); // never block the user
  }
}
