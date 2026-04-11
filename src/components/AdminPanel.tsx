import React, { useState, useEffect } from 'react';
import { Save, LogOut, CheckCircle, AlertCircle, LayoutTemplate, BarChart, Phone, LayoutPanelTop, Wrench, FileText, Activity, Plus, Trash2, Image, MessageSquare, Check, Download, ShieldCheck, Zap, ExternalLink, User, Users, Lock, Mail, Key } from 'lucide-react';
import { db, createAdminAccount } from '../firebase';
import { doc, setDoc, collection, onSnapshot, deleteDoc, getDocs } from 'firebase/firestore';

export default function AdminPanel({ token, onLogout, siteContent, onUpdateContent }: { token: string, onLogout: () => void, siteContent: any, onUpdateContent: (content: any) => void }) {
  const [content, setContent] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void}>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

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

  useEffect(() => {
    if (activeTab === 'manageAdmins') {
      const unsub = onSnapshot(collection(db, 'admins'), (snapshot) => {
        const adminList = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() }));
        setAdmins(adminList);
      }, (error) => {
        console.error('Failed to fetch admins', error);
      });
      return () => unsub();
    }
  }, [activeTab]);

  const handleDeleteServiceRequest = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Service Request',
      message: 'Are you sure you want to delete this service request? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'serviceRequests', id));
        } catch (error) {
          console.error('Failed to delete service request', error);
          setErrorMessage('Failed to delete service request');
          setStatus('error');
          setTimeout(() => setStatus('idle'), 3000);
        }
      }
    });
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
          housing: { basePricePerMm: 10, basePricePerMm_aluminum: 12, basePricePerMm_stainlessSteel: 15, minPrice: 1000 }
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
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      onConfirm: () => {
        setContent((prev: any) => {
          const newArray = [...prev[section]];
          newArray.splice(index, 1);
          return { ...prev, [section]: newArray };
        });
      }
    });
  };

  const exportToCSV = (filename: string, rows: any[]) => {
    if (!rows || !rows.length) {
      setErrorMessage("No data to export");
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportTrackingIds = () => {
    const data = (content?.trackingIds || []).map((t: any) => {
      const client = (content.clients || []).find((c: any) => c.id === t.clientId);
      return {
        ...t,
        clientName: client ? client.name : 'General Customer',
        docs: JSON.stringify(t.docs || {})
      };
    });
    exportToCSV('tracking_ids_backup.csv', data);
  };

  const exportServiceRequests = () => {
    exportToCSV('service_requests_backup.csv', serviceRequests);
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
    { id: 'customerPortal', label: 'Customer Portal', icon: <ShieldCheck className="w-4 h-4 mr-2" /> },
    { id: 'serviceRequests', label: 'Service Requests', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    { id: 'manageAdmins', label: 'Manage Admins', icon: <Users className="w-4 h-4 mr-2" /> },
  ];

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminPassword) return;
    
    setAdminActionLoading(true);
    try {
      // 1. Create the account in Firebase Auth
      // Note: This might sign out the current user if not careful.
      // But we'll use the helper from firebase.ts which we'll need to fix to use a secondary app.
      await createAdminAccount(newAdminEmail, newAdminPassword);
      
      // 2. Add to the 'admins' collection
      await setDoc(doc(db, 'admins', newAdminEmail.toLowerCase()), {
        email: newAdminEmail.toLowerCase(),
        createdAt: new Date().toISOString(),
        addedBy: token // uid of current admin
      });
      
      setNewAdminEmail('');
      setNewAdminPassword('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error("Error adding admin:", err);
      setErrorMessage(err.message || "Failed to add admin.");
      setStatus('error');
    } finally {
      setAdminActionLoading(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Admin',
      message: `Are you sure you want to remove ${email} from the admin list? They will no longer be able to access this panel.`,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'admins', email.toLowerCase()));
          setStatus('success');
          setTimeout(() => setStatus('idle'), 3000);
        } catch (err: any) {
          console.error("Error removing admin:", err);
          setErrorMessage(err.message || "Failed to remove admin.");
          setStatus('error');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-slate-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
                }}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-slate-900 border-b border-slate-800 text-white p-4 shadow-lg flex justify-between items-center z-20 sticky top-0">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center">
              BIG MOTOR <span className="text-orange-500 ml-2 font-medium text-sm bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">ADMIN</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Management System v2.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <a href="/" target="_blank" className="text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center group">
            <ExternalLink className="w-3.5 h-3.5 mr-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            View Live Site
          </a>
          <div className="h-8 w-px bg-slate-800"></div>
          <button onClick={onLogout} className="flex items-center text-xs font-bold bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all active:scale-95 border border-slate-700 hover:border-red-400">
            <LogOut className="w-3.5 h-3.5 mr-2" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto flex flex-col">
          <div className="p-6 flex-grow">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-3">Content Sections</h2>
            <nav className="space-y-1.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 translate-x-1' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`mr-3 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Logged in as</p>
              <p className="text-xs font-black text-slate-900 truncate">{token}</p>
            </div>
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price per mm of ID - Cast Iron (THB)</label>
                            <input 
                              type="number" 
                              value={content.calculator?.pricing?.housing?.basePricePerMm || 10} 
                              onChange={(e) => handlePricingChange('housing', 'basePricePerMm', parseFloat(e.target.value))} 
                              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price per mm of ID - Aluminum (THB)</label>
                            <input 
                              type="number" 
                              value={content.calculator?.pricing?.housing?.basePricePerMm_aluminum || 12} 
                              onChange={(e) => handlePricingChange('housing', 'basePricePerMm_aluminum', parseFloat(e.target.value))} 
                              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price per mm of ID - Stainless Steel (THB)</label>
                            <input 
                              type="number" 
                              value={content.calculator?.pricing?.housing?.basePricePerMm_stainlessSteel || 15} 
                              onChange={(e) => handlePricingChange('housing', 'basePricePerMm_stainlessSteel', parseFloat(e.target.value))} 
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

              {/* CUSTOMER PORTAL SECTION */}
              {activeTab === 'customerPortal' && (
                <div className="space-y-10">
                  {/* Portal Configuration */}
                  <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center mr-4 shadow-lg shadow-orange-500/20">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Portal Configuration</h3>
                        <p className="text-sm text-slate-500">Manage how your customers see the service portal</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Portal Title (English)</label>
                        <input type="text" value={content.portal?.title || ''} onChange={e => handleChange('portal', 'title', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Portal Title (Thai)</label>
                        <input type="text" value={content.portal?.title_th || ''} onChange={e => handleChange('portal', 'title_th', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
                      </div>
                    </div>
                  </section>
                  
                  {/* Client Management */}
                  <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-4 shadow-lg shadow-blue-500/20">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Client Management</h3>
                          <p className="text-sm text-slate-500">Manage your industrial clients list</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => addArrayItem('clients', { id: `C-${Math.floor(100 + Math.random() * 899)}`, name: '', contact: '', phone: '', email: '' })}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add New Client
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(content.clients || []).map((client: any, idx: number) => (
                        <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50 relative group">
                          <button 
                            onClick={() => removeArrayItem('clients', idx)}
                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company / Client Name</label>
                              <input 
                                type="text" 
                                value={client.name || ''} 
                                onChange={(e) => handleArrayChange('clients', idx, 'name', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                placeholder="e.g. Industrial Solutions Co."
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Person</label>
                              <input 
                                type="text" 
                                value={client.contact || ''} 
                                onChange={(e) => handleArrayChange('clients', idx, 'contact', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                placeholder="John Smith"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</label>
                              <input 
                                type="text" 
                                value={client.phone || ''} 
                                onChange={(e) => handleArrayChange('clients', idx, 'phone', e.target.value)} 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                placeholder="081-234-5678"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!content.clients || content.clients.length === 0) && (
                        <div className="col-span-2 text-center py-8 border border-dashed border-slate-200 rounded-xl">
                          <p className="text-slate-400 text-sm">No clients added yet.</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Tracking IDs Management */}
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Repair Tracking IDs Management</h3>
                        <p className="text-sm text-slate-500">Manage customer tracking codes and linked documents</p>
                      </div>
                      <div className="flex items-center space-x-3 w-full md:w-auto">
                        <button
                          onClick={exportTrackingIds}
                          className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-bold text-xs uppercase tracking-wider"
                        >
                          <Download className="w-4 h-4 mr-2" /> Export CSV
                        </button>
                        <button 
                          onClick={() => addArrayItem('trackingIds', { id: `EMS-${Math.floor(100000 + Math.random() * 900000)}`, status: 'Received', completionDate: 'TBD', paymentStatus: 'Unpaid', docs: {} })}
                          className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add New ID
                        </button>
                      </div>
                    </div>
                    {(() => {
                      const trackingIds = content.trackingIds || [];
                      const idCounts = trackingIds.reduce((acc: any, curr: any) => {
                        if (curr.id) {
                          acc[curr.id] = (acc[curr.id] || 0) + 1;
                        }
                        return acc;
                      }, {});
                      
                      const hasDuplicates = Object.values(idCounts).some((count: any) => count > 1);

                      return (
                        <>
                          {hasDuplicates && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700 font-medium">
                                    Duplicate Tracking IDs found! Please correct the highlighted rows below.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {trackingIds.map((tracking: any, idx: number) => {
                            const isDuplicate = tracking.id && idCounts[tracking.id] > 1;
                            return (
                              <div key={idx} className={`p-6 border rounded-xl relative group transition-all ${isDuplicate ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white shadow-sm hover:shadow-md'}`}>
                                <button 
                                  onClick={() => removeArrayItem('trackingIds', idx)}
                                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2"
                                  title="Remove Tracking ID"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                  <div className="lg:col-span-1">
                                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDuplicate ? 'text-red-600' : 'text-slate-400'}`}>Tracking ID</label>
                                    <input 
                                      type="text" 
                                      value={tracking.id || ''} 
                                      onChange={(e) => handleArrayChange('trackingIds', idx, 'id', e.target.value.toUpperCase())} 
                                      className={`w-full border rounded-lg px-4 py-2.5 font-bold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all ${isDuplicate ? 'border-red-300 bg-white text-red-900' : 'border-slate-200 bg-slate-50'}`} 
                                    />
                                    {isDuplicate && <p className="mt-1 text-[10px] text-red-600 font-bold uppercase">Warning: Duplicate ID</p>}
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assign Client</label>
                                    <div className="flex gap-2">
                                      <select 
                                        value={tracking.clientId || ''} 
                                        onChange={(e) => handleArrayChange('trackingIds', idx, 'clientId', e.target.value)} 
                                        className="flex-grow border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 font-medium text-sm outline-none focus:bg-white focus:border-orange-500 transition-all"
                                      >
                                        <option value="">Select Client</option>
                                        {(content.clients || []).map((c: any) => (
                                          <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                      </select>
                                      {tracking.clientId && (
                                        <div className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter" title="Client ID">
                                          {tracking.clientId}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Repair Status</label>
                                    <select 
                                      value={tracking.status || ''} 
                                      onChange={(e) => handleArrayChange('trackingIds', idx, 'status', e.target.value)} 
                                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 font-medium text-sm outline-none focus:bg-white focus:border-orange-500 transition-all"
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
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Est. Completion</label>
                                    <input 
                                      type="text" 
                                      value={tracking.completionDate || ''} 
                                      onChange={(e) => handleArrayChange('trackingIds', idx, 'completionDate', e.target.value)} 
                                      placeholder="e.g., 2-3 Days"
                                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 font-medium text-sm outline-none focus:bg-white focus:border-orange-500 transition-all" 
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Status</label>
                                    <select 
                                      value={tracking.paymentStatus || 'Unpaid'} 
                                      onChange={(e) => handleArrayChange('trackingIds', idx, 'paymentStatus', e.target.value)} 
                                      className={`w-full border rounded-lg px-4 py-2.5 font-bold text-sm outline-none transition-all ${
                                        tracking.paymentStatus === 'Paid' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                                        tracking.paymentStatus === 'Partial' ? 'text-orange-600 bg-orange-50 border-orange-100' : 
                                        'text-red-600 bg-red-50 border-red-100'
                                      }`}
                                    >
                                      <option value="Unpaid">Unpaid</option>
                                      <option value="Partial">Partial</option>
                                      <option value="Paid">Paid</option>
                                    </select>
                                  </div>

                                  <div className="space-y-4">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">External Document Links</label>
                                    <div className="grid grid-cols-2 gap-3">
                                      {['report', 'invoice', 'document', 'drawing', 'other'].map(docKey => (
                                        <div key={docKey}>
                                          <input 
                                            type="text" 
                                            value={tracking.docs?.[docKey] || ''} 
                                            placeholder={`${docKey.charAt(0).toUpperCase() + docKey.slice(1)} URL...`}
                                            onChange={e => {
                                              const newTrackingIds = [...content.trackingIds];
                                              if (!newTrackingIds[idx].docs) newTrackingIds[idx].docs = {};
                                              newTrackingIds[idx].docs[docKey] = e.target.value;
                                              setContent({...content, trackingIds: newTrackingIds});
                                            }} 
                                            className="w-full border border-slate-100 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:border-orange-500 transition-all outline-none" 
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      );
                    })()}
                    <div className="h-4"></div>
                  </div>
                </div>
              )}

              {/* SERVICE REQUESTS SECTION */}
              {activeTab === 'serviceRequests' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-slate-900">Service Requests</h3>
                    <button
                      onClick={exportServiceRequests}
                      className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" /> Export to CSV
                    </button>
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

              {/* MANAGE ADMINS SECTION */}
              {activeTab === 'manageAdmins' && (
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-blue-500" />
                      Add New Admin
                    </h3>
                    <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            required
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                            placeholder="admin@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Initial Password</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="password" 
                            required
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        disabled={adminActionLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 h-[42px]"
                      >
                        {adminActionLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 'Create Admin'}
                      </button>
                    </form>
                    <p className="mt-4 text-xs text-slate-500 italic">
                      * Note: Creating a new account will add the email to the authorized whitelist and create a Firebase Auth user.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-500" />
                        Authorized Admins
                      </h3>
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                        {admins.length} Total
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Admin Email</th>
                            <th className="px-6 py-4">Added On</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {admins.map((admin) => (
                            <tr key={admin.email} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                                    {admin.email.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-slate-700">{admin.email}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => handleRemoveAdmin(admin.email)}
                                  className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                                  title="Remove Admin"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
