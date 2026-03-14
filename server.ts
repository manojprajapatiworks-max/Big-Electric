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
    phone: "+66 94 260 8244"
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
    email: "service@bigmotor.co.th"
  },
  footer: {
    description: "Professional electric motor repair and rewinding services in Chon Buri and Pattaya. We keep your industry running.",
    description_th: "บริการซ่อมและพันขดลวดมอเตอร์ไฟฟ้าระดับมืออาชีพในชลบุรีและพัทยา เราช่วยให้ธุรกิจของคุณขับเคลื่อนต่อไป",
    facebook: "https://facebook.com"
  },
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
