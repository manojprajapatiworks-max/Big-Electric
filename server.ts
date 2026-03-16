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
    motorsRepaired: "500",
    industrialClients: "200"
  },
  contact: {
    address: "21 2, Khao Mai Kaeo\nBang Lamung District\nChon Buri 20150, Thailand",
    address_th: "21 2 เขาไม้แก้ว\nอำเภอบางละมุง\nชลบุรี 20150 ประเทศไทย",
    phone: "+66 94 260 8244",
    line: "@bigmotor",
    email: "service@bigmotor.co.th",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.583324647352!2d101.0185073148216!3d12.9344799908801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102958013e80001%3A0x6000000000000000!2sKhao%20Mai%20Kaeo%2C%20Bang%20Lamung%20District%2C%20Chon%20Buri%2020150%2C%20Thailand!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
    mapLinkUrl: "https://maps.google.com/?q=21+2,+Khao+Mai+Kaeo,+Bang+Lamung+District,+Chon+Buri+20150"
  },
  footer: {
    description: "Professional electric motor repair and rewinding services in Chon Buri and Pattaya. We keep your industry running.",
    description_th: "บริการซ่อมและพันขดลวดมอเตอร์ไฟฟ้าระดับมืออาชีพในชลบุรีและพัทยา เราช่วยให้ธุรกิจของคุณขับเคลื่อนต่อไป",
    facebook: "https://facebook.com"
  },
  services: [
    { title: "Electric Motor Repair", desc: "Comprehensive diagnostics and repair for all types of electric motors." },
    { title: "Motor Rewinding", desc: "High-quality copper rewinding to restore motor efficiency and lifespan." },
    { title: "Pump Motor Repair", desc: "Specialized repair services for industrial water and chemical pumps." },
    { title: "Generator Motor Repair", desc: "Maintenance and repair for backup and continuous power generators." },
    { title: "Industrial Maintenance", desc: "Preventative maintenance programs to minimize factory downtime." },
    { title: "AC/DC Motor Service", desc: "Expert service for both alternating and direct current motors." }
  ],
  blogs: [
    { title: "Signs Your Electric Motor Needs Rewinding", category: "Maintenance", date: "Oct 12, 2026", image: "https://picsum.photos/seed/motor1/800/600", desc: "Learn the top 5 warning signs that indicate your industrial motor requires professional rewinding before a complete failure occurs." },
    { title: "How to Extend the Lifespan of Industrial Pumps", category: "Tips & Tricks", date: "Sep 28, 2026", image: "https://picsum.photos/seed/pump2/800/600", desc: "Simple preventative maintenance steps you can take to ensure your water and chemical pumps operate efficiently for years." },
    { title: "Understanding AC vs DC Motor Repairs", category: "Education", date: "Sep 15, 2026", image: "https://picsum.photos/seed/repair3/800/600", desc: "A comprehensive guide to the differences in diagnosing and repairing alternating current versus direct current electric motors." }
  ],
  trackingIds: [
    { id: "EMS-000245", status: "Rewinding", completionDate: "Oct 24, 2026" }
  ]
};

app.get("/api/content", (req, res) => {
  res.json(siteContent);
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
