// netlify/functions/groq.js
// Proxies requests to the Groq API, keeping the API key server-side.

export default async (req) => {
  const url = new URL(req.url);
  const targetPath = url.pathname.replace("/.netlify/functions/groq", "");
  const targetUrl = `https://api.groq.com${targetPath}${url.search}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.VITE_GROQ_KEY}`,
    },
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  const data = await response.text();

  return new Response(data, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  });
};

export const config = { path: "/api/groq/*" };
