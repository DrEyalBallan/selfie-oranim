/**
 * Cloudflare Pages Function – /api/selfie
 * שומר, מנהל ומסנכרן את שאלוני SELFIE 2.0 בענן (Cloudflare KV)
 */

const CORS_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate"
};

const KV_KEY_SUBMISSIONS = "selfie2_submissions";
const KV_KEY_INCLUDE_DEMO = "selfie2_include_demo";

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  try {
    const kv = context.env.SELFIE_KV || context.env.PRIZMA_KV;
    if (!kv) {
      return new Response(
        JSON.stringify({
          status: "local_only",
          cloudConnected: false,
          submissions: [],
          includeDemo: true
        }),
        { headers: CORS_HEADERS }
      );
    }

    const [rawSubs, rawDemo] = await Promise.all([
      kv.get(KV_KEY_SUBMISSIONS),
      kv.get(KV_KEY_INCLUDE_DEMO)
    ]);

    const submissions = rawSubs ? JSON.parse(rawSubs) : [];
    const includeDemo = rawDemo !== null ? rawDemo === "true" : true;

    return new Response(
      JSON.stringify({
        status: "ok",
        cloudConnected: true,
        submissions,
        includeDemo,
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
      return new Response(
        JSON.stringify({ status: "local_only", cloudConnected: false }),
        { headers: CORS_HEADERS }
      );
    }

    const body = await context.request.json();
    const { action } = body;

    // 1. שמירת שאלון חדש או עדכון שאלון קיים של אותו משיב באותה פעימה
    if (action === "submit_reflection" && body.submission) {
      const submission = body.submission;
      const raw = await kv.get(KV_KEY_SUBMISSIONS);
      const submissions = raw ? JSON.parse(raw) : [];

      const isAnonymous = String(submission.participantHash || "").startsWith("anon_");
      const idx = isAnonymous
        ? submissions.findIndex((s) => s.id === submission.id)
        : submissions.findIndex(
            (s) => s.participantHash === submission.participantHash && s.pulse === submission.pulse
          );

      if (idx !== -1) {
        submissions[idx] = submission;
      } else {
        submissions.unshift(submission);
      }

      await kv.put(KV_KEY_SUBMISSIONS, JSON.stringify(submissions));
      return new Response(
        JSON.stringify({
          status: "ok",
          cloudConnected: true,
          submissions,
          totalCount: submissions.length
        }),
        { headers: CORS_HEADERS }
      );
    }

    // 2. מחיקת שאלון בודד מהענן
    if (action === "delete_submission" && body.id) {
      const raw = await kv.get(KV_KEY_SUBMISSIONS);
      const submissions = raw ? JSON.parse(raw) : [];
      const filtered = submissions.filter((s) => s.id !== body.id);
      await kv.put(KV_KEY_SUBMISSIONS, JSON.stringify(filtered));
      return new Response(
        JSON.stringify({
          status: "ok",
          cloudConnected: true,
          submissions: filtered,
          totalCount: filtered.length
        }),
        { headers: CORS_HEADERS }
      );
    }

    // 3. איפוס כל השאלונים האמיתיים בענן
    if (action === "clear_all_submissions") {
      await kv.put(KV_KEY_SUBMISSIONS, JSON.stringify([]));
      return new Response(
        JSON.stringify({
          status: "ok",
          cloudConnected: true,
          submissions: [],
          totalCount: 0
        }),
        { headers: CORS_HEADERS }
      );
    }

    // 4. שחזור מגיבוי JSON (החלפה או מיזוג)
    if (action === "restore_backup" && Array.isArray(body.submissions)) {
      const incoming = body.submissions;
      let finalSubs = [];
      if (body.mode === "replace") {
        finalSubs = incoming;
      } else {
        const raw = await kv.get(KV_KEY_SUBMISSIONS);
        const existing = raw ? JSON.parse(raw) : [];
        const map = new Map();
        existing.forEach((s) => map.set(s.id || `${s.participantHash}_${s.pulse}`, s));
        incoming.forEach((s) => map.set(s.id || `${s.participantHash}_${s.pulse}`, s));
        finalSubs = Array.from(map.values());
      }
      await kv.put(KV_KEY_SUBMISSIONS, JSON.stringify(finalSubs));
      return new Response(
        JSON.stringify({
          status: "ok",
          cloudConnected: true,
          submissions: finalSubs,
          totalCount: finalSubs.length
        }),
        { headers: CORS_HEADERS }
      );
    }

    // 5. הפעלה / כיבוי של הצגת נתוני ההדגמה (Demo Cohort) בדשבורד
    if (action === "set_demo_mode") {
      const includeDemo = Boolean(body.includeDemo);
      await kv.put(KV_KEY_INCLUDE_DEMO, includeDemo ? "true" : "false");
      return new Response(
        JSON.stringify({
          status: "ok",
          cloudConnected: true,
          includeDemo
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
