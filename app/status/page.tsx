// pages/status.tsx
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const StatusPage = () => {
  const [mongoStatus, setMongoStatus] = useState<'online' | 'offline'>('offline');
  const [chromaStatus, setChromaStatus] = useState<'online' | 'offline'>('offline');
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
        const chroma = await axios.get('/api/status/chroma');
        setChromaStatus(chroma.data.status);
    } catch {
        setChromaStatus('offline');
    }
    try {
      const mongo = await axios.get('/api/status/mongo');
      setMongoStatus(mongo.data.status);
    } catch {
      setMongoStatus('offline');
    }
    setLoading(false);
  };

  const handleRestart = async (service: 'mongo' | 'chroma') => {
    await axios.post(`/api/status/restart`, { service });
    setTimeout(() => checkStatus(), 5000);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusBadge = (status: 'online' | 'offline') => (
    <span className={`text-sm px-2 py-1 rounded-full ${status === 'online' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
      {status.toUpperCase()}
    </span>
  );

  return (
    <div className="p-10 font-sans">
      <h1 className="text-3xl font-bold mb-6">Database Status Dashboard</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>ChromaDB (port 8000)</span>
          {statusBadge(chromaStatus)}
          <button onClick={() => handleRestart('chroma')} className="px-3 py-1 bg-blue-600 text-white rounded">Restart</button>
        </div>
        <div className="flex items-center justify-between">
          <span>MongoDB (port 27017)</span>
          {statusBadge(mongoStatus)}
          <button onClick={() => handleRestart('mongo')} className="px-3 py-1 bg-blue-600 text-white rounded">Restart</button>
        </div>
        {loading && <div className="text-sm text-gray-500">Refreshing...</div>}
      </div>
    </div>
  );
};

export default StatusPage;