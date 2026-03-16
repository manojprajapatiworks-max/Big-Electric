import React, { useState, useEffect } from 'react';
import { Save, LogOut, CheckCircle, AlertCircle, LayoutTemplate, BarChart, Phone, LayoutPanelTop, Wrench, FileText, Activity, Plus, Trash2 } from 'lucide-react';

export default function AdminPanel({ token, onLogout, siteContent, onUpdateContent }: { token: string, onLogout: () => void, siteContent: any, onUpdateContent: (content: any) => void }) {
  const [content, setContent] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    // Deep copy to avoid mutating original state directly before saving
    if (siteContent) {
      setContent(JSON.parse(JSON.stringify(siteContent)));
    }
  }, [siteContent]);

  const handleSave = async () => {
    try {
      setStatus('saving');
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
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
      setErrorMessage(err.message || 'Network error occurred');
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: string, index: number, field: string, value: string) => {
    setContent((prev: any) => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const addArrayItem = (section: string, defaultItem: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: [...(prev[section] || []), defaultItem]
    }));
  };

  const removeArrayItem = (section: string, index: number) => {
    setContent((prev: any) => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  if (!content) return <div className="p-8 text-center">Loading editor...</div>;

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: <LayoutTemplate className="w-4 h-4 mr-2" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart className="w-4 h-4 mr-2" /> },
    { id: 'contact', label: 'Contact Info', icon: <Phone className="w-4 h-4 mr-2" /> },
    { id: 'footer', label: 'Footer', icon: <LayoutPanelTop className="w-4 h-4 mr-2" /> },
    { id: 'services', label: 'Services', icon: <Wrench className="w-4 h-4 mr-2" /> },
    { id: 'blogs', label: 'Blogs', icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: 'trackingIds', label: 'Tracking IDs', icon: <Activity className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center z-10">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Content Sections</h2>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-orange-50 text-orange-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{tabs.find(t => t.id === activeTab)?.label}</h2>
                <p className="text-slate-500 text-sm mt-1">Update the content for this section below.</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={status === 'saving'}
                className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-medium transition disabled:opacity-50 shadow-sm"
              >
                {status === 'saving' ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
              </button>
            </div>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center border border-green-200">
                <CheckCircle className="w-5 h-5 mr-2" /> Content updated successfully! Changes are now live.
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center border border-red-200">
                <AlertCircle className="w-5 h-5 mr-2" /> {errorMessage}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              
              {/* HERO SECTION */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Headline (English)</label>
                      <input type="text" value={content.hero?.headline || ''} onChange={(e) => handleChange('hero', 'headline', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Headline (Thai)</label>
                      <input type="text" value={content.hero?.headline_th || ''} onChange={(e) => handleChange('hero', 'headline_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subheadline (English)</label>
                      <textarea value={content.hero?.subheadline || ''} onChange={(e) => handleChange('hero', 'subheadline', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subheadline (Thai)</label>
                      <textarea value={content.hero?.subheadline_th || ''} onChange={(e) => handleChange('hero', 'subheadline_th', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input type="text" value={content.hero?.phone || ''} onChange={(e) => handleChange('hero', 'phone', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Logo URL</label>
                      <input type="text" value={content.hero?.logo || ''} onChange={(e) => handleChange('hero', 'logo', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Leave empty to use default text logo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Name (Desktop)</label>
                      <input type="text" value={content.hero?.companyName || ''} onChange={(e) => handleChange('hero', 'companyName', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="BIG ELECTRICMOTOR" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Name (Mobile/Short)</label>
                      <input type="text" value={content.hero?.companyNameShort || ''} onChange={(e) => handleChange('hero', 'companyNameShort', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="BIG MOTOR" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Hero Background Image URL</label>
                      <input type="text" value={content.hero?.bgImage || ''} onChange={(e) => handleChange('hero', 'bgImage', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="https://..." />
                    </div>
                  </div>
                </div>
              )}

              {/* STATS SECTION */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Years Experience</label>
                      <input type="text" value={content.stats?.yearsExperience || ''} onChange={(e) => handleChange('stats', 'yearsExperience', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Motors Repaired</label>
                      <input type="text" value={content.stats?.motorsRepaired || ''} onChange={(e) => handleChange('stats', 'motorsRepaired', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Industrial Clients</label>
                      <input type="text" value={content.stats?.industrialClients || ''} onChange={(e) => handleChange('stats', 'industrialClients', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT SECTION */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Address (English)</label>
                      <textarea value={content.contact?.address || ''} onChange={(e) => handleChange('contact', 'address', e.target.value)} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Address (Thai)</label>
                      <textarea value={content.contact?.address_th || ''} onChange={(e) => handleChange('contact', 'address_th', e.target.value)} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input type="text" value={content.contact?.phone || ''} onChange={(e) => handleChange('contact', 'phone', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="text" value={content.contact?.email || ''} onChange={(e) => handleChange('contact', 'email', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">LINE ID</label>
                      <input type="text" value={content.contact?.line || ''} onChange={(e) => handleChange('contact', 'line', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Map Embed URL (iframe src)</label>
                      <input type="text" value={content.contact?.mapEmbedUrl || ''} onChange={(e) => handleChange('contact', 'mapEmbedUrl', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="https://www.google.com/maps/embed?pb=..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Map Link URL (Open in Maps button)</label>
                      <input type="text" value={content.contact?.mapLinkUrl || ''} onChange={(e) => handleChange('contact', 'mapLinkUrl', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="https://maps.google.com/?q=..." />
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER SECTION */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description (English)</label>
                      <textarea value={content.footer?.description || ''} onChange={(e) => handleChange('footer', 'description', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description (Thai)</label>
                      <textarea value={content.footer?.description_th || ''} onChange={(e) => handleChange('footer', 'description_th', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
                      <input type="text" value={content.footer?.facebook || ''} onChange={(e) => handleChange('footer', 'facebook', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICES SECTION */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  {(content.services || []).map((service: any, idx: number) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                      <button 
                        onClick={() => removeArrayItem('services', idx)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                        title="Remove Service"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 gap-4 pr-8">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Service Title</label>
                          <input type="text" value={service.title || ''} onChange={(e) => handleArrayChange('services', idx, 'title', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                          <textarea value={service.desc || ''} onChange={(e) => handleArrayChange('services', idx, 'desc', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addArrayItem('services', { title: 'New Service', desc: 'Service description' })}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition flex items-center justify-center font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add New Service
                  </button>
                </div>
              )}

              {/* BLOGS SECTION */}
              {activeTab === 'blogs' && (
                <div className="space-y-6">
                  {(content.blogs || []).map((blog: any, idx: number) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                      <button 
                        onClick={() => removeArrayItem('blogs', idx)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                        title="Remove Blog"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Blog Title</label>
                          <input type="text" value={blog.title || ''} onChange={(e) => handleArrayChange('blogs', idx, 'title', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                          <input type="text" value={blog.category || ''} onChange={(e) => handleArrayChange('blogs', idx, 'category', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                          <input type="text" value={blog.date || ''} onChange={(e) => handleArrayChange('blogs', idx, 'date', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Image URL</label>
                          <input type="text" value={blog.image || blog.img || ''} onChange={(e) => handleArrayChange('blogs', idx, 'image', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                          <textarea value={blog.desc || ''} onChange={(e) => handleArrayChange('blogs', idx, 'desc', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addArrayItem('blogs', { title: 'New Blog Post', category: 'News', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), image: 'https://picsum.photos/seed/new/800/600', desc: 'Short description' })}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition flex items-center justify-center font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add New Blog Post
                  </button>
                </div>
              )}

              {/* TRACKING IDS SECTION */}
              {activeTab === 'trackingIds' && (
                <div className="space-y-6">
                  {(content.trackingIds || []).map((tracking: any, idx: number) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                      <button 
                        onClick={() => removeArrayItem('trackingIds', idx)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                        title="Remove Tracking ID"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Tracking ID</label>
                          <input type="text" value={tracking.id || ''} onChange={(e) => handleArrayChange('trackingIds', idx, 'id', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                          <select 
                            value={tracking.status || ''} 
                            onChange={(e) => handleArrayChange('trackingIds', idx, 'status', e.target.value)} 
                            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                          >
                            <option value="Received">Received</option>
                            <option value="Inspection">Inspection</option>
                            <option value="Rewinding">Rewinding</option>
                            <option value="Testing">Testing</option>
                            <option value="Ready">Ready</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Est. Completion Date</label>
                          <input type="text" value={tracking.completionDate || ''} onChange={(e) => handleArrayChange('trackingIds', idx, 'completionDate', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addArrayItem('trackingIds', { id: `EMS-${Math.floor(100000 + Math.random() * 900000)}`, status: 'Received', completionDate: 'TBD' })}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition flex items-center justify-center font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add New Tracking ID
                  </button>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
