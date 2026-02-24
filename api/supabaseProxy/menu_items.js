export default async function handler(req, res) {
  try {
    const url = new URL(req.url, "https://dummy.com");
    const path = url.pathname.replace("/api/supabaseProxy/", "");
    const query = url.search;

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return res.status(500).json({ error: "Missing Supabase env vars" });
    }

    const target = `${SUPABASE_URL}/rest/v1/${path}${query}`;

    const response = await fetch(target, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}