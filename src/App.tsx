import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Phone, MessageCircle, Globe, Menu, X, ChevronRight,
  Wrench, Zap, Settings, Activity, ShieldCheck, Clock,
  ThumbsUp, CheckCircle, Search, MapPin, Mail, Facebook,
  ArrowRight, Star, Factory, Cpu, PenTool,
  Truck, ClipboardList, MessageSquare, Check, Calendar, Tag,
  Download, FileText, CreditCard, User, ExternalLink
} from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import { db, auth, loginWithGoogle, loginWithEmail, logout, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { defaultContent } from './defaultContent';

const SiteContext = createContext<any>(null);

type Language = 'en' | 'th';
const LanguageContext = createContext<{lang: Language, setLang: (l: Language) => void}>({lang: 'en', setLang: () => {}});

const t = (key: string, lang: Language) => {
  const dict: Record<string, Record<Language, string>> = {
    'Home': { en: 'Home', th: 'หน้าแรก' },
    'About': { en: 'About', th: 'เกี่ยวกับเรา' },
    'Services': { en: 'Services', th: 'บริการ' },
    'Booking': { en: 'Booking', th: 'จองคิว' },
    'Customer Portal': { en: 'Customer Portal', th: 'พอร์ทัลลูกค้า' },
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
    'Need this service?': { en: 'Need this service?', th: 'ต้องการบริการนี้หรือไม่?' },
    'Contact us today for a free consultation and quote.': { en: 'Contact us today for a free consultation and quote.', th: 'ติดต่อเราวันนี้เพื่อขอคำปรึกษาและใบเสนอราคาฟรี' },
    'Request Service': { en: 'Request Service', th: 'ขอรับบริการ' },
    'Motor Rewinding Cost Calculator': { en: 'Motor Rewinding Cost Calculator', th: 'เครื่องคำนวณค่าพันมอเตอร์' },
    'Estimate Calculator': { en: 'Estimate Calculator', th: 'เครื่องคำนวณราคาประเมิน' },
    'Get an instant estimate for your motor rewinding or housing repair. Enter your specifications below to see estimated costs and turnaround times.': { en: 'Get an instant estimate for your motor rewinding or housing repair. Enter your specifications below to see estimated costs and turnaround times.', th: 'รับการประเมินราคาซ่อมหรือพันมอเตอร์ของคุณทันที ป้อนข้อมูลจำเพาะด้านล่างเพื่อดูค่าใช้จ่ายและเวลาที่ใช้โดยประมาณ' },
    'Housing Repair': { en: 'Housing Repair', th: 'ซ่อมตัวเรือน' },
    'Motor Power (kW)': { en: 'Motor Power (kW)', th: 'กำลังมอเตอร์ (kW)' },
    'Inner Dia (ID) in mm': { en: 'Inner Dia (ID) in mm', th: 'เส้นผ่านศูนย์กลางภายใน (ID) เป็นมม.' },
    'Housing Type': { en: 'Housing Type', th: 'ประเภทตัวเรือน' },
    'Standard Cast Iron': { en: 'Standard Cast Iron', th: 'เหล็กหล่อมาตรฐาน' },
    'Aluminum': { en: 'Aluminum', th: 'อลูมิเนียม' },
    'Stainless Steel': { en: 'Stainless Steel', th: 'สแตนเลส' },
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
    'Inspection': { en: 'Inspection', th: 'กำลังตรวจสอบ' },
    'Rewinding': { en: 'Rewinding', th: 'กำลังพันขดลวด' },
    'Testing': { en: 'Testing', th: 'กำลังทดสอบ' },
    'Ready': { en: 'Ready', th: 'พร้อมส่งมอบ' },
    'Delivered': { en: 'Delivered', th: 'ส่งมอบแล้ว' },
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
    'Admin Login': { en: 'Admin Login', th: 'เข้าสู่ระบบผู้ดูแลระบบ' },
    'Email': { en: 'Email', th: 'อีเมล' },
    'Password': { en: 'Password', th: 'รหัสผ่าน' },
    'Login': { en: 'Login', th: 'เข้าสู่ระบบ' },
  };
  return dict[key] ? dict[key][lang] : key;
};

export const scrollToSectionById = (sectionId: string, callback?: () => void) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const header = document.querySelector('header');
    const headerOffset = header ? header.offsetHeight : 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
  if (callback) callback();
};

const scrollToSectionHelper = (e: React.MouseEvent<HTMLElement>, sectionId: string, callback?: () => void) => {
  if (e && e.preventDefault) e.preventDefault();
  scrollToSectionById(sectionId, callback);
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const siteContent = useContext(SiteContext);
  const { lang, setLang } = useContext(LanguageContext);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'booking', 'customer-portal', 'contact'];
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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    scrollToSectionHelper(e, sectionId, () => setIsMenuOpen(false));
  };

  const companyName = siteContent?.hero?.companyName || 'BIG ELECTRICMOTOR';
  const companyNameShort = siteContent?.hero?.companyNameShort || 'BIG MOTOR';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-xs hidden md:block border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <span className="flex items-center text-slate-400 hover:text-white transition-colors cursor-default"><Phone className="w-3.5 h-3.5 mr-2 text-blue-400" /> {siteContent?.contact?.phone || '+66 94 260 8244'}</span>
            <span className="flex items-center text-slate-400 hover:text-white transition-colors cursor-default"><MessageCircle className="w-3.5 h-3.5 mr-2 text-emerald-400" /> LINE: {siteContent?.contact?.line || '@bigmotor'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mr-2">
              <Globe className="w-3 h-3 mr-1.5" /> Language
            </div>
            <div className="flex bg-white/5 rounded-full p-0.5 border border-white/10">
              <button 
                onClick={() => setLang('en')} 
                className={`px-3 py-0.5 text-[10px] font-black rounded-full transition-all ${lang === 'en' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('th')} 
                className={`px-3 py-0.5 text-[10px] font-black rounded-full transition-all ${lang === 'th' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
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
            {siteContent?.hero?.logo ? (
              <div className="flex items-center">
                <img src={siteContent.hero.logo} alt="Company Logo" className="h-12 object-contain mr-3" referrerPolicy="no-referrer" />
                <div className="text-2xl font-bold text-slate-900 flex items-center">
                  <span className="hidden sm:block lg:hidden xl:block">{companyName}</span>
                  <span className="block sm:hidden lg:block xl:hidden">{companyNameShort}</span>
                </div>
              </div>
            ) : (
              <div className="text-2xl font-extrabold text-slate-800 flex items-center tracking-tight">
                <Zap className="w-8 h-8 text-blue-500 mr-2" />
                <span className="hidden sm:block lg:hidden xl:block">{companyName}</span>
                <span className="block sm:hidden lg:block xl:hidden">{companyNameShort}</span>
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex lg:space-x-4 xl:space-x-8">
            {['Home', 'Booking', 'Customer Portal', 'Contact'].map((item) => {
              const sectionId = item.toLowerCase().replace(' ', '-');
              const isActive = activeSection === sectionId;
              return (
              <a 
                key={item} 
                href={`#${sectionId}`} 
                onClick={(e) => scrollToSection(e, sectionId)}
                className={`font-bold transition-colors text-sm xl:text-base relative group ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
              >
                {t(item, lang)}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </a>
            )})}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden xl:flex items-center space-x-6">
            <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="flex items-center text-slate-900 font-bold hover:text-blue-600 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-blue-50 transition-colors">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">Call Us</span>
                <span className="leading-none">{siteContent?.contact?.phone || '+66 94 260 8244'}</span>
              </div>
            </a>
            <button onClick={() => window.open(`https://line.me/R/ti/p/${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`, '_blank')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-black text-sm flex items-center transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 active:scale-95">
              <MessageCircle className="w-5 h-5 mr-2" /> {t('LINE Chat', lang)}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-800 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-50 shadow-xl absolute w-full">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {['Home', 'Booking', 'Customer Portal', 'Contact'].map((item) => {
              const sectionId = item.toLowerCase().replace(' ', '-');
              const isActive = activeSection === sectionId;
              return (
              <a 
                key={item} 
                href={`#${sectionId}`} 
                onClick={(e) => scrollToSection(e, sectionId)}
                className={`block px-4 py-3 text-base font-bold rounded-xl transition-all ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                {t(item, lang)}
              </a>
            )})}
            <div className="mt-6 flex flex-col space-y-4 border-t border-slate-100 pt-8">
              <div className="flex items-center justify-between mb-2 px-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('Language', lang)}</span>
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-full">
                  <button 
                    onClick={() => setLang('en')} 
                    className={`px-6 py-2 text-xs font-black rounded-full transition-all ${lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLang('th')} 
                    className={`px-6 py-2 text-xs font-black rounded-full transition-all ${lang === 'th' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    TH
                  </button>
                </div>
              </div>
              <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="flex items-center justify-center w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black transition-transform active:scale-95 shadow-xl shadow-slate-900/10">
                <Phone className="w-5 h-5 mr-3 text-blue-400" /> {t('Call Now', lang)}
              </a>
              <button onClick={() => window.open(`https://line.me/R/ti/p/${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`, '_blank')} className="flex items-center justify-center w-full bg-emerald-500 text-white px-6 py-4 rounded-2xl font-black transition-transform active:scale-95 shadow-xl shadow-emerald-500/10">
                <MessageCircle className="w-5 h-5 mr-3" /> {t('LINE Chat', lang)}
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
  const bgImage = siteContent?.hero?.bgImage || "https://picsum.photos/seed/factory/1920/1080";

  return (
    <section id="home" className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={bgImage} 
          alt="Electric motor repair workshop" 
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/70 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-blue-300 font-semibold text-sm mb-6 border border-white/20 shadow-lg">
            {t('#1 Industrial Motor Specialists', lang)}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            {lang === 'en' ? headline.split('Repair & Rewinding').map((part: string, i: number, arr: string[]) => 
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Repair & Rewinding</span>}
              </React.Fragment>
            ) : headline}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl font-light">
            {subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-500/30 flex items-center justify-center" onClick={(e) => scrollToSectionHelper(e, 'contact')}>
              {t('Request Repair Service', lang)} <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center" onClick={(e) => scrollToSectionHelper(e, 'contact')}>
              {t('Get Repair Quotation', lang)}
            </button>
          </div>
          
          <div className="flex items-center space-x-6 text-slate-300">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider font-semibold text-slate-400">{t('24/7 Emergency Service', lang)}</p>
                <p className="text-xl font-bold text-white">{siteContent?.hero?.phone || '+66 94 260 8244'}</p>
              </div>
            </div>
            <div className="hidden sm:block h-12 w-px bg-white/20"></div>
            <button className="hidden sm:flex items-center text-sm hover:text-white transition underline underline-offset-4 font-medium" onClick={(e) => scrollToSectionHelper(e, 'booking')}>
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
    <section id="about" className="bg-slate-50 py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: <ShieldCheck className="w-6 h-6 text-blue-500" />, text: "Experienced motor technicians" },
            { icon: <Clock className="w-6 h-6 text-blue-500" />, text: "Fast repair turnaround" },
            { icon: <Factory className="w-6 h-6 text-blue-500" />, text: "Industrial motor specialists" },
            { icon: <MapPin className="w-6 h-6 text-blue-500" />, text: "Service across Chon Buri region" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-2 rounded-xl">{item.icon}</div>
              <span className="font-medium text-slate-800">{t(item.text, lang)}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="py-4">
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-cyan-700 mb-2">{siteContent?.stats?.yearsExperience || '10'}<span className="text-blue-500">+</span></p>
            <p className="text-blue-600 font-bold uppercase tracking-wider text-sm">{lang === 'th' && siteContent?.stats?.yearsExperienceLabel_th ? siteContent.stats.yearsExperienceLabel_th : (siteContent?.stats?.yearsExperienceLabel || t('Years Experience', lang))}</p>
          </div>
          <div className="py-4">
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-cyan-700 mb-2">{siteContent?.stats?.motorsRepaired || '500'}<span className="text-blue-500">+</span></p>
            <p className="text-blue-600 font-bold uppercase tracking-wider text-sm">{lang === 'th' && siteContent?.stats?.motorsRepairedLabel_th ? siteContent.stats.motorsRepairedLabel_th : (siteContent?.stats?.motorsRepairedLabel || t('Motors Repaired', lang))}</p>
          </div>
          <div className="py-4">
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-cyan-700 mb-2">{siteContent?.stats?.industrialClients || '200'}<span className="text-blue-500">+</span></p>
            <p className="text-blue-600 font-bold uppercase tracking-wider text-sm">{lang === 'th' && siteContent?.stats?.industrialClientsLabel_th ? siteContent.stats.industrialClientsLabel_th : (siteContent?.stats?.industrialClientsLabel || t('Industrial Clients', lang))}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const { lang } = useContext(LanguageContext);
  const siteContent = useContext(SiteContext);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const icons = [
    <Wrench className="w-8 h-8" />,
    <Activity className="w-8 h-8" />,
    <Settings className="w-8 h-8" />,
    <Zap className="w-8 h-8" />,
    <Factory className="w-8 h-8" />,
    <Cpu className="w-8 h-8" />
  ];
  
  const servicesList = siteContent?.services || [
    { title: "Electric Motor Repair", desc: "Comprehensive diagnostics and repair for all types of electric motors." },
    { title: "Motor Rewinding", desc: "High-quality copper rewinding to restore motor efficiency and lifespan." },
    { title: "Pump Motor Repair", desc: "Specialized repair services for industrial water and chemical pumps." },
    { title: "Generator Motor Repair", desc: "Maintenance and repair for backup and continuous power generators." },
    { title: "Industrial Maintenance", desc: "Preventative maintenance programs to minimize factory downtime." },
    { title: "AC/DC Motor Service", desc: "Expert service for both alternating and direct current motors." }
  ];

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">{t('Our Professional Services', lang)}</h2>
          <p className="text-xl text-slate-600">{t('We provide comprehensive repair and maintenance solutions for all types of industrial electric motors.', lang)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service: any, idx: number) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 border border-slate-50 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300 shadow-sm">
                {icons[idx % icons.length]}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{lang === 'th' && service.title_th ? service.title_th : (t(service.title, lang) || service.title)}</h3>
              <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">{lang === 'th' && service.desc_th ? service.desc_th : (t(service.desc, lang) || service.desc)}</p>
              <button onClick={() => setSelectedService(service)} className="text-blue-600 font-bold flex items-center hover:text-pink-700 transition-colors group/btn">
                {t('Learn More', lang)} <ChevronRight className="w-5 h-5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
            <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-slate-50">
              <h3 className="text-2xl font-extrabold text-slate-800">
                {lang === 'th' && selectedService.title_th ? selectedService.title_th : (t(selectedService.title, lang) || selectedService.title)}
              </h3>
              <button 
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <p className="text-slate-700 text-lg leading-relaxed mb-10">
                {lang === 'th' && selectedService.longDesc_th 
                  ? selectedService.longDesc_th 
                  : (selectedService.longDesc || (lang === 'th' && selectedService.desc_th ? selectedService.desc_th : (t(selectedService.desc, lang) || selectedService.desc)))}
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 flex flex-col sm:flex-row items-center justify-between shadow-inner">
                <div className="mb-6 sm:mb-0 text-center sm:text-left">
                  <h4 className="font-bold text-slate-800 mb-2 text-xl">{t('Need this service?', lang)}</h4>
                  <p className="text-slate-600">{t('Contact us today for a free consultation and quote.', lang)}</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedService(null);
                    setTimeout(() => {
                      scrollToSectionById('contact');
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/30 w-full sm:w-auto whitespace-nowrap"
                >
                  {t('Request Service', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Calculator = () => {
  const { lang } = useContext(LanguageContext);
  const siteContent = useContext(SiteContext);
  const [calcType, setCalcType] = useState<'motor' | 'housing'>('motor');
  const [result, setResult] = useState<{cost: string, time: string} | null>(null);
  
  // Form State
  const [motorKw, setMotorKw] = useState('');
  const [motorVoltage, setMotorVoltage] = useState('380V');
  const [housingId, setHousingId] = useState('');
  const [housingType, setHousingType] = useState('Standard Cast Iron');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pricing = siteContent?.calculator?.pricing || {
      motor: {
        basePricePerKw: 500,
        voltageMultipliers: {
          "220V": 1.0,
          "380V": 1.2,
          "400V": 1.25,
          "440V": 1.3,
          "High Voltage": 2.0
        }
      },
      housing: {
        basePricePerMm: 10,
        basePricePerMm_aluminum: 12,
        basePricePerMm_stainlessSteel: 15,
        minPrice: 1000
      }
    };

    let estimatedCost = 0;
    
    if (calcType === 'motor') {
      const kw = parseFloat(motorKw) || 0;
      const multiplier = (pricing.motor.voltageMultipliers as any)[motorVoltage] || 1.0;
      estimatedCost = kw * pricing.motor.basePricePerKw * multiplier;
      
      // Add a base minimum cost if > 0
      if (kw > 0 && estimatedCost < 1500) estimatedCost = 1500;
      
      setResult({
        cost: kw > 0 ? `฿${Math.floor(estimatedCost * 0.9).toLocaleString()} - ฿${Math.ceil(estimatedCost * 1.1).toLocaleString()}` : "Please enter kW",
        time: kw > 50 ? "7 - 14 Business Days" : "3 - 5 Business Days"
      });
    } else {
      const id = parseFloat(housingId) || 0;
      
      let rate = pricing.housing.basePricePerMm;
      if (housingType === 'Aluminum') {
        rate = pricing.housing.basePricePerMm_aluminum || pricing.housing.basePricePerMm;
      } else if (housingType === 'Stainless Steel') {
        rate = pricing.housing.basePricePerMm_stainlessSteel || pricing.housing.basePricePerMm;
      }
      
      estimatedCost = id * rate;
      if (id > 0 && estimatedCost < pricing.housing.minPrice) estimatedCost = pricing.housing.minPrice;
      
      setResult({
        cost: id > 0 ? `฿${Math.floor(estimatedCost * 0.9).toLocaleString()} - ฿${Math.ceil(estimatedCost * 1.1).toLocaleString()}` : "Please enter Inner Dia",
        time: "2 - 4 Business Days"
      });
    }
  };

  const title = lang === 'th' && siteContent?.calculator?.title_th ? siteContent.calculator.title_th : (siteContent?.calculator?.title || t('Estimate Calculator', lang));
  const description = lang === 'th' && siteContent?.calculator?.description_th ? siteContent.calculator.description_th : (siteContent?.calculator?.description || t('Get an instant estimate for your motor rewinding or housing repair. Enter your specifications below to see estimated costs and turnaround times.', lang));
  const features = lang === 'th' && siteContent?.calculator?.features_th ? siteContent.calculator.features_th : (siteContent?.calculator?.features || ['Transparent pricing structure', 'No hidden fees', 'Free detailed quotation available']);

  return (
    <section id="booking" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-[100px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">{title}</h2>
            <p className="text-slate-300 text-xl mb-8 leading-relaxed font-light">
              {description}
            </p>
            <ul className="space-y-5 mb-8">
              {features.map((item: string, i: number) => (
                <li key={i} className="flex items-center text-slate-200 text-lg">
                  <CheckCircle className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0" />
                  {lang === 'th' ? item : t(item, lang)}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50 text-slate-900 border border-slate-200/10">
            <div className="flex mb-8 border-b border-slate-200">
              <button 
                type="button"
                className={`pb-4 px-6 font-bold text-lg transition-all ${calcType === 'motor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                onClick={() => { setCalcType('motor'); setResult(null); }}
              >
                {t('Motor Rewinding', lang)}
              </button>
              <button 
                type="button"
                className={`pb-4 px-6 font-bold text-lg transition-all ${calcType === 'housing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                onClick={() => { setCalcType('housing'); setResult(null); }}
              >
                {t('Housing Repair', lang)}
              </button>
            </div>
            
            <form onSubmit={handleCalculate} className="space-y-5">
              {calcType === 'motor' ? (
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('Motor Type', lang)}</label>
                    <select className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50">
                      <option>{t('AC Induction Motor', lang)}</option>
                      <option>{t('DC Motor', lang)}</option>
                      <option>{t('Servo Motor', lang)}</option>
                      <option>{t('Pump Motor', lang)}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('Motor Power (kW)', lang)}</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      value={motorKw}
                      onChange={(e) => setMotorKw(e.target.value)}
                      placeholder={t("e.g. 7.5", lang)} 
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('Voltage', lang)}</label>
                    <select 
                      value={motorVoltage}
                      onChange={(e) => setMotorVoltage(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50"
                    >
                      <option>220V</option>
                      <option>380V</option>
                      <option>400V</option>
                      <option>440V</option>
                      <option>{t('High Voltage', lang)}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('Phase', lang)}</label>
                    <select className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50">
                      <option>{t('1 Phase', lang)}</option>
                      <option>{t('3 Phase', lang)}</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('RPM', lang)}</label>
                    <input type="text" placeholder={t("e.g. 1450 RPM", lang)} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('Inner Dia (ID) in mm', lang)}</label>
                    <input 
                      type="number" 
                      step="1"
                      min="0"
                      value={housingId}
                      onChange={(e) => setHousingId(e.target.value)}
                      placeholder={t("e.g. 150", lang)} 
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('Housing Type', lang)}</label>
                    <select 
                      value={housingType}
                      onChange={(e) => setHousingType(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50"
                    >
                      <option value="Standard Cast Iron">{t('Standard Cast Iron', lang)}</option>
                      <option value="Aluminum">{t('Aluminum', lang)}</option>
                      <option value="Stainless Steel">{t('Stainless Steel', lang)}</option>
                    </select>
                  </div>
                </div>
              )}
              
              {!result ? (
                <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/30 mt-6 text-lg">
                  {t('Calculate Estimate', lang)}
                </button>
              ) : (
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-8 shadow-inner">
                  <div className="mb-6">
                    <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">{t('Estimated Cost', lang)}</p>
                    <p className="text-4xl font-extrabold text-slate-900">{result.cost}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">{t('Estimated Time', lang)}</p>
                    <p className="text-2xl font-bold text-slate-800">{result.time}</p>
                  </div>
                  <button type="button" onClick={(e) => { setResult(null); scrollToSectionHelper(e, 'contact'); }} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-md transition">
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
  const siteContent = useContext(SiteContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const points = [
    "Professional Technicians",
    "Modern Repair Equipment",
    "Fast Turnaround Time",
    "High Quality Motor Rewinding",
    "Affordable Repair Pricing",
    "Industrial Motor Expertise"
  ];

  const imageUrl = siteContent?.whyChooseUs?.imageUrl || "https://picsum.photos/seed/technician/800/600";
  const heading = siteContent?.whyChooseUs?.heading?.[lang] || t('Why Choose BIG ELECTRICMOTOR?', lang);
  const buttonText = siteContent?.whyChooseUs?.buttonText?.[lang] || t('Learn More About Us', lang);
  const detailsText = siteContent?.whyChooseUs?.details?.[lang] || "BIG ELECTRICMOTOR SERVICE CO., LTD. has been a trusted partner for industrial facilities across Chon Buri and Pattaya for over a decade. Our team of highly skilled technicians is dedicated to providing top-notch electric motor repair, rewinding, and maintenance services. We understand that downtime costs money, which is why we prioritize speed without compromising on quality. Equipped with modern diagnostic and repair tools, we handle everything from standard AC/DC motors to complex industrial pumps and generators. Our commitment to excellence, transparent pricing, and customer satisfaction makes us the preferred choice for businesses relying on continuous operations.";

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-cyan-100/50 blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 opacity-20"></div>
            <img 
              src={imageUrl} 
              alt="Professional Technician" 
              className="rounded-3xl shadow-2xl relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500 border border-white"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">{heading}</h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              {t('We are the trusted partner for industrial facilities across Chon Buri and Pattaya. Our commitment to quality and speed ensures your operations experience minimal downtime.', lang)}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {points.map((point, idx) => (
                <div key={idx} className="flex items-start group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mt-1 group-hover:from-blue-500 group-hover:to-cyan-500 transition-colors duration-300 shadow-sm">
                    <Check className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="ml-4 text-slate-800 font-bold text-lg">{t(point, lang)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl text-lg flex items-center"
              >
                {buttonText} <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
            <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-slate-50">
              <h3 className="text-2xl font-extrabold text-slate-800">{heading}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                {detailsText}
              </p>
            </div>
            <div className="p-6 border-t border-slate-50 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-md"
              >
                {t('Close', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Process = () => {
  const { lang } = useContext(LanguageContext);
  const siteContent = useContext(SiteContext);
  const icons = [
    <PenTool className="w-6 h-6" />,
    <Search className="w-6 h-6" />,
    <Wrench className="w-6 h-6" />,
    <ShieldCheck className="w-6 h-6" />,
    <Truck className="w-6 h-6" />
  ];
  
  const steps = siteContent?.process || [
    { title: "Submit Service Request", desc: "Contact us via phone, LINE, or web form." },
    { title: "Motor Inspection", desc: "Thorough diagnostic to identify the root cause." },
    { title: "Repair or Rewinding", desc: "Expert repair using high-grade materials." },
    { title: "Testing & Quality Check", desc: "Rigorous testing to ensure optimal performance." },
    { title: "Delivery to Customer", desc: "Safe return of your fully functional motor." }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">{t('Our Repair Process', lang)}</h2>
          <p className="text-xl text-slate-600">{t('A systematic approach to ensure quality and reliability in every repair job.', lang)}</p>
        </div>
        
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 relative z-10">
            {steps.map((step: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-3xl bg-white border border-slate-50 shadow-xl shadow-slate-200/50 flex items-center justify-center text-blue-500 mb-6 relative group-hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>
                  <div className="relative z-10">{icons[idx % icons.length]}</div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full text-sm font-bold flex items-center justify-center shadow-md">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{lang === 'th' && step.title_th ? step.title_th : (t(step.title, lang) || step.title)}</h3>
                <p className="text-slate-600 leading-relaxed">{lang === 'th' && step.desc_th ? step.desc_th : (t(step.desc, lang) || step.desc)}</p>
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

  const stages = ['Received', 'Inspection', 'Rewinding', 'Testing', 'Ready', 'Delivered'];
  const currentStageIndex = trackingData ? stages.findIndex(s => s.toLowerCase() === trackingData.status?.toLowerCase()) : -1;
  const progressPercentage = currentStageIndex >= 0 ? ((currentStageIndex) / (stages.length - 1)) * 100 : 0;

  return (
    <section id="customer-portal" className="py-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-slate-800 text-white relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-xl">
          <ClipboardList className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">
          {lang === 'th' && siteContent?.portal?.title_th ? siteContent.portal.title_th : (siteContent?.portal?.title || t('Customer Service Portal', lang))}
        </h2>
        <p className="text-xl text-white/90 mb-10 font-medium drop-shadow">{t('Track your repair status, download reports, and manage your project documents.', lang)}</p>
        
        <form onSubmit={handleTrack} className="max-w-2xl mx-auto bg-white/20 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row border border-white/30">
          <input 
            type="text" 
            placeholder={t("e.g. EMS-000245", lang)} 
            className="flex-grow px-6 py-4 text-slate-900 focus:outline-none rounded-xl bg-white/90 font-medium text-lg placeholder:text-slate-400"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button type="submit" className="mt-2 sm:mt-0 sm:ml-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 flex items-center justify-center shadow-lg text-lg">
            <Search className="w-6 h-6 mr-2" /> {t('Track', lang)}
          </button>
        </form>

        {status === 'searching' && (
          <div className="mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto shadow-lg"></div>
          </div>
        )}

        {status === 'not_found' && (
          <div className="mt-10 bg-white/95 backdrop-blur-sm text-slate-900 rounded-3xl p-8 text-center shadow-2xl animate-in fade-in slide-in-from-bottom-4 border border-white/50">
            <p className="text-2xl font-bold text-red-500 mb-2">{t('Tracking ID not found.', lang)}</p>
            <p className="text-slate-600 text-lg">{t('Please check the ID and try again.', lang)}</p>
          </div>
        )}

        {status === 'found' && trackingData && (
          <div className="mt-10 bg-white/95 backdrop-blur-sm text-slate-900 rounded-3xl p-8 text-left shadow-2xl animate-in fade-in slide-in-from-bottom-4 border border-white/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-slate-200 pb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">{t('Tracking ID', lang)}</p>
                  <p className="text-3xl font-extrabold text-slate-800">{trackingData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">{t('Client Name', lang)}</p>
                  <div className="flex items-center text-xl font-bold text-slate-700">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    {(() => {
                      const client = (siteContent?.clients || []).find((c: any) => c.id === trackingData.clientId);
                      return client ? client.name : t('General Customer', lang);
                    })()}
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:text-right">
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">{t('Est. Completion', lang)}</p>
                  <p className="text-2xl font-bold text-blue-600">{trackingData.completionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">{t('Payment Status', lang)}</p>
                  <div className="flex items-center md:justify-end text-xl font-bold">
                    <CreditCard className={`w-5 h-5 mr-2 ${trackingData.paymentStatus === 'Paid' ? 'text-emerald-500' : trackingData.paymentStatus === 'Partial' ? 'text-orange-500' : 'text-red-500'}`} />
                    <span className={trackingData.paymentStatus === 'Paid' ? 'text-emerald-600' : trackingData.paymentStatus === 'Partial' ? 'text-orange-600' : 'text-red-600'}>
                      {t(trackingData.paymentStatus || 'Unpaid', lang)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative pt-4 pb-12">
              <div className="relative h-3 mb-6 rounded-full bg-slate-200 shadow-inner">
                <div style={{ width: `${Math.max(5, progressPercentage)}%` }} className="absolute top-0 left-0 h-full rounded-full shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"></div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 bg-white border-4 border-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-1000 z-10 flex items-center justify-center"
                  style={{ left: `${Math.max(5, progressPercentage)}%` }}
                >
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs md:text-sm font-medium text-slate-500">
                {stages.map((stage, idx) => (
                  <span key={stage} className={idx <= currentStageIndex ? "text-blue-600 font-bold" : ""}>
                    {t(stage, lang)}
                  </span>
                ))}
              </div>
            </div>

            {/* Documents Section */}
            <div className="mt-4 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                {t('Project Documents & Reports', lang)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'report', label: 'Service Report' },
                  { key: 'invoice', label: 'Invoice' },
                  { key: 'document', label: 'Technical Document' },
                  { key: 'drawing', label: 'Motor Drawing' },
                  { key: 'other', label: 'Other Files' }
                ].map(doc => {
                  const url = trackingData.docs?.[doc.key];
                  if (!url) return null;
                  return (
                    <a 
                      key={doc.key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-blue-700">{t(doc.label, lang)}</span>
                      </div>
                      <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    </a>
                  );
                })}
                {(!trackingData.docs || Object.values(trackingData.docs).every(v => !v)) && (
                  <p className="text-slate-400 italic text-sm col-span-full">{t('No documents available yet.', lang)}</p>
                )}
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
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">{t('Customer Testimonials', lang)}</h2>
          <p className="text-xl text-slate-600">{t('See what our industrial clients have to say about our repair services.', lang)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Somchai P.", company: "Eastern Manufacturing Co.", text: "Very professional motor repair service. Fast and reliable. They saved our production line from a long downtime." },
            { name: "Kittipong T.", company: "Chon Buri Water Works", text: "Excellent pump motor rewinding. The motor runs cooler and more efficiently than before. Highly recommended." },
            { name: "Ariya S.", company: "Pattaya Industrial Estate", text: "Transparent pricing and great communication throughout the repair process. The best motor service in the region." }
          ].map((review, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-50 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
              </div>
              <p className="text-slate-700 italic mb-8 text-lg leading-relaxed">"{t(review.text, lang)}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{t(review.name, lang)}</p>
                  <p className="text-sm text-slate-500">{t(review.company, lang)}</p>
                </div>
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
  const siteContent = useContext(SiteContext);
  const [showAll, setShowAll] = useState(false);
  
  const images = siteContent?.workshopGallery || [
    "https://picsum.photos/seed/motor1/600/400",
    "https://picsum.photos/seed/motor2/600/400",
    "https://picsum.photos/seed/motor3/600/400",
    "https://picsum.photos/seed/motor4/600/400",
  ];

  const displayedImages = showAll ? images : images.slice(0, 4);

  return (
    <section className="py-24 bg-slate-900 relative" id="gallery">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-4">{t('Workshop Gallery', lang)}</h2>
            <p className="text-xl text-slate-300 font-light">{t('A glimpse into our professional repair facility.', lang)}</p>
          </div>
          <button onClick={() => setShowAll(!showAll)} className="hidden sm:flex items-center text-blue-400 hover:text-blue-300 font-bold transition-colors">
            {showAll ? t('Show Less', lang) : t('View All Photos', lang)} <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-500">
          {displayedImages.map((img, idx) => (
            <div key={idx} className="relative group overflow-hidden rounded-3xl aspect-video shadow-xl shadow-black/40 border border-blue-500/20">
              <img 
                src={img} 
                alt={`Gallery image ${idx + 1}`} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-800/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Search className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setShowAll(!showAll)} className="sm:hidden mt-10 w-full flex justify-center items-center text-blue-400 font-bold text-lg">
          {showAll ? t('Show Less', lang) : t('View All Photos', lang)} <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      </div>
    </section>
  );
};

const Blog = () => {
  const { lang } = useContext(LanguageContext);
  const siteContent = useContext(SiteContext);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const posts = siteContent?.blogs || [
    { title: "Electric Motor Overheating Causes", img: "https://picsum.photos/seed/heat/600/400", date: "Oct 12, 2026" },
    { title: "Motor Rewinding Process Explained", img: "https://picsum.photos/seed/wire/600/400", date: "Sep 28, 2026" },
    { title: "Industrial Motor Maintenance Tips", img: "https://picsum.photos/seed/maint/600/400", date: "Sep 15, 2026" }
  ];

  return (
    <section id="blog" className="py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">{t('Latest Articles & Tips', lang)}</h2>
          <p className="text-xl text-slate-600">{t('Stay updated with our latest insights on motor maintenance and repair.', lang)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post: any, idx: number) => {
            const title = lang === 'th' && post.title_th ? post.title_th : (t(post.title, lang) || post.title);
            const desc = lang === 'th' && post.desc_th ? post.desc_th : (t(post.desc, lang) || post.desc);
            const category = lang === 'th' && post.category_th ? post.category_th : (t(post.category, lang) || post.category);
            
            return (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 group hover:-translate-y-2 flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={post.image || post.img} 
                    alt={title} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-800/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-blue-500 font-bold uppercase tracking-wider">{post.date}</p>
                    {category && <span className="text-xs font-bold bg-slate-50 text-blue-600 px-3 py-1.5 rounded-full">{category}</span>}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">{title}</h3>
                  {desc && <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed flex-grow">{desc}</p>}
                  <button onClick={() => setSelectedPost(post)} className="text-blue-600 font-bold flex items-center hover:text-pink-700 transition-colors group/btn mt-auto">
                    {t('Read More', lang)} <ArrowRight className="w-5 h-5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 pr-8">
                {lang === 'th' && selectedPost.title_th ? selectedPost.title_th : (t(selectedPost.title, lang) || selectedPost.title)}
              </h3>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100 flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <img 
                src={selectedPost.image || selectedPost.img} 
                alt="Blog Cover" 
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6 text-sm text-slate-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> {selectedPost.date}
                  </span>
                  {(selectedPost.category || selectedPost.category_th) && (
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" /> 
                      {lang === 'th' && selectedPost.category_th ? selectedPost.category_th : (t(selectedPost.category, lang) || selectedPost.category)}
                    </span>
                  )}
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {lang === 'th' && selectedPost.content_th ? selectedPost.content_th : (selectedPost.content || (lang === 'th' && selectedPost.desc_th ? selectedPost.desc_th : selectedPost.desc))}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedPost(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md font-medium transition"
              >
                {t('Close', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Contact = () => {
  const siteContent = useContext(SiteContext);
  const { lang } = useContext(LanguageContext);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    motorType: '',
    issue: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const address = lang === 'th' && siteContent?.contact?.address_th ? siteContent.contact.address_th : (siteContent?.contact?.address || '21 2, Khao Mai Kaeo\nBang Lamung District\nChon Buri 20150, Thailand');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'serviceRequests'), {
        ...formData,
        date: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ name: '', phone: '', motorType: '', issue: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to submit request', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">{t('Contact Us', lang)}</h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              {t('Need immediate assistance or a quotation? Reach out to us using the details below or fill out the quick request form.', lang)}
            </p>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center text-blue-600 mr-6 group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{t('Address', lang)}</h4>
                  <p className="text-slate-600 whitespace-pre-line text-lg">{address}</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center text-blue-600 mr-6 group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{t('Phone', lang)}</h4>
                  <p className="text-slate-600 text-lg">{siteContent?.contact?.phone || '+66 94 260 8244'}</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-14 h-14 bg-[#00B900]/10 rounded-2xl flex items-center justify-center text-[#00B900] mr-6 group-hover:bg-[#00B900] group-hover:text-white transition-all duration-300 shadow-sm">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{t('LINE', lang)}</h4>
                  <p className="text-slate-600 mb-4 text-lg">{siteContent?.contact?.line || '@bigmotor'}</p>
                  <img 
                    src={siteContent?.contact?.lineQrCode || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://line.me/R/ti/p/~${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`} 
                    alt="LINE QR Code" 
                    className="w-36 h-36 rounded-xl border border-slate-200 p-2 bg-white shadow-md object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 flex items-center shadow-lg text-lg">
                <Phone className="w-6 h-6 mr-2" /> {t('Call Now', lang)}
              </a>
              <a href={`https://line.me/R/ti/p/~${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`} target="_blank" rel="noopener noreferrer" className="bg-[#00B900] hover:bg-[#009900] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 flex items-center shadow-lg text-lg">
                <MessageCircle className="w-6 h-6 mr-2" /> {t('Chat on LINE', lang)}
              </a>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-3xl border border-slate-50 shadow-2xl shadow-slate-200/50">
            <h3 className="text-3xl font-extrabold text-slate-800 mb-8">{t('Quick Service Request', lang)}</h3>
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-8 text-center shadow-inner">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-2xl font-bold mb-2">{t('Request Sent Successfully!', lang)}</h4>
                <p className="text-lg">{t('We will contact you shortly.', lang)}</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t('Name / Company', lang)}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('Phone', lang)}</label>
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('Motor Type', lang)}</label>
                    <input 
                      type="text" 
                      value={formData.motorType}
                      onChange={(e) => setFormData({...formData, motorType: e.target.value})}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t('Issue Description', lang)}</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={formData.issue}
                    onChange={(e) => setFormData({...formData, issue: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/30 mt-4 flex justify-center items-center text-lg"
                >
                  {status === 'submitting' ? t('Sending...', lang) : t('Send Request', lang)}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-sm mt-2 font-medium">Failed to send request. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  const siteContent = useContext(SiteContext);
  const { lang } = useContext(LanguageContext);
  
  const mapEmbedUrl = siteContent?.contact?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.583324647352!2d101.0185073148216!3d12.9344799908801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102958013e80001%3A0x6000000000000000!2sKhao%20Mai%20Kaeo%2C%20Bang%20Lamung%20District%2C%20Chon%20Buri%2020150%2C%20Thailand!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus";
  const mapLinkUrl = siteContent?.contact?.mapLinkUrl || "https://maps.google.com/?q=21+2,+Khao+Mai+Kaeo,+Bang+Lamung+District,+Chon+Buri+20150";
  const mapButtonText = lang === 'th' && siteContent?.contact?.mapButtonText_th ? siteContent.contact.mapButtonText_th : (siteContent?.contact?.mapButtonText || t('Open in Google Maps', lang));

  return (
    <section className="bg-slate-200 h-96 relative">
      <iframe 
        src={mapEmbedUrl} 
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
        <a href={mapLinkUrl} target="_blank" rel="noopener noreferrer" className="pointer-events-auto bg-white text-slate-900 px-6 py-3 rounded-md font-bold shadow-lg hover:bg-slate-50 transition border border-slate-200 flex items-center mt-48">
          <MapPin className="w-5 h-5 mr-2 text-cyan-500" /> {mapButtonText}
        </a>
      </div>
    </section>
  );
};

const Footer = ({ onOpenAdminLogin }: { onOpenAdminLogin: () => void }) => {
  const siteContent = useContext(SiteContext);
  const { lang } = useContext(LanguageContext);
  
  const description = lang === 'th' && siteContent?.footer?.description_th ? siteContent.footer.description_th : (siteContent?.footer?.description || 'Professional electric motor repair and rewinding service in Chon Buri and Pattaya. Quality guaranteed.');
  const companyNameShort = siteContent?.hero?.companyNameShort || 'BIG MOTOR';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-6">
              {siteContent?.hero?.logo ? (
                <div className="flex items-center">
                  <img src={siteContent.hero.logo} alt="Company Logo" className="h-12 object-contain bg-white p-1.5 rounded-xl mr-4 shadow-md" referrerPolicy="no-referrer" />
                  <span className="text-3xl font-extrabold text-white tracking-tight">{companyNameShort}</span>
                </div>
              ) : (
                <div className="text-3xl font-extrabold text-white flex items-center tracking-tight">
                  <Zap className="w-8 h-8 text-blue-500 mr-3" />
                  {companyNameShort}
                </div>
              )}
            </div>
            <p className="mb-8 leading-relaxed font-light">{description}</p>
            <div className="flex space-x-4">
              <a href={siteContent?.footer?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all hover:scale-110 shadow-lg">
                <Facebook className="w-6 h-6" />
              </a>
              <a href={`https://line.me/R/ti/p/~${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#00B900] hover:text-white transition-all hover:scale-110 shadow-lg">
                <MessageCircle className="w-6 h-6" />
              </a>
              <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all hover:scale-110 shadow-lg">
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-xl mb-6">{t('Quick Links', lang)}</h4>
            <ul className="space-y-4">
              {['Home', 'Services', 'Booking', 'Repair Status', 'Blog', 'Contact'].map((link) => {
                const sectionId = link.toLowerCase().replace(' ', '-');
                return (
                <li key={link}>
                  <a href={`#${sectionId}`} onClick={(e) => scrollToSectionHelper(e, sectionId)} className="hover:text-blue-400 transition-colors flex items-center group font-medium">
                    <ChevronRight className="w-5 h-5 mr-2 text-blue-500 group-hover:text-blue-400 transition-colors" /> {t(link, lang)}
                  </a>
                </li>
              )})}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-xl mb-6">{t('Our Services', lang)}</h4>
            <ul className="space-y-4">
              {['Electric Motor Repair', 'Motor Rewinding', 'Pump Motor Repair', 'Generator Service', 'Industrial Maintenance'].map((link) => (
                <li key={link}>
                  <a href="#services" onClick={(e) => scrollToSectionHelper(e, 'services')} className="hover:text-blue-400 transition-colors flex items-center group font-medium">
                    <ChevronRight className="w-5 h-5 mr-2 text-blue-500 group-hover:text-blue-400 transition-colors" /> {t(link, lang)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-xl mb-6">{t('Contact Info', lang)}</h4>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 text-blue-500 mr-3 mt-1 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                <span className="whitespace-pre-line group-hover:text-slate-200 transition-colors">{lang === 'th' && siteContent?.contact?.address_th ? siteContent.contact.address_th : (siteContent?.contact?.address || '21 2, Khao Mai Kaeo, Bang Lamung District, Chon Buri 20150')}</span>
              </li>
              <li className="flex items-center group">
                <Phone className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                <span className="group-hover:text-slate-200 transition-colors">{siteContent?.contact?.phone || '+66 94 260 8244'}</span>
              </li>
              <li className="flex items-center group">
                <Mail className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                <span className="group-hover:text-slate-200 transition-colors">{siteContent?.contact?.email || 'service@bigmotor.co.th'}</span>
              </li>
              <li className="flex items-center group">
                <MessageCircle className="w-5 h-5 text-[#00B900] mr-3 flex-shrink-0 group-hover:text-[#25D366] transition-colors" />
                <span className="group-hover:text-slate-200 transition-colors">LINE: {siteContent?.contact?.line || '@bigmotor'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} BIG ELECTRICMOTOR SERVICE CO., LTD. {t('All rights reserved.', lang)}</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm font-medium">
            <a href="#" className="hover:text-blue-400 transition-colors">{t('Privacy Policy', lang)}</a>
            <a href="#" className="hover:text-blue-400 transition-colors">{t('Terms of Service', lang)}</a>
            <button onClick={onOpenAdminLogin} className="hover:text-blue-400 transition-colors">{t('Admin Login', lang)}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingButtons = () => {
  const siteContent = useContext(SiteContext);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
      <a href={`https://wa.me/${siteContent?.contact?.phone?.replace(/\D/g, '') || '66942608244'}`} className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#25D366]/50" aria-label="WhatsApp">
        <MessageSquare className="w-8 h-8" />
      </a>
      <a href={`https://line.me/R/ti/p/~${siteContent?.contact?.line?.replace('@', '') || 'bigmotor'}`} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-[#00B900] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#00B900]/50" aria-label="LINE">
        <MessageCircle className="w-7 h-7" />
      </a>
      <a href={`tel:${siteContent?.contact?.phone?.replace(/\s/g, '') || '+66942608244'}`} className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-blue-500/50 animate-bounce" aria-label="Call">
        <Phone className="w-8 h-8" />
      </a>
    </div>
  );
};

const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean, onClose: () => void, onLoginSuccess: (token: string) => void }) => {
  const { lang } = useContext(LanguageContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, 'admins', user.email || ''));
      const isFallbackAdmin = user.email === 'manojprajapatiworks@gmail.com';
      if (!adminDoc.exists() && !isFallbackAdmin) {
        await logout();
        throw new Error(lang === 'en' ? 'Access denied. You are not an authorized admin.' : 'ปฏิเสธการเข้าถึง คุณไม่ใช่ผู้ดูแลระบบที่ได้รับอนุญาต');
      }
      const token = await user.getIdToken();
      onLoginSuccess(token);
      onClose();
    } catch (err: any) {
      setError(err.message || (lang === 'en' ? 'Login failed. Please try again.' : 'เข้าสู่ระบบล้มเหลว กรุณาลองอีกครั้ง'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await loginWithEmail(email, password);
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, 'admins', user.email || ''));
      const isFallbackAdmin = user.email === 'manojprajapatiworks@gmail.com';
      if (!adminDoc.exists() && !isFallbackAdmin) {
        await logout();
        throw new Error(lang === 'en' ? 'Access denied. You are not an authorized admin.' : 'ปฏิเสธการเข้าถึง คุณไม่ใช่ผู้ดูแลระบบที่ได้รับอนุญาต');
      }
      const token = await user.getIdToken();
      onLoginSuccess(token);
      onClose();
    } catch (err: any) {
      setError(err.message || (lang === 'en' ? 'Login failed. Please check your credentials.' : 'เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลประจำตัวของคุณ'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-800 to-cyan-700 p-6 flex justify-between items-center text-white">
          <h3 className="text-xl font-extrabold flex items-center">
            <Zap className="w-6 h-6 text-blue-400 mr-2" />
            {t('Admin Login', lang)}
          </h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8">
          <div className="flex mb-6 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setLoginMethod('google')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginMethod === 'google' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Google
            </button>
            <button 
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginMethod === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Email
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 mb-6">
              {error}
            </div>
          )}

          {loginMethod === 'google' ? (
            <div className="text-center py-4">
              <p className="text-slate-600 mb-8 text-lg">
                {lang === 'en' ? 'Sign in with your Google account to access the admin panel.' : 'ลงชื่อเข้าใช้ด้วยบัญชี Google ของคุณเพื่อเข้าถึงแผงควบคุม'}
              </p>
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center disabled:opacity-70 shadow-lg shadow-blue-500/30 text-lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  lang === 'en' ? 'Sign in with Google' : 'ลงชื่อเข้าใช้ด้วย Google'
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center disabled:opacity-70 shadow-lg shadow-blue-500/30 text-lg mt-6"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  lang === 'en' ? 'Sign in with Email' : 'ลงชื่อเข้าใช้ด้วยอีเมล'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [siteContent, setSiteContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'th') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Double check admin status on auth change
        const adminDoc = await getDoc(doc(db, 'admins', user.email || ''));
        const isFallbackAdmin = user.email === 'manojprajapatiworks@gmail.com';
        if (adminDoc.exists() || isFallbackAdmin) {
          setAdminUser(user);
        } else {
          setAdminUser(null);
          if (auth.currentUser) await logout();
        }
      } else {
        setAdminUser(null);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSiteContent(docSnap.data());
      } else {
        setSiteContent(defaultContent);
      }
      setLoading(false);
    }, (error) => {
      console.error('Failed to fetch site content', error);
      setSiteContent(defaultContent);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading || !authInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
    </div>;
  }

  if (adminUser) {
    return (
      <AdminPanel 
        token={adminUser.uid} 
        siteContent={siteContent} 
        onUpdateContent={setSiteContent} 
        onLogout={async () => {
          await logout();
        }} 
      />
    );
  }

  return (
    <LanguageContext.Provider value={{lang, setLang}}>
      <SiteContext.Provider value={siteContent}>
        <div className="min-h-screen bg-white font-sans selection:bg-cyan-500 selection:text-white scroll-smooth">
          <Header />
          <main>
            <Hero />
            <TrustSection />
            <Services />
            <Calculator />
            <WhyChooseUs />
            <Process />
            <Tracking />
            {siteContent?.showTestimonials !== false && <Testimonials />}
            <Gallery />
            <Blog />
            <Contact />
            <MapSection />
          </main>
          <Footer onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />
          <FloatingButtons />
          <AdminLoginModal 
            isOpen={isAdminLoginOpen} 
            onClose={() => setIsAdminLoginOpen(false)} 
            onLoginSuccess={() => {
              // Auth state is handled by onAuthStateChanged
            }}
          />
        </div>
      </SiteContext.Provider>
    </LanguageContext.Provider>
  );
}
