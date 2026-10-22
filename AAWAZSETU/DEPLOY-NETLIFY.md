# 🚀 Deploying AawazSetu to Netlify (Live Online Server)
**Powered by Team NEURONEXSIS**

Your project is completely packaged and 100% production-ready for Netlify with serverless API functions, global CDN caching, and security headers configured.

---

## ⚡ Method 1: Instant 10-Second Deploy (No CLI / No Tools Needed!)

This is the fastest way to get your website live with an active `https://your-site.netlify.app` URL right now:

1. **Open your browser** and visit:  
   👉 **[https://app.netlify.com/drop](https://app.netlify.com/drop)**  
   *(Log in or create a free Netlify account if you haven't already)*

2. **Drag & Drop**:
   - Open File Explorer on your computer.
   - Drag the entire **`AAWAZSETU`** folder (`D:\AAWAZSETU`) and drop it into the upload box on the Netlify Drop page.

3. **Done! 🎉**:
   - Netlify will instantly deploy your static frontend, stylesheets, scripts, and serverless `/api/*` cloud functions.
   - You will receive a live URL like `https://aawazsetu-neuronexsis.netlify.app`.

---

## 🔗 Method 2: Automatic Git / GitHub Deploy (Continuous Deployment)

If you have a GitHub repository:

1. Create a new repository on [GitHub](https://github.com/new) called `AawazSetu`.
2. Push your project files to the GitHub repo.
3. Go to [Netlify Dashboard](https://app.netlify.com/) $\rightarrow$ Click **"Add new site"** $\rightarrow$ **"Import an existing project"**.
4. Select **GitHub** and pick the `AawazSetu` repository.
5. Netlify will automatically detect `netlify.toml` settings:
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`
6. Click **Deploy Site**! Every time you update code, Netlify will auto-deploy the latest version.

---

## ⚙️ What Is Pre-Configured for Netlify

| File | Purpose |
|---|---|
| `netlify.toml` | Build configuration, `/api/*` cloud function redirects, and caching headers |
| `_redirects` | Clean URL routing (`/auth`, `/courses`) and `/api/*` rewrite rules |
| `_headers` | CORS, X-Frame-Options, and security headers |
| `netlify/functions/api.js` | Serverless backend REST API handler (Health check, Translation, Stories, Phonics, Lesson plans) |

---

## 🌐 Custom Domain Setup (Optional)
To give your website a custom name on Netlify:
1. In your Netlify Site Dashboard, go to **Site configuration $\rightarrow$ Change site name**.
2. Set it to something like `aawazsetu-neuronexsis.netlify.app`.
