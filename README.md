# ExamCraft - Enterprise AI Question Paper & Answer Booklet Creator

A commercial-grade, multi-tenant examination creation platform designed for schools, teachers, and academic institutions. Creates formal CBSE/ICSE Question Papers and Question Paper-cum-Answer Booklets with enterprise security, secret key concealment, threat shielding, and multi-school license management.

---

## 🛡️ Enterprise Security & Threat Architecture

ExamCraft is architected for commercial B2B sales to schools:

1. **Zero-Leak API Key Concealment (Denial of Wallet Defense)**
   - Secret LLM keys (`GEMINI_API_KEY`, `GROQ_API_KEY`) reside strictly inside the backend proxy server (`server/index.js` / `.env`).
   - The browser and client JavaScript bundles never touch or expose the API keys, preventing student or unauthorized scraping and key theft via browser DevTools.

2. **Multi-Tenant School Licensing & Access Control (`x-school-token`)**
   - Each client school is assigned a unique School License Token (e.g., `SCH-DPS-2026-X9A`).
   - The backend validates the license token on every paper generation call. Unauthenticated or expired tokens receive an immediate HTTP 401 Unauthorized block.

3. **Anti-DDoS, DoS & Rate Limiting Protection**
   - `express-rate-limit` enforces quotas:
     - **Paper Generation**: Maximum 35 full papers per 15-minute window per school / IP.
     - **API Requests**: Maximum 150 general requests per 15 minutes.
   - Rejects payload sizes exceeding 500 KB to defend against memory exhaustion and buffer overflow attacks.

4. **Prompt Injection & Threat Shield**
   - Heuristic filter actively screens user-supplied text (teacher focus notes, syllabus instructions) for prompt injection patterns:
     - `Ignore previous instructions`, `DAN mode`, `System:`, `Jailbreak`, `Reveal secret / API key`, `<script>` tags, and persona hijacking attempts.
   - User inputs are structurally enclosed in isolated `<teacher_guidelines>` XML enclosures with rigid negative constraints commanding the LLM to treat all inputs as passive text strings.

5. **Dual-Engine High-Availability & 503 Auto-Recovery**
   - Groq LPUs (`llama-3.3-70b-versatile`) generating at 500+ tokens/sec.
   - Google Gemini (`gemini-2.5-flash`) with parallel batching and intelligent fallback chains to prevent service disruption during Google server demand spikes.
   - Built-in JSON auto-repair salvages questions if output is ever truncated by token limits.

---

## 🏫 Demo School License Keys (For Testing)

| School Name | License Key | Tier | Daily Quota |
| :--- | :--- | :--- | :--- |
| **Delhi Public School (DPS RK Puram)** | `SCH-DPS-2026-X9A` | Enterprise School License | 500 papers/day |
| **DAV Public School** | `SCH-DAV-2026-B4Z` | Standard School License | 300 papers/day |
| **St. Xavier's Collegiate School** | `SCH-STX-2026-M8K` | Enterprise School License | 500 papers/day |
| **Kendriya Vidyalaya (KV Sangathan)** | `SCH-KV-2026-Q1R` | Institutional License | 1,000 papers/day |
| **System Administrator (Dev Master)** | `SCH-DEV-MASTER-2026` | Master Administrator | Unlimited |

---

## 🚀 Running the Platform

### 1. Start Enterprise Backend Proxy
```bash
npm run server
```
Server starts on `http://localhost:3001` with active Helmet headers, CORS policies, rate limiting, and prompt injection defense.

### 2. Start Frontend Dev Server
```bash
npm run dev
```
Accessible at `http://localhost:5173`. The Vite proxy automatically routes `/api` calls directly to the Express server.

### 3. Production Deployment (Cloud Run / Render / Railway)
- Deploy backend `server/index.js` with server `.env` variables (`PORT`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `ALLOWED_SCHOOL_TOKENS`).
- Deploy frontend build (`dist/`) to Vercel, Firebase Hosting, Netlify, or serve statically from Express.
