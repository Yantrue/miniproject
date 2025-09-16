const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// Rate limiter (opsional tapi disarankan)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // Maksimum 10 request per menit per IP
});
app.use('/api/', limiter);

// ===== Static Files (HTML, CSS, JS, Favicon) =====
app.use(express.static(__dirname));

// Favicon handling if not present
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content, silent fail
});

// ===== Serve index.html =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== API Endpoint TikTok Downloader =====
app.post('/api/download', async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl || !videoUrl.includes('tiktok.com')) {
    return res.status(400).json({ error: 'URL TikTok tidak valid.' });
  }

  try {
    // Ganti dengan API downloader beneran yang kamu pakai (contoh: snaptik, musicallydown, dll)
    const apiUrl = `https://api.example.com/tiktok?url=${encodeURIComponent(videoUrl)}`;

    const response = await axios.get(apiUrl);

    // Misalnya responnya punya: { download_url: "..." }
    res.json({ downloadUrl: response.data.download_url || null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menghubungi API pihak ketiga.' });
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
