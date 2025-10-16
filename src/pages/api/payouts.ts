import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const xflowBase = process.env.NEXT_PUBLIC_XFLOW_API_URL || 'https://api.xflowpay.com/v1';
  const accountId = (req.query.account_id as string) || '';

  // Expect client to forward the secret via this custom header (from localStorage)
  const proxyAuth = req.headers['x-proxy-authorization'];
  const xflowAccount = (req.headers['xflow-account'] as string) || accountId;

  if (!proxyAuth || !xflowAccount) {
    return res.status(400).json({ error: 'Missing credentials', details: { hasProxyAuth: !!proxyAuth, hasAccount: !!xflowAccount } });
  }

  try {
    const xRes = await axios.get(`${xflowBase}/payouts`, {
      headers: {
        Authorization: Array.isArray(proxyAuth) ? proxyAuth[0] : proxyAuth,
        'Xflow-Account': xflowAccount,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Pass through the list or data array
    return res.status(200).json(xRes.data);
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data || { error: err.message };
    return res.status(status).json(data);
  }
}


