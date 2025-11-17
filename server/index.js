require("dotenv").config();

const http = require("http");
const db = require("./configs/db");
const express = require("express");
const cors = require("cors");
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

const app = express();
db();

const corsOptions = {
  origin: true, // reflect request origin to support multiple domains & production
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ✅ FIX lỗi PayloadTooLargeError
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/alowork/db", require("./route/DB"));
app.use("/alowork/user", require("./route/AloWorkUser"));
app.post("/api/translate", async (req, res) => {
  const { text, target_lang } = req.body;
  if (!text || !target_lang) {
    return res.status(400).json({ error: "Missing text or target_lang" });
  }

  try {
    const translate = (await import("google-translate-api-x")).default;
    const result = await translate(text, { to: target_lang });

    res.json({
      translations: [{ text: result.text, from: result.from.language.iso }],
    });
  } catch (err) {
    console.error("❌ Translation failed:", err);
    res.status(500).json({ error: "Translation failed", detail: err.message });
  }
});
// Health check endpoint
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;
