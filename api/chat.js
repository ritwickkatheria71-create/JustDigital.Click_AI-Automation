/**
 * /api/chat.js — Vercel Serverless Function
 * Secure Claude API proxy for Pooja AI Agent
 *
 * SETUP (one time, 1 minute):
 * 1. vercel.com → Your Project → Settings → Environment Variables
 * 2. Name: ANTHROPIC_API_KEY
 *    Value: sk-ant-api03-xxxxxxxx  (your key from console.anthropic.com)
 * 3. Click Save → Redeploy → Done!
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in Vercel environment variables' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    body.max_tokens = Math.min(body.max_tokens || 600, 800);

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
