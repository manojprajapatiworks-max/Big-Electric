import React, { useState, useEffect } from 'react';
import { Save, LogOut, CheckCircle, AlertCircle, LayoutTemplate, BarChart, Phone, LayoutPanelTop, Wrench, FileText, Activity, Plus, Trash2, Image, MessageSquare, Check } from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';

export default function AdminPanel({ token, onLogout, siteContent, onUpdateContent }: { token: string, onLogout: () => void, siteContent: any, onUpdateContent: (content: any) => void }) {
  const [content, setContent] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);

  useEffect(() => {
    // Deep copy to avoid mutating original state directly before saving
    if (siteContent) {
      setContent(JSON.parse(JSON.stringify(siteContent)));
    }
  }, [siteContent]);

  useEffect(() => {
    if (activeTab === 'serviceRequests') {
      const unsub = onSnapshot(collection(db, 'serviceRequests'), (snapshot) => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServiceRequests(requests);
      }, (error) => {
        console.error('Failed to fetch service requests', error);
      });
      return () => unsub();
    }
  }, [activeTab]);

  const handleDeleteServiceRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await deleteDoc(doc(db, 'serviceRequests', id));
    } catch (error) {
      console.error('Failed to delete service request', error);
    }
  };

  const handleSave = async () => {
    try {
      setStatus('saving');
      
      await setDoc(doc(db, 'content', 'main'), content);
      
      onUpdateContent(content);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error occurred');
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    if (field === '') {
      setContent((prev: any) => ({
        ...prev,
        [section]: value
      }));
      return;
    }
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePricingChange = (type: 'motor' | 'housing', field: string, value: any, isMultiplier: boolean = false) => {
    setContent((prev: any) => {
      const newContent = { ...prev };
      if (!newContent.calculator) newContent.calculator = {};
      if (!newContent.calculator.pricing) {
        newContent.calculator.pricing = {
          motor: { basePricePerKw: 500, voltageMultipliers: { "220V": 1.0, "380V": 1.2, "400V": 1.25, "440V": 1.3, "High Voltage": 2.0 } },
          housing: { basePricePerMm: 10, minPrice: 1000 }
        };
      }
      
      if (isMultiplier && type === 'motor') {
        newContent.calculator.pricing.motor.voltageMultipliers = {
          ...newContent.calculator.pricing.motor.voltageMultipliers,
          [field]: value
        };
      } else {
        newContent.calculator.pricing[type] = {
          ...newContent.calculator.pricing[type],
          [field]: value
        };
      }
      return newContent;
    });
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
    { id: 'calculator', label: 'Calculator', icon: <Activity className="w-4 h-4 mr-2" /> },
    { id: 'whyChooseUs', label: 'Why Choose Us', icon: <Check className="w-4 h-4 mr-2" /> },
    { id: 'process', label: 'Repair Process', icon: <Wrench className="w-4 h-4 mr-2" /> },
    { id: 'contact', label: 'Contact Info', icon: <Phone className="w-4 h-4 mr-2" /> },
    { id: 'footer', label: 'Footer', icon: <LayoutPanelTop className="w-4 h-4 mr-2" /> },
    { id: 'services', label: 'Services', icon: <Wrench className="w-4 h-4 mr-2" /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    { id: 'blogs', label: 'Blogs', icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: 'workshopGallery', label: 'Workshop Gallery', icon: <Image className="w-4 h-4 mr-2" /> },
    { id: 'trackingIds', label: 'Tracking IDs', icon: <Activity className="w-4 h-4 mr-2" /> },
    { id: 'serviceRequests', label: 'Service Requests', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
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
                      <label className="block text-sm font-medium text-slate-700 mb-1">Years Experience Number</label>
                      <input type="text" value={content.stats?.yearsExperience || ''} onChange={(e) => handleChange('stats', 'yearsExperience', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Motors Repaired Number</label>
                      <input type="text" value={content.stats?.motorsRepaired || ''} onChange={(e) => handleChange('stats', 'motorsRepaired', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Industrial Clients Number</label>
                      <input type="text" value={content.stats?.industrialClients || ''} onChange={(e) => handleChange('stats', 'industrialClients', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Years Experience Label (EN)</label>
                      <input type="text" value={content.stats?.yearsExperienceLabel || ''} onChange={(e) => handleChange('stats', 'yearsExperienceLabel', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Years Experience Label (TH)</label>
                      <input type="text" value={content.stats?.yearsExperienceLabel_th || ''} onChange={(e) => handleChange('stats', 'yearsExperienceLabel_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Motors Repaired Label (EN)</label>
                      <input type="text" value={content.stats?.motorsRepairedLabel || ''} onChange={(e) => handleChange('stats', 'motorsRepairedLabel', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Motors Repaired Label (TH)</label>
                      <input type="text" value={content.stats?.motorsRepairedLabel_th || ''} onChange={(e) => handleChange('stats', 'motorsRepairedLabel_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Industrial Clients Label (EN)</label>
                      <input type="text" value={content.stats?.industrialClientsLabel || ''} onChange={(e) => handleChange('stats', 'industrialClientsLabel', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Industrial Clients Label (TH)</label>
                      <input type="text" value={content.stats?.industrialClientsLabel_th || ''} onChange={(e) => handleChange('stats', 'industrialClientsLabel_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* CALCULATOR SECTION */}
              {activeTab === 'calculator' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title (EN)</label>
                      <input type="text" value={content.calculator?.title || ''} onChange={(e) => handleChange('calculator', 'title', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title (TH)</label>
                      <input type="text" value={content.calculator?.title_th || ''} onChange={(e) => handleChange('calculator', 'title_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description (EN)</label>
                      <textarea value={content.calculator?.description || ''} onChange={(e) => handleChange('calculator', 'description', e.target.value)} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description (TH)</label>
                      <textarea value={content.calculator?.description_th || ''} onChange={(e) => handleChange('calculator', 'description_th', e.target.value)} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Features (EN) - Comma separated</label>
                      <textarea value={(content.calculator?.features || []).join(', ')} onChange={(e) => handleChange('calculator', 'features', e.target.value.split(',').map((s: string) => s.trim()))} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Features (TH) - Comma separated</label>
                      <textarea value={(content.calculator?.features_th || []).join(', ')} onChange={(e) => handleChange('calculator', 'features_th', e.target.value.split(',').map((s: string) => s.trim()))} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-slate-200 pt-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Pricing Configuration</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Motor Pricing */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4">Motor Rewinding</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price per kW (THB)</label>
                            <input 
                              type="number" 
                              value={content.calculator?.pricing?.motor?.basePricePerKw || 500} 
                              onChange={(e) => handlePricingChange('motor', 'basePricePerKw', parseFloat(e.target.value))} 
                              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" 
                            />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Voltage Multipliers</h5>
                            <div className="space-y-2">
                              {['220V', '380V', '400V', '440V', 'High Voltage'].map(voltage => (
                                <div key={voltage} className="flex items-center justify-between">
                                  <span className="text-sm text-slate-600">{voltage}</span>
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    value={content.calculator?.pricing?.motor?.voltageMultipliers?.[voltage] || 1.0} 
                                    onChange={(e) => handlePricingChange('motor', voltage, parseFloat(e.target.value), true)} 
                                    className="w-24 border border-slate-300 rounded-md px-2 py-1 text-sm focus:ring-orange-500 focus:border-orange-500" 
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Housing Pricing */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4">Housing Repair</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price per mm of ID (THB)</label>
                            <input 
                              type="number" 
                              value={content.calculator?.pricing?.housing?.basePricePerMm || 10} 
                              onChange={(e) => handlePricingChange('housing', 'basePricePerMm', parseFloat(e.target.value))} 
                              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Price (THB)</label>
                            <input 
                              type="number" 
                              value={content.calculator?.pricing?.housing?.minPrice || 1000} 
                              onChange={(e) => handlePricingChange('housing', 'minPrice', parseFloat(e.target.value))} 
                              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* WHY CHOOSE US SECTION */}
              {activeTab === 'whyChooseUs' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-slate-900">Why Choose Us Section</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                      <input 
                        type="text" 
                        value={content.whyChooseUs?.imageUrl || ''} 
                        onChange={(e) => handleChange('whyChooseUs', 'imageUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Heading (English)</label>
                        <input 
                          type="text" 
                          value={content.whyChooseUs?.heading?.en || ''} 
                          onChange={(e) => {
                            const newWhyChooseUs = { ...content.whyChooseUs };
                            if (!newWhyChooseUs.heading) newWhyChooseUs.heading = {};
                            newWhyChooseUs.heading.en = e.target.value;
                            onUpdateContent({ ...content, whyChooseUs: newWhyChooseUs });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Heading (Thai)</label>
                        <input 
                          type="text" 
                          value={content.whyChooseUs?.heading?.th || ''} 
                          onChange={(e) => {
                            const newWhyChooseUs = { ...content.whyChooseUs };
                            if (!newWhyChooseUs.heading) newWhyChooseUs.heading = {};
                            newWhyChooseUs.heading.th = e.target.value;
                            onUpdateContent({ ...content, whyChooseUs: newWhyChooseUs });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Button Text (English)</label>
                        <input 
                          type="text" 
                          value={content.whyChooseUs?.buttonText?.en || ''} 
                          onChange={(e) => {
                            const newWhyChooseUs = { ...content.whyChooseUs };
                            if (!newWhyChooseUs.buttonText) newWhyChooseUs.buttonText = {};
                            newWhyChooseUs.buttonText.en = e.target.value;
                            onUpdateContent({ ...content, whyChooseUs: newWhyChooseUs });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Button Text (Thai)</label>
                        <input 
                          type="text" 
                          value={content.whyChooseUs?.buttonText?.th || ''} 
                          onChange={(e) => {
                            const newWhyChooseUs = { ...content.whyChooseUs };
                            if (!newWhyChooseUs.buttonText) newWhyChooseUs.buttonText = {};
                            newWhyChooseUs.buttonText.th = e.target.value;
                            onUpdateContent({ ...content, whyChooseUs: newWhyChooseUs });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Popup Details (English)</label>
                        <textarea 
                          rows={4}
                          value={content.whyChooseUs?.details?.en || ''} 
                          onChange={(e) => {
                            const newWhyChooseUs = { ...content.whyChooseUs };
                            if (!newWhyChooseUs.details) newWhyChooseUs.details = {};
                            newWhyChooseUs.details.en = e.target.value;
                            onUpdateContent({ ...content, whyChooseUs: newWhyChooseUs });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Popup Details (Thai)</label>
                        <textarea 
                          rows={4}
                          value={content.whyChooseUs?.details?.th || ''} 
                          onChange={(e) => {
                            const newWhyChooseUs = { ...content.whyChooseUs };
                            if (!newWhyChooseUs.details) newWhyChooseUs.details = {};
                            newWhyChooseUs.details.th = e.target.value;
                            onUpdateContent({ ...content, whyChooseUs: newWhyChooseUs });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PROCESS SECTION */}
              {activeTab === 'process' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-slate-900">Repair Process Steps</h3>
                    <button onClick={() => {
                      const newProcess = [...(content.process || [])];
                      newProcess.push({ title: 'New Step', title_th: '', desc: 'Description', desc_th: '' });
                      handleChange('process', '', newProcess);
                    }} className="flex items-center text-sm bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 transition">
                      <Plus className="w-4 h-4 mr-1" /> Add Step
                    </button>
                  </div>
                  
                  {(content.process || []).map((step: any, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                      <button 
                        onClick={() => {
                          const newProcess = [...content.process];
                          newProcess.splice(index, 1);
                          handleChange('process', '', newProcess);
                        }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Title (EN)</label>
                          <input type="text" value={step.title || ''} onChange={(e) => handleArrayChange('process', index, 'title', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Title (TH)</label>
                          <input type="text" value={step.title_th || ''} onChange={(e) => handleArrayChange('process', index, 'title_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Description (EN)</label>
                          <textarea value={step.desc || ''} onChange={(e) => handleArrayChange('process', index, 'desc', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Description (TH)</label>
                          <textarea value={step.desc_th || ''} onChange={(e) => handleArrayChange('process', index, 'desc_th', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">LINE QR Code Image URL (Optional)</label>
                      <input type="text" value={content.contact?.lineQrCode || ''} onChange={(e) => handleChange('contact', 'lineQrCode', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="https://example.com/qr.jpg" />
                      <p className="text-xs text-slate-500 mt-1">Leave blank to auto-generate from LINE ID</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Map Embed URL (iframe src)</label>
                      <input type="text" value={content.contact?.mapEmbedUrl || ''} onChange={(e) => handleChange('contact', 'mapEmbedUrl', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="https://www.google.com/maps/embed?pb=..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Map Link URL (Open in Maps button)</label>
                      <input type="text" value={content.contact?.mapLinkUrl || ''} onChange={(e) => handleChange('contact', 'mapLinkUrl', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="https://maps.google.com/?q=..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Map Button Text (EN)</label>
                      <input type="text" value={content.contact?.mapButtonText || ''} onChange={(e) => handleChange('contact', 'mapButtonText', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Open in Google Maps" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Map Button Text (TH)</label>
                      <input type="text" value={content.contact?.mapButtonText_th || ''} onChange={(e) => handleChange('contact', 'mapButtonText_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" placeholder="เปิดใน Google Maps" />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Service Title (EN)</label>
                          <input type="text" value={service.title || ''} onChange={(e) => handleArrayChange('services', idx, 'title', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Service Title (TH)</label>
                          <input type="text" value={service.title_th || ''} onChange={(e) => handleArrayChange('services', idx, 'title_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Description (EN)</label>
                          <textarea value={service.desc || ''} onChange={(e) => handleArrayChange('services', idx, 'desc', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Description (TH)</label>
                          <textarea value={service.desc_th || ''} onChange={(e) => handleArrayChange('services', idx, 'desc_th', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Detailed Description (EN)</label>
                          <textarea value={service.longDesc || ''} onChange={(e) => handleArrayChange('services', idx, 'longDesc', e.target.value)} rows={4} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Detailed Description (TH)</label>
                          <textarea value={service.longDesc_th || ''} onChange={(e) => handleArrayChange('services', idx, 'longDesc_th', e.target.value)} rows={4} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addArrayItem('services', { title: 'New Service', title_th: '', desc: 'Service description', desc_th: '', longDesc: 'Detailed description', longDesc_th: '' })}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition flex items-center justify-center font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add New Service
                  </button>
                </div>
              )}

              {/* TESTIMONIALS SECTION */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-slate-900">Customer Testimonials</h3>
                  
                  <div className="flex items-center space-x-3 mb-6 bg-white p-4 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="showTestimonials"
                      checked={content.showTestimonials !== false}
                      onChange={(e) => onUpdateContent({ ...content, showTestimonials: e.target.checked })}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showTestimonials" className="text-sm font-medium text-slate-700">
                      Show Customer Testimonials section on the website
                    </label>
                  </div>
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
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Blog Title (EN)</label>
                          <input type="text" value={blog.title || ''} onChange={(e) => handleArrayChange('blogs', idx, 'title', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Blog Title (TH)</label>
                          <input type="text" value={blog.title_th || ''} onChange={(e) => handleArrayChange('blogs', idx, 'title_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Category (EN)</label>
                          <input type="text" value={blog.category || ''} onChange={(e) => handleArrayChange('blogs', idx, 'category', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Category (TH)</label>
                          <input type="text" value={blog.category_th || ''} onChange={(e) => handleArrayChange('blogs', idx, 'category_th', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                          <input type="text" value={blog.date || ''} onChange={(e) => handleArrayChange('blogs', idx, 'date', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Image URL</label>
                          <input type="text" value={blog.image || blog.img || ''} onChange={(e) => handleArrayChange('blogs', idx, 'image', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Description (EN)</label>
                          <textarea value={blog.desc || ''} onChange={(e) => handleArrayChange('blogs', idx, 'desc', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Description (TH)</label>
                          <textarea value={blog.desc_th || ''} onChange={(e) => handleArrayChange('blogs', idx, 'desc_th', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addArrayItem('blogs', { title: 'New Blog Post', title_th: '', category: 'News', category_th: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), image: 'https://picsum.photos/seed/new/800/600', desc: 'Short description', desc_th: '' })}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition flex items-center justify-center font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add New Blog Post
                  </button>
                </div>
              )}

              {/* WORKSHOP GALLERY SECTION */}
              {activeTab === 'workshopGallery' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-slate-900">Workshop Gallery Images</h3>
                    <button onClick={() => addArrayItem('workshopGallery', '')} className="flex items-center text-sm bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 transition">
                      <Plus className="w-4 h-4 mr-1" /> Add Image URL
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {(content.workshopGallery || []).map((url: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Image URL {idx + 1}</label>
                          <input 
                            type="text" 
                            value={url} 
                            onChange={(e) => {
                              const newGallery = [...content.workshopGallery];
                              newGallery[idx] = e.target.value;
                              handleChange('workshopGallery', '', newGallery);
                            }} 
                            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" 
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="w-16 h-16 bg-slate-100 rounded border border-slate-200 overflow-hidden flex-shrink-0 mt-5">
                          {url ? <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Image className="w-6 h-6" /></div>}
                        </div>
                        <button 
                          onClick={() => removeArrayItem('workshopGallery', idx)}
                          className="text-slate-400 hover:text-red-500 transition mt-5"
                          title="Remove Image"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
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

              {/* SERVICE REQUESTS SECTION */}
              {activeTab === 'serviceRequests' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-slate-900">Service Requests</h3>
                  </div>
                  
                  {serviceRequests.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                      <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No service requests yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {serviceRequests.map((req: any) => (
                        <div key={req.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative">
                          <button 
                            onClick={() => handleDeleteServiceRequest(req.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
                            title="Delete Request"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date</p>
                              <p className="text-sm font-medium text-slate-900">{new Date(req.date).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Name / Company</p>
                              <p className="text-sm font-medium text-slate-900">{req.name}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                              <p className="text-sm font-medium text-slate-900">{req.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Motor Type</p>
                              <p className="text-sm font-medium text-slate-900">{req.motorType || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Issue Description</p>
                              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 mt-1 whitespace-pre-wrap">{req.issue}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
