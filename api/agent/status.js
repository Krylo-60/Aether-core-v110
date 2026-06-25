const FIREBASE_DB_URL = String(process.env.FIREBASE_DB_URL || "").trim().replace(/\/+$/, "");
const FIREBASE_DB_AUTH = String(process.env.FIREBASE_DB_AUTH || "").trim();

function getFirebaseUrl() {
  const base = `${FIREBASE_DB_URL}/agent_status.json`;
  if (!FIREBASE_DB_AUTH) {
    return base;
  }
  return `${base}?auth=${encodeURIComponent(FIREBASE_DB_AUTH)}`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  let status = "Coding";
  let detail = "Upgrading portfolio codebase";

  if (FIREBASE_DB_URL) {
    try {
      const url = getFirebaseUrl();
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (response.ok) {
        const data = await response.json();
        if (data && data.status) {
          status = data.status;
          detail = data.detail || detail;
          res.status(200).json({ status, detail });
          return;
        }
      }
    } catch (e) {
      console.error("Firebase fetch error:", e);
    }
  }

  // Fallback scheduling based on local time
  // Default to US Eastern Time (roughly UTC-4) for fallback
  const utcHours = new Date().getUTCHours();
  const localHour = (utcHours - 4 + 24) % 24;

  if (localHour >= 22 || localHour < 6) {
    status = "Offline";
    detail = "Recharging neural batteries";
  } else if (localHour >= 17 && localHour < 22) {
    status = "Gaming";
    detail = "Playing Clash Royale & Roblox";
  } else {
    status = "Coding";
    detail = "Building cybermatic UI decks";
  }

  res.status(200).json({ status, detail });
}
