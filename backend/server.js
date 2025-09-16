const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rate limit untuk mencegah spam
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10
});
app.use('/api/', limiter);

// Serve file frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Endpoint download TikTok
app.post('/api/download', async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl || !videoUrl.includes('tiktok.com')) {
    return res.status(400).json({ error: 'URL TikTok tidak valid.' });
  }

  try {
    // Ganti URL ini dengan endpoint API TikTok downloader yang kamu pakai
    const response = await axios.get(`https://api.snaptik.app/your-api-endpoint?url=${encodeURIComponent(videoUrl)}`);
    res.json({ downloadUrl: response.data.download_url });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menghubungi API pihak ketiga.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
