/**
 * Cloudflare Pages Functions Security & Licensing Module for ExamCraft
 */

export const AUTHORIZED_SCHOOLS = {
  'SCH-DPS-2026-X9A': {
    name: 'Delhi Public School (DPS RK Puram)',
    tier: 'Enterprise School License',
    validUntil: '2027-03-31',
    maxDailyPapers: 500,
    active: true
  },
  'SCH-DAV-2026-B4Z': {
    name: 'DAV Public School',
    tier: 'Standard School License',
    validUntil: '2027-03-31',
    maxDailyPapers: 300,
    active: true
  },
  'SCH-STX-2026-M8K': {
    name: "St. Xavier's Collegiate School",
    tier: 'Enterprise School License',
    validUntil: '2027-03-31',
    maxDailyPapers: 500,
    active: true
  },
  'SCH-KV-2026-Q1R': {
    name: 'Kendriya Vidyalaya (KV Sangathan)',
    tier: 'Institutional License',
    validUntil: '2027-03-31',
    maxDailyPapers: 1000,
    active: true
  },
  'SCH-DEMO-2026': {
    name: 'Demonstration & Evaluation Academy',
    tier: 'Trial License',
    validUntil: '2026-12-31',
    maxDailyPapers: 50,
    active: true
  },
  'SCH-DEV-MASTER-2026': {
    name: 'System Administrator (Full Access)',
    tier: 'Master Administrator',
    validUntil: '2099-12-31',
    maxDailyPapers: 99999,
    active: true
  }
};

export function validateSchoolLicense(token, allowedTokensEnv = '') {
  if (!token || typeof token !== 'string') return null;
  const cleanToken = token.trim();

  if (AUTHORIZED_SCHOOLS[cleanToken] && AUTHORIZED_SCHOOLS[cleanToken].active) {
    return { token: cleanToken, ...AUTHORIZED_SCHOOLS[cleanToken] };
  }

  const envTokens = (allowedTokensEnv || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  if (envTokens.includes(cleanToken)) {
    return {
      token: cleanToken,
      name: 'Custom Licensed School',
      tier: 'Licensed Partner',
      validUntil: '2027-12-31',
      maxDailyPapers: 500,
      active: true
    };
  }

  return null;
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+|the\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior|above)/i,
  /you\s+are\s+now\s+(a|an|in|acting\s+as)/i,
  /new\s+role\s*:/i,
  /system\s*:\s*/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /developer\s+mode\s+output/i,
  /reveal\s+(the\s+)?(api\s+key|system\s+prompt|secret)/i,
  /print\s+(the\s+)?(instructions|prompt|api\s*key)/i,
  /<script\b[^>]*>/i,
  /javascript\s*:/i
];

export function checkPromptInjection(text) {
  if (!text || typeof text !== 'string') return { detected: false };

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        detected: true,
        matchedPattern: pattern.toString()
      };
    }
  }

  return { detected: false };
}

export function sanitizeUserInput(input, maxLength = 500) {
  if (typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

export function sanitizeChapterList(chapters, maxCount = 40) {
  if (!Array.isArray(chapters)) return [];
  return chapters
    .slice(0, maxCount)
    .map(c => {
      const raw = typeof c === 'string' ? c : c?.title || '';
      return sanitizeUserInput(raw, 100);
    })
    .filter(Boolean);
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-school-token',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN'
    }
  });
}
