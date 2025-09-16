function isValidTikTokUrl(url) {
  const tiktokRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/(@[\w.-]+\/video\/\d+)/;
  return tiktokRegex.test(url);
}

async function downloadVideo() {
  const videoUrl = document.getElementById('videoUrl').value;
  const message = document.getElementById('message');
  const result = document.getElementById('result');

  message.innerText = '';
  result.innerHTML = '';

  if (!isValidTikTokUrl(videoUrl)) {
    message.innerText = '❌ URL TikTok tidak valid.';
    return;
  }

  message.innerText = '⏳ Memproses...';

  try {
    const res = await fetch('http://localhost:3000/api/download', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ videoUrl })
    });

    const data = await res.json();

    if (data.downloadUrl) {
      result.innerHTML = `<a href="${data.downloadUrl}" target="_blank" class="download-link">⬇️ Klik di sini untuk mengunduh</a>`;
      message.innerText = '✅ Video siap diunduh!';
    } else {
      message.innerText = '❌ Gagal mendapatkan link download.';
    }
  } catch (err) {
    message.innerText = '❌ Terjadi kesalahan saat memproses.';
  }
}
