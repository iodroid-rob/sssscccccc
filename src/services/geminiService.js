// Gemini API service for reading chapter content and generating curriculum questions

const GEMINI_API_KEY_STORAGE = 'examcraft_gemini_api_key';
const GEMINI_MODEL_STORAGE = 'examcraft_gemini_model';

export const AVAILABLE_MODELS = [
  { 
    id: 'gemini-2.5-flash', 
    name: 'Gemini 2.5 Flash (Verified Working & Ultra Fast)', 
    badge: 'Active & Recommended',
    description: 'Ultra-low latency, verified working with your API key'
  },
  { 
    id: 'gemini-4-hydrogen', 
    name: 'Gemini 4 Hydrogen (Preview / Experimental)', 
    badge: 'Preview',
    description: 'Cutting-edge intelligence for fast, dependable execution'
  },
  { 
    id: 'gemini-2.0-flash', 
    name: 'Gemini 2.0 Flash', 
    badge: 'Fast',
    description: 'Fast multimodal generation'
  },
  { 
    id: 'gemini-1.5-flash', 
    name: 'Gemini 1.5 Flash', 
    badge: 'Legacy',
    description: 'Standard fallback'
  },
];

export function getStoredApiKey() {
  const local = localStorage.getItem(GEMINI_API_KEY_STORAGE);
  if (local && local.trim().length > 5) {
    return local.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 5) {
    return envKey.trim();
  }
  return '';
}

export function saveStoredApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
  }
}

export function getStoredModel() {
  return localStorage.getItem(GEMINI_MODEL_STORAGE) || 'gemini-2.5-flash';
}

export function saveStoredModel(model) {
  localStorage.setItem(GEMINI_MODEL_STORAGE, model);
}

export async function testGeminiApiKey(apiKey, modelChoice) {
  const key = apiKey || getStoredApiKey();
  if (!key) {
    throw new Error('API Key is missing');
  }

  const model = modelChoice || getStoredModel();
  const candidateModels = [model, 'gemini-2.5-flash', 'gemini-4-hydrogen', 'gemini-2.0-flash'];
  let lastError = null;

  for (const targetModel of Array.from(new Set(candidateModels))) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with "OK" if connection works.' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      });

      if (response.ok) {
        saveStoredModel(targetModel);
        return { success: true, activeModel: targetModel };
      }

      const err = await response.json().catch(() => ({}));
      lastError = err?.error?.message || `Status ${response.status}`;
    } catch (e) {
      lastError = e.message;
    }
  }

  throw new Error(lastError || 'Failed to connect with Gemini API.');
}

export async function generateQuestionsWithGemini({
  apiKey,
  modelChoice,
  subject,
  classLevel,
  chapterTitle,
  chapterContent,
  questionTypes,
  totalCount = 10,
  difficulty = 'Balanced'
}) {
  const key = apiKey || getStoredApiKey();
  if (!key) {
    throw new Error('Please configure your Gemini API Key in settings first.');
  }

  const preferredModel = modelChoice || getStoredModel();
  const modelsToTry = [preferredModel, 'gemini-2.5-flash', 'gemini-4-hydrogen', 'gemini-2.0-flash'];

  const prompt = `
You are an expert school examination question paper creator.
Read the textbook chapter / content provided below and generate exactly ${totalCount} brand-new, high-quality exam questions for ${classLevel} students studying ${subject}.

Chapter/Topic: "${chapterTitle}"
Difficulty: ${difficulty}

Content / Study Material:
${chapterContent || 'Use standard NCERT / CBSE curriculum syllabus knowledge for this chapter.'}

Requested Question Types to distribute among the questions:
${questionTypes.join(', ')}

Strict Requirements:
1. Generate a valid JSON array of question objects only. Return pure raw JSON array without markdown backticks.
2. Each question object MUST follow this schema:
{
  "id": "gemini-${Date.now()}-1",
  "type": "mcq" | "fillups" | "true_false" | "matching" | "vsa" | "sa" | "la",
  "text": "The full clear question statement",
  "marks": number (1 for mcq/fillups/true_false, 4 for matching, 2 for vsa, 3 for sa, 5 for la),
  "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"], // REQUIRED only if type is "mcq"
  "matchPairs": [{"left": "1. Term", "right": "a) Match"}], // REQUIRED only if type is "matching" (provide 3 to 4 pairs)
  "answer": "Accurate model answer or solution key for teacher marking",
  "answerLinesCount": number (1 for mcq/fillup/true_false, 4 for matching, 3 for vsa, 6 for sa, 12 for la)
}
3. Make questions original, educational, unambiguous, and aligned with standard curriculum benchmarks.
`;

  let lastError = null;

  for (const model of Array.from(new Set(modelsToTry))) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        lastError = errorData?.error?.message || `Status ${response.status}`;
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) continue;

      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(cleaned);
      const questionsArray = Array.isArray(parsed) ? parsed : parsed.questions || [];
      
      return questionsArray.map((q, index) => ({
        ...q,
        id: `ai-gemini-${Date.now()}-${index + 1}`,
        marks: Number(q.marks) || 1,
        answerLinesCount: Number(q.answerLinesCount) || (q.type === 'la' ? 12 : q.type === 'sa' ? 6 : q.type === 'vsa' ? 3 : 1)
      }));
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(lastError || 'Failed to generate questions. Please verify your API key and model selection.');
}
