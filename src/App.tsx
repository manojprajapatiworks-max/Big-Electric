import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Phone, MessageCircle, Globe, Menu, X, ChevronRight,
  Wrench, Zap, Settings, Activity, ShieldCheck, Clock,
  ThumbsUp, CheckCircle, Search, MapPin, Mail, Facebook,
  ArrowRight, Star, Factory, Cpu, PenTool,
  Truck, ClipboardList, MessageSquare, Check
} from 'lucide-react';

const SiteContext = createContext<any>(null);

type Language = 'en' | 'th';
const LanguageContext = createContext<{lang: Language, setLang: (l: Language) => void}>({lang: 'en', setLang: () => {}});

const t = (key: string, lang: Language) => {
  const dict: Record<string, Record<Language, string>> = {
    'Home': { en: 'Home', th: 'หน้าแรก' },
    'About': { en: 'About', th: 'เกี่ยวกับเรา' },
    'Services': { en: 'Services', th: 'บริการ' },
    'Booking': { en: 'Booking', th: 'จองคิว' },
    'Repair Status': { en: 'Repair Status', th: 'สถานะการซ่อม' },
    'Blog': { en: 'Blog', th: 'บทความ' },
    'Contact': { en: 'Contact', th: 'ติดต่อเรา' },
    'Call Now': { en: 'Call Now', th: 'โทรเลย' },
    'LINE Chat': { en: 'LINE Chat', th: 'แชท LINE' },
    'Request Repair Service': { en: 'Request Repair Service', th: 'แจ้งซ่อม' },
    'Get Repair Quotation': { en: 'Get Repair Quotation', th: 'ขอใบเสนอราคา' },
    '24/7 Emergency Service': { en: '24/7 Emergency Service', th: 'บริการฉุกเฉิน 24 ชม.' },
    'Calculate Rewinding Cost': { en: 'Calculate Rewinding Cost', th: 'คำนวณค่าพันมอเตอร์' },
    'Experienced motor technicians': { en: 'Experienced motor technicians', th: 'ช่างมอเตอร์ผู้เชี่ยวชาญ' },
    'Fast repair turnaround': { en: 'Fast repair turnaround', th: 'ซ่อมเสร็จรวดเร็ว' },
    'Industrial motor specialists': { en: 'Industrial motor specialists', th: 'ผู้เชี่ยวชาญมอเตอร์อุตสาหกรรม' },
    'Service across Chon Buri region': { en: 'Service across Chon Buri region', th: 'บริการทั่วชลบุรี' },
    'Years Experience': { en: 'Years Experience', th: 'ปีแห่งประสบการณ์' },
    'Motors Repaired': { en: 'Motors Repaired', th: 'มอเตอร์ที่ซ่อมแล้ว' },
    'Industrial Clients': { en: 'Industrial Clients', th: 'ลูกค้าอุตสาหกรรม' },
    'Our Specialized Services': { en: 'Our Specialized Services', th: 'บริการเฉพาะทางของเรา' },
    'Comprehensive motor repair and maintenance solutions for industrial applications.': { en: 'Comprehensive motor repair and maintenance solutions for industrial applications.', th: 'โซลูชั่นการซ่อมแซมและบำรุงรักษามอเตอร์แบบครบวงจรสำหรับงานอุตสาหกรรม' },
    'Motor Rewinding': { en: 'Motor Rewinding', th: 'พันขดลวดมอเตอร์' },
    'Complete stator and rotor rewinding with high-grade copper and class H insulation.': { en: 'Complete stator and rotor rewinding with high-grade copper and class H insulation.', th: 'พันขดลวดสเตเตอร์และโรเตอร์ใหม่ทั้งหมดด้วยทองแดงเกรดสูงและฉนวนคลาส H' },
    'Overhaul & Maintenance': { en: 'Overhaul & Maintenance', th: 'ยกเครื่องและบำรุงรักษา' },
    'Bearing replacement, balancing, cleaning, and preventive maintenance.': { en: 'Bearing replacement, balancing, cleaning, and preventive maintenance.', th: 'เปลี่ยนลูกปืน ถ่วงสมดุล ทำความสะอาด และบำรุงรักษาเชิงป้องกัน' },
    'Testing & Diagnostics': { en: 'Testing & Diagnostics', th: 'การทดสอบและวิเคราะห์' },
    'Vibration analysis, surge testing, and electrical diagnostics.': { en: 'Vibration analysis, surge testing, and electrical diagnostics.', th: 'วิเคราะห์ความสั่นสะเทือน ทดสอบไฟกระชาก และวิเคราะห์ระบบไฟฟ้า' },
    'Learn More': { en: 'Learn More', th: 'เรียนรู้เพิ่มเติม' },
    'Motor Rewinding Cost Calculator': { en: 'Motor Rewinding Cost Calculator', th: 'เครื่องคำนวณค่าพันมอเตอร์' },
    'Estimate your repair costs instantly. Actual prices may vary based on inspection.': { en: 'Estimate your repair costs instantly. Actual prices may vary based on inspection.', th: 'ประเมินค่าซ่อมของคุณทันที ราคาจริงอาจแตกต่างกันไปตามการตรวจสอบ' },
    'Motor Power (HP/kW)': { en: 'Motor Power (HP/kW)', th: 'กำลังมอเตอร์ (HP/kW)' },
    'Motor Type': { en: 'Motor Type', th: 'ประเภทมอเตอร์' },
    'AC Motor': { en: 'AC Motor', th: 'มอเตอร์ AC' },
    'DC Motor': { en: 'DC Motor', th: 'มอเตอร์ DC' },
    'Calculate Estimate': { en: 'Calculate Estimate', th: 'คำนวณราคาประเมิน' },
    'Estimated Cost': { en: 'Estimated Cost', th: 'ค่าใช้จ่ายโดยประมาณ' },
    'Estimated Time': { en: 'Estimated Time', th: 'เวลาโดยประมาณ' },
    'Quick Service Request': { en: 'Quick Service Request', th: 'แจ้งซ่อมด่วน' },
    'Name': { en: 'Name', th: 'ชื่อ' },
    'Phone Number': { en: 'Phone Number', th: 'เบอร์โทรศัพท์' },
    'Motor Issue': { en: 'Motor Issue', th: 'ปัญหามอเตอร์' },
    'Submit Request': { en: 'Submit Request', th: 'ส่งคำร้อง' },
    'Track Your Repair Status': { en: 'Track Your Repair Status', th: 'ติดตามสถานะการซ่อม' },
    'Enter your Repair Tracking ID to see the current stage of your motor.': { en: 'Enter your Repair Tracking ID to see the current stage of your motor.', th: 'ป้อนรหัสติดตามการซ่อมของคุณเพื่อดูขั้นตอนปัจจุบันของมอเตอร์' },
    'Track': { en: 'Track', th: 'ติดตาม' },
    'Tracking ID': { en: 'Tracking ID', th: 'รหัสติดตาม' },
    'Est. Completion': { en: 'Est. Completion', th: 'คาดว่าจะเสร็จ' },
    'Customer Testimonials': { en: 'Customer Testimonials', th: 'เสียงตอบรับจากลูกค้า' },
    'See what our industrial clients have to say about our repair services.': { en: 'See what our industrial clients have to say about our repair services.', th: 'ดูว่าลูกค้าอุตสาหกรรมของเราพูดถึงบริการซ่อมของเราอย่างไร' },
    'Workshop Gallery': { en: 'Workshop Gallery', th: 'แกลเลอรีเวิร์กชอป' },
    'A glimpse into our professional repair facility.': { en: 'A glimpse into our professional repair facility.', th: 'ภาพรวมของศูนย์ซ่อมระดับมืออาชีพของเรา' },
    'View All Photos': { en: 'View All Photos', th: 'ดูรูปภาพทั้งหมด' },
    'Latest Articles & Tips': { en: 'Latest Articles & Tips', th: 'บทความและเคล็ดลับล่าสุด' },
    'Stay updated with our latest insights on motor maintenance and repair.': { en: 'Stay updated with our latest insights on motor maintenance and repair.', th: 'ติดตามข้อมูลเชิงลึกล่าสุดเกี่ยวกับการบำรุงรักษาและซ่อมแซมมอเตอร์' },
    'Read More': { en: 'Read More', th: 'อ่านเพิ่มเติม' },
    'Contact Us': { en: 'Contact Us', th: 'ติดต่อเรา' },
    'Need immediate assistance or a quotation? Reach out to us using the details below or fill out the quick request form.': { en: 'Need immediate assistance or a quotation? Reach out to us using the details below or fill out the quick request form.', th: 'ต้องการความช่วยเหลือทันทีหรือใบเสนอราคา? ติดต่อเราตามรายละเอียดด้านล่างหรือกรอกแบบฟอร์มคำร้องด่วน' },
    'Address': { en: 'Address', th: 'ที่อยู่' },
    'Business Hours': { en: 'Business Hours', th: 'เวลาทำการ' },
    'Mon - Sat: 8:00 AM - 6:00 PM': { en: 'Mon - Sat: 8:00 AM - 6:00 PM', th: 'จันทร์ - เสาร์: 8:00 น. - 18:00 น.' },
    'Sunday: Emergency Calls Only': { en: 'Sunday: Emergency Calls Only', th: 'อาทิตย์: รับสายฉุกเฉินเท่านั้น' },
    'Privacy Policy': { en: 'Privacy Policy', th: 'นโยบายความเป็นส่วนตัว' },
    'Terms of Service': { en: 'Terms of Service', th: 'ข้อกำหนดการให้บริการ' },
    'Open in Google Maps': { en: 'Open in Google Maps', th: 'เปิดใน Google Maps' },
    'Sending...': { en: 'Sending...', th: 'กำลังส่ง...' },
    'Request Sent Successfully!': { en: 'Request Sent Successfully!', th: 'ส่งคำร้องสำเร็จ!' },
    'We will contact you shortly.': { en: 'We will contact you shortly.', th: 'เราจะติดต่อกลับในไม่ช้า' },
    '#1 Industrial Motor Specialists': { en: '#1 Industrial Motor Specialists', th: 'ผู้เชี่ยวชาญมอเตอร์อุตสาหกรรมอันดับ 1' },
    'Received': { en: 'Received', th: 'รับเครื่อง' },
    'Inspecting': { en: 'Inspecting', th: 'กำลังตรวจสอบ' },
    'Rewinding': { en: 'Rewinding', th: 'กำลังพันขดลวด' },
    'Testing': { en: 'Testing', th: 'กำลังทดสอบ' },
    'Ready': { en: 'Ready', th: 'พร้อมส่งมอบ' },
    'Name / Company': { en: 'Name / Company', th: 'ชื่อ / บริษัท' },
    'Phone': { en: 'Phone', th: 'เบอร์โทรศัพท์' },
    'Issue Description': { en: 'Issue Description', th: 'รายละเอียดปัญหา' },
    'Send Request': { en: 'Send Request', th: 'ส่งคำร้อง' },
    'Request sent successfully!': { en: 'Request sent successfully!', th: 'ส่งคำร้องสำเร็จ!' },
    'Our Services': { en: 'Our Services', th: 'บริการของเรา' },
    'Contact Info': { en: 'Contact Info', th: 'ข้อมูลการติดต่อ' },
    'All rights reserved.': { en: 'All rights reserved.', th: 'สงวนลิขสิทธิ์' },
    'LINE': { en: 'LINE', th: 'ไลน์' },
    'Chat on LINE': { en: 'Chat on LINE', th: 'แชทผ่าน LINE' },
    'Our Professional Services': { en: 'Our Professional Services', th: 'บริการระดับมืออาชีพของเรา' },
    'We provide comprehensive repair and maintenance solutions for all types of industrial electric motors.': { en: 'We provide comprehensive repair and maintenance solutions for all types of industrial electric motors.', th: 'เราให้บริการซ่อมแซมและบำรุงรักษามอเตอร์ไฟฟ้าอุตสาหกรรมทุกประเภทแบบครบวงจร' },
    'AC Induction Motor': { en: 'AC Induction Motor', th: 'มอเตอร์เหนี่ยวนำ AC' },
    'Servo Motor': { en: 'Servo Motor', th: 'เซอร์โวมอเตอร์' },
    'Pump Motor': { en: 'Pump Motor', th: 'มอเตอร์ปั๊ม' },
    'HP / KW': { en: 'HP / KW', th: 'แรงม้า / กิโลวัตต์' },
    'e.g. 10 HP': { en: 'e.g. 10 HP', th: 'เช่น 10 HP' },
    'Voltage': { en: 'Voltage', th: 'แรงดันไฟฟ้า' },
    'High Voltage': { en: 'High Voltage', th: 'ไฟฟ้าแรงสูง' },
    'Phase': { en: 'Phase', th: 'เฟส' },
    '1 Phase': { en: '1 Phase', th: '1 เฟส' },
    '3 Phase': { en: '3 Phase', th: '3 เฟส' },
    'RPM': { en: 'RPM', th: 'รอบต่อนาที (RPM)' },
    'e.g. 1450 RPM': { en: 'e.g. 1450 RPM', th: 'เช่น 1450 RPM' },
    'Calculate Cost': { en: 'Calculate Cost', th: 'คำนวณค่าใช้จ่าย' },
    'Request Service Now': { en: 'Request Service Now', th: 'แจ้งซ่อมตอนนี้' },
    'Why Choose BIG ELECTRICMOTOR?': { en: 'Why Choose BIG ELECTRICMOTOR?', th: 'ทำไมต้องเลือก BIG ELECTRICMOTOR?' },
    'We are the trusted partner for industrial facilities across Chon Buri and Pattaya. Our commitment to quality and speed ensures your operations experience minimal downtime.': { en: 'We are the trusted partner for industrial facilities across Chon Buri and Pattaya. Our commitment to quality and speed ensures your operations experience minimal downtime.', th: 'เราคือพันธมิตรที่ได้รับความไว้วางใจจากโรงงานอุตสาหกรรมทั่วชลบุรีและพัทยา ความมุ่งมั่นในคุณภาพและความรวดเร็วของเราช่วยให้การดำเนินงานของคุณมีเวลาหยุดทำงานน้อยที่สุด' },
    'Learn More About Us': { en: 'Learn More About Us', th: 'เรียนรู้เพิ่มเติมเกี่ยวกับเรา' },
    'Our Repair Process': { en: 'Our Repair Process', th: 'กระบวนการซ่อมของเรา' },
    'A systematic approach to ensure quality and reliability in every repair job.': { en: 'A systematic approach to ensure quality and reliability in every repair job.', th: 'แนวทางที่เป็นระบบเพื่อให้มั่นใจในคุณภาพและความน่าเชื่อถือในงานซ่อมทุกครั้ง' },
    'e.g. EMS-000245': { en: 'e.g. EMS-000245', th: 'เช่น EMS-000245' },
    'Tracking ID not found.': { en: 'Tracking ID not found.', th: 'ไม่พบรหัสติดตาม' },
    'Please check the ID and try again.': { en: 'Please check the ID and try again.', th: 'โปรดตรวจสอบรหัสและลองอีกครั้ง' },
    'Language': { en: 'Language', th: 'ภาษา' },
  };
  return dict[key] ? dict[key][lang] : key;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const siteContent = useContext(SiteContext);
  const { lang, setLang } = useContext(LanguageContext);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'booking', 'repair-status', 'blog', 'contact'];
      let current = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {siteContent?.contact?.phone || '+66 94 260 8244'}</span>
            <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-2" /> LINE: {siteContent?.contact?.line || '@bigmotor'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 mr-1 text-slate-400" />
            <div className="flex bg-slate-800 rounded-md p-0.5">
              <button 
                onClick={() => setLang('en')} 
                className={`px-3 py-1 text-xs font-bold rounded-sm transition ${lang === 'en' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('th')} 
                className={`px-3 py-1 text-xs font-bold rounded-sm transition ${lang === 'th' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                TH
              </button>
            </div>
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
              <span className="hidden sm:block lg:hidden xl:block">BIG ELECTRICMOTOR</span>
              <span className="block sm:hidden lg:block xl:hidden">BIG MOTOR</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex lg:space-x-4 xl:space-x-8">
            {['Home', 'About', 'Services', 'Booking', 'Repair Status', 'Blog', 'Contact'].map((item) => {
              const sectionId = item.toLowerCase().replace(' ', '-');
              const isActive = activeSection === sectionId;
              return (
              <a 
                key={item} 
                href={`#${sectionId}`} 
                className={`font-medium transition text-sm xl:text-base ${isActive ? 'text-orange-500' : 'text-slate-700 hover:text-orange-500'}`}
              >
                {t(item, lang)}
              </a>
            )})}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden xl:flex items-center space-x-4">
            <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="flex items-center text-slate-900 font-bold hover:text-orange-500 transition">
              <Phone className="w-5 h-5 mr-2" /> {t('Call Now', lang)}
            </a>
            <button onClick={() => window.open(`https://line.me/R/ti/p/${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`, '_blank')} className="bg-[#00B900] hover:bg-[#009900] text-white px-4 py-2 rounded-md font-medium flex items-center transition shadow-sm">
              <MessageCircle className="w-5 h-5 mr-2" /> {t('LINE Chat', lang)}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-700 hover:text-orange-500">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Home', 'About', 'Services', 'Booking', 'Repair Status', 'Blog', 'Contact'].map((item) => {
              const sectionId = item.toLowerCase().replace(' ', '-');
              const isActive = activeSection === sectionId;
              return (
              <a 
                key={item} 
                href={`#${sectionId}`} 
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-md transition ${isActive ? 'text-orange-500 bg-orange-50' : 'text-slate-700 hover:text-orange-500 hover:bg-slate-50'}`}
              >
                {t(item, lang)}
              </a>
            )})}
            <div className="mt-4 px-3 flex flex-col space-y-2 border-t pt-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-sm font-medium text-slate-500 uppercase">{t('Language', lang)}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setLang('en')} 
                    className={`px-3 py-1 text-sm font-medium rounded-md transition ${lang === 'en' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLang('th')} 
                    className={`px-3 py-1 text-sm font-medium rounded-md transition ${lang === 'th' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    TH
                  </button>
                </div>
              </div>
              <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="flex items-center justify-center w-full bg-slate-900 text-white px-4 py-2 rounded-md font-medium">
                <Phone className="w-5 h-5 mr-2" /> {t('Call Now', lang)}: {siteContent?.contact?.phone || '+66 94 260 8244'}
              </a>
              <button onClick={() => window.open(`https://line.me/R/ti/p/${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`, '_blank')} className="flex items-center justify-center w-full bg-[#00B900] text-white px-4 py-2 rounded-md font-medium">
                <MessageCircle className="w-5 h-5 mr-2" /> {t('LINE Chat', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  const siteContent = useContext(SiteContext);
  const { lang } = useContext(LanguageContext);
  
  const headline = lang === 'th' && siteContent?.hero?.headline_th ? siteContent.hero.headline_th : (siteContent?.hero?.headline || 'Professional Electric Motor Repair & Rewinding Service');
  const subheadline = lang === 'th' && siteContent?.hero?.subheadline_th ? siteContent.hero.subheadline_th : (siteContent?.hero?.subheadline || 'Reliable industrial motor repair services in Chon Buri and Pattaya. Fast turnaround, guaranteed quality.');

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
            {t('#1 Industrial Motor Specialists', lang)}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {lang === 'en' ? headline.split('Repair & Rewinding').map((part: string, i: number, arr: string[]) => 
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-orange-500">Repair & Rewinding</span>}
              </React.Fragment>
            ) : headline}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl">
            {subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-md font-bold text-lg transition shadow-lg flex items-center justify-center" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('Request Repair Service', lang)} <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-md font-bold text-lg transition shadow-lg flex items-center justify-center" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('Get Repair Quotation', lang)}
            </button>
          </div>
          
          <div className="flex items-center space-x-6 text-slate-300">
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-orange-500 mr-3" />
              <div>
                <p className="text-sm">{t('24/7 Emergency Service', lang)}</p>
                <p className="text-xl font-bold text-white">{siteContent?.hero?.phone || '+66 94 260 8244'}</p>
              </div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-slate-700"></div>
            <button className="hidden sm:flex items-center text-sm hover:text-white transition underline underline-offset-4" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('Calculate Rewinding Cost', lang)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  const siteContent = useContext(SiteContext);
  const { lang } = useContext(LanguageContext);
  return (
    <section id="about" className="bg-white py-12 border-b border-slate-200">
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
              <span className="font-medium text-slate-800">{t(item.text, lang)}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="py-4">
            <p className="text-4xl font-extrabold text-slate-900 mb-2">{siteContent?.stats?.yearsExperience || '10'}<span className="text-orange-500">+</span></p>
            <p className="text-slate-600 font-medium uppercase tracking-wide text-sm">{t('Years Experience', lang)}</p>
          </div>
          <div className="py-4">
            <p className="text-4xl font-extrabold text-slate-900 mb-2">{siteContent?.stats?.motorsRepaired || '500'}<span className="text-orange-500">+</span></p>
            <p className="text-slate-600 font-medium uppercase tracking-wide text-sm">{t('Motors Repaired', lang)}</p>
          </div>
          <div className="py-4">
            <p className="text-4xl font-extrabold text-slate-900 mb-2">{siteContent?.stats?.industrialClients || '200'}<span className="text-orange-500">+</span></p>
            <p className="text-slate-600 font-medium uppercase tracking-wide text-sm">{t('Industrial Clients', lang)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const { lang } = useContext(LanguageContext);
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
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('Our Professional Services', lang)}</h2>
          <p className="text-lg text-slate-600">{t('We provide comprehensive repair and maintenance solutions for all types of industrial electric motors.', lang)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition border border-slate-100 group">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t(service.title, lang)}</h3>
              <p className="text-slate-600 mb-6 line-clamp-2">{t(service.desc, lang)}</p>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-orange-600 font-semibold flex items-center hover:text-orange-700 transition">
                {t('Learn More', lang)} <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Calculator = () => {
  const { lang } = useContext(LanguageContext);
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
    <section id="booking" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('Motor Rewinding Cost Calculator', lang)}</h2>
            <p className="text-slate-300 text-lg mb-8">
              {t('Get an instant estimate for your motor rewinding or repair. Enter your motor specifications below to see estimated costs and turnaround times.', lang)}
            </p>
            <ul className="space-y-4 mb-8">
              {['Transparent pricing structure', 'No hidden fees', 'Free detailed quotation available'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                  {t(item, lang)}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-2xl text-slate-900">
            <h3 className="text-2xl font-bold mb-6">{t('Calculate Estimate', lang)}</h3>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('Motor Type', lang)}</label>
                  <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>{t('AC Induction Motor', lang)}</option>
                    <option>{t('DC Motor', lang)}</option>
                    <option>{t('Servo Motor', lang)}</option>
                    <option>{t('Pump Motor', lang)}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('HP / KW', lang)}</label>
                  <input type="text" placeholder={t("e.g. 10 HP", lang)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('Voltage', lang)}</label>
                  <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>220V</option>
                    <option>380V</option>
                    <option>440V</option>
                    <option>{t('High Voltage', lang)}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('Phase', lang)}</label>
                  <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>{t('1 Phase', lang)}</option>
                    <option>{t('3 Phase', lang)}</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('RPM', lang)}</label>
                  <input type="text" placeholder={t("e.g. 1450 RPM", lang)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
              </div>
              
              {!result ? (
                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-md transition mt-4">
                  {t('Calculate Cost', lang)}
                </button>
              ) : (
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">{t('Estimated Cost', lang)}</p>
                    <p className="text-3xl font-bold text-orange-600">{result.cost}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">{t('Estimated Time', lang)}</p>
                    <p className="text-xl font-semibold text-slate-800">{result.time}</p>
                  </div>
                  <button type="button" onClick={() => { setResult(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition">
                    {t('Request Service Now', lang)}
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
  const { lang } = useContext(LanguageContext);
  const points = [
    "Professional Technicians",
    "Modern Repair Equipment",
    "Fast Turnaround Time",
    "High Quality Motor Rewinding",
    "Affordable Repair Pricing",
    "Industrial Motor Expertise"
  ];

  return (
    <section className="py-20 bg-white">
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{t('Why Choose BIG ELECTRICMOTOR?', lang)}</h2>
            <p className="text-lg text-slate-600 mb-8">
              {t('We are the trusted partner for industrial facilities across Chon Buri and Pattaya. Our commitment to quality and speed ensures your operations experience minimal downtime.', lang)}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((point, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="ml-3 text-slate-800 font-medium">{t(point, lang)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-md font-bold transition shadow-md">
                {t('Learn More About Us', lang)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const { lang } = useContext(LanguageContext);
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
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('Our Repair Process', lang)}</h2>
          <p className="text-lg text-slate-600">{t('A systematic approach to ensure quality and reliability in every repair job.', lang)}</p>
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
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t(step.title, lang)}</h3>
                <p className="text-sm text-slate-600">{t(step.desc, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Tracking = () => {
  const { lang } = useContext(LanguageContext);
  const [trackingId, setTrackingId] = useState('');
  const [status, setStatus] = useState<null | 'searching' | 'found' | 'not_found'>(null);
  const [trackingData, setTrackingData] = useState<any>(null);
  const siteContent = useContext(SiteContext);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    setStatus('searching');
    setTimeout(() => {
      const found = siteContent?.trackingIds?.find((t: any) => t.id === trackingId);
      if (found) {
        setTrackingData(found);
        setStatus('found');
      } else {
        setStatus('not_found');
      }
    }, 800);
  };

  const stages = ['Received', 'Inspecting', 'Rewinding', 'Testing', 'Ready'];
  const currentStageIndex = trackingData ? stages.indexOf(trackingData.status) : -1;
  const progressPercentage = currentStageIndex >= 0 ? (currentStageIndex / (stages.length - 1)) * 100 : 0;

  return (
    <section id="repair-status" className="py-20 bg-orange-500 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ClipboardList className="w-16 h-16 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('Track Your Repair Status', lang)}</h2>
        <p className="text-lg text-orange-100 mb-8">{t('Enter your Repair Tracking ID to see the current stage of your motor.', lang)}</p>
        
        <form onSubmit={handleTrack} className="max-w-2xl mx-auto bg-white p-2 rounded-lg shadow-lg flex flex-col sm:flex-row">
          <input 
            type="text" 
            placeholder={t("e.g. EMS-000245", lang)} 
            className="flex-grow px-4 py-3 text-slate-900 focus:outline-none rounded-md"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button type="submit" className="mt-2 sm:mt-0 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-md font-bold transition flex items-center justify-center">
            <Search className="w-5 h-5 mr-2" /> {t('Track', lang)}
          </button>
        </form>

        {status === 'searching' && (
          <div className="mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        )}

        {status === 'not_found' && (
          <div className="mt-8 bg-white text-slate-900 rounded-xl p-6 text-center shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <p className="text-lg font-bold text-red-500">{t('Tracking ID not found.', lang)}</p>
            <p className="text-slate-600">{t('Please check the ID and try again.', lang)}</p>
          </div>
        )}

        {status === 'found' && trackingData && (
          <div className="mt-8 bg-white text-slate-900 rounded-xl p-6 text-left shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase">{t('Tracking ID', lang)}</p>
                <p className="text-xl font-bold">{trackingData.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium uppercase">{t('Est. Completion', lang)}</p>
                <p className="text-xl font-bold text-orange-600">{trackingData.completionDate}</p>
              </div>
            </div>
            
            <div className="relative pt-4">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500 transition-all duration-1000"></div>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                {stages.map((stage, idx) => (
                  <span key={stage} className={idx <= currentStageIndex ? "text-orange-600 font-bold" : ""}>
                    {t(stage, lang)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { lang } = useContext(LanguageContext);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('Customer Testimonials', lang)}</h2>
          <p className="text-lg text-slate-600">{t('See what our industrial clients have to say about our repair services.', lang)}</p>
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
              <p className="text-slate-700 italic mb-6">"{t(review.text, lang)}"</p>
              <div>
                <p className="font-bold text-slate-900">{t(review.name, lang)}</p>
                <p className="text-sm text-slate-500">{t(review.company, lang)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const { lang } = useContext(LanguageContext);
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('Workshop Gallery', lang)}</h2>
            <p className="text-lg text-slate-400">{t('A glimpse into our professional repair facility.', lang)}</p>
          </div>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hidden sm:flex items-center text-orange-500 hover:text-orange-400 font-medium transition">
            {t('View All Photos', lang)} <ArrowRight className="w-4 h-4 ml-2" />
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
        <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="sm:hidden mt-8 w-full flex justify-center items-center text-orange-500 font-medium">
          {t('View All Photos', lang)} <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </section>
  );
};

const Blog = () => {
  const { lang } = useContext(LanguageContext);
  const posts = [
    { title: "Electric Motor Overheating Causes", img: "https://picsum.photos/seed/heat/600/400", date: "Oct 12, 2026" },
    { title: "Motor Rewinding Process Explained", img: "https://picsum.photos/seed/wire/600/400", date: "Sep 28, 2026" },
    { title: "Industrial Motor Maintenance Tips", img: "https://picsum.photos/seed/maint/600/400", date: "Sep 15, 2026" }
  ];

  return (
    <section id="blog" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('Latest Articles & Tips', lang)}</h2>
          <p className="text-lg text-slate-600">{t('Stay updated with our latest insights on motor maintenance and repair.', lang)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.img} 
                  alt={t(post.title, lang)} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-orange-500 font-medium mb-2">{post.date}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition">{t(post.title, lang)}</h3>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-600 font-medium flex items-center hover:text-slate-900 transition">
                  {t('Read More', lang)} <ArrowRight className="w-4 h-4 ml-1" />
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
  const siteContent = useContext(SiteContext);
  const { lang } = useContext(LanguageContext);
  
  const address = lang === 'th' && siteContent?.contact?.address_th ? siteContent.contact.address_th : (siteContent?.contact?.address || '21 2, Khao Mai Kaeo\nBang Lamung District\nChon Buri 20150, Thailand');

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{t('Contact Us', lang)}</h2>
            <p className="text-lg text-slate-600 mb-8">
              {t('Need immediate assistance or a quotation? Reach out to us using the details below or fill out the quick request form.', lang)}
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mr-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{t('Address', lang)}</h4>
                  <p className="text-slate-600 whitespace-pre-line">{address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mr-4">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{t('Phone', lang)}</h4>
                  <p className="text-slate-600">{siteContent?.contact?.phone || '+66 94 260 8244'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00B900]/10 rounded-lg flex items-center justify-center text-[#00B900] mr-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{t('LINE', lang)}</h4>
                  <p className="text-slate-600">{siteContent?.contact?.line || '@bigmotor'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-md font-bold transition flex items-center">
                <Phone className="w-5 h-5 mr-2" /> {t('Call Now', lang)}
              </a>
              <a href={`https://line.me/R/ti/p/~${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`} target="_blank" rel="noopener noreferrer" className="bg-[#00B900] hover:bg-[#009900] text-white px-6 py-3 rounded-md font-bold transition flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" /> {t('Chat on LINE', lang)}
              </a>
            </div>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('Quick Service Request', lang)}</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert(t('Request sent successfully!', lang)); }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('Name / Company', lang)}</label>
                <input type="text" required className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('Phone', lang)}</label>
                  <input type="tel" required className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('Motor Type', lang)}</label>
                  <input type="text" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('Issue Description', lang)}</label>
                <textarea rows={4} required className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-orange-500 focus:border-orange-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition mt-2">
                {t('Send Request', lang)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  const siteContent = useContext(SiteContext);
  const { lang } = useContext(LanguageContext);
  return (
    <section className="bg-slate-200 h-96 relative">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.583324647352!2d101.0185073148216!3d12.9344799908801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102958013e80001%3A0x6000000000000000!2sKhao%20Mai%20Kaeo%2C%20Bang%20Lamung%20District%2C%20Chon%20Buri%2020150%2C%20Thailand!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps Location"
        className="absolute inset-0"
      ></iframe>
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        <a href="https://maps.google.com/?q=21+2,+Khao+Mai+Kaeo,+Bang+Lamung+District,+Chon+Buri+20150" target="_blank" rel="noopener noreferrer" className="pointer-events-auto bg-white text-slate-900 px-6 py-3 rounded-md font-bold shadow-lg hover:bg-slate-50 transition border border-slate-200 flex items-center mt-48">
          <MapPin className="w-5 h-5 mr-2 text-orange-500" /> {t('Open in Google Maps', lang)}
        </a>
      </div>
    </section>
  );
};

const Footer = () => {
  const siteContent = useContext(SiteContext);
  const { lang } = useContext(LanguageContext);
  
  const description = lang === 'th' && siteContent?.footer?.description_th ? siteContent.footer.description_th : (siteContent?.footer?.description || 'Professional electric motor repair and rewinding service in Chon Buri and Pattaya. Quality guaranteed.');

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold text-white flex items-center mb-6">
              <Zap className="w-6 h-6 text-orange-500 mr-2" />
              BIG MOTOR
            </div>
            <p className="mb-6">{description}</p>
            <div className="flex space-x-4">
              <a href={siteContent?.footer?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={`https://line.me/R/ti/p/~${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#00B900] hover:text-white transition">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('Quick Links', lang)}</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Booking', 'Repair Status', 'Blog', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-orange-500 transition flex items-center">
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600" /> {t(link, lang)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('Our Services', lang)}</h4>
            <ul className="space-y-3">
              {['Electric Motor Repair', 'Motor Rewinding', 'Pump Motor Repair', 'Generator Service', 'Industrial Maintenance'].map((link) => (
                <li key={link}>
                  <a href="#services" className="hover:text-orange-500 transition flex items-center">
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600" /> {t(link, lang)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('Contact Info', lang)}</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                <span className="whitespace-pre-line">{lang === 'th' && siteContent?.contact?.address_th ? siteContent.contact.address_th : (siteContent?.contact?.address || '21 2, Khao Mai Kaeo, Bang Lamung District, Chon Buri 20150')}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                <span>{siteContent?.contact?.phone || '+66 94 260 8244'}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                <span>{siteContent?.contact?.email || 'service@bigmotor.co.th'}</span>
              </li>
              <li className="flex items-center">
                <MessageCircle className="w-5 h-5 text-[#00B900] mr-3 flex-shrink-0" />
                <span>LINE: {siteContent?.contact?.line || '@bigmotor'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} BIG ELECTRICMOTOR SERVICE CO., LTD. {t('All rights reserved.', lang)}</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
            <a href="#" className="hover:text-white transition">{t('Privacy Policy', lang)}</a>
            <a href="#" className="hover:text-white transition">{t('Terms of Service', lang)}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingButtons = () => {
  const siteContent = useContext(SiteContext);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
      <a href={`https://wa.me/${siteContent?.contact?.phone?.replace(/\D/g, '') || '66942608244'}`} className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="WhatsApp">
        <MessageSquare className="w-7 h-7" />
      </a>
      <a href={`https://line.me/R/ti/p/~${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#00B900] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="LINE">
        <MessageCircle className="w-7 h-7" />
      </a>
      <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce" aria-label="Call">
        <Phone className="w-7 h-7" />
      </a>
    </div>
  );
};

export default function App() {
  const [siteContent, setSiteContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'th') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setSiteContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch site content', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>;
  }

  return (
    <LanguageContext.Provider value={{lang, setLang}}>
      <SiteContext.Provider value={siteContent}>
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
      </SiteContext.Provider>
    </LanguageContext.Provider>
  );
}
