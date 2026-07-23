// Supabase Edge Function: notify-signup
//
// Fires when a row is inserted into public.user_approvals (i.e. a new user
// signed up). Sends an email to contactus@esgen.co.uk so staff know a new
// account is waiting for approval.
//
// Setup (Supabase Dashboard, no CLI needed):
//   1. Sign up at resend.com (free tier), grab an API key. To start sending
//      immediately without touching DNS, use the sender address
//      "onboarding@resend.dev" (works out of the box). Later, verify
//      esgen.co.uk in Resend (adds a couple of DNS records at names.co.uk)
//      to send from a proper @esgen.co.uk address.
//   2. Dashboard -> Edge Functions -> Create a new function -> name it
//      "notify-signup" -> paste this file's contents -> Deploy.
//   3. Dashboard -> Edge Functions -> notify-signup -> Secrets -> add a
//      secret: RESEND_API_KEY = <the key from step 1>.
//   4. Dashboard -> Database -> Webhooks -> Create a new webhook:
//        Table: user_approvals   Events: Insert
//        Type: Supabase Edge Functions   Function: notify-signup
//      (this webhook type auto-signs the request; no manual secret needed)

// deno-lint-ignore-file
// @ts-nocheck  -- Deno edge runtime; not part of the Next.js TypeScript project.

Deno.serve(async (req) => {
  try {
    var payload = await req.json();
    var row = payload.record || payload.new || {};
    var email = row.email || "unknown";
    var requestedAt = row.requested_at || new Date().toISOString();
    var apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, error: "RESEND_API_KEY not set" }), { status: 500 });
    }
    var subject = "New sign-up awaiting approval: " + email;
    var html = "<p>A new account has signed up and is waiting for approval.</p>" + "<p><b>Email:</b> " + email + "<br/><b>Requested:</b> " + requestedAt + "</p>" + "<p>Sign in at esgen.co.uk with an admin account, then go to Settings -> Sign-up approvals to approve or reject.</p>";
    var res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "ESGEN <onboarding@resend.dev>", to: ["contactus@esgen.co.uk"], subject: subject, html: html })
    });
    var body = await res.text();
    return new Response(JSON.stringify({ ok: res.ok, resend: body }), { status: res.ok ? 200 : 502 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});
