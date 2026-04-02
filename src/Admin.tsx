import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Plus, Trash2, Home } from 'lucide-react';
import { db, auth, loginWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { defaultContent } from './defaultContent';

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('site');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const unsubDoc = onSnapshot(doc(db, 'content', 'main'), (docSnap) => {
          if (docSnap.exists()) {
            setContent(docSnap.data());
          } else {
            setContent(defaultContent);
          }
        }, (err) => {
          console.error("Error fetching content:", err);
          setContent(defaultContent);
          setError("Failed to load content. You might not have permission.");
        });
        return () => unsubDoc();
      } else {
        setContent(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError('Login failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'main'), content);
      alert('Saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save. Check your permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center text-slate-600 hover:text-slate-900">
          <Home className="w-5 h-5 mr-2" /> Back to Website
        </button>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-cyan-500 text-white font-bold py-3 rounded hover:bg-cyan-600 transition">Sign in with Google</button>
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
            <button onClick={handleSave} disabled={saving} className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded flex items-center font-medium transition">
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center font-medium transition">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Site Administration</h1>
          <div className="flex space-x-4">
            <button onClick={() => navigate('/')} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded flex items-center font-medium transition">
              <Home className="w-4 h-4 mr-2" /> View Site
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded flex items-center font-medium transition">
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center font-medium transition">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 bg-slate-50">
          {[
            { id: 'site', label: 'Site Content' },
            { id: 'clients', label: 'Clients' },
            { id: 'projects', label: 'Projects' },
            { id: 'tracking', label: 'Repair Tracking' },
            { id: 'pricing', label: 'Pricing' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-white text-cyan-600 border-b-2 border-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'site' && (
            <div className="space-y-8">
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
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Client Management</h2>
                <button onClick={() => {
                  const name = prompt('Enter Client Name:');
                  if (name) {
                    const id = `C-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
                    setContent({...content, clients: [...(content.clients || []), { id, name, contact: '', phone: '', email: '' }]});
                  }
                }} className="text-cyan-500 hover:text-cyan-600 flex items-center text-sm font-medium">
                  <Plus className="w-4 h-4 mr-1" /> Add Client
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(content.clients || []).map((client: any, index: number) => (
                  <div key={client.id} className="bg-slate-50 p-4 rounded border space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-cyan-600">{client.id}</span>
                      <button onClick={() => {
                        const newClients = content.clients.filter((_: any, i: number) => i !== index);
                        setContent({...content, clients: newClients});
                      }} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase">Company Name</label>
                        <input type="text" value={client.name} onChange={e => {
                          const newClients = [...content.clients];
                          newClients[index].name = e.target.value;
                          setContent({...content, clients: newClients});
                        }} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase">Contact Person</label>
                        <input type="text" value={client.contact} onChange={e => {
                          const newClients = [...content.clients];
                          newClients[index].contact = e.target.value;
                          setContent({...content, clients: newClients});
                        }} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase">Phone</label>
                        <input type="text" value={client.phone} onChange={e => {
                          const newClients = [...content.clients];
                          newClients[index].phone = e.target.value;
                          setContent({...content, clients: newClients});
                        }} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase">Email</label>
                        <input type="text" value={client.email} onChange={e => {
                          const newClients = [...content.clients];
                          newClients[index].email = e.target.value;
                          setContent({...content, clients: newClients});
                        }} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Project Management</h2>
                <button onClick={() => {
                  const name = prompt('Enter Project Name:');
                  if (name) {
                    const id = `P-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
                    setContent({...content, projects: [...(content.projects || []), { id, name, clientId: '', status: 'In Progress', startDate: new Date().toISOString().split('T')[0] }]});
                  }
                }} className="text-cyan-500 hover:text-cyan-600 flex items-center text-sm font-medium">
                  <Plus className="w-4 h-4 mr-1" /> Add Project
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(content.projects || []).map((project: any, index: number) => (
                  <div key={project.id} className="bg-slate-50 p-4 rounded border space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-cyan-600">{project.id}</span>
                      <button onClick={() => {
                        const newProjects = content.projects.filter((_: any, i: number) => i !== index);
                        setContent({...content, projects: newProjects});
                      }} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-500 uppercase">Project Name</label>
                        <input type="text" value={project.name} onChange={e => {
                          const newProjects = [...content.projects];
                          newProjects[index].name = e.target.value;
                          setContent({...content, projects: newProjects});
                        }} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase">Client</label>
                        <select value={project.clientId} onChange={e => {
                          const newProjects = [...content.projects];
                          newProjects[index].clientId = e.target.value;
                          setContent({...content, projects: newProjects});
                        }} className="w-full border rounded px-2 py-1 text-sm">
                          <option value="">Select Client</option>
                          {(content.clients || []).map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase">Status</label>
                        <select value={project.status} onChange={e => {
                          const newProjects = [...content.projects];
                          newProjects[index].status = e.target.value;
                          setContent({...content, projects: newProjects});
                        }} className="w-full border rounded px-2 py-1 text-sm">
                          <option>In Progress</option>
                          <option>Completed</option>
                          <option>On Hold</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold">Repair Tracking</h2>
                <button onClick={() => {
                  const id = prompt('Enter new Tracking ID (e.g. EMS-000123):');
                  if (id) {
                    setContent({...content, trackingIds: [...(content.trackingIds || []), { 
                      id, 
                      status: 'Received', 
                      completionDate: 'TBD',
                      clientId: '',
                      paymentStatus: 'Pending',
                      docs: { report: '', invoice: '', document: '', drawing: '', other: '' }
                    }]});
                  }
                }} className="text-cyan-500 hover:text-cyan-600 flex items-center text-sm font-medium">
                  <Plus className="w-4 h-4 mr-1" /> Add Tracking ID
                </button>
              </div>
              <div className="space-y-6">
                {(() => {
                  const trackingIds = content.trackingIds || [];
                  const idCounts = trackingIds.reduce((acc: any, curr: any) => {
                    acc[curr.id] = (acc[curr.id] || 0) + 1;
                    return acc;
                  }, {});

                  return trackingIds.map((data: any, index: number) => {
                    const isDuplicate = idCounts[data.id] > 1;
                    return (
                      <div key={`${data.id}-${index}`} className={`p-6 rounded border space-y-4 ${isDuplicate ? 'bg-red-50 border-red-300' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-start">
                          <div className="w-1/3">
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Tracking ID</label>
                            <input 
                              type="text" 
                              value={data.id} 
                              onChange={e => {
                                const newTrackingIds = [...content.trackingIds];
                                newTrackingIds[index].id = e.target.value;
                                setContent({...content, trackingIds: newTrackingIds});
                              }} 
                              className={`w-full border rounded px-3 py-2 font-bold ${isDuplicate ? 'border-red-300 bg-white' : 'bg-white border-slate-200'}`}
                            />
                            {isDuplicate && <span className="text-xs text-red-500 font-normal mt-1">Duplicate ID. Please correct.</span>}
                          </div>
                          <div className="w-1/3 px-4">
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Client</label>
                            <select value={data.clientId} onChange={e => {
                              const newTrackingIds = [...content.trackingIds];
                              newTrackingIds[index].clientId = e.target.value;
                              setContent({...content, trackingIds: newTrackingIds});
                            }} className="w-full border rounded px-3 py-2 bg-white">
                              <option value="">Select Client</option>
                              {(content.clients || []).map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <button onClick={() => {
                            const newTrackingIds = content.trackingIds.filter((_: any, i: number) => i !== index);
                            setContent({...content, trackingIds: newTrackingIds});
                          }} className="text-red-500 hover:text-red-700 p-2">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Repair Status</label>
                            <select value={data.status} onChange={e => {
                              const newTrackingIds = [...content.trackingIds];
                              newTrackingIds[index].status = e.target.value;
                              setContent({...content, trackingIds: newTrackingIds});
                            }} className="w-full border rounded px-3 py-2 bg-white">
                              <option>Received</option>
                              <option>Inspection</option>
                              <option>Rewinding</option>
                              <option>Testing</option>
                              <option>Ready</option>
                              <option>Delivered</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Est. Completion</label>
                            <input type="text" value={data.completionDate} onChange={e => {
                              const newTrackingIds = [...content.trackingIds];
                              newTrackingIds[index].completionDate = e.target.value;
                              setContent({...content, trackingIds: newTrackingIds});
                            }} placeholder="Est. Completion" className="w-full border rounded px-3 py-2 bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Payment Status</label>
                            <select value={data.paymentStatus} onChange={e => {
                              const newTrackingIds = [...content.trackingIds];
                              newTrackingIds[index].paymentStatus = e.target.value;
                              setContent({...content, trackingIds: newTrackingIds});
                            }} className="w-full border rounded px-3 py-2 bg-white">
                              <option>Pending</option>
                              <option>Partial</option>
                              <option>Paid</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Documents & Files (URLs)</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {['report', 'invoice', 'document', 'drawing', 'other'].map(docKey => (
                              <div key={docKey}>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">{docKey}</label>
                                <input 
                                  type="text" 
                                  value={data.docs?.[docKey] || ''} 
                                  placeholder={`Link to ${docKey} (Google Drive, etc.)`}
                                  onChange={e => {
                                    const newTrackingIds = [...content.trackingIds];
                                    if (!newTrackingIds[index].docs) newTrackingIds[index].docs = {};
                                    newTrackingIds[index].docs[docKey] = e.target.value;
                                    setContent({...content, trackingIds: newTrackingIds});
                                  }} 
                                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm bg-white" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
                {(!content.trackingIds || content.trackingIds.length === 0) && (
                  <p className="text-slate-500 italic">No tracking IDs found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">Pricing Configuration</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Motor Rewinding</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Base Price per kW (฿)</label>
                        <input type="number" value={content.calculator?.pricing?.motor?.basePricePerKw || 500} onChange={e => setContent({...content, calculator: {...content.calculator, pricing: {...content.calculator?.pricing, motor: {...content.calculator?.pricing?.motor, basePricePerKw: Number(e.target.value)}}}})} className="w-full border rounded px-3 py-2" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Housing Repair</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Standard Cast Iron (฿/mm)</label>
                        <input type="number" value={content.calculator?.pricing?.housing?.basePricePerMm || 10} onChange={e => setContent({...content, calculator: {...content.calculator, pricing: {...content.calculator?.pricing, housing: {...content.calculator?.pricing?.housing, basePricePerMm: Number(e.target.value)}}}})} className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Aluminum (฿/mm)</label>
                        <input type="number" value={content.calculator?.pricing?.housing?.basePricePerMm_aluminum || 12} onChange={e => setContent({...content, calculator: {...content.calculator, pricing: {...content.calculator?.pricing, housing: {...content.calculator?.pricing?.housing, basePricePerMm_aluminum: Number(e.target.value)}}}})} className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Stainless Steel (฿/mm)</label>
                        <input type="number" value={content.calculator?.pricing?.housing?.basePricePerMm_stainlessSteel || 15} onChange={e => setContent({...content, calculator: {...content.calculator, pricing: {...content.calculator?.pricing, housing: {...content.calculator?.pricing?.housing, basePricePerMm_stainlessSteel: Number(e.target.value)}}}})} className="w-full border rounded px-3 py-2" />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium mb-1">Minimum Price (฿)</label>
                        <input type="number" value={content.calculator?.pricing?.housing?.minPrice || 1000} onChange={e => setContent({...content, calculator: {...content.calculator, pricing: {...content.calculator?.pricing, housing: {...content.calculator?.pricing?.housing, minPrice: Number(e.target.value)}}}})} className="w-full border rounded px-3 py-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
