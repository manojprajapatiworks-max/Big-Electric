import React, { useState } from 'react';
import {
  Phone, MessageCircle, Globe, Menu, X, ChevronRight,
  Wrench, Zap, Settings, Activity, ShieldCheck, Clock,
  ThumbsUp, CheckCircle, Search, MapPin, Mail, Facebook,
  ArrowRight, Star, Factory, Cpu, PenTool,
  Truck, ClipboardList, MessageSquare, Check
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +66 94 260 8244</span>
            <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-2" /> LINE: @bigmotor</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center hover:text-orange-400 transition"><Globe className="w-4 h-4 mr-1" /> EN | TH</button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="text-2xl font-bold text-slate-900 flex items-center">
              <Zap className="w-8 h-8 text-orange-500 mr-2" />
              <span className="hidden sm:block">BIG ELECTRICMOTOR</span>
              <span className="sm:hidden">BIG MOTOR</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {['Home', 'About', 'Services', 'Booking', 'Repair Status', 'Blog', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-slate-700 hover:text-orange-500 font-medium transition">
                {item}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+66942608244" className="flex items-center text-slate-900 font-bold hover:text-orange-500 transition">
              <Phone className="w-5 h-5 mr-2" /> Call Now
            </a>
            <button className="bg-[#00B900] hover:bg-[#009900] text-white px-4 py-2 rounded-md font-medium flex items-center transition shadow-sm">
              <MessageCircle className="w-5 h-5 mr-2" /> LINE Chat
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-700 hover:text-orange-500">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Home', 'About', 'Services', 'Booking', 'Repair Status', 'Blog', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-orange-500 hover:bg-slate-50">
                {item}
              </a>
            ))}
            <div className="mt-4 px-3 flex flex-col space-y-2">
              <a href="tel:+66942608244" className="flex items-center justify-center w-full bg-slate-900 text-white px-4 py-2 rounded-md font-medium">
                <Phone className="w-5 h-5 mr-2" /> Call: +66 94 260 8244
              </a>
              <button className="flex items-center justify-center w-full bg-[#00B900] text-white px-4 py-2 rounded-md font-medium">
                <MessageCircle className="w-5 h-5 mr-2" /> LINE Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative bg-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://picsum.photos/seed/factory/1920/1080" 
          alt="Electric motor repair workshop" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 font-semibold text-sm mb-6 border border-orange-500/30">
            #1 Industrial Motor Specialists
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Professional Electric Motor <span className="text-orange-500">Repair & Rewinding</span> Service
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl">
            Reliable industrial motor repair services in Chon Buri and Pattaya. Fast turnaround, guaranteed quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-md font-bold text-lg transition shadow-lg flex items-center justify-center">
              Request Repair Service <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-md font-bold text-lg transition shadow-lg flex items-center justify-center">
              Get Repair Quotation
            </button>
          </div>
          
          <div className="flex items-center space-x-6 text-slate-300">
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-orange-500 mr-3" />
              <div>
                <p className="text-sm">24/7 Emergency Service</p>
                <p className="text-xl font-bold text-white">+66 94 260 8244</p>
              </div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-slate-700"></div>
            <button className="hidden sm:flex items-center text-sm hover:text-white transition underline underline-offset-4">
              Calculate Rewinding Cost
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  return (
    <section className="bg-white py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: <ShieldCheck className="w-6 h-6 text-orange-500" />, text: "Experienced motor technicians" },
            { icon: <Clock className="w-6 h-6 text-orange-500" />, text: "Fast repair turnaround" },
            { icon: <Factory className="w-6 h-6 text-orange-500" />, text: "Industrial motor specialists" },
            { icon: <MapPin className="w-6 h-6 text-orange-500" />, text: "Service across Chon Buri region" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
              {item.icon}
              <span className="font-medium text-slate-800">{item.text}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="py-4">
            <p className="text-4xl font-extrabold text-slate-900 mb-2">10<span className="text-orange-500">+</span></p>
            <p className="text-slate-600 font-medium uppercase tracking-wide text-sm">Years Experience</p>
          </div>
          <div className="py-4">
            <p className="text-4xl font-extrabold text-slate-900 mb-2">500<span className="text-orange-500">+</span></p>
            <p className="text-slate-600 font-medium uppercase tracking-wide text-sm">Motors Repaired</p>
          </div>
          <div className="py-4">
            <p className="text-4xl font-extrabold text-slate-900 mb-2">200<span className="text-orange-500">+</span></p>
            <p className="text-slate-600 font-medium uppercase tracking-wide text-sm">Industrial Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const servicesList = [
    { title: "Electric Motor Repair", icon: <Wrench className="w-8 h-8" />, desc: "Comprehensive diagnostics and repair for all types of electric motors." },
    { title: "Motor Rewinding", icon: <Activity className="w-8 h-8" />, desc: "High-quality copper rewinding to restore motor efficiency and lifespan." },
    { title: "Pump Motor Repair", icon: <Settings className="w-8 h-8" />, desc: "Specialized repair services for industrial water and chemical pumps." },
    { title: "Generator Motor Repair", icon: <Zap className="w-8 h-8" />, desc: "Maintenance and repair for backup and continuous power generators." },
    { title: "Industrial Maintenance", icon: <Factory className="w-8 h-8" />, desc: "Preventative maintenance programs to minimize factory downtime." },
    { title: "AC/DC Motor Service", icon: <Cpu className="w-8 h-8" />, desc: "Expert service for both alternating and direct current motors." }
  ];

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Professional Services</h2>
          <p className="text-lg text-slate-600">We provide comprehensive repair and maintenance solutions for all types of industrial electric motors.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition border border-slate-100 group">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6 line-clamp-2">{service.desc}</p>
              <button className="text-orange-600 font-semibold flex items-center hover:text-orange-700 transition">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Calculator = () => {
  const [result, setResult] = useState<{cost: string, time: string} | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock calculation
    setResult({
      cost: "฿4,500 - ฿6,000",
      time: "3 - 5 Business Days"
    });
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Motor Rewinding Cost Calculator</h2>
            <p className="text-slate-300 text-lg mb-8">
              Get an instant estimate for your motor rewinding or repair. Enter your motor specifications below to see estimated costs and turnaround times.
            </p>
            <ul className="space-y-4 mb-8">
              {['Transparent pricing structure', 'No hidden fees', 'Free detailed quotation available'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-2xl text-slate-900">
            <h3 className="text-2xl font-bold mb-6">Calculate Estimate</h3>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Motor Type</label>
                  <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>AC Induction Motor</option>
                    <option>DC Motor</option>
                    <option>Servo Motor</option>
                    <option>Pump Motor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">HP / KW</label>
                  <input type="text" placeholder="e.g. 10 HP" className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Voltage</label>
                  <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>220V</option>
                    <option>380V</option>
                    <option>440V</option>
                    <option>High Voltage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phase</label>
                  <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>1 Phase</option>
                    <option>3 Phase</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">RPM</label>
                  <input type="text" placeholder="e.g. 1450 RPM" className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
              </div>
              
              {!result ? (
                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-md transition mt-4">
                  Calculate Cost
                </button>
              ) : (
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Estimated Cost</p>
                    <p className="text-3xl font-bold text-orange-600">{result.cost}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Estimated Time</p>
                    <p className="text-xl font-semibold text-slate-800">{result.time}</p>
                  </div>
                  <button type="button" onClick={() => setResult(null)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition">
                    Request Service Now
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const points = [
    "Professional Technicians",
    "Modern Repair Equipment",
    "Fast Turnaround Time",
    "High Quality Motor Rewinding",
    "Affordable Repair Pricing",
    "Industrial Motor Expertise"
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://picsum.photos/seed/technician/800/600" 
              alt="Professional Technician" 
              className="rounded-2xl shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Choose BIG ELECTRICMOTOR?</h2>
            <p className="text-lg text-slate-600 mb-8">
              We are the trusted partner for industrial facilities across Chon Buri and Pattaya. Our commitment to quality and speed ensures your operations experience minimal downtime.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((point, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="ml-3 text-slate-800 font-medium">{point}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-md font-bold transition shadow-md">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    { icon: <PenTool className="w-6 h-6" />, title: "Submit Service Request", desc: "Contact us via phone, LINE, or web form." },
    { icon: <Search className="w-6 h-6" />, title: "Motor Inspection", desc: "Thorough diagnostic to identify the root cause." },
    { icon: <Wrench className="w-6 h-6" />, title: "Repair or Rewinding", desc: "Expert repair using high-grade materials." },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Testing & Quality Check", desc: "Rigorous testing to ensure optimal performance." },
    { icon: <Truck className="w-6 h-6" />, title: "Delivery to Customer", desc: "Safe return of your fully functional motor." }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Repair Process</h2>
          <p className="text-lg text-slate-600">A systematic approach to ensure quality and reliability in every repair job.</p>
        </div>
        
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 shadow-md flex items-center justify-center text-orange-500 mb-4 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [status, setStatus] = useState<null | 'searching' | 'found'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    setStatus('searching');
    setTimeout(() => setStatus('found'), 800);
  };

  return (
    <section id="repair-status" className="py-20 bg-orange-500 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ClipboardList className="w-16 h-16 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Track Your Repair Status</h2>
        <p className="text-lg text-orange-100 mb-8">Enter your Repair Tracking ID to see the current stage of your motor.</p>
        
        <form onSubmit={handleTrack} className="max-w-2xl mx-auto bg-white p-2 rounded-lg shadow-lg flex flex-col sm:flex-row">
          <input 
            type="text" 
            placeholder="e.g. EMS-000245" 
            className="flex-grow px-4 py-3 text-slate-900 focus:outline-none rounded-md"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button type="submit" className="mt-2 sm:mt-0 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-md font-bold transition flex items-center justify-center">
            <Search className="w-5 h-5 mr-2" /> Track
          </button>
        </form>

        {status === 'searching' && (
          <div className="mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        )}

        {status === 'found' && (
          <div className="mt-8 bg-white text-slate-900 rounded-xl p-6 text-left shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase">Tracking ID</p>
                <p className="text-xl font-bold">{trackingId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium uppercase">Est. Completion</p>
                <p className="text-xl font-bold text-orange-600">Oct 24, 2026</p>
              </div>
            </div>
            
            <div className="relative pt-4">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                <div style={{ width: "60%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"></div>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Received</span>
                <span>Inspecting</span>
                <span className="text-orange-600 font-bold">Rewinding</span>
                <span>Testing</span>
                <span>Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Customer Testimonials</h2>
          <p className="text-lg text-slate-600">See what our industrial clients have to say about our repair services.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Somchai P.", company: "Eastern Manufacturing Co.", text: "Very professional motor repair service. Fast and reliable. They saved our production line from a long downtime." },
            { name: "Kittipong T.", company: "Chon Buri Water Works", text: "Excellent pump motor rewinding. The motor runs cooler and more efficiently than before. Highly recommended." },
            { name: "Ariya S.", company: "Pattaya Industrial Estate", text: "Transparent pricing and great communication throughout the repair process. The best motor service in the region." }
          ].map((review, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-8 border border-slate-100">
              <div className="flex text-orange-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-slate-700 italic mb-6">"{review.text}"</p>
              <div>
                <p className="font-bold text-slate-900">{review.name}</p>
                <p className="text-sm text-slate-500">{review.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    "https://picsum.photos/seed/motor1/600/400",
    "https://picsum.photos/seed/motor2/600/400",
    "https://picsum.photos/seed/motor3/600/400",
    "https://picsum.photos/seed/motor4/600/400",
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Workshop Gallery</h2>
            <p className="text-lg text-slate-400">A glimpse into our professional repair facility.</p>
          </div>
          <button className="hidden sm:flex items-center text-orange-500 hover:text-orange-400 font-medium transition">
            View All Photos <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group overflow-hidden rounded-lg aspect-video">
              <img 
                src={img} 
                alt={`Gallery image ${idx + 1}`} 
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>
        <button className="sm:hidden mt-8 w-full flex justify-center items-center text-orange-500 font-medium">
          View All Photos <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </section>
  );
};

const Blog = () => {
  const posts = [
    { title: "Electric Motor Overheating Causes", img: "https://picsum.photos/seed/heat/600/400", date: "Oct 12, 2026" },
    { title: "Motor Rewinding Process Explained", img: "https://picsum.photos/seed/wire/600/400", date: "Sep 28, 2026" },
    { title: "Industrial Motor Maintenance Tips", img: "https://picsum.photos/seed/maint/600/400", date: "Sep 15, 2026" }
  ];

  return (
    <section id="blog" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Latest Articles & Tips</h2>
          <p className="text-lg text-slate-600">Stay updated with our latest insights on motor maintenance and repair.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.img} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-orange-500 font-medium mb-2">{post.date}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition">{post.title}</h3>
                <button className="text-slate-600 font-medium flex items-center hover:text-slate-900 transition">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Contact Us</h2>
            <p className="text-lg text-slate-600 mb-8">
              Need immediate assistance or a quotation? Reach out to us using the details below or fill out the quick request form.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mr-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Address</h4>
                  <p className="text-slate-600">21 2, Khao Mai Kaeo<br/>Bang Lamung District<br/>Chon Buri 20150, Thailand</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mr-4">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Phone</h4>
                  <p className="text-slate-600">+66 94 260 8244</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00B900]/10 rounded-lg flex items-center justify-center text-[#00B900] mr-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">LINE</h4>
                  <p className="text-slate-600">@bigmotor</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a href="tel:+66942608244" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-md font-bold transition flex items-center">
                <Phone className="w-5 h-5 mr-2" /> Call Now
              </a>
              <button className="bg-[#00B900] hover:bg-[#009900] text-white px-6 py-3 rounded-md font-bold transition flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" /> Chat on LINE
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Quick Service Request</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name / Company</label>
                <input type="text" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Motor Type</label>
                  <input type="text" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Description</label>
                <textarea rows={4} className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition mt-2">
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  return (
    <section className="bg-slate-200 h-96 relative">
      {/* Placeholder for actual Google Map iframe */}
      <div className="absolute inset-0 bg-slate-300 flex flex-col items-center justify-center">
        <MapPin className="w-12 h-12 text-slate-500 mb-4" />
        <p className="text-slate-600 font-medium mb-4">Map of Bang Lamung District, Chon Buri</p>
        <button className="bg-white text-slate-900 px-6 py-2 rounded-md font-medium shadow-sm hover:bg-slate-50 transition border border-slate-200">
          Open in Google Maps
        </button>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold text-white flex items-center mb-6">
              <Zap className="w-6 h-6 text-orange-500 mr-2" />
              BIG MOTOR
            </div>
            <p className="mb-6">Professional electric motor repair and rewinding service in Chon Buri and Pattaya. Quality guaranteed.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#00B900] hover:text-white transition">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Booking', 'Repair Status', 'Blog', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-orange-500 transition flex items-center">
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600" /> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Our Services</h4>
            <ul className="space-y-3">
              {['Electric Motor Repair', 'Motor Rewinding', 'Pump Motor Repair', 'Generator Service', 'Industrial Maintenance'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-orange-500 transition flex items-center">
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600" /> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                <span>21 2, Khao Mai Kaeo, Bang Lamung District, Chon Buri 20150</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                <span>+66 94 260 8244</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                <span>service@bigmotor.co.th</span>
              </li>
              <li className="flex items-center">
                <MessageCircle className="w-5 h-5 text-[#00B900] mr-3 flex-shrink-0" />
                <span>LINE: @bigmotor</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} BIG ELECTRICMOTOR SERVICE CO., LTD. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
      <a href="https://wa.me/66942608244" className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="WhatsApp">
        <MessageSquare className="w-7 h-7" />
      </a>
      <a href="#" className="w-14 h-14 bg-[#00B900] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="LINE">
        <MessageCircle className="w-7 h-7" />
      </a>
      <a href="tel:+66942608244" className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce" aria-label="Call">
        <Phone className="w-7 h-7" />
      </a>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-500 selection:text-white scroll-smooth">
      <Header />
      <main>
        <Hero />
        <TrustSection />
        <Services />
        <Calculator />
        <WhyChooseUs />
        <Process />
        <Tracking />
        <Testimonials />
        <Gallery />
        <Blog />
        <Contact />
        <MapSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
