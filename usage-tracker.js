(() => {
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const blocked = new Set(["admin.private.html", "usage-admin.private.html"]);
  if (blocked.has(path)) return;

  function getSessionId() {
    const key = "krishiv_usage_session_v1";
    try {
      let id = String(localStorage.getItem(key) || "");
      if (!id) {
        id = "sess_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(key, id);
      }
      return id;
    } catch {
      return "sess_" + Math.random().toString(36).slice(2, 10);
    }
  }

  function post(eventName, pageName) {
    const params = new URLSearchParams({
      event: String(eventName || "event"),
      page: String(pageName || path || "index.html"),
      sessionId: getSessionId()
    });
    try {
      const img = new Image();
      img.src = "/api/usage/track?" + params.toString();
    } catch {}
  }

  window.trackUsage = (eventName, meta) => {
    const base = path || "index.html";
    const suffix = meta && typeof meta === "string" ? ":" + meta.slice(0, 80) : "";
    post(String(eventName || "event"), base + suffix);
  };

  post("page_view", path || "index.html");
})();
