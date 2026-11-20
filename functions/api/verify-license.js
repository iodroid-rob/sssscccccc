import { validateSchoolLicense, jsonResponse } from './_security.js';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json().catch(() => ({}));
    const { licenseToken } = body;

    if (!licenseToken) {
      return jsonResponse({ success: false, error: 'License token is required' }, 400);
    }

    const allowedTokens = env.ALLOWED_SCHOOL_TOKENS || env.ALLOWED_SCHOOL_TOK || '';
    const school = validateSchoolLicense(licenseToken, allowedTokens);
    if (!school) {
      return jsonResponse({
        success: false,
        error: 'Invalid or expired School License Key. Contact administrator for license activation.'
      }, 401);
    }

    return jsonResponse({
      success: true,
      school: {
        name: school.name,
        tier: school.tier,
        validUntil: school.validUntil,
        token: school.token
      }
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
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
