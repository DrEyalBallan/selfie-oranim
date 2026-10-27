/**
 * Cloudflare Pages Function – /api/selfie
 * שומר ומסנכרן את שאלוני SELFIE 2.0 בענן (Cloudflare KV) לפי מזהה משיב מזווג (ParticipantHash + Pulse)
 */

const CORS_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  try {
    const kv = context.env.SELFIE_KV || context.env.PRIZMA_KV;
    if (!kv) {
      return new Response(JSON.stringify({ status: "local_only", submissions: [] }), {
        headers: CORS_HEADERS
      });
    }
    const raw = await kv.get("selfie2_submissions");
    const submissions = raw ? JSON.parse(raw) : [];
    return new Response(
      JSON.stringify({
        status: "ok",
        submissions,
        serverTime: new Date().toISOString()
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}

export async function onRequestPost(context) {
  try {
    const kv = context.env.SELFIE_KV || context.env.PRIZMA_KV;
    if (!kv) {
      return new Response(JSON.stringify({ status: "local_only" }), {
        headers: CORS_HEADERS
      });
    }

    const body = await context.request.json();
    const { action, submission } = body;

    if (action === "submit_reflection" && submission) {
      const raw = await kv.get("selfie2_submissions");
      const submissions = raw ? JSON.parse(raw) : [];

      const idx = submissions.findIndex(
        (s) => s.participantHash === submission.participantHash && s.pulse === submission.pulse
      );
      if (idx !== -1) {
        submissions[idx] = submission;
      } else {
        submissions.unshift(submission);
      }

      await kv.put("selfie2_submissions", JSON.stringify(submissions));
      return new Response(
        JSON.stringify({
          status: "ok",
          totalCount: submissions.length
        }),
        { headers: CORS_HEADERS }
      );
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}
