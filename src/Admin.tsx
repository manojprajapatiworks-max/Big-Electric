import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Plus, Trash2, Home } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetch('/api/content')
        .then(r => r.json())
        .then(setContent);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        alert('Saved successfully!');
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      alert('Failed to save');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center text-slate-600 hover:text-slate-900">
          <Home className="w-5 h-5 mr-2" /> Back to Website
        </button>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition">Login</button>
        </form>
      </div>
    );
  }

  if (!content) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Site Administration</h1>
          <div className="flex space-x-4">
            <button onClick={() => navigate('/')} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded flex items-center font-medium transition">
              <Home className="w-4 h-4 mr-2" /> View Site
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded flex items-center font-medium transition">
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center font-medium transition">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Hero Section */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Headline (EN)</label>
                <input type="text" value={content.hero.headline} onChange={e => setContent({...content, hero: {...content.hero, headline: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Headline (TH)</label>
                <input type="text" value={content.hero.headline_th || ''} onChange={e => setContent({...content, hero: {...content.hero, headline_th: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subheadline (EN)</label>
                <textarea value={content.hero.subheadline} onChange={e => setContent({...content, hero: {...content.hero, subheadline: e.target.value}})} className="w-full border rounded px-3 py-2" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subheadline (TH)</label>
                <textarea value={content.hero.subheadline_th || ''} onChange={e => setContent({...content, hero: {...content.hero, subheadline_th: e.target.value}})} className="w-full border rounded px-3 py-2" rows={2} />
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Years Experience</label>
                <input type="text" value={content.stats.yearsExperience} onChange={e => setContent({...content, stats: {...content.stats, yearsExperience: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Motors Repaired</label>
                <input type="text" value={content.stats.motorsRepaired} onChange={e => setContent({...content, stats: {...content.stats, motorsRepaired: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industrial Clients</label>
                <input type="text" value={content.stats.industrialClients} onChange={e => setContent({...content, stats: {...content.stats, industrialClients: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" value={content.contact.phone} onChange={e => setContent({...content, contact: {...content.contact, phone: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LINE ID</label>
                <input type="text" value={content.contact.line} onChange={e => setContent({...content, contact: {...content.contact, line: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="text" value={content.contact.email} onChange={e => setContent({...content, contact: {...content.contact, email: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Address (EN)</label>
                <textarea value={content.contact.address} onChange={e => setContent({...content, contact: {...content.contact, address: e.target.value}})} className="w-full border rounded px-3 py-2" rows={3} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Address (TH)</label>
                <textarea value={content.contact.address_th || ''} onChange={e => setContent({...content, contact: {...content.contact, address_th: e.target.value}})} className="w-full border rounded px-3 py-2" rows={3} />
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <section>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Footer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description (EN)</label>
                <textarea value={content.footer?.description || ''} onChange={e => setContent({...content, footer: {...content.footer, description: e.target.value}})} className="w-full border rounded px-3 py-2" rows={2} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description (TH)</label>
                <textarea value={content.footer?.description_th || ''} onChange={e => setContent({...content, footer: {...content.footer, description_th: e.target.value}})} className="w-full border rounded px-3 py-2" rows={2} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Facebook URL</label>
                <input type="text" value={content.footer?.facebook || ''} onChange={e => setContent({...content, footer: {...content.footer, facebook: e.target.value}})} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </section>

          {/* Tracking Section */}
          <section>
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-bold">Repair Tracking</h2>
              <button onClick={() => {
                const id = prompt('Enter new Tracking ID (e.g. EMS-000123):');
                if (id) {
                  setContent({...content, trackingIds: [...(content.trackingIds || []), { id, status: 'Received', completionDate: 'TBD' }]});
                }
              }} className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium">
                <Plus className="w-4 h-4 mr-1" /> Add Tracking ID
              </button>
            </div>
            <div className="space-y-4">
              {(content.trackingIds || []).map((data: any, index: number) => (
                <div key={data.id} className="flex items-center space-x-4 bg-slate-50 p-4 rounded border">
                  <div className="w-1/4 font-bold">{data.id}</div>
                  <div className="w-1/3">
                    <select value={data.status} onChange={e => {
                      const newTrackingIds = [...content.trackingIds];
                      newTrackingIds[index].status = e.target.value;
                      setContent({...content, trackingIds: newTrackingIds});
                    }} className="w-full border rounded px-3 py-2">
                      <option>Received</option>
                      <option>Inspecting</option>
                      <option>Rewinding</option>
                      <option>Testing</option>
                      <option>Ready</option>
                    </select>
                  </div>
                  <div className="w-1/3">
                    <input type="text" value={data.completionDate} onChange={e => {
                      const newTrackingIds = [...content.trackingIds];
                      newTrackingIds[index].completionDate = e.target.value;
                      setContent({...content, trackingIds: newTrackingIds});
                    }} placeholder="Est. Completion" className="w-full border rounded px-3 py-2" />
                  </div>
                  <button onClick={() => {
                    const newTrackingIds = content.trackingIds.filter((_: any, i: number) => i !== index);
                    setContent({...content, trackingIds: newTrackingIds});
                  }} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {(!content.trackingIds || content.trackingIds.length === 0) && (
                <p className="text-slate-500 italic">No tracking IDs found.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
