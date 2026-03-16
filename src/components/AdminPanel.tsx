import React, { useState, useEffect } from 'react';
import { Save, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminPanel({ token, onLogout, siteContent, onUpdateContent }: { token: string, onLogout: () => void, siteContent: any, onUpdateContent: (content: any) => void }) {
  const [contentString, setContentString] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setContentString(JSON.stringify(siteContent, null, 2));
  }, [siteContent]);

  const handleSave = async () => {
    try {
      setStatus('saving');
      const parsedContent = JSON.parse(contentString);
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(parsedContent)
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      const data = await response.json();
      onUpdateContent(data.data);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Invalid JSON or network error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center">
          <span className="text-orange-500 mr-2">⚡</span> BIG MOTOR Admin Panel
        </h1>
        <div className="flex items-center space-x-4">
          <a href="/" target="_blank" className="text-sm text-slate-300 hover:text-white transition">View Live Site</a>
          <button onClick={onLogout} className="flex items-center text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full flex flex-col">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Site Content Editor</h2>
            <p className="text-slate-600">Edit the JSON below to update all text, contacts, services, and blogs on the website.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={status === 'saving'}
            className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-medium transition disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
          </button>
        </div>

        {status === 'success' && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center border border-green-200">
            <CheckCircle className="w-5 h-5 mr-2" /> Content updated successfully! Changes are now live.
          </div>
        )}

        {status === 'error' && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center border border-red-200">
            <AlertCircle className="w-5 h-5 mr-2" /> {errorMessage}
          </div>
        )}

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-sm font-mono text-slate-500">
            siteContent.json
          </div>
          <textarea
            value={contentString}
            onChange={(e) => setContentString(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-sm text-slate-800 focus:outline-none resize-none"
            spellCheck="false"
          />
        </div>
      </main>
    </div>
  );
}
