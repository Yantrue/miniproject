const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 10 // 10 request per IP per menit
});
app.use('/api/', limiter);

// API Proxy ke SnapTik atau API pihak ketiga
app.post('/api/download', async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl || !videoUrl.includes('tiktok.com')) {
    return res.status(400).json({ error: 'URL tidak valid' });
  }

  try {
    const response = await axios.get(`https://api.snaptik.app/your-api-endpoint?url=${encodeURIComponent(videoUrl)}`);
    res.json({ downloadUrl: response.data.download_url });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menghubungi server API pihak ketiga' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend jalan di http://localhost:${PORT}`));
