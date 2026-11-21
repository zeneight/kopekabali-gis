const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envVars = {};

// 1. Baca dari file .env lokal jika ada
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
            envVars[key] = val;
        }
    }
}

// 2. Prioritaskan process.env (untuk Vercel / CI/CD) lalu fallback ke .env lokal
const finalConfig = {
    SUPABASE_URL: process.env.SUPABASE_URL || envVars.SUPABASE_URL || '',
    SUPABASE_KEY: process.env.SUPABASE_KEY || envVars.SUPABASE_KEY || '',
    BASEMAP_URL: process.env.BASEMAP_URL || envVars.BASEMAP_URL || 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    BASEMAP_API_KEY: process.env.BASEMAP_API_KEY || envVars.BASEMAP_API_KEY || ''
};

const output = `// File ini di-generate otomatis dari .env — JANGAN di-commit ke repository publik\nwindow.APP_CONFIG = ${JSON.stringify(finalConfig, null, 4)};\n`;
fs.writeFileSync(path.join(__dirname, 'config.js'), output, 'utf-8');
console.log('Berhasil membuat config.js dari environment variables.');