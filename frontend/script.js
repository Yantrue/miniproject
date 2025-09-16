document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('downloadBtn');
  const input = document.getElementById('videoUrl');
  const message = document.getElementById('message');
  const result = document.getElementById('result');

  function isValidTikTokUrl(url) {
    const regex = /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/;
    return regex.test(url);
  }

  button.addEventListener('click', async () => {
    const videoUrl = input.value.trim();
    message.textContent = '';
    result.innerHTML = '';

    if (!isValidTikTokUrl(videoUrl)) {
      message.textContent = '❌ URL TikTok tidak valid.';
      return;
    }

    message.textContent = '⏳ Memproses link...';

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });

      const data = await res.json();

      if (data.downloadUrl) {
        result.innerHTML = `<a href="${data.downloadUrl}" target="_blank" class="download-link">⬇️ Klik di sini untuk mengunduh video</a>`;
        message.textContent = '✅ Link berhasil dibuat!';
      } else {
        message.textContent = '❌ Gagal mendapatkan link download.';
      }
    } catch (err) {
      console.error(err);
      message.textContent = '❌ Terjadi kesalahan saat memproses.';
    }
  });
});
