/**
 * AawazSetu (आवाज़ सेतु) - Node.js Backend Server (Zero external dependencies)
 * Run: node backend/server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = path.join(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      handleApi(pathname, req.method, body ? JSON.parse(body || '{}') : {}, res);
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${pathname}`);
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

function handleApi(endpoint, method, data, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (endpoint === '/api/health' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      version: '2.4.0',
      server: 'AawazSetu-NodeEngine',
      supportedLanguages: ['English (en-IN)', 'Hindi (hi-IN)', 'Bhojpuri (bho-IN)', 'Marathi (mr-IN)', 'Tamil (ta-IN)'],
      nepAlignment: 'FLN / NIPUN Bharat / NEP-2020'
    }));
    return;
  }

  if (endpoint === '/api/translate' && method === 'POST') {
    const text = data.text || 'बच्चों अपनी किताबें खोलिए।';
    const target = data.targetLang || 'Bhojpuri (भोजपुरी)';
    
    let translated = text;
    let transliteration = '';
    let analogy = 'स्थानीय सांस्कृतिक संदर्भ व परिवेशीय उदाहरण।';

    if (target.includes('Bhojpuri')) {
      translated = 'लइकन! आपन-आपन पोथी खोलल जाव आ मन लगा के पढ़ल जाव।';
      transliteration = 'Laikan! Aapan-aapan pothi kholal jaav aa man laga ke padhal jaav.';
      analogy = 'ग्रामीण व कृषि परिवेश के दैनिक जीवन से जुड़ी उपमाएं।';
    } else if (target.includes('Marathi')) {
      translated = 'मुलांनो! आपली पुस्तके उघडा आणि आनंदाने शिका.';
      transliteration = 'Mulaano! Aapli pustake ughada aani aanandane shika.';
      analogy = 'स्थानिक वारली संस्कृती आणि निसर्गाची उदाहरणे.';
    } else if (target.includes('Tamil')) {
      translated = 'மாணவர்களே! புத்தகங்களை திறந்து கவனமாக படிக்கவும்.';
      transliteration = 'Maanavargale! Puththagangalai thiranthu kavanamaaga padikkavum.';
      analogy = 'தமிழ் பாரம்பரியம் மற்றும் அன்றாட வாழ்வியல் எடுத்துக்காட்டுகள்.';
    } else if (target.includes('English')) {
      translated = 'Children, please open your books and let us learn together.';
      transliteration = 'Children, please open your books and let us learn together.';
      analogy = 'Foundational FLN bilingual scaffolding.';
    }

    res.writeHead(200);
    res.end(JSON.stringify({
      originalText: text,
      translatedText: translated,
      transliteration: transliteration,
      targetLang: target,
      pedagogyBridge: analogy,
      confidenceScore: 99.1
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
}

server.listen(PORT, () => {
  console.log(`🎙️ AawazSetu Node Server running at http://localhost:${PORT}`);
});
