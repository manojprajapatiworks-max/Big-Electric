import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-admin-panel-2026";

let siteContent = {
  hero: {
    headline: "Professional Electric Motor Repair & Rewinding Service",
    headline_th: "บริการซ่อมและพันขดลวดมอเตอร์ไฟฟ้าระดับมืออาชีพ",
    subheadline: "Reliable industrial motor repair services in Chon Buri and Pattaya. Fast turnaround, guaranteed quality.",
    subheadline_th: "บริการซ่อมมอเตอร์อุตสาหกรรมที่เชื่อถือได้ในชลบุรีและพัทยา ซ่อมเสร็จไว มั่นใจในคุณภาพ",
    phone: "+66 94 260 8244",
    bgImage: "https://picsum.photos/seed/factory/1920/1080",
    logo: "",
    companyName: "BIG ELECTRICMOTOR",
    companyNameShort: "BIG MOTOR"
  },
  stats: {
    yearsExperience: "10",
    yearsExperienceLabel: "Years Experience",
    yearsExperienceLabel_th: "ปีแห่งประสบการณ์",
    motorsRepaired: "500",
    motorsRepairedLabel: "Motors Repaired",
    motorsRepairedLabel_th: "มอเตอร์ที่ซ่อมแล้ว",
    industrialClients: "200",
    industrialClientsLabel: "Industrial Clients",
    industrialClientsLabel_th: "ลูกค้าอุตสาหกรรม"
  },
  calculator: {
    title: "Motor Rewinding Cost Calculator",
    title_th: "เครื่องคำนวณค่าพันมอเตอร์",
    description: "Get an instant estimate for your motor rewinding or repair. Enter your motor specifications below to see estimated costs and turnaround times.",
    description_th: "รับการประเมินราคาซ่อมหรือพันมอเตอร์ของคุณทันที ป้อนข้อมูลจำเพาะของมอเตอร์ด้านล่างเพื่อดูค่าใช้จ่ายและเวลาที่ใช้โดยประมาณ",
    features: ["Transparent pricing structure", "No hidden fees", "Free detailed quotation available"],
    features_th: ["โครงสร้างราคาโปร่งใส", "ไม่มีค่าใช้จ่ายแอบแฝง", "มีใบเสนอราคาโดยละเอียดฟรี"]
  },
  process: [
    { title: "Submit Service Request", title_th: "ส่งคำร้องขอรับบริการ", desc: "Contact us via phone, LINE, or web form.", desc_th: "ติดต่อเราทางโทรศัพท์ LINE หรือแบบฟอร์มบนเว็บ" },
    { title: "Motor Inspection", title_th: "ตรวจสอบมอเตอร์", desc: "Thorough diagnostic to identify the root cause.", desc_th: "การวินิจฉัยอย่างละเอียดเพื่อระบุสาเหตุที่แท้จริง" },
    { title: "Repair or Rewinding", title_th: "ซ่อมแซมหรือพันขดลวด", desc: "Expert repair using high-grade materials.", desc_th: "ซ่อมแซมโดยผู้เชี่ยวชาญใช้วัสดุเกรดสูง" },
    { title: "Testing & Quality Check", title_th: "ทดสอบและตรวจสอบคุณภาพ", desc: "Rigorous testing to ensure optimal performance.", desc_th: "การทดสอบอย่างเข้มงวดเพื่อให้แน่ใจว่าได้ประสิทธิภาพสูงสุด" },
    { title: "Delivery to Customer", title_th: "ส่งมอบให้ลูกค้า", desc: "Safe return of your fully functional motor.", desc_th: "ส่งคืนมอเตอร์ที่ใช้งานได้สมบูรณ์ของคุณอย่างปลอดภัย" }
  ],
  contact: {
    address: "21 2, Khao Mai Kaeo\nBang Lamung District\nChon Buri 20150, Thailand",
    address_th: "21 2 เขาไม้แก้ว\nอำเภอบางละมุง\nชลบุรี 20150 ประเทศไทย",
    phone: "+66 94 260 8244",
    line: "@bigmotor",
    email: "service@bigmotor.co.th",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.583324647352!2d101.0185073148216!3d12.9344799908801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102958013e80001%3A0x6000000000000000!2sKhao%20Mai%20Kaeo%2C%20Bang%20Lamung%20District%2C%20Chon%20Buri%2020150%2C%20Thailand!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
    mapLinkUrl: "https://maps.google.com/?q=21+2,+Khao+Mai+Kaeo,+Bang+Lamung+District,+Chon+Buri+20150",
    mapButtonText: "Open in Google Maps",
    mapButtonText_th: "เปิดใน Google Maps"
  },
  footer: {
    description: "Professional electric motor repair and rewinding services in Chon Buri and Pattaya. We keep your industry running.",
    description_th: "บริการซ่อมและพันขดลวดมอเตอร์ไฟฟ้าระดับมืออาชีพในชลบุรีและพัทยา เราช่วยให้ธุรกิจของคุณขับเคลื่อนต่อไป",
    facebook: "https://facebook.com"
  },
  services: [
    { 
      title: "Electric Motor Repair", title_th: "ซ่อมมอเตอร์ไฟฟ้า", 
      desc: "Comprehensive diagnostics and repair for all types of electric motors.", desc_th: "การวินิจฉัยและซ่อมแซมมอเตอร์ไฟฟ้าทุกประเภทอย่างครอบคลุม",
      longDesc: "Our electric motor repair service covers everything from basic maintenance to complete overhauls. We use advanced diagnostic equipment to identify electrical and mechanical faults accurately. Our process includes stator and rotor testing, bearing replacement, dynamic balancing, and comprehensive load testing to ensure your motor returns to peak operating condition.",
      longDesc_th: "บริการซ่อมมอเตอร์ไฟฟ้าของเราครอบคลุมตั้งแต่การบำรุงรักษาขั้นพื้นฐานไปจนถึงการยกเครื่องใหม่ทั้งหมด เราใช้อุปกรณ์วินิจฉัยขั้นสูงเพื่อระบุข้อบกพร่องทางไฟฟ้าและทางกลอย่างแม่นยำ กระบวนการของเราประกอบด้วยการทดสอบสเตเตอร์และโรเตอร์ การเปลี่ยนลูกปืน การปรับสมดุลแบบไดนามิก และการทดสอบโหลดอย่างครอบคลุม เพื่อให้แน่ใจว่ามอเตอร์ของคุณกลับสู่สภาพการทำงานสูงสุด"
    },
    { 
      title: "Motor Rewinding", title_th: "พันขดลวดมอเตอร์", 
      desc: "High-quality copper rewinding to restore motor efficiency and lifespan.", desc_th: "การพันขดลวดทองแดงคุณภาพสูงเพื่อฟื้นฟูประสิทธิภาพและอายุการใช้งานของมอเตอร์",
      longDesc: "We specialize in precision motor rewinding using premium Class H insulation materials and high-grade copper wire. Our rewinding process involves careful stripping, core testing, precision coil winding, vacuum pressure impregnation (VPI), and oven curing. This meticulous approach guarantees enhanced thermal capacity, improved efficiency, and an extended lifespan for your industrial motors.",
      longDesc_th: "เราเชี่ยวชาญในการพันขดลวดมอเตอร์ที่มีความแม่นยำโดยใช้วัสดุฉนวน Class H ระดับพรีเมียมและลวดทองแดงเกรดสูง กระบวนการพันขดลวดของเราเกี่ยวข้องกับการลอกอย่างระมัดระวัง การทดสอบแกนกลาง การพันขดลวดที่แม่นยำ การชุบด้วยแรงดันสุญญากาศ (VPI) และการอบในเตาอบ แนวทางที่พิถีพิถันนี้รับประกันความจุความร้อนที่เพิ่มขึ้น ประสิทธิภาพที่ดีขึ้น และอายุการใช้งานที่ยาวนานขึ้นสำหรับมอเตอร์อุตสาหกรรมของคุณ"
    },
    { 
      title: "Pump Motor Repair", title_th: "ซ่อมมอเตอร์ปั๊ม", 
      desc: "Specialized repair services for industrial water and chemical pumps.", desc_th: "บริการซ่อมแซมเฉพาะทางสำหรับปั๊มน้ำและสารเคมีอุตสาหกรรม",
      longDesc: "Industrial pumps operate in demanding environments and require specialized care. We repair and rebuild centrifugal, submersible, and positive displacement pump motors. Our service includes mechanical seal replacement, impeller balancing, shaft alignment, and protective coating applications to prevent corrosion and ensure reliable fluid handling in your facility.",
      longDesc_th: "ปั๊มอุตสาหกรรมทำงานในสภาพแวดล้อมที่ต้องการความทนทานและต้องการการดูแลเป็นพิเศษ เราซ่อมแซมและสร้างมอเตอร์ปั๊มหอยโข่ง ปั๊มจุ่ม และปั๊มแบบแทนที่เชิงบวก บริการของเราประกอบด้วยการเปลี่ยนซีลเชิงกล การปรับสมดุลใบพัด การจัดตำแหน่งเพลา และการใช้สารเคลือบป้องกันเพื่อป้องกันการกัดกร่อนและรับประกันการจัดการของเหลวที่เชื่อถือได้ในโรงงานของคุณ"
    },
    { 
      title: "Generator Motor Repair", title_th: "ซ่อมมอเตอร์เครื่องกำเนิดไฟฟ้า", 
      desc: "Maintenance and repair for backup and continuous power generators.", desc_th: "การบำรุงรักษาและซ่อมแซมเครื่องกำเนิดไฟฟ้าสำรองและเครื่องกำเนิดไฟฟ้าต่อเนื่อง",
      longDesc: "Reliable power generation is critical for your operations. We offer comprehensive repair and maintenance for both standby and prime power generators. Our technicians are experienced in alternator rewinding, exciter repair, voltage regulator troubleshooting, and full-load bank testing to guarantee your generator performs flawlessly when you need it most.",
      longDesc_th: "การผลิตไฟฟ้าที่เชื่อถือได้มีความสำคัญต่อการดำเนินงานของคุณ เรานำเสนอการซ่อมแซมและบำรุงรักษาอย่างครอบคลุมสำหรับทั้งเครื่องกำเนิดไฟฟ้าสำรองและเครื่องกำเนิดไฟฟ้าหลัก ช่างเทคนิคของเรามีประสบการณ์ในการพันขดลวดอัลเทอร์เนเตอร์ การซ่อมแซมเอ็กไซเตอร์ การแก้ไขปัญหาเครื่องควบคุมแรงดันไฟฟ้า และการทดสอบโหลดแบงก์เต็มรูปแบบ เพื่อรับประกันว่าเครื่องกำเนิดไฟฟ้าของคุณจะทำงานได้อย่างไร้ที่ติเมื่อคุณต้องการมากที่สุด"
    },
    { 
      title: "Industrial Maintenance", title_th: "การบำรุงรักษาอุตสาหกรรม", 
      desc: "Preventative maintenance programs to minimize factory downtime.", desc_th: "โปรแกรมการบำรุงรักษาเชิงป้องกันเพื่อลดเวลาหยุดทำงานของโรงงาน",
      longDesc: "Prevent unexpected breakdowns with our customized industrial maintenance programs. We conduct routine inspections, vibration analysis, thermal imaging, and electrical testing on-site. By identifying potential issues early, we help you schedule repairs during planned outages, significantly reducing costly unplanned downtime and extending the life of your critical rotating equipment.",
      longDesc_th: "ป้องกันการพังทลายที่ไม่คาดคิดด้วยโปรแกรมการบำรุงรักษาอุตสาหกรรมที่ปรับแต่งได้ของเรา เราดำเนินการตรวจสอบตามปกติ การวิเคราะห์การสั่นสะเทือน การถ่ายภาพความร้อน และการทดสอบทางไฟฟ้าในสถานที่ ด้วยการระบุปัญหาที่อาจเกิดขึ้นตั้งแต่เนิ่นๆ เราช่วยคุณกำหนดเวลาการซ่อมแซมในช่วงที่วางแผนหยุดทำงาน ซึ่งช่วยลดเวลาหยุดทำงานที่ไม่ได้วางแผนไว้ซึ่งมีค่าใช้จ่ายสูงได้อย่างมาก และยืดอายุการใช้งานของอุปกรณ์หมุนที่สำคัญของคุณ"
    },
    { 
      title: "AC/DC Motor Service", title_th: "บริการมอเตอร์ AC/DC", 
      desc: "Expert service for both alternating and direct current motors.", desc_th: "บริการผู้เชี่ยวชาญสำหรับทั้งมอเตอร์กระแสสลับและกระแสตรง",
      longDesc: "Whether your facility relies on standard AC induction motors or complex DC drive systems, our experts have the knowledge and tools to service them. For DC motors, we provide specialized commutator turning, undercutting, and brush gear maintenance. For AC motors, we offer comprehensive electrical testing and mechanical overhauls to ensure optimal torque and speed control.",
      longDesc_th: "ไม่ว่าโรงงานของคุณจะพึ่งพามอเตอร์เหนี่ยวนำ AC มาตรฐานหรือระบบขับเคลื่อน DC ที่ซับซ้อน ผู้เชี่ยวชาญของเรามีความรู้และเครื่องมือในการให้บริการ สำหรับมอเตอร์ DC เราให้บริการการกลึงคอมมิวเตเตอร์ การเซาะร่อง และการบำรุงรักษาชุดแปรงถ่านโดยเฉพาะ สำหรับมอเตอร์ AC เรานำเสนอการทดสอบทางไฟฟ้าและการยกเครื่องทางกลอย่างครอบคลุม เพื่อให้แน่ใจว่ามีการควบคุมแรงบิดและความเร็วที่เหมาะสมที่สุด"
    }
  ],
  blogs: [
    { title: "Signs Your Electric Motor Needs Rewinding", title_th: "สัญญาณที่บ่งบอกว่ามอเตอร์ไฟฟ้าของคุณต้องพันขดลวดใหม่", category: "Maintenance", category_th: "การบำรุงรักษา", date: "Oct 12, 2026", image: "https://picsum.photos/seed/motor1/800/600", desc: "Learn the top 5 warning signs that indicate your industrial motor requires professional rewinding before a complete failure occurs.", desc_th: "เรียนรู้ 5 สัญญาณเตือนอันดับต้นๆ ที่บ่งบอกว่ามอเตอร์อุตสาหกรรมของคุณต้องได้รับการพันขดลวดใหม่โดยผู้เชี่ยวชาญก่อนที่จะเกิดความล้มเหลวโดยสมบูรณ์" },
    { title: "How to Extend the Lifespan of Industrial Pumps", title_th: "วิธีขยายอายุการใช้งานของปั๊มอุตสาหกรรม", category: "Tips & Tricks", category_th: "เคล็ดลับและเทคนิค", date: "Sep 28, 2026", image: "https://picsum.photos/seed/pump2/800/600", desc: "Simple preventative maintenance steps you can take to ensure your water and chemical pumps operate efficiently for years.", desc_th: "ขั้นตอนการบำรุงรักษาเชิงป้องกันง่ายๆ ที่คุณสามารถทำได้เพื่อให้แน่ใจว่าปั๊มน้ำและสารเคมีของคุณทำงานอย่างมีประสิทธิภาพเป็นเวลาหลายปี" },
    { title: "Understanding AC vs DC Motor Repairs", title_th: "ทำความเข้าใจเกี่ยวกับการซ่อมมอเตอร์ AC กับ DC", category: "Education", category_th: "การศึกษา", date: "Sep 15, 2026", image: "https://picsum.photos/seed/repair3/800/600", desc: "A comprehensive guide to the differences in diagnosing and repairing alternating current versus direct current electric motors.", desc_th: "คำแนะนำที่ครอบคลุมเกี่ยวกับความแตกต่างในการวินิจฉัยและซ่อมแซมมอเตอร์ไฟฟ้ากระแสสลับเทียบกับมอเตอร์ไฟฟ้ากระแสตรง" }
  ],
  trackingIds: [
    { id: "EMS-000245", status: "Rewinding", completionDate: "Oct 24, 2026" }
  ],
  workshopGallery: [
    "https://picsum.photos/seed/workshop1/800/600",
    "https://picsum.photos/seed/workshop2/800/600",
    "https://picsum.photos/seed/workshop3/800/600",
    "https://picsum.photos/seed/workshop4/800/600",
    "https://picsum.photos/seed/workshop5/800/600",
    "https://picsum.photos/seed/workshop6/800/600"
  ]
};

let serviceRequests: any[] = [];

app.get("/api/content", (req, res) => {
  res.json(siteContent);
});

app.post("/api/service-request", (req, res) => {
  const newRequest = {
    id: Date.now().toString(),
    ...req.body,
    date: new Date().toISOString()
  };
  serviceRequests.unshift(newRequest);
  res.json({ success: true, data: newRequest });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "Bigelectricmotoradmin" && password === "Bigelectricadminlogin2026") {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/api/content", authenticateToken, (req, res) => {
  siteContent = { ...siteContent, ...req.body };
  res.json({ success: true, data: siteContent });
});

app.get("/api/service-requests", authenticateToken, (req, res) => {
  res.json(serviceRequests);
});

app.delete("/api/service-requests/:id", authenticateToken, (req, res) => {
  serviceRequests = serviceRequests.filter(req => req.id !== req.params.id);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
  });
}

startServer();
