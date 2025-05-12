// /pages/api/status/restart.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

const serviceMap: Record<string, string> = {
  mongo: 'Start MongoDB',
  chroma: 'Start ChromaDB'
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { service } = req.body;
  const taskName = serviceMap[service];

  if (!taskName) return res.status(400).json({ error: 'Invalid service' });

  exec(`schtasks /run /tn "${taskName}"`, (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.status(200).json({ success: true });
  });
}