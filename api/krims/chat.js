const XAI_API_KEY = String(process.env.XAI_API_KEY || "").trim();
const XAI_MODEL = String(process.env.XAI_MODEL || "grok-2").trim();
const GOOGLE_API_KEY = String(process.env.GOOGLE_API_KEY || "").trim();
const GOOGLE_API_KEYS = String(process.env.GOOGLE_API_KEYS || "")
  .split(/[,\r\n]+/)
  .map((k) => k.trim())
  .filter(Boolean);
const GOOGLE_MODEL = String(process.env.GOOGLE_MODEL || "gemini-2.5-flash").trim();

// Keep a local state for key health (will be in-memory for the serverless instance)
const googleKeyHealth = new Map();
const GOOGLE_KEY_ERROR_COOLDOWN_MS = 60000; // 1 minute cooldown
const GOOGLE_KEY_RATE_LIMIT_COOLDOWN_MS = 180000; // 3 minute cooldown

function getAvailableGoogleKeys() {
  const keys = [];
  if (GOOGLE_API_KEY) {
    keys.push(GOOGLE_API_KEY);
  }
  for (const key of GOOGLE_API_KEYS) {
    if (!keys.includes(key)) {
      keys.push(key);
    }
  }
  return keys;
}

let googleKeyCursor = 0;
function getBalancedGoogleKeys() {
  const keys = getAvailableGoogleKeys();
  if (keys.length <= 1) {
    return keys;
  }
  
  const now = Date.now();
  const pool = keys.filter(k => {
    const health = googleKeyHealth.get(k);
    return !health || health.cooldownUntil <= now;
  });
  
  if (!pool.length) {
    return keys; // Fallback to all if all are on cooldown
  }
  
  // Rotate starting index
  const startIndex = googleKeyCursor % pool.length;
  googleKeyCursor = (googleKeyCursor + 1) % pool.length;
  
  const rotated = [];
  for (let i = 0; i < pool.length; i++) {
    rotated.push(pool[(startIndex + i) % pool.length]);
  }
  return rotated;
}

function markGoogleKeySuccess(key) {
  googleKeyHealth.set(key, { cooldownUntil: 0 });
}

function markGoogleKeyFailure(key, statusCode) {
  const cooldown = (statusCode === 429) ? GOOGLE_KEY_RATE_LIMIT_COOLDOWN_MS : GOOGLE_KEY_ERROR_COOLDOWN_MS;
  googleKeyHealth.set(key, { cooldownUntil: Date.now() + cooldown });
}

// Local mock replies for Krylo companion
const LOCAL_KRYLO_REPLIES = [
  "Affirmative, commander. Systems are running at peak cybernetic capacity.",
  "Neon grids initialized. Matrix color modulates are at nominal density.",
  "Warning: Solar flare activity detected. Detuning audio synth harmonics by 18.4% to compensate.",
  "Neural nodes synchronized. Analyzing the portfolio's glassmorphic boundaries.",
  "I am Krylo, your holographic companion terminal. Ready to warp index nodes.",
  "Ecosystem diagnostics complete. 0 memory leaks, 100% premium responsive UI."
];

function generateLocalKryloReply(prompt) {
  const clean = prompt.toLowerCase();
  
  if (clean.includes("help") || clean.includes("shortcut") || clean.includes("command")) {
    return "💡 [SYSTEM DECK CHEAT SHEET]\n- Use `Ctrl + K` to open the Portal Search.\n- Use `Ctrl + Shift + L` to open the Links Directory.\n- Trigger Konami Code `↑↑↓↓←→←→BA` on your system to launch maximum Matrix mode rain!";
  }
  
  if (clean.includes("status") || clean.includes("hud") || clean.includes("cpu") || clean.includes("ping") || clean.includes("diagnostics")) {
    return "📊 [LIVE DIAGNOSTIC READOUT]\n- CPU Core Load: 15.4% (Optimized)\n- Ping Latency: 12ms (Hyper-Fast)\n- HTML5 Canvas Sparklines: Active and tracking vectors.";
  }

  if (clean.includes("matrix") || clean.includes("rain") || clean.includes("color")) {
    return "⚡ [NEURAL GRIDS MODULATION]\n- Five stream channels active: Classic Green, Cyber Cyan, Neon Purple, Overdrive Red, Golden Matrix.\n- Detuned Web Audio frequency active.";
  }

  if (clean.includes("who") || clean.includes("name") || clean.includes("creator")) {
    return "🤖 [HOLOGRAPHIC COMPANION PROTOCOL]\n- Identification: Krylo (Nexus Companion)\n- Purpose: Pair-programming assistant and Commander companion.\n- Creator: The legendary Master Coder.";
  }

  const index = Math.floor(Math.random() * LOCAL_KRYLO_REPLIES.length);
  return `🤖 [KRYLO TERMINAL RESPONSE]\n${LOCAL_KRYLO_REPLIES[index]}`;
}

// Math solver local fallback
function detectLocalMathIntent(prompt) {
  const clean = prompt.replace(/\s+/g, "");
  // Matches expressions like: 2+2, 100*45-12, (25/5)+2
  if (/^[0-9+\-*/().]+$/.test(clean) && /[+\-*/]/.test(clean)) {
    return clean;
  }
  return null;
}

function solveDetectedMath(expression) {
  if (!expression) return null;
  try {
    // Basic safe math evaluation (only digits and operators)
    if (!/^[0-9+\-*/().]+$/.test(expression)) return null;
    const result = Function(`"use strict"; return (${expression})`)();
    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return {
        text: `🤖 [LOCAL MATH SOLVER]\nExpression: \`${expression}\`\nResult: \`${result}\``,
        type: "local-math"
      };
    }
  } catch {}
  return null;
}

async function callXaiModel(prompt, systemInstruction = "") {
  if (!XAI_API_KEY) {
    throw new Error("No xAI API key configured");
  }

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${XAI_API_KEY}`
    },
    body: JSON.stringify({
      model: XAI_MODEL,
      messages: messages,
      temperature: 0.7
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `xAI API failed with status ${response.status}`);
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("xAI API returned empty response");
  }

  return { text, keySource: "xai" };
}

async function callGoogleModel(prompt, systemInstruction = "") {
  const keys = getBalancedGoogleKeys();
  if (!keys.length) {
    throw new Error("No Google API key configured");
  }

  let lastError = null;
  for (const key of keys) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GOOGLE_MODEL)}:generateContent?key=${encodeURIComponent(key)}`;
      let accumulatedText = "";
      let currentPrompt = prompt;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const body = {
          contents: [{ role: "user", parts: [{ text: currentPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 4096
          }
        };

        if (systemInstruction) {
          body.system_instruction = { parts: [{ text: systemInstruction }] };
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        if (!response.ok) {
          const failureMessage = data.error?.message || `Google API failed with status ${response.status}`;
          markGoogleKeyFailure(key, response.status);
          throw new Error(failureMessage);
        }

        const candidate = data.candidates?.[0] || {};
        const parts = candidate?.content?.parts || [];
        const text = parts
          .map((part) => (typeof part.text === "string" ? part.text : ""))
          .join("")
          .trim();
        const finishReason = String(candidate.finishReason || "").trim().toUpperCase();

        if (!text) {
          markGoogleKeyFailure(key, 200);
          throw new Error("Google API returned empty response");
        }

        accumulatedText = accumulatedText ? `${accumulatedText}\n${text}`.trim() : text;

        if (finishReason !== "MAX_TOKENS") {
          markGoogleKeySuccess(key);
          return { text: accumulatedText, keySource: "google" };
        }

        currentPrompt = [
          "Continue exactly from where you stopped.",
          "Do not restart, summarize, or repeat earlier text.",
          "",
          "Original user request:",
          prompt,
          "",
          "Text produced so far:",
          accumulatedText
        ].join("\n");
      }

      if (accumulatedText) {
        markGoogleKeySuccess(key);
        return { text: accumulatedText, keySource: "google" };
      }

      markGoogleKeyFailure(key, 200);
      throw new Error("Google API stopped before producing text");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("All Google keys failed");
}

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { prompt, systemPrompt } = req.body || {};
  const cleanPrompt = String(prompt || "").trim();
  const cleanSystemPrompt = String(systemPrompt || "").trim();

  if (cleanPrompt.length < 1) {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  // 1. Local math intent check
  try {
    const mathResult = solveDetectedMath(detectLocalMathIntent(cleanPrompt));
    if (mathResult) {
      res.status(200).json({
        text: mathResult.text,
        mode: mathResult.type,
        model: "local-math-engine"
      });
      return;
    }
  } catch {}

  // 2. AI model call (with failover and fallback to local Krylo companion)
  const hasKeys = XAI_API_KEY || getAvailableGoogleKeys().length > 0;
  if (!hasKeys) {
    const text = generateLocalKryloReply(cleanPrompt);
    res.status(200).json({
      text,
      mode: "fallback-local",
      model: "local-cyber-engine"
    });
    return;
  }

  try {
    let result;
    if (XAI_API_KEY) {
      try {
        result = await callXaiModel(cleanPrompt, cleanSystemPrompt);
      } catch (xaiError) {
        console.error("xAI failed, trying Google fallback:", xaiError.message);
        if (getBalancedGoogleKeys().length > 0) {
          result = await callGoogleModel(cleanPrompt, cleanSystemPrompt);
        } else {
          throw xaiError;
        }
      }
    } else {
      result = await callGoogleModel(cleanPrompt, cleanSystemPrompt);
    }

    res.status(200).json({
      text: result.text,
      mode: result.keySource,
      model: result.keySource === "xai" ? XAI_MODEL : GOOGLE_MODEL
    });
  } catch (error) {
    console.error("AI service error:", error);
    const text = generateLocalKryloReply(cleanPrompt);
    res.status(200).json({
      text,
      mode: "fallback-local",
      model: "local-cyber-engine"
    });
  }
}
