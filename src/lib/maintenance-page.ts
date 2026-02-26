const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const renderMaintenancePage = (message: string) => {
  const safeMessage = escapeHtml(message);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>WebNest | Maintenance</title>
    <style>
      :root {
        --bg: #0a0f14;
        --panel: #121b24;
        --line: #27384a;
        --text: #f2f7fc;
        --muted: #9fb2c6;
        --accent: #0ea5e9;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background: radial-gradient(circle at top, #12263a, var(--bg) 55%);
        color: var(--text);
        display: grid;
        place-items: center;
        padding: 24px;
      }
      main {
        width: min(720px, 100%);
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
        border-radius: 16px;
        padding: 36px;
        text-align: center;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(28px, 5vw, 44px);
        letter-spacing: 0.02em;
      }
      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
        font-size: clamp(15px, 2.5vw, 18px);
      }
      .badge {
        display: inline-block;
        margin-bottom: 18px;
        padding: 8px 12px;
        border-radius: 999px;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        border: 1px solid rgba(14, 165, 233, 0.4);
        color: var(--accent);
      }
    </style>
  </head>
  <body>
    <main>
      <span class="badge">Maintenance</span>
      <h1>We will be back soon</h1>
      <p>${safeMessage}</p>
    </main>
  </body>
</html>`;
};
