import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf-8');
  if (process.env.FIREBASE_API_KEY) {
    const customConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "ai-horizons-54ab9.firebaseapp.com",
      projectId: process.env.FIREBASE_PROJECT_ID || "ai-horizons-54ab9",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "ai-horizons-54ab9.firebasestorage.app",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1087064454163",
      appId: process.env.FIREBASE_APP_ID || "1:1087064454163:web:b04cefb2d4d995b9e23be6",
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-0VRZT968M5"
    };
    html = html.replace('<head>', `<head><script>window.__FIREBASE_CONFIG__ = ${JSON.stringify(customConfig)};</script>`);
  }
  res.send(html);
});

// Serve static assets from root directory
app.use(express.static(__dirname));

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
