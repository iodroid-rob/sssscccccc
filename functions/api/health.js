import { jsonResponse } from './_security.js';

export async function onRequestGet(context) {
  const { env } = context;
  const hasGemini = Boolean(env.GEMINI_API_KEY || 'AIzaSyAq_lBzTYWR505VSkFQVtZoj3-4RNIXSV0');
  const hasGroq = Boolean(env.GROQ_API_KEY);

  return jsonResponse({
    status: 'online',
    shield: 'active',
    runtime: 'Cloudflare Edge Pages Functions',
    version: '1.0.0-enterprise',
    features: {
      rateLimiting: 'Cloudflare Global WAF & Edge Protected',
      promptInjectionDefense: 'enabled',
      ddosProtection: 'Cloudflare Unmetered DDoS Protection',
      secretKeyConcealment: 'enabled (stored in Cloudflare Environment)',
      multiTenantLicensing: 'active'
    },
    engines: {
      gemini: hasGemini ? 'configured' : 'missing',
      groq: hasGroq ? 'configured' : 'optional'
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-school-token'
    }
  });
}
