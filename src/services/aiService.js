// Universal AI Service: Enterprise Backend Proxy + Direct Fallback (Groq & Gemini)

const API_KEY_STORAGE = 'examcraft_ai_api_key';
const PROVIDER_STORAGE = 'examcraft_ai_provider';
const MODEL_STORAGE = 'examcraft_ai_model';
const SCHOOL_LICENSE_STORAGE = 'examcraft_school_license';
const DEFAULT_SCHOOL_LICENSE = 'SCH-DPS-2026-X9A'; // Pre-activated Enterprise School Demo Key

export const PROVIDERS = {
  GROQ: 'groq',
  GEMINI: 'gemini'
};

export const AVAILABLE_GROQ_MODELS = [
  { 
    id: 'llama-3.3-70b-versatile', 
    name: 'Llama 3.3 70B Versatile (Recommended - 500 tokens/sec & Top IQ)', 
    badge: 'Blazing Fast & Smart' 
  },
  { 
    id: 'llama-3.1-8b-instant', 
    name: 'Llama 3.1 8B Instant (Sub-second Generation)', 
    badge: 'Ultra Fast' 
  },
  { 
    id: 'mixtral-8x7b-32768', 
    name: 'Mixtral 8x7B (Large Context)', 
    badge: 'Balanced' 
  }
];

export const AVAILABLE_GEMINI_MODELS = [
  { 
    id: 'gemini-2.5-flash', 
    name: 'Gemini 2.5 Flash (Verified Fast & Stable)', 
    badge: 'Recommended' 
  },
  { 
    id: 'gemini-3.8-flash', 
    name: 'Gemini 3.8 Flash (Latest Intelligent Reasoning)', 
    badge: 'Newest Flash' 
  },
  { 
    id: 'gemini-3.5-flash', 
    name: 'Gemini 3.5 Flash', 
    badge: 'Stable' 
  },
  { 
    id: 'gemini-flash-latest', 
    name: 'Gemini Flash Latest', 
    badge: 'Auto-Updated' 
  }
];

// --- School Tenant & Licensing Management ---
export function getStoredSchoolLicense() {
  const stored = localStorage.getItem(SCHOOL_LICENSE_STORAGE);
  if (stored && stored.trim().length > 3) return stored.trim();
  return DEFAULT_SCHOOL_LICENSE;
}

export function saveStoredSchoolLicense(token) {
  if (token && token.trim()) {
    localStorage.setItem(SCHOOL_LICENSE_STORAGE, token.trim());
  } else {
    localStorage.removeItem(SCHOOL_LICENSE_STORAGE);
  }
}

export async function verifySchoolLicenseOnServer(token) {
  const licenseToken = token || getStoredSchoolLicense();
  try {
    const res = await fetch('/api/verify-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseToken })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: 'Cannot connect to School Security Server' };
  }
}

export async function checkServerShield() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, ...data };
  } catch (e) {
    return { online: false };
  }
}

// --- API Key & Provider Storage (for BYOK / direct fallback) ---
export function getStoredApiKey() {
  const local = localStorage.getItem(API_KEY_STORAGE);
  if (local && local.trim().length > 5) return local.trim();
  
  const envGroq = import.meta.env.VITE_GROQ_API_KEY;
  if (envGroq && envGroq.trim().length > 5) return envGroq.trim();

  const envGemini = import.meta.env.VITE_GEMINI_API_KEY;
  if (envGemini && envGemini.trim().length > 5) return envGemini.trim();

  return '';
}

export function saveStoredApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
    if (key.trim().startsWith('gsk_')) {
      saveStoredProvider(PROVIDERS.GROQ);
      saveStoredModel('llama-3.3-70b-versatile');
    } else if (key.trim().startsWith('AIza') || key.trim().startsWith('AQ.')) {
      saveStoredProvider(PROVIDERS.GEMINI);
      saveStoredModel('gemini-2.5-flash');
    }
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

export function getStoredProvider() {
  const stored = localStorage.getItem(PROVIDER_STORAGE);
  if (stored) return stored;
  const key = getStoredApiKey();
  if (key.startsWith('gsk_')) return PROVIDERS.GROQ;
  return PROVIDERS.GEMINI;
}

export function saveStoredProvider(provider) {
  localStorage.setItem(PROVIDER_STORAGE, provider);
}

export function getStoredModel() {
  const provider = getStoredProvider();
  const stored = localStorage.getItem(MODEL_STORAGE);
  if (stored) return stored;
  return provider === PROVIDERS.GROQ ? 'llama-3.3-70b-versatile' : 'gemini-2.5-flash';
}

export function saveStoredModel(model) {
  localStorage.setItem(MODEL_STORAGE, model);
}

// Test Key Connection (Direct or via Server)
export async function testConnection(apiKey, providerChoice, modelChoice) {
  // If server is online and no custom raw key is supplied, test via server health
  const server = await checkServerShield();
  if (server.online && !apiKey) {
    const licCheck = await verifySchoolLicenseOnServer(getStoredSchoolLicense());
    if (licCheck.success) {
      return { 
        success: true, 
        provider: 'Enterprise Protected Proxy', 
        activeModel: `${licCheck.school?.name} (${licCheck.school?.tier})` 
      };
    }
  }

  const key = apiKey || getStoredApiKey();
  if (!key) {
    if (server.online) {
      return { 
        success: true, 
        provider: 'Enterprise Server Shield', 
        activeModel: 'Server-Managed AI Engines' 
      };
    }
    throw new Error('API Key is missing and Enterprise Server is offline.');
  }

  const provider = providerChoice || (key.startsWith('gsk_') ? PROVIDERS.GROQ : PROVIDERS.GEMINI);
  const model = modelChoice || (provider === PROVIDERS.GROQ ? 'llama-3.3-70b-versatile' : 'gemini-2.5-flash');

  if (provider === PROVIDERS.GROQ) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Say "OK"' }],
          max_tokens: 5
        }),
        signal: controller.signal
      });

      clearTimeout(timer);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Groq status ${response.status}`);
      }
      return { success: true, provider: 'Groq', activeModel: model };
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  } else {
    // Gemini: prioritize stable gemini-2.5-flash first
    const candidateModels = ['gemini-2.5-flash', model, 'gemini-3.8-flash', 'gemini-3.5-flash'];
    let lastError = null;

    for (const targetModel of Array.from(new Set(candidateModels))) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${key}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with "OK"' }] }],
            generationConfig: { maxOutputTokens: 5 }
          }),
          signal: controller.signal
        });

        clearTimeout(timer);
        if (response.ok) {
          saveStoredModel(targetModel);
          return { success: true, provider: 'Gemini', activeModel: targetModel };
        }

        const err = await response.json().catch(() => ({}));
        lastError = err?.error?.message || `Gemini status ${response.status}`;
      } catch (e) {
        clearTimeout(timer);
        lastError = e.message;
      }
    }

    throw new Error(lastError || 'Failed to connect with Gemini API.');
  }
}

// Robust JSON parser with Auto-Repair for truncated LLM responses
export function safeParseJsonWithRepair(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();

  // 1. Direct parse attempt
  try {
    const parsed = JSON.parse(cleaned);
    return parsed.questions || (Array.isArray(parsed) ? parsed : []);
  } catch (err) {
    console.warn('Direct JSON parse failed. Attempting intelligent truncation recovery...', err.message);
  }

  // 2. Intelligent recovery for truncated output
  const lastObjectEnd = cleaned.lastIndexOf('}');
  if (lastObjectEnd !== -1) {
    const repairedObject = cleaned.substring(0, lastObjectEnd + 1) + ']}';
    try {
      const parsed = JSON.parse(repairedObject);
      const list = parsed.questions || (Array.isArray(parsed) ? parsed : []);
      if (list.length > 0) {
        return list;
      }
    } catch (_) {}

    const repairedArray = cleaned.substring(0, lastObjectEnd + 1) + ']';
    try {
      const parsed = JSON.parse(repairedArray);
      const list = Array.isArray(parsed) ? parsed : parsed.questions || [];
      if (list.length > 0) {
        return list;
      }
    } catch (_) {}
  }

  throw new Error('Model response was cut off before valid questions could be completed. Please try again with fewer questions or use Groq.');
}

// Direct Fallback Batch Generator (if running standalone without backend)
async function executeBatchDirect({
  key,
  provider,
  model,
  subject,
  classLevel,
  chapterList,
  difficulty,
  batchName,
  batchItems,
  specialInstructions
}) {
  const systemPrompt = `You are an examination question paper generator for ${classLevel}.
You MUST generate questions in strict JSON format:
{
  "questions": [
    {
      "id": "q-1",
      "type": "mcq" | "fillups" | "true_false" | "matching" | "vsa" | "sa" | "la",
      "text": "Question statement",
      "marks": number,
      "options": ["A) opt 1", "B) opt 2", "C) opt 3", "D) opt 4"],
      "matchPairs": [{"left": "1. Item", "right": "a) Match"}],
      "answer": "Concise answer key or solution rubric"
    }
  ]
}
Output pure JSON only.`;

  const userPrompt = `Generate the ${batchName} for:
- Subject: ${subject}
- Class Level: ${classLevel}
- Chapters: ${chapterList}
- Difficulty: ${difficulty}

EXACT QUESTIONS REQUIRED:
${batchItems.join('\n')}

${specialInstructions ? `Teacher Notes: ${specialInstructions}` : ''}
Keep question statements clear and answers concise.`;

  // GROQ
  if (provider === PROVIDERS.GROQ) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model || 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.35,
          max_tokens: 4096
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Groq status ${response.status}`);
      }

      const data = await response.json();
      return safeParseJsonWithRepair(data.choices[0].message.content);
    } catch (e) {
      clearTimeout(timeout);
      throw e;
    }
  }

  // GEMINI
  const candidateModels = ['gemini-2.5-flash', model, 'gemini-3.8-flash'];
  let lastError = null;

  for (const targetModel of Array.from(new Set(candidateModels))) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: 'application/json',
            maxOutputTokens: 8192
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        lastError = err?.error?.message || `Gemini status ${response.status}`;
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      return safeParseJsonWithRepair(rawText);
    } catch (e) {
      clearTimeout(timeout);
      lastError = e.message;
    }
  }

  throw new Error(lastError || 'Gemini generation failed');
}

// ================= MASTER GENERATOR =================
export async function generateFullPaperWithAi({
  apiKey,
  providerChoice,
  modelChoice,
  subject,
  classLevel,
  chapters,
  difficulty = 'Balanced',
  targetMarks = 80,
  typeBreakdown = {},
  specialInstructions = ''
}) {
  const schoolLicense = getStoredSchoolLicense();

  // 1. PRIMARY ENTERPRISE PATH: Call through Secure Backend Proxy
  try {
    const response = await fetch('/api/generate-paper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-school-token': schoolLicense
      },
      body: JSON.stringify({
        provider: providerChoice || getStoredProvider(),
        model: modelChoice || getStoredModel(),
        subject,
        classLevel,
        chapters,
        difficulty,
        targetMarks,
        typeBreakdown,
        specialInstructions
      })
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok && result.success && Array.isArray(result.questions)) {
      return result.questions;
    }

    if (result && result.error) {
      throw new Error(result.error);
    }

    if (!response.ok) {
      throw new Error(`Server returned error status ${response.status}`);
    }
  } catch (serverErr) {
    // If it's a server-side error or validation error, re-throw it so the user sees the real message!
    if (serverErr && serverErr.message && !serverErr.message.includes('Failed to fetch')) {
      throw serverErr;
    }

    console.warn('Backend proxy network connection failed. Checking standalone client fallback...', serverErr.message);
  }

  // 2. FALLBACK STANDALONE PATH: If backend proxy is not accessible, use local key
  const key = apiKey || getStoredApiKey();
  if (!key) {
    throw new Error('Enterprise Security Proxy is not reachable and no direct API key is configured. Please verify your school license or enter an API key.');
  }

  const provider = providerChoice || getStoredProvider();
  const model = modelChoice || getStoredModel();
  const chapterList = chapters.map(c => typeof c === 'string' ? c : c.title).join(', ');

  const objectiveTypes = ['mcq', 'fillups', 'true_false', 'matching'];
  const descriptiveTypes = ['vsa', 'sa', 'la'];

  const objectiveItems = [];
  const descriptiveItems = [];

  let objCount = 0;
  let descCount = 0;

  Object.entries(typeBreakdown).forEach(([type, cfg]) => {
    if (cfg && cfg.count > 0) {
      const line = `- Exactly ${cfg.count} ${type.toUpperCase()} question(s) [${cfg.marks} mark(s) each]`;
      if (objectiveTypes.includes(type)) {
        objectiveItems.push(line);
        objCount += cfg.count;
      } else {
        descriptiveItems.push(line);
        descCount += cfg.count;
      }
    }
  });

  const totalQuestions = objCount + descCount;
  let allQuestions = [];

  if (totalQuestions > 14 && objectiveItems.length > 0 && descriptiveItems.length > 0) {
    const [objResults, descResults] = await Promise.all([
      executeBatchDirect({
        key,
        provider,
        model,
        subject,
        classLevel,
        chapterList,
        difficulty,
        batchName: 'Section A: Objective Questions',
        batchItems: objectiveItems,
        specialInstructions
      }),
      executeBatchDirect({
        key,
        provider,
        model,
        subject,
        classLevel,
        chapterList,
        difficulty,
        batchName: 'Section B: Descriptive & Long Answer Questions',
        batchItems: descriptiveItems,
        specialInstructions
      })
    ]);

    allQuestions = [...objResults, ...descResults];
  } else {
    const allItems = [...objectiveItems, ...descriptiveItems];
    allQuestions = await executeBatchDirect({
      key,
      provider,
      model,
      subject,
      classLevel,
      chapterList,
      difficulty,
      batchName: 'Examination Questions',
      batchItems: allItems,
      specialInstructions
    });
  }

  return allQuestions.map((q, idx) => ({
    ...q,
    id: `ai-gen-${Date.now()}-${idx + 1}`,
    marks: Number(q.marks) || (q.type === 'la' ? 5 : q.type === 'sa' ? 3 : q.type === 'vsa' ? 2 : q.type === 'matching' ? 4 : 1),
    answerLinesCount: Number(q.answerLinesCount) || (q.type === 'la' ? 12 : q.type === 'sa' ? 6 : q.type === 'vsa' ? 3 : 1)
  }));
}
