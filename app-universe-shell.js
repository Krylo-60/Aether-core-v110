(() => {
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const BLOCKED_PATHS = new Set(["admin.private.html"]);
  if (BLOCKED_PATHS.has(path)) return;

  // Override global window.alert with a premium glassmorphic modal
  window.alert = function (message) {
    let overlay = document.getElementById("custom-cyber-alert-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "custom-cyber-alert-overlay";
      overlay.className = "custom-cyber-alert-overlay";
      
      const modal = document.createElement("div");
      modal.className = "custom-cyber-alert-modal";
      
      const header = document.createElement("div");
      header.className = "custom-cyber-alert-header";
      
      const badge = document.createElement("div");
      badge.className = "custom-cyber-alert-badge";
      badge.textContent = "SYSTEM DEPLOYMENT ALERT";
      
      const closeBtn = document.createElement("button");
      closeBtn.className = "custom-cyber-alert-close";
      closeBtn.innerHTML = "&times;";
      closeBtn.onclick = () => overlay.classList.remove("active");
      
      header.appendChild(badge);
      header.appendChild(closeBtn);
      
      const body = document.createElement("div");
      body.id = "custom-cyber-alert-body";
      body.className = "custom-cyber-alert-body";
      
      const footer = document.createElement("div");
      footer.className = "custom-cyber-alert-footer";
      
      const actionBtn = document.createElement("button");
      actionBtn.className = "custom-cyber-alert-btn";
      actionBtn.textContent = "ACKNOWLEDGE";
      actionBtn.onclick = () => overlay.classList.remove("active");
      
      footer.appendChild(actionBtn);
      
      modal.appendChild(header);
      modal.appendChild(body);
      modal.appendChild(footer);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    }
    
    const bodyEl = overlay.querySelector("#custom-cyber-alert-body");
    if (bodyEl) {
      bodyEl.textContent = String(message || "");
    }
    
    // Auto-focus the action button for keyboard accessibility
    const btn = overlay.querySelector(".custom-cyber-alert-btn");
    
    requestAnimationFrame(() => {
      overlay.classList.add("active");
      if (btn) btn.focus();
    });
  };

  const safeGet = (key, fallback = "") => {
    try {
      const value = localStorage.getItem(key);
      return value == null ? fallback : value;
    } catch {
      return fallback;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  };

  function getUsageSessionId() {
    const key = "krishiv_usage_session_v1";
    let value = "";
    try {
      value = String(safeGet(key, ""));
      if (!value) {
        value = "sess_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
        safeSet(key, value);
      }
    } catch {
      value = "sess_" + Math.random().toString(36).slice(2, 10);
    }
    return value;
  }

  function postUsage(eventName, pageName) {
    const params = new URLSearchParams({
      event: String(eventName || "event"),
      page: String(pageName || path || "unknown-page"),
      sessionId: getUsageSessionId()
    });
    try {
      const img = new Image();
      img.src = "/api/usage/track?" + params.toString();
    } catch {}
  }

  function installRuntimeGuard() {
    const seen = new Set();
    const toast = document.createElement("div");
    toast.className = "app-guard-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    let toastTimer = 0;

    function show(message, isError) {
      toast.textContent = message;
      toast.classList.toggle("is-error", Boolean(isError));
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
    }

    window.addEventListener("error", (event) => {
      const msg = String((event && event.message) || "Unknown script error");
      if (seen.has(msg)) return;
      seen.add(msg);
      show("Recovered from minor app issue. You can continue.", true);
    });

    window.addEventListener("unhandledrejection", () => {
      show("A background task failed. Try refresh if needed.", true);
    });

    window.safeNotify = (message) => show(String(message || ""), false);
  }
  installRuntimeGuard();

  function installImageGuard() {
    const images = Array.from(document.querySelectorAll("img"));
    images.forEach((img) => {
      const src = String(img.getAttribute("src") || "");
      if (!src || /placeholder|dummy|temp-image|coming-soon/i.test(src)) {
        img.setAttribute("src", "logo.svg");
      }
      img.addEventListener("error", () => {
        if (img.getAttribute("src") !== "logo.svg") {
          img.setAttribute("src", "logo.svg");
        }
      }, { once: true });
    });
  }
  installImageGuard();

  const APPS = [
    { name: "Home", href: "index.html", tag: "Navigation", tier: "featured" },
    { name: "All Links", href: "all-links.html", tag: "Navigation" },
    { name: "Release Notes", href: "release-notes.html", tag: "Navigation" },
    { name: "Contact", href: "contact.html", tag: "Navigation" },
    { name: "Projects", href: "projects.html", tag: "Navigation" },
    { name: "Games Hub", href: "games.html", tag: "Navigation" },
    { name: "Study Planner", href: "study-planner.html", tag: "Productivity", tier: "featured" },
    { name: "Quiz Zone", href: "quiz-zone.html", tag: "Learning" },
    { name: "Review App", href: "review-app.html", tag: "Feedback", tier: "featured" },
    { name: "Focus Timer", href: "focus-timer.html", tag: "Focus" },
    { name: "Habit Tracker", href: "habit-tracker.html", tag: "Discipline" },
    { name: "Idea Lab AI", href: "idea-lab-ai.html", tag: "AI", tier: "featured" },
    { name: "Expense Tracker", href: "expense-tracker.html", tag: "Finance" },
    { name: "Notes Vault", href: "notes-vault.html", tag: "Writing" },
    { name: "Flashcards", href: "flashcards.html", tag: "Memory" },
    { name: "Typing Test", href: "typing-test.html", tag: "Speed" },
    { name: "Task Kanban", href: "task-kanban.html", tag: "Workflow" },
    { name: "Unit Converter", href: "unit-converter.html", tag: "Utility" },
    { name: "Grade Calculator", href: "grade-calculator.html", tag: "Education" },
    { name: "Daily Journal", href: "daily-journal.html", tag: "Reflection" },
    { name: "Goal Planner", href: "goal-planner.html", tag: "Planning" },
    { name: "Reading Tracker", href: "reading-tracker.html", tag: "Learning" },
    { name: "Water Reminder", href: "water-reminder.html", tag: "Health" },
    { name: "Presentation Planner", href: "presentation-planner.html", tag: "School" },
    { name: "Code Snippets Vault", href: "code-snippets-vault.html", tag: "Developer" },
    { name: "Mind Map Board", href: "mind-map-board.html", tag: "Ideas" },
    { name: "BazaarBlitz Prime", href: "bazaar-blitz.html", tag: "Marketplace", tier: "featured" },
    { name: "VoteStorm Arena", href: "votestorm-arena.html", tag: "Community", tier: "featured" },
    { name: "Time Capsule Lab", href: "time-capsule-lab.html", tag: "Future" },
    { name: "StoryForge Studio", href: "storyforge-studio.html", tag: "Creative" },
    { name: "Meal Planner Pro", href: "meal-planner.html", tag: "Lifestyle" },
    { name: "Color Palette Lab", href: "color-palette-lab.html", tag: "Design" },
    { name: "Resume Studio Lite", href: "resume-studio.html", tag: "Career" },
    { name: "Budget Battle Sim", href: "budget-battle.html", tag: "Finance" },
    { name: "Games Hub", href: "games.html", tag: "Gaming" },
    { name: "Reaction Blitz", href: "reaction-blitz.html", tag: "Gaming" },
    { name: "Memory Matrix", href: "memory-matrix.html", tag: "Gaming" },
    { name: "Color Switch Rush", href: "color-switch-rush.html", tag: "Gaming" },
    { name: "Projects", href: "projects.html", tag: "Navigation" },
    { name: "Contact", href: "contact.html", tag: "Navigation" },
    { name: "Password Lab", href: "password-lab.html", tag: "Security" },
    { name: "BMI Health", href: "bmi-health.html", tag: "Health" },
    { name: "Random Picker", href: "random-picker.html", tag: "Utility" },
    { name: "All Links Directory", href: "all-links.html", tag: "Navigation", tier: "featured" },
    { name: "Release Notes", href: "release-notes.html", tag: "Updates", tier: "featured" },
    { name: "Phonk Room", href: "phonk-room.html", tag: "Music", tier: "featured" },
    { name: "Git Devlog", href: "changelog.html", tag: "Updates", tier: "featured" },
    { name: "Master Nexus", href: "krylo-blox-master-nexus.html", tag: "Core", tier: "featured" },
    { name: "Aether v110", href: "aether-core-v110.html", tag: "Core", tier: "featured" },
    { name: "Homework Hub", href: "homework-hub.html", tag: "App" },
    { name: "Attendance Tracker", href: "attendance-tracker.html", tag: "App" },
    { name: "Link Locker", href: "link-locker.html", tag: "App" },
    { name: "Habit Heatmap", href: "habit-heatmap.html", tag: "App" },
    { name: "Focus Music Deck", href: "focus-music-deck.html", tag: "App" },
    { name: "Thumbnail Idea Board", href: "thumbnail-idea-board.html", tag: "App" },
    { name: "Script Planner", href: "script-planner.html", tag: "App" },
    { name: "Upload Calendar", href: "upload-calendar.html", tag: "App" },
    { name: "Stream Overlay Kit", href: "stream-overlay-kit.html", tag: "App" },
    { name: "QR Generator Pro", href: "qr-generator-pro.html", tag: "App" },
    { name: "Pomodoro Duel", href: "pomodoro-duel.html", tag: "App" },
    { name: "Revision Race", href: "revision-race.html", tag: "App" },
    { name: "Scholarship Finder", href: "scholarship-finder.html", tag: "App" },
    { name: "Portfolio Asset Vault", href: "portfolio-asset-vault.html", tag: "App" },
    { name: "Poll Party", href: "poll-party.html", tag: "App" },
    { name: "Emoji Story Maker", href: "emoji-story-maker.html", tag: "App" },
    { name: "Team Splitter", href: "team-splitter.html", tag: "App" },
    { name: "Exam Countdown", href: "exam-countdown.html", tag: "App" },
    { name: "Screenshot Annotator", href: "screenshot-annotator.html", tag: "App" }
  ];

  const bonusApps = Array.isArray(window.KRISHIV_BONUS_APPS) ? window.KRISHIV_BONUS_APPS : [];
  bonusApps.forEach((item) => {
    const href = String((item && item.href) || "").trim();
    if (!href || APPS.some((existing) => existing.href === href)) return;
    APPS.push({
      name: item.name || href,
      href,
      tag: item.tag || "App",
      tier: item.tier || "live"
    });
  });

  const APP_ICONS = {
    "index.html": "logo.svg",
    "all-links.html": "logo.svg",
    "release-notes.html": "logo.svg",
    "phonk-room.html": "logo.svg",
    "changelog.html": "logo.svg",
    "contact.html": "app-icon-contact-page.svg",
    "projects.html": "app-icon-projects-page.svg",
    "games.html": "app-icon-games-hub.svg",
    "study-planner.html": "app-icon-study-planner.svg",
    "quiz-zone.html": "app-icon-quiz-zone.svg",
    "review-app.html": "app-icon-review-app.svg",
    "focus-timer.html": "app-icon-focus-timer.svg",
    "habit-tracker.html": "app-icon-habit-tracker.svg",
    "idea-lab-ai.html": "app-icon-idea-lab-ai.svg",
    "expense-tracker.html": "app-icon-expense-tracker.svg",
    "notes-vault.html": "app-icon-notes-vault.svg",
    "flashcards.html": "app-icon-flashcards.svg",
    "typing-test.html": "app-icon-typing-test.svg",
    "task-kanban.html": "app-icon-task-kanban.svg",
    "unit-converter.html": "app-icon-unit-converter.svg",
    "grade-calculator.html": "app-icon-grade-calculator.svg",
    "daily-journal.html": "app-icon-daily-journal.svg",
    "goal-planner.html": "app-icon-goal-planner.svg",
    "reading-tracker.html": "app-icon-reading-tracker.svg",
    "water-reminder.html": "app-icon-water-reminder.svg",
    "presentation-planner.html": "app-icon-presentation-planner.svg",
    "code-snippets-vault.html": "app-icon-code-snippets.svg",
    "mind-map-board.html": "app-icon-mind-map.svg",
    "bazaar-blitz.html": "app-icon-bazaar-blitz.svg",
    "votestorm-arena.html": "app-icon-votestorm.svg",
    "time-capsule-lab.html": "app-icon-time-capsule.svg",
    "storyforge-studio.html": "app-icon-storyforge.svg",
    "meal-planner.html": "app-icon-meal-planner.svg",
    "color-palette-lab.html": "app-icon-color-palette-lab.svg",
    "resume-studio.html": "app-icon-resume-studio.svg",
    "budget-battle.html": "app-icon-budget-battle.svg",
    "games.html": "app-icon-games-hub.svg",
    "reaction-blitz.html": "app-icon-reaction-blitz.svg",
    "memory-matrix.html": "app-icon-memory-matrix.svg",
    "color-switch-rush.html": "app-icon-color-switch-rush.svg",
    "projects.html": "app-icon-projects-page.svg",
    "contact.html": "app-icon-contact-page.svg",
    "password-lab.html": "app-icon-password-lab.svg",
    "bmi-health.html": "app-icon-bmi-health.svg",
    "random-picker.html": "app-icon-random-picker.svg",
    "all-links.html": "app-icon-all-links.svg",
    "release-notes.html": "logo.svg",
    "krylo-blox-master-nexus.html": "core-icon-master-nexus.svg",
    "aether-core-v110.html": "core-icon-aether-v110.svg",
    "homework-hub.html": "app-icon-homework-hub.svg",
    "attendance-tracker.html": "app-icon-attendance-tracker.svg",
    "link-locker.html": "app-icon-link-locker.svg",
    "habit-heatmap.html": "app-icon-habit-heatmap.svg",
    "focus-music-deck.html": "app-icon-focus-music-deck.svg",
    "thumbnail-idea-board.html": "app-icon-thumbnail-idea-board.svg",
    "script-planner.html": "app-icon-script-planner.svg",
    "upload-calendar.html": "app-icon-upload-calendar.svg",
    "stream-overlay-kit.html": "app-icon-stream-overlay-kit.svg",
    "qr-generator-pro.html": "app-icon-qr-generator-pro.svg",
    "pomodoro-duel.html": "app-icon-pomodoro-duel.svg",
    "revision-race.html": "app-icon-revision-race.svg",
    "scholarship-finder.html": "app-icon-scholarship-finder.svg",
    "portfolio-asset-vault.html": "app-icon-portfolio-asset-vault.svg",
    "poll-party.html": "app-icon-poll-party.svg",
    "emoji-story-maker.html": "app-icon-emoji-story-maker.svg",
    "team-splitter.html": "app-icon-team-splitter.svg",
    "exam-countdown.html": "app-icon-exam-countdown.svg",
    "screenshot-annotator.html": "app-icon-screenshot-annotator.svg"
  };

  bonusApps.forEach((item) => {
    const href = String((item && item.href) || "").trim();
    const icon = String((item && item.icon) || "").trim();
    if (href && icon && !APP_ICONS[href]) {
      APP_ICONS[href] = icon;
    }
  });

  const THEME_KEY = "krishiv_theme_mode_v1";
  const FAV_KEY = "krishiv_app_favorites_v1";
  const RECENT_KEY = "krishiv_app_recents_v1";
  const STATS_KEY = "krishiv_app_launch_stats_v1";
  const APP_NOTE_PREFIX = "krishiv_app_note_";
  const PROFILE_KEY = "krishiv_app_profiles_v1";
  const DAILY_KEY = "krishiv_app_daily_v1";
  const THEMES = [
    { key: "default", label: "Aurora" },
    { key: "neon", label: "Neon" },
    { key: "solar", label: "Solar" }
  ];

  function applyTheme(key) {
    const chosen = THEMES.find((item) => item.key === key) || THEMES[0];
    document.body.setAttribute("data-theme", chosen.key);
    document.documentElement.setAttribute("data-theme", chosen.key);
    document.body.classList.add("app-theme-root");
    return chosen;
  }

  let activeTheme = safeGet(THEME_KEY, "default");
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY && event.newValue) {
      activeTheme = event.newValue;
      applyTheme(activeTheme);
      refreshButtons();
    }
  });
  let favorites = [];
  let recents = [];
  let stats = {};
  let appProfiles = {};
  let appDaily = {};
  try {
    favorites = JSON.parse(safeGet(FAV_KEY, "[]"));
    if (!Array.isArray(favorites)) favorites = [];
  } catch {
    favorites = [];
  }
  try {
    recents = JSON.parse(safeGet(RECENT_KEY, "[]"));
    if (!Array.isArray(recents)) recents = [];
  } catch {
    recents = [];
  }
  try {
    stats = JSON.parse(safeGet(STATS_KEY, "{}"));
    if (!stats || typeof stats !== "object") stats = {};
  } catch {
    stats = {};
  }
  try {
    appProfiles = JSON.parse(safeGet(PROFILE_KEY, "{}"));
    if (!appProfiles || typeof appProfiles !== "object") appProfiles = {};
  } catch {
    appProfiles = {};
  }
  try {
    appDaily = JSON.parse(safeGet(DAILY_KEY, "{}"));
    if (!appDaily || typeof appDaily !== "object") appDaily = {};
  } catch {
    appDaily = {};
  }

  applyTheme(activeTheme);
  document.body.setAttribute("data-mode", "dark");
  document.documentElement.setAttribute("data-mode", "dark");
  document.body.classList.add("app-theme-root");


  function getDayStamp(date = new Date()) {
    return date.toLocaleDateString("en-CA");
  }

  function getPreviousDayStamp(dayStamp) {
    if (!dayStamp) return "";
    const date = new Date(dayStamp + "T00:00:00");
    date.setDate(date.getDate() - 1);
    return getDayStamp(date);
  }

  function trackCurrentAppLaunch() {
    if (!path || path === "index.html" || path === "admin.private.html") return;
    stats[path] = Number(stats[path] || 0) + 1;
    safeSet(STATS_KEY, JSON.stringify(stats));
    recents = [path, ...recents.filter((item) => item !== path)].slice(0, 8);
    safeSet(RECENT_KEY, JSON.stringify(recents));
    const today = getDayStamp();
    const existingDaily = appDaily[path] || { streak: 0, totalDays: 0, lastDate: "" };
    if (existingDaily.lastDate !== today) {
      const wasYesterday = existingDaily.lastDate === getPreviousDayStamp(today);
      existingDaily.streak = wasYesterday ? Number(existingDaily.streak || 0) + 1 : 1;
      existingDaily.totalDays = Number(existingDaily.totalDays || 0) + 1;
      existingDaily.lastDate = today;
      appDaily[path] = existingDaily;
      safeSet(DAILY_KEY, JSON.stringify(appDaily));
    }
    const existingProfile = appProfiles[path] || { stage: "Building", progress: 35 };
    appProfiles[path] = {
      stage: existingProfile.stage || "Building",
      progress: Number(existingProfile.progress || 35),
      lastOpened: new Date().toISOString()
    };
    safeSet(PROFILE_KEY, JSON.stringify(appProfiles));
    postUsage("page_view", path);
    postUsage("app_open", path);
  }
  trackCurrentAppLaunch();

  const dock = document.createElement("div");
  dock.className = "app-shell-dock";
  dock.innerHTML = `
    <button type="button" class="app-shell-btn" id="shellTopBtn">Top</button>
    <button type="button" class="app-shell-btn" id="shellHomeBtn">Home</button>
    <button type="button" class="app-shell-btn" id="shellAppsBtn">Apps <span class="app-shell-pill" style="font-size: 9px; opacity: 0.8; margin-left: 4px; border: 1px solid rgba(120, 178, 255, 0.25); border-radius: 4px; padding: 1px 3px;">Ctrl+K</span></button>
    <button type="button" class="app-shell-btn" id="shellThemeBtn">Theme</button>
    <button type="button" class="app-shell-btn" id="shellMusicBtn">🎵 Synth</button>
    <button type="button" class="app-shell-btn" id="shellHudBtn">📊 HUD</button>
  `;

  // 🎵 Web Audio Procedural Synth Core Engine
  let audioCtx = null;
  let synthIsPlaying = false;
  let activePreset = "aurora";
  let masterGain = null;
  let synthLoopTimer = null;
  let synthOscillators = [];
  let currentVolume = 0.5;
  let crownAudio = null;
  let synthAnalyser = null;
  let visualizerAnimId = null;
  let crownMediaSource = null;

  const CHORDS = {
    aurora: [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [196.00, 246.94, 293.66, 392.00]  // G6
    ],
    drone: [
      [65.41, 130.81, 196.00], // Low C
      [58.27, 116.54, 174.61], // Low Bb
      [73.42, 146.83, 220.00]  // Low D
    ]
  };

  let chordIndex = 0;

  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    window.audioCtx = audioCtx;
    masterGain = audioCtx.createGain();
    masterGain.gain.value = currentVolume;
    
    synthAnalyser = audioCtx.createAnalyser();
    synthAnalyser.fftSize = 64;
    synthAnalyser.smoothingTimeConstant = 0.8;
    
    masterGain.connect(synthAnalyser);
    synthAnalyser.connect(audioCtx.destination);
    
    startVisualizer();
  }
  window.initAudio = initAudio;
  
  function startVisualizer() {
    const canvas = document.getElementById("synthVisualizer");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const bufferLength = synthAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function draw() {
      visualizerAnimId = requestAnimationFrame(draw);
      
      if (!synthIsPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      
      synthAnalyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;
      
      for(let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        const hue = i * (360 / bufferLength) + Date.now() / 20;
        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    }
    draw();
  }

  function playSynthPreset() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();

    stopOscillators();

    if (activePreset === "crown") {
      if (!crownAudio) {
        crownAudio = new Audio("better_from_the_crown.mp3");
        crownAudio.loop = true;
        crownAudio.crossOrigin = "anonymous";
        if (audioCtx) {
           crownMediaSource = audioCtx.createMediaElementSource(crownAudio);
           crownMediaSource.connect(masterGain);
        }
      }
      crownAudio.volume = currentVolume;
      crownAudio.play().catch(err => console.log("Crown track play deferred:", err));
      return;
    }

    if (activePreset === "aurora" || activePreset === "drone") {
      const chords = CHORDS[activePreset];
      const frequencies = chords[chordIndex % chords.length];
      chordIndex++;

      frequencies.forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const oscGain = audioCtx.createGain();

        osc.type = activePreset === "drone" ? "sine" : "triangle";
        osc.frequency.value = freq + (Math.random() * 0.5 - 0.25);
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(freq * 3, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 3.5);

        oscGain.gain.setValueAtTime(0, audioCtx.currentTime);
        oscGain.gain.linearRampToValueAtTime(activePreset === "drone" ? 0.25 : 0.15, audioCtx.currentTime + 1.5);
        oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.5);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        osc.stop(audioCtx.currentTime + 4.8);

        synthOscillators.push(osc);
      });

      synthLoopTimer = setTimeout(playSynthPreset, 4500);

    } else if (activePreset === "rain") {
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const rainFilter = audioCtx.createBiquadFilter();
      rainFilter.type = "bandpass";
      rainFilter.frequency.setValueAtTime(800, audioCtx.currentTime);
      
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 350;

      lfo.connect(lfoGain);
      lfoGain.connect(rainFilter.frequency);
      lfo.start();

      const rainGain = audioCtx.createGain();
      rainGain.gain.setValueAtTime(0, audioCtx.currentTime);
      rainGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 2.0);

      noise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(masterGain);

      noise.start();
      
      function scheduleBellPluck() {
        if (!synthIsPlaying || activePreset !== "rain") return;
        
        const bellOsc = audioCtx.createOscillator();
        const bellGain = audioCtx.createGain();
        
        bellOsc.type = "sine";
        const notes = [587.33, 698.46, 880.00, 1046.50, 1318.51];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        bellOsc.frequency.value = randomNote;

        bellGain.gain.setValueAtTime(0, audioCtx.currentTime);
        bellGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.02);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.2);

        bellOsc.connect(bellGain);
        bellGain.connect(masterGain);
        
        bellOsc.start();
        bellOsc.stop(audioCtx.currentTime + 2.5);
        
        synthOscillators.push(bellOsc);
        synthLoopTimer = setTimeout(scheduleBellPluck, 2000 + Math.random() * 3000);
      }
      
      scheduleBellPluck();
      synthOscillators.push(noise, lfo);
    }
  }

  function stopOscillators() {
    clearTimeout(synthLoopTimer);
    synthOscillators.forEach((osc) => {
      try { osc.stop(); } catch {}
      try { osc.disconnect(); } catch {}
    });
    synthOscillators = [];
    if (crownAudio) {
      try { crownAudio.pause(); } catch {}
    }
  }

  function stopSynth() {
    stopOscillators();
    synthIsPlaying = false;
  }

  // Inject floating control card
  const synthDeck = document.createElement("div");
  synthDeck.className = "app-shell-synth-deck";
  synthDeck.innerHTML = `
    <div class="synth-deck-header">
      <strong>🎵 Cyber Synth Deck</strong>
      <span class="synth-preset-tag" id="synthPresetTag">Aurora Pad</span>
    </div>
    <div class="synth-deck-controls">
      <button type="button" class="synth-control-btn" id="synthPlayBtn">▶ Play</button>
      <canvas id="synthVisualizer" width="120" height="30" class="synth-visualizer-canvas"></canvas>
      <div class="synth-volume-container">
        <span>🔊</span>
        <input type="range" id="synthVolRange" min="0" max="1" step="0.05" value="0.5" />
      </div>
    </div>
    <div class="synth-deck-presets">
      <button type="button" class="synth-preset-btn active" data-preset="aurora">Aurora Pad</button>
      <button type="button" class="synth-preset-btn" data-preset="rain">Cyber Rain</button>
      <button type="button" class="synth-preset-btn" data-preset="drone">Space Drone</button>
      <button type="button" class="synth-preset-btn" data-preset="crown" style="border-color:#ffd700 !important; color:#ffd700 !important;">👑 Crown Track</button>
    </div>
  `;
  document.body.appendChild(synthDeck);

  const shellMusicBtn = dock.querySelector("#shellMusicBtn");
  const synthPlayBtn = synthDeck.querySelector("#synthPlayBtn");
  const synthVolRange = synthDeck.querySelector("#synthVolRange");
  const synthPresetTag = synthDeck.querySelector("#synthPresetTag");
  const presetButtons = synthDeck.querySelectorAll(".synth-preset-btn");

  shellMusicBtn.addEventListener("click", () => {
    synthDeck.classList.toggle("is-visible");
  });

  function updateSynthUI() {
    if (synthIsPlaying) {
      synthPlayBtn.textContent = "⏸ Pause";
      synthPlayBtn.classList.add("playing");
      shellMusicBtn.classList.add("playing");
      shellMusicBtn.innerHTML = "🎵 playing...";
    } else {
      synthPlayBtn.textContent = "▶ Play";
      synthPlayBtn.classList.remove("playing");
      shellMusicBtn.classList.remove("playing");
      shellMusicBtn.innerHTML = "🎵 Synth";
    }
    const currentActiveBtn = Array.from(presetButtons).find(btn => btn.getAttribute("data-preset") === activePreset);
    if (currentActiveBtn) {
      synthPresetTag.textContent = currentActiveBtn.textContent;
    }
  }

  synthPlayBtn.addEventListener("click", () => {
    initAudio();
    if (synthIsPlaying) {
      stopSynth();
    } else {
      synthIsPlaying = true;
      playSynthPreset();
    }
    updateSynthUI();
  });

  synthVolRange.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    if (masterGain) {
      masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
    }
    if (crownAudio) {
      crownAudio.volume = currentVolume;
    }
  });

  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      initAudio();
      presetButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activePreset = btn.getAttribute("data-preset");
      
      if (synthIsPlaying) {
        stopOscillators();
        playSynthPreset();
      }
      updateSynthUI();
    });
  });

  const overlay = document.createElement("div");
  overlay.className = "app-shell-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <section class="app-shell-panel" role="dialog" aria-modal="true" aria-label="Apps Galaxy">
      <header class="app-shell-head">
        <div class="app-shell-head-copy">
          <h2 class="app-shell-title glitch-hover">Apps Galaxy</h2>
          <p class="app-shell-subtitle">Your fastest route to favorites, AI tools, live builds, and every site page.</p>
        </div>
        <input class="app-shell-search" id="shellSearchInput" type="search" placeholder="Search page, app, or link..." aria-label="Search apps and pages" />
        <select class="app-shell-search app-shell-filter" id="shellCategoryFilter">
          <option value="all">All categories</option>
        </select>
        <select class="app-shell-search app-shell-filter" id="shellSortSelect">
          <option value="smart">Smart sort</option>
          <option value="launches">Most launches</option>
          <option value="az">A-Z</option>
        </select>
        <button type="button" class="app-shell-btn" id="shellCloseBtn">Close</button>
      </header>
      <div class="app-shell-insights" id="shellInsights"></div>
      <div class="app-shell-actions">
        <button type="button" class="app-shell-quick" data-action="featured">Open Random Featured</button>
        <button type="button" class="app-shell-quick" data-action="top">Open Most Used</button>
        <button type="button" class="app-shell-quick" data-action="latest">Continue Latest</button>
        <button type="button" class="app-shell-quick" data-action="directory">Open Links Directory</button>
        <button type="button" class="app-shell-quick" data-action="copy">Copy Page URL</button>
        <button type="button" class="app-shell-quick" data-action="ai">Launch AI Hub</button>
        <button type="button" class="app-shell-quick" data-action="diagnostics">🛡️ Run Diagnostics</button>
      </div>
      <div class="app-shell-system-feed" id="shellSystemFeed">
        <span class="feed-blink"></span> <span id="feedText">Initializing Krylo-Nexus Protocol...</span>
      </div>
      <div class="app-shell-grid" id="shellGrid"></div>
    </section>
  `;

  const progressWrap = document.createElement("div");
  progressWrap.className = "app-shell-progress";
  const progressBar = document.createElement("div");
  progressBar.className = "app-shell-progress-bar";
  progressWrap.appendChild(progressBar);
  document.body.appendChild(progressWrap);

  document.body.appendChild(dock);
  document.body.appendChild(overlay);

  // Animate progress bar
  setTimeout(() => {
    progressBar.style.width = "40%";
    setTimeout(() => {
      progressBar.style.width = "85%";
      setTimeout(() => {
        progressBar.style.width = "100%";
        setTimeout(() => {
          progressWrap.style.opacity = "0";
          setTimeout(() => progressWrap.remove(), 200);
        }, 100);
      }, 150);
    }, 100);
  }, 40);

  const topBtn = document.getElementById("shellTopBtn");
  const homeBtn = document.getElementById("shellHomeBtn");
  const appsBtn = document.getElementById("shellAppsBtn");
  const themeBtn = document.getElementById("shellThemeBtn");

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  const closeBtn = document.getElementById("shellCloseBtn");
  const grid = document.getElementById("shellGrid");
  const searchInput = document.getElementById("shellSearchInput");
  const categoryFilter = document.getElementById("shellCategoryFilter");
  const sortSelect = document.getElementById("shellSortSelect");
  const insights = document.getElementById("shellInsights");

  if (categoryFilter) {
    const categories = Array.from(new Set(APPS.map((item) => item.tag))).sort((left, right) => left.localeCompare(right));
    categoryFilter.innerHTML = [`<option value="all">All categories</option>`]
      .concat(categories.map((category) => `<option value="${category}">${category}</option>`))
      .join("");
  }

  function saveFavs() {
    safeSet(FAV_KEY, JSON.stringify(favorites));
  }

  function resolveOrder(items) {
    const withRank = items.map((item) => {
      const isFav = favorites.includes(item.href);
      const recentIndex = recents.indexOf(item.href);
      const recentRank = recentIndex >= 0 ? recentIndex : 999;
      const launches = Number(stats[item.href] || 0);
      const tierRank = item.tier === "featured" ? 0 : 1;
      return { item, isFav, recentRank, launches, tierRank };
    });
    withRank.sort((a, b) => {
      if (a.isFav !== b.isFav) return Number(b.isFav) - Number(a.isFav);
      if (a.recentRank !== b.recentRank) return a.recentRank - b.recentRank;
      if (a.tierRank !== b.tierRank) return a.tierRank - b.tierRank;
      if (a.launches !== b.launches) return b.launches - a.launches;
      return a.item.name.localeCompare(b.item.name);
    });
    return withRank;
  }

  function renderInsightStrip() {
    const totalLaunches = Object.values(stats).reduce((sum, value) => sum + Number(value || 0), 0);
    const totalStreak = Object.values(appDaily).reduce((sum, value) => sum + Number((value && value.streak) || 0), 0);
    if (!insights) return;
    insights.innerHTML = `
      <article class="app-shell-insight"><strong>${APPS.length}</strong><span>apps indexed</span></article>
      <article class="app-shell-insight"><strong>${totalLaunches}</strong><span>launches</span></article>
      <article class="app-shell-insight"><strong id="sysCpuUsage">14%</strong><span>cpu load</span></article>
      <article class="app-shell-insight"><strong id="sysRamUsage">2.4GB</strong><span>ram usage</span></article>
      <article class="app-shell-insight"><strong id="sysNetPing">24ms</strong><span>network latency</span></article>
      <article class="app-shell-insight"><strong>${totalStreak}</strong><span>total streak</span></article>
    `;
    
    // Telemetry updates
    if (!window.telemetryTimer) {
      window.telemetryTimer = setInterval(() => {
        const cpuEl = document.getElementById("sysCpuUsage");
        const ramEl = document.getElementById("sysRamUsage");
        const pingEl = document.getElementById("sysNetPing");
        if (cpuEl) cpuEl.textContent = Math.floor(Math.random() * 20 + 5) + "%";
        if (ramEl) ramEl.textContent = (2.0 + Math.random()).toFixed(1) + "GB";
        if (pingEl) pingEl.textContent = Math.floor(Math.random() * 30 + 10) + "ms";
      }, 2000);
    }
  }

  function renderCard({ item, isFav, launches }) {
    const icon = APP_ICONS[item.href] || "logo.svg";
    const tierLabel = item.tier === "featured" ? "Featured build" : item.tag;
    const isCurrent = item.href === path;
    return `
      <article class="app-shell-link${isCurrent ? " is-current" : ""}" data-href="${item.href}">
        <div class="app-shell-link-row">
          <a href="${item.href}" style="color:inherit;text-decoration:none;display:block;flex:1;">
            <span style="display:flex;align-items:center;gap:0.7rem;">
              <img src="${icon}" onerror="this.src='logo.svg'" alt="" width="28" height="28" style="width:28px;height:28px;border-radius:10px;flex:0 0 auto;" />
              <strong>${item.name}</strong>
            </span>
            <span>${tierLabel}</span>
            ${isCurrent ? `<span class="app-shell-current">Current page</span>` : ""}
            <span class="app-shell-meta">${item.href} | launches: ${launches}</span>
          </a>
          <button type="button" class="app-shell-fav ${isFav ? "is-on" : ""}" data-fav="${item.href}" aria-label="Toggle favorite">${isFav ? "Fav" : "+"}</button>
        </div>
      </article>
    `;
  }

  function renderSection(label, items, emptyText) {
    return `
      <section class="app-shell-section">
        <p class="app-shell-section-label">${label}</p>
        ${items.length ? items.map(renderCard).join("") : `<div class="app-shell-empty">${emptyText}</div>`}
      </section>
    `;
  }

  function launchHref(href) {
    if (!href) return;
    window.location.href = href;
  }

  function openRandomFeatured() {
    const featured = APPS.filter((item) => item.tier === "featured");
    if (!featured.length) return;
    launchHref(featured[Math.floor(Math.random() * featured.length)].href);
  }

  function openMostUsed() {
    const topEntry = Object.entries(stats)
      .sort((left, right) => Number(right[1] || 0) - Number(left[1] || 0))
      .find(([href, count]) => href && Number(count || 0) > 0);
    if (topEntry) {
      launchHref(topEntry[0]);
      return;
    }
    openRandomFeatured();
  }

  function openAiZone() {
    launchHref(path === "aether-core-v110.html" ? "idea-lab-ai.html" : "aether-core-v110.html");
  }

  function openLinksDirectory() {
    launchHref("all-links.html");
  }

  function copyCurrentPageLink() {
    const pageUrl = window.location.href;
    if (!pageUrl) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pageUrl).then(() => {
        window.safeNotify("Copied current page URL.");
      }).catch(() => {
        window.safeNotify("Could not copy the URL automatically.");
      });
    } else {
      window.safeNotify("Copy is not supported in this browser.");
    }
  }

  function continueLatest() {
    const nextRecent = recents.find((href) => href && href !== path);
    launchHref(nextRecent || "index.html");
  }

  function openSurprise() {
    const pool = APPS.filter((item) => item.href !== path);
    if (!pool.length) return;
    launchHref(pool[Math.floor(Math.random() * pool.length)].href);
  }

  function renderGrid(term) {
    const q = String(term || "").toLowerCase().trim();
    const category = String(categoryFilter?.value || "all");
    const sortMode = String(sortSelect?.value || "smart");
    const filtered = APPS.filter((item) => {
      if (category !== "all" && item.tag !== category) return false;
      const searchText = [item.name, item.tag, item.href, item.description, item.searchTags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return !q || searchText.includes(q);
    });
    const ordered = resolveOrder(filtered);
    if (sortMode === "az") {
      ordered.sort((left, right) => left.item.name.localeCompare(right.item.name));
    } else if (sortMode === "launches") {
      ordered.sort((left, right) => right.launches - left.launches || left.item.name.localeCompare(right.item.name));
    }
    renderInsightStrip();

    if (q) {
      grid.innerHTML = renderSection("Search Results", ordered, "No matching apps yet.");
      return;
    }

    const favoriteSet = new Set(favorites);
    const recentSet = new Set(recents);
    const favoriteItems = ordered.filter(({ item }) => favoriteSet.has(item.href)).slice(0, 6);
    const recentItems = ordered.filter(({ item }) => recentSet.has(item.href)).slice(0, 6);
    const featuredItems = ordered.filter(({ item }) => item.tier === "featured").slice(0, 8);
    const trendingItems = ordered.filter(({ launches }) => launches > 0).sort((a, b) => b.launches - a.launches).slice(0, 6);
    const quickPageItems = ordered.filter(({ item }) => item.tag === "Navigation" || item.href === "index.html").slice(0, 8);
    const directoryItems = ordered.slice(0, 18);
    grid.innerHTML = [
      renderSection("Favorites", favoriteItems, "Star an app to pin it here."),
      renderSection("Recent Launches", recentItems, "Open a few apps and they will show up here."),
      renderSection("Featured Builds", featuredItems, "Featured builds are warming up."),
      renderSection("Top Site Links", quickPageItems, "Browse the main pages and hub links quickly."),
      renderSection("Trending in This Browser", trendingItems, "This appears after you launch apps."),
      renderSection("Directory Snapshot", directoryItems, "Directory unavailable.")
    ].join("");
  }


  function refreshButtons() {
    const themeLabel = "Theme: " + applyTheme(activeTheme).label;
    if (themeBtn) themeBtn.textContent = themeLabel;
  }
  refreshButtons();

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  if (appsBtn) appsBtn.addEventListener("click", openOverlay);
  if (closeBtn) closeBtn.addEventListener("click", closeOverlay);
  
  function runDiagnostics() {
    closeOverlay();
    if (document.getElementById("cyberDiagnosticsModal")) return;

    initAudio();
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    if (audioCtx) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }

    const modal = document.createElement("div");
    modal.id = "cyberDiagnosticsModal";
    modal.className = "app-shell-diagnostics-modal";
    modal.innerHTML = `
      <div class="diagnostics-box">
        <div class="diagnostics-header">
          <span>🛡️ GALAXY TELEMETRY PROTOCOL v14.0.0</span>
          <button type="button" class="diagnostics-close-btn" id="closeDiagBtn">×</button>
        </div>
        <div class="diagnostics-body" id="diagnosticsLog">
          <div class="diag-line primary">> Initiating system telemetry scan...</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const logBox = modal.querySelector("#diagnosticsLog");
    const closeBtn = modal.querySelector("#closeDiagBtn");

    closeBtn.addEventListener("click", () => {
      modal.remove();
    });

    const steps = [
      { text: "[BOOT] Initializing galaxy cores...", delay: 400, sound: 600 },
      { text: "[LINK] Verifying active CDN nodes: Vercel: OK", delay: 700, sound: 700 },
      { text: `[NET] Telemetry latency response check: ${Math.floor(Math.random() * 15 + 8)}ms (Fast)`, delay: 1000, sound: 800 },
      { text: "[CSS] Validating Glassmorphic styling engines: Active (98.6% opacity)", delay: 1300, sound: 900 },
      { text: `[REGISTRY] Scanning App Catalog: ${APPS.length} applications loaded successfully`, delay: 1700, sound: 1000 },
      { text: "[AUDIO] Procedural Web Audio Synthesis Engine: Online & detuned", delay: 2100, sound: 1100 },
      { text: "[AURA] Spotlighting Glow vector coordinates: Stable", delay: 2400, sound: 1200 },
      { text: "[MATRIX] God Mode Core decryption: Key Verified", delay: 2700, sound: 1300 },
      { text: "[SUCCESS] System integrity: 100% SECURE. ALL SYSTEMS GO!", delay: 3200, sound: 1500, class: "success" }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        if (!document.getElementById("cyberDiagnosticsModal")) return;
        
        if (audioCtx) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(step.sound, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.15);
        }

        const div = document.createElement("div");
        div.className = "diag-line " + (step.class || "");
        div.textContent = step.text;
        logBox.appendChild(div);
        logBox.scrollTop = logBox.scrollHeight;
      }, step.delay);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeOverlay();
        return;
      }
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const quickAction = target.closest("[data-action]");
      if (!(quickAction instanceof HTMLButtonElement)) return;
      const action = String(quickAction.dataset.action || "");
      if (action === "featured") openRandomFeatured();
      if (action === "top") openMostUsed();
      if (action === "latest") continueLatest();
      if (action === "directory") openLinksDirectory();
      if (action === "copy") copyCurrentPageLink();
      if (action === "surprise") openSurprise();
      if (action === "ai") openAiZone();
      if (action === "diagnostics") runDiagnostics();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query === "matrix") {
        activateMatrixMode();
        return;
      }
      renderGrid(query);
    });
  }

  function activateMatrixMode() {
    closeOverlay();
    if (document.getElementById("kv-matrix-canvas")) return;
    const canvas = document.createElement("canvas");
    canvas.id = "kv-matrix-canvas";
    canvas.style.cssText = "position:fixed;inset:0;z-index:99999;pointer-events:none;opacity:0.6;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const drops = Array(Math.floor(w / 20)).fill(1);
    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#0f0";
      ctx.font = "15px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    const interval = setInterval(draw, 33);
    setTimeout(() => {
      clearInterval(interval);
      canvas.style.transition = "opacity 2s ease";
      canvas.style.opacity = "0";
      setTimeout(() => canvas.remove(), 2000);
    }, 10000);
  }
  categoryFilter?.addEventListener("change", () => renderGrid(searchInput ? searchInput.value : ""));
  sortSelect?.addEventListener("change", () => renderGrid(searchInput ? searchInput.value : ""));
  if (grid) {
    grid.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const favBtn = target.closest("button[data-fav]");
      if (favBtn instanceof HTMLButtonElement) {
        const href = String(favBtn.dataset.fav || "");
        if (!href) return;
        if (favorites.includes(href)) {
          favorites = favorites.filter((item) => item !== href);
        } else {
          favorites.unshift(href);
        }
        saveFavs();
        renderGrid(searchInput ? searchInput.value : "");
      }
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const index = Math.max(0, THEMES.findIndex((item) => item.key === activeTheme));
      activeTheme = THEMES[(index + 1) % THEMES.length].key;
      safeSet(THEME_KEY, activeTheme);
      refreshButtons();
    });
  }

  // ── Telemetry Stats HUD Dashboard ──
  const hudBtn = document.getElementById("shellHudBtn");
  if (hudBtn) {
    // Inject the Cyber Stats HUD Panel
    const hudPanel = document.createElement("div");
    hudPanel.id = "kryloHudPanel";
    hudPanel.className = "krylo-hud-panel";
    hudPanel.innerHTML = `
      <div class="hud-header">
        <div class="hud-title"><div class="pulse-dot"></div> CYBERNETIC STATS HUD</div>
        <button class="hud-close-x" id="hudCloseX">×</button>
      </div>
      <div class="hud-body">
        <div class="hud-stat-box">
          <div class="hud-label">CPU CORE LOAD</div>
          <div class="hud-value-row">
            <span class="hud-value" id="hudCpuVal">18.4%</span>
            <span class="hud-indicator status-ok">OPTIMIZED</span>
          </div>
          <div style="width:100%; height:32px; background:rgba(255,255,255,0.02); border:1px solid rgba(121,216,255,0.06); border-radius:6px; overflow:hidden; display:flex; align-items:center;">
            <canvas id="hudCpuSparkline" width="280" height="30" style="width:100%; height:100%; display:block;"></canvas>
          </div>
        </div>

        <div class="hud-stat-box">
          <div class="hud-label">RAM ALLOCATION</div>
          <div class="hud-value-row">
            <span class="hud-value" id="hudRamVal">256.8 MB</span>
            <span class="hud-indicator status-ok">STABLE</span>
          </div>
          <div class="hud-progress-bg">
            <div class="hud-progress-bar bar-ram" id="hudRamBar" style="width: 44%"></div>
          </div>
        </div>

        <div class="hud-stat-box">
          <div class="hud-label">PING LATENCY RESPONSE</div>
          <div class="hud-value-row">
            <span class="hud-value" id="hudPingVal">12ms</span>
            <span class="hud-indicator status-fast">HYPER-FAST</span>
          </div>
          <div style="width:100%; height:32px; background:rgba(255,255,255,0.02); border:1px solid rgba(121,216,255,0.06); border-radius:6px; overflow:hidden; display:flex; align-items:center;">
            <canvas id="hudPingSparkline" width="280" height="30" style="width:100%; height:100%; display:block;"></canvas>
          </div>
        </div>

        <div class="hud-divider"></div>

        <div class="hud-section-title" style="display:flex; align-items:center; justify-content:space-between; width:100%; gap:4px; margin-bottom: 6px;">
          <span>Cyber Commands</span>
          <span style="font-size:0.6rem; opacity:0.6; font-family:'JetBrains Mono',monospace;">(HOTKEYS)</span>
        </div>
        <div class="hud-shortcuts-list" style="font-family:'Space Grotesk',sans-serif; font-size:0.75rem; display:flex; flex-direction:column; gap:6px; background:rgba(255,255,255,0.01); border:1px solid rgba(121,216,255,0.08); border-radius:12px; padding:10px; color:var(--app-muted,#9fc0de); margin-bottom: 12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>🔍 Portal Search</span>
            <kbd style="background:rgba(121,216,255,0.15); border:1px solid rgba(121,216,255,0.3); border-radius:4px; padding:1px 5px; font-family:'JetBrains Mono',monospace; font-size:0.62rem; color:#fff;">Ctrl+K</kbd>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>🌐 Links Directory</span>
            <kbd style="background:rgba(121,216,255,0.15); border:1px solid rgba(121,216,255,0.3); border-radius:4px; padding:1px 5px; font-family:'JetBrains Mono',monospace; font-size:0.62rem; color:#fff;">Ctrl+Shift+L</kbd>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>🟢 Matrix Rain Code</span>
            <kbd style="background:rgba(121,216,255,0.15); border:1px solid rgba(121,216,255,0.3); border-radius:4px; padding:1px 5px; font-family:'JetBrains Mono',monospace; font-size:0.62rem; color:#fff;">Konami Code</kbd>
          </div>
        </div>

        <div class="hud-divider"></div>

        <div class="hud-section-title">Ecosystem Metrics</div>
        <div class="hud-metrics-grid">
          <div class="hud-metric-card">
            <strong id="hudTotalApps">--</strong>
            <span>Active Apps</span>
          </div>
          <div class="hud-metric-card">
            <strong id="hudThemeSwitches">0</strong>
            <span>Theme Shifts</span>
          </div>
          <div class="hud-metric-card">
            <strong id="hudDiagnosticsCount">0</strong>
            <span>Diagnostics Run</span>
          </div>
          <div class="hud-metric-card">
            <strong id="hudUptimeVal">0s</strong>
            <span>Session Uptime</span>
          </div>
        </div>

        <button class="hud-action-btn" id="hudBoostBtn">🚀 DEFRAGMENT & BOOST SPEED</button>
      </div>
    `;
    document.body.appendChild(hudPanel);

    // Track state variables
    let hudInterval = null;
    let uptimeInterval = null;
    let sessionUptime = 0;
    let themeSwitches = 0;
    window.hudDiagnosticsRun = 0;

    // Track theme switches
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        themeSwitches++;
        const countEl = document.getElementById("hudThemeSwitches");
        if (countEl) countEl.innerText = themeSwitches;
      });
    }

    // Monitor diagnostics button from AI Mascot
    window.incrementHudDiagnostics = () => {
      window.hudDiagnosticsRun++;
      const countEl = document.getElementById("hudDiagnosticsCount");
      if (countEl) countEl.innerText = window.hudDiagnosticsRun;
    };

    // Uptime counter
    uptimeInterval = setInterval(() => {
      sessionUptime++;
      const uptimeEl = document.getElementById("hudUptimeVal");
      if (uptimeEl) {
        if (sessionUptime < 60) {
          uptimeEl.innerText = sessionUptime + "s";
        } else {
          const mins = Math.floor(sessionUptime / 60);
          const secs = sessionUptime % 60;
          uptimeEl.innerText = `${mins}m ${secs}s`;
        }
      }
    }, 1000);

    // Interactive toggle click handlers
    hudBtn.addEventListener("click", () => {
      const isVisible = hudPanel.classList.toggle("is-active");
      if (isVisible) {
        playHudSynth(600, 0.1);
        startHudSimulation();
        // Load real total apps count from catalog
        const totalAppsEl = document.getElementById("hudTotalApps");
        if (totalAppsEl && typeof APPS !== "undefined") {
          totalAppsEl.innerText = APPS.length;
        }
      } else {
        stopHudSimulation();
      }
    });

    document.getElementById("hudCloseX").addEventListener("click", () => {
      hudPanel.classList.remove("is-active");
      stopHudSimulation();
      playHudSynth(400, 0.08);
    });

    // Synth player for HUD feedback
    function playHudSynth(freq, duration) {
      try {
        if (typeof initAudio === "function") initAudio();
        if (window.audioCtx && window.audioCtx.state === "suspended") window.audioCtx.resume();
        const ctx = window.audioCtx || (window.AudioContext && new window.AudioContext());
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration + 0.05);
      } catch(e) {}
    }

    // Boost defragment button
    document.getElementById("hudBoostBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      playHudSynth(900, 0.15);
      setTimeout(() => playHudSynth(1200, 0.25), 120);

      const btn = document.getElementById("hudBoostBtn");
      btn.innerText = "⚡ DEFRICTION CORE PURGING...";
      btn.disabled = true;
      btn.style.background = "linear-gradient(135deg, #ffd166, #ff6384)";

      // Trigger standard cybermodal
      setTimeout(() => {
        if (typeof window.alert === "function") {
          window.alert("CORE OPTIMIZATION COMPLETE!\n- Cleared simulated JavaScript Garbage Collector caches.\n- Defragmented glassmorphic layer boundaries.\n- Restored latency overhead headroom: +18.4% speed gain.");
        }
        btn.innerText = "🚀 DEFRAGMENT & BOOST SPEED";
        btn.disabled = false;
        btn.style.background = "";
      }, 1200);
    });

    // History arrays for sparkline tracking
    const cpuHistory = Array(15).fill(15);
    const pingHistory = Array(15).fill(10);

    function drawSparkline(canvasId, history, color, minVal=0, maxVal=40) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Create glowing gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      const step = w / (history.length - 1);
      
      // Draw path
      for (let i = 0; i < history.length; i++) {
        const x = i * step;
        const valPct = (history[i] - minVal) / (maxVal - minVal);
        const y = h - valPct * (h - 4) - 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      // Path line
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 4;
      ctx.shadowColor = color;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill underneath
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.15;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Simulate fluctuate values
    function startHudSimulation() {
      if (hudInterval) clearInterval(hudInterval);
      
      // Trigger initial draws immediately
      drawSparkline('hudCpuSparkline', cpuHistory, '#00f2ff', 0, 40);
      drawSparkline('hudPingSparkline', pingHistory, '#58d4a8', 0, 25);

      hudInterval = setInterval(() => {
        // CPU loads
        const cpuVal = (Math.random() * 15 + 10).toFixed(1);
        const cpuEl = document.getElementById("hudCpuVal");
        if (cpuEl) cpuEl.innerText = cpuVal + "%";

        // Track and redraw sparkline
        cpuHistory.push(Number(cpuVal));
        cpuHistory.shift();
        drawSparkline('hudCpuSparkline', cpuHistory, '#00f2ff', 0, 40);

        // RAM load
        let ramBase = 250 + Math.random() * 30;
        const ramEl = document.getElementById("hudRamVal");
        const ramBar = document.getElementById("hudRamBar");
        if (ramEl) ramEl.innerText = ramBase.toFixed(1) + " MB";
        if (ramBar) ramBar.style.width = ((ramBase / 800) * 100).toFixed(0) + "%";

        // Ping latency
        const pingVal = Math.floor(Math.random() * 6 + 8);
        const pingEl = document.getElementById("hudPingVal");
        if (pingEl) pingEl.innerText = pingVal + "ms";

        // Track and redraw sparkline
        pingHistory.push(pingVal);
        pingHistory.shift();
        drawSparkline('hudPingSparkline', pingHistory, '#58d4a8', 0, 25);
      }, 800);
    }

    // Stop simulate values
    function stopHudSimulation() {
      if (hudInterval) {
        clearInterval(hudInterval);
        hudInterval = null;
      }
    }
  }

  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY) {
      activeTheme = safeGet(THEME_KEY, activeTheme);
      refreshButtons();
      return;
    }
    if (event.key === FAV_KEY) {
      try {
        favorites = JSON.parse(safeGet(FAV_KEY, "[]"));
        if (!Array.isArray(favorites)) favorites = [];
      } catch {
        favorites = [];
      }
      renderGrid(searchInput ? searchInput.value : "");
      return;
    }
    if (event.key === RECENT_KEY) {
      try {
        recents = JSON.parse(safeGet(RECENT_KEY, "[]"));
        if (!Array.isArray(recents)) recents = [];
      } catch {
        recents = [];
      }
      renderGrid(searchInput ? searchInput.value : "");
      return;
    }
    if (event.key === PROFILE_KEY) {
      try {
        appProfiles = JSON.parse(safeGet(PROFILE_KEY, "{}"));
        if (!appProfiles || typeof appProfiles !== "object") appProfiles = {};
      } catch {
        appProfiles = {};
      }
      return;
    }
    if (event.key === DAILY_KEY) {
      try {
        appDaily = JSON.parse(safeGet(DAILY_KEY, "{}"));
        if (!appDaily || typeof appDaily !== "object") appDaily = {};
      } catch {
        appDaily = {};
      }
      renderGrid(searchInput ? searchInput.value : "");
      return;
    }
    if (event.key === STATS_KEY) {
      try {
        stats = JSON.parse(safeGet(STATS_KEY, "{}"));
        if (!stats || typeof stats !== "object") stats = {};
      } catch {
        stats = {};
      }
      renderGrid(searchInput ? searchInput.value : "");
    }
  });

  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openOverlay();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      openLinksDirectory();
      return;
    }
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeOverlay();
    }
  });

  if (!document.querySelector('script[src="premium-ui-injector.js"]')) {
    const pScript = document.createElement("script");
    pScript.src = "premium-ui-injector.js";
    pScript.defer = true;
    document.head.appendChild(pScript);
  }
  const AudioEngine = (() => {
    let ctx = null;
    const ensureContext = () => {
      try {
        if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
      } catch {
        ctx = null;
      }
      return ctx;
    };
    const play = (freq, type, duration, vol) => {
      const context = ensureContext();
      if (!context) return;
      if (context.state === "suspended") context.resume();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, context.currentTime);
      gain.gain.setValueAtTime(vol, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + duration);
    };
    return {
      click: () => play(800, "sine", 0.1, 0.05),
      whoosh: () => play(150, "sine", 0.5, 0.05),
      success: () => {
        play(600, "sine", 0.1, 0.05);
        setTimeout(() => play(900, "sine", 0.2, 0.05), 50);
      }
    };
  })();

  function openOverlay() {
    AudioEngine.whoosh();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    renderGrid("");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    } else {
      overlay.focus();
    }
  }

  function closeOverlay() {
    AudioEngine.click();
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      renderInsightStrip();
      if (typeof installPowerPanel === "function") installPowerPanel();
    });
  } else {
    renderInsightStrip();
  }

  function startFeed() {
    const feedText = document.getElementById("feedText");
    if (!feedText) return;
    const messages = [
      "Krylo-Nexus Protocol: Online",
      "Aether Mesh Stability: 99.8%",
      "Synchronizing Aurora Flux...",
      "AI Reasoning Engine: Optimized",
      "Scanning App Galaxy for updates...",
      "Neural Node Routing: Active",
      "Solar Flare Protection: Enabled",
      "Neon Grid Density: Nominal",
      "Welcome back, Commander.",
      "Vercel Deployment: Verified",
      "Historical Archives: Synced",
      "Premium UI Layer: Active"
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % messages.length;
      feedText.style.opacity = 0;
      setTimeout(() => {
        feedText.textContent = messages[i];
        feedText.style.opacity = 1;
      }, 300);
    }, 5000);
  }
  startFeed();

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("button, .app-shell-btn, .app-shell-link")) {
      AudioEngine.click();
    }
  }, { passive: true });
})();

/* Star helper: initializes a decorative starfield on a canvas or with THREE.js if loaded.
   Usage: window.initStarHelper('heroParticles', {count:120, color:'#7beaff'}) */
(function(){
  window.initStarHelper = function(canvasId, opts){
    try {
      const cfg = Object.assign({count:88, color:'#7beaff', blend:'screen'}, opts || {});
      const c = document.getElementById(canvasId);
      if (!c) return null;
      // If three is available, attempt a WebGL starfield (best-effort)
      if (window.THREE && typeof window.THREE === 'object') {
        try {
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 2000);
          camera.position.z = 400;
          const renderer = new THREE.WebGLRenderer({ canvas: c, alpha: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(cfg.count * 3);
          for (let i=0;i<cfg.count;i++){ positions[i*3+0]=(Math.random()-0.5)*2000; positions[i*3+1]=(Math.random()-0.5)*1200; positions[i*3+2]=(Math.random()-0.5)*1200; }
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          const material = new THREE.PointsMaterial({ color: cfg.color, size: 2, sizeAttenuation: true, transparent: true, opacity: 0.85 });
          const points = new THREE.Points(geometry, material);
          scene.add(points);
          let raf = null;
          function onResize(){ camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); }
          window.addEventListener('resize', onResize, { passive:true });
          (function animate(){ points.rotation.y += 0.0008; points.rotation.x += 0.0004; renderer.render(scene, camera); raf = requestAnimationFrame(animate); })();
          return { stop: ()=>{ if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); renderer.dispose(); } };
        } catch(e) { /* fallthrough to 2D */ }
      }
      // 2D Canvas fallback
      const ctx = c.getContext('2d'); if (!ctx) return null;
      let w = 0, h = 0; const ratio = Math.min(2, window.devicePixelRatio || 1);
      const stars = Array.from({length: cfg.count}, ()=>({ x:0,y:0,r:Math.random()*1.6+0.6,vx:(Math.random()-.5)*0.2, vy:(Math.random()-.5)*0.08, a:0.2+Math.random()*0.6 }));
      function resize(){ const rect = c.getBoundingClientRect(); w = rect.width; h = rect.height; c.width = Math.floor(w*ratio); c.height = Math.floor(h*ratio); c.style.width = w+'px'; c.style.height = h+'px'; ctx.setTransform(ratio,0,0,ratio,0,0); stars.forEach(s=>{s.x=Math.random()*w; s.y=Math.random()*h;}); }
      function draw(){ ctx.clearRect(0,0,w,h); stars.forEach(s=>{ s.x+=s.vx; s.y+=s.vy; if (s.x< -20) s.x = w+20; if (s.x> w+20) s.x = -20; if (s.y< -20) s.y = h+20; if (s.y> h+20) s.y = -20; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle = `rgba(123,234,255,${s.a})`; ctx.fill(); }); raf = requestAnimationFrame(draw); }
      window.addEventListener('resize', resize, { passive:true });
      resize(); let raf = requestAnimationFrame(draw);
      return { stop: ()=>{ if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', resize); } };
    } catch(e) { return null; }
  };

  // AI Mascot (Krylo)
  if (!document.getElementById('kryloMascot')) {
    const mascot = document.createElement('div');
    mascot.id = 'kryloMascot';
    mascot.className = 'krylo-ai-mascot';
    mascot.innerHTML = `
      <div class="mascot-core">
        <div class="mascot-eye"></div>
      </div>
      <div class="mascot-ring"></div>
      <div class="mascot-ring-outer"></div>
    `;
    document.body.appendChild(mascot);
    
    // Create Holographic Assistant Panel
    const panel = document.createElement('div');
    panel.id = 'kryloAssistantPanel';
    panel.className = 'krylo-assistant-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <div class="panel-title"><div class="pulse-dot"></div> KRYLO SYSTEM AI</div>
      </div>
      <div class="panel-body">
        <div class="panel-dialogue" id="kryloDialogue">Hello! I am Krylo, Krishiv's cyber assistant. Select an operational directive to begin.</div>
        <div class="panel-actions">
          <button class="panel-btn" id="kryloDiagBtn">Diagnostics</button>
          <button class="panel-btn" id="kryloSoundBtn">Synth Note</button>
          <button class="panel-btn" id="kryloQuoteBtn">Dev Quote</button>
          <button class="panel-btn" id="kryloMatrixBtn">Matrix Mode</button>
          <button class="panel-btn close-btn" id="kryloCloseBtn">Shutdown Terminal</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Audio synthesizer helper function
    function playAssistantSynth(freq, duration) {
      try {
        if (typeof initAudio === "function") initAudio();
        if (window.audioCtx && window.audioCtx.state === "suspended") window.audioCtx.resume();
        const ctx = window.audioCtx || (window.AudioContext && new window.AudioContext());
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration + 0.05);
      } catch(err) {}
    }

    // Toggle panel on Mascot click
    mascot.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = panel.classList.toggle('is-active');
      if (isActive) {
        // Trigger a cute startup arpeggio sound
        playAssistantSynth(523.25, 0.08); // C5
        setTimeout(() => playAssistantSynth(659.25, 0.08), 80); // E5
        setTimeout(() => playAssistantSynth(783.99, 0.14), 160); // G5
        
        document.getElementById('kryloDialogue').className = "panel-dialogue";
        document.getElementById('kryloDialogue').innerText = "Hello! I am Krylo, Krishiv's cyber assistant. Select an operational directive to begin.";
      }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== mascot && !mascot.contains(e.target)) {
        panel.classList.remove('is-active');
      }
    });

    // Diagnostics logic
    let diagInterval = null;
    document.getElementById('kryloDiagBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.incrementHudDiagnostics === "function") {
        window.incrementHudDiagnostics();
      }
      if (diagInterval) clearInterval(diagInterval);
      playAssistantSynth(880, 0.06);
      
      const dialogue = document.getElementById('kryloDialogue');
      dialogue.className = "panel-dialogue terminal-mode";
      dialogue.innerText = "[SYSTEM DIAGNOSTIC RUNNING...]\n";
      
      const logs = [
        "Connecting core...",
        "Resolving Glassmorphic borders...",
        "Starfield warp acceleration: 100%",
        "Synthesis oscillator: detuned",
        "God mode Matrix rain: Ready",
        "SYSTEM HEALTH: 100% SECURE!"
      ];
      
      let step = 0;
      diagInterval = setInterval(() => {
        if (step < logs.length) {
          dialogue.innerText += `> ${logs[step]}\n`;
          dialogue.scrollTop = dialogue.scrollHeight;
          playAssistantSynth(600 + (step * 50), 0.04);
          step++;
        } else {
          clearInterval(diagInterval);
          diagInterval = null;
        }
      }, 300);
    });

    // Synth Sound logic
    document.getElementById('kryloSoundBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      const freqs = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
      const randomFreq = freqs[Math.floor(Math.random() * freqs.length)];
      playAssistantSynth(randomFreq, 0.4);
      
      const dialogue = document.getElementById('kryloDialogue');
      dialogue.className = "panel-dialogue";
      dialogue.innerText = `Synthesizing futuristic retro sound wave at frequency: ${randomFreq}Hz... 🎵`;
    });

    // Dev Quote logic
    const quotes = [
      "Krishiv: 'I drink apple juice to compile CSS faster!' 🧃",
      "Krishiv: 'Don't touch that line of code, it's holding the whole portfolio grid together!' ⚠️",
      "Krishiv: 'Just compiled 42 lines of vanilla JavaScript without a single console error!' 🎉",
      "Krishiv: 'Future Mode core temperature: Stable. Leveling up next apps now!' 🚀",
      "Krishiv: 'I am building a Roblox tower defense game in my other tab right now!' 🎮",
      "Krishiv: 'Apple Pie increases developer productivity by 200%, scientifically proven by me.' 🥧"
    ];
    let lastQuoteIdx = -1;
    document.getElementById('kryloQuoteBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      playAssistantSynth(700, 0.06);
      
      let nextIdx = lastQuoteIdx;
      while (nextIdx === lastQuoteIdx) {
        nextIdx = Math.floor(Math.random() * quotes.length);
      }
      lastQuoteIdx = nextIdx;
      
      const dialogue = document.getElementById('kryloDialogue');
      dialogue.className = "panel-dialogue";
      dialogue.innerText = quotes[nextIdx];
    });

    // Matrix color cycling state
    const MATRIX_COLORS = [
      { name: "Classic Green 🟢", hex: "#00ff66" },
      { name: "Cyber Cyan 🔵", hex: "#00f2ff" },
      { name: "Neon Purple 🟣", hex: "#b300ff" },
      { name: "Overdrive Red 🔴", hex: "#ff3b30" },
      { name: "Golden Matrix 🟡", hex: "#ffd166" }
    ];
    let matrixColorIdx = 0;
    window.matrixRainColor = MATRIX_COLORS[0].hex;

    // Matrix toggle logic
    document.getElementById('kryloMatrixBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      const dialogue = document.getElementById('kryloDialogue');
      dialogue.className = "panel-dialogue";

      const hasMatrix = document.body.classList.contains('matrix-mode');
      if (!hasMatrix) {
        // First activate: start classic green
        document.body.classList.add('matrix-mode');
        matrixColorIdx = 0;
        window.matrixRainColor = MATRIX_COLORS[matrixColorIdx].hex;
        playAssistantSynth(400, 0.12);
        dialogue.innerText = `God Mode Core decrypted. Initiating Matrix rain falling code stream... 🟢`;
      } else {
        // Already active: cycle colors!
        matrixColorIdx++;
        if (matrixColorIdx >= MATRIX_COLORS.length) {
          // Cycled past the end: disable Matrix Mode
          document.body.classList.remove('matrix-mode');
          playAssistantSynth(200, 0.15);
          dialogue.innerText = "Re-activating premium glassmorphism styling engines... 🔵";
        } else {
          // Set new color!
          window.matrixRainColor = MATRIX_COLORS[matrixColorIdx].hex;
          playAssistantSynth(450 + matrixColorIdx * 80, 0.12);
          dialogue.innerText = `Matrix color stream modulated: Decrypted the ${MATRIX_COLORS[matrixColorIdx].name} stream. Tuning frequency... 📻`;
        }
      }
    });

    // Close logic
    document.getElementById('kryloCloseBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      playAssistantSynth(200, 0.15);
      panel.classList.remove('is-active');
    });
  }

  // Global Cursor Aura
  if (!document.getElementById('cursorAura')) {
    const aura = document.createElement('div');
    aura.id = 'cursorAura';
    aura.style.cssText = 'position: fixed; top: 0; left: 0; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(0,220,255,0.15) 0%, transparent 70%); pointer-events: none; transform: translate(-50%, -50%); z-index: 9999; mix-blend-mode: screen; transition: width 0.3s, height 0.3s; will-change: transform; opacity: 0;';
    document.body.appendChild(aura);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2, auraX = mouseX, auraY = mouseY, auraVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!auraVisible) { aura.style.opacity = '1'; auraVisible = true; }
    }, { passive: true });

    window.addEventListener('mousedown', () => { aura.style.width = '400px'; aura.style.height = '400px'; });
    window.addEventListener('mouseup', () => { aura.style.width = '300px'; aura.style.height = '300px'; });

    function renderAura() {
      auraX += (mouseX - auraX) * 0.15;
      auraY += (mouseY - auraY) * 0.15;
      aura.style.transform = 'translate(' + (auraX - 150) + 'px, ' + (auraY - 150) + 'px)';
      requestAnimationFrame(renderAura);
    }
    renderAura();
  }

  // Matrix Konami Code globally
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kIdx = 0;
  window.addEventListener('keydown', (e) => {
    if (e.key === konami[kIdx] || e.key.toLowerCase() === konami[kIdx].toLowerCase()) {
      kIdx++;
      if (kIdx === konami.length) {
        document.body.classList.toggle('matrix-mode');
        kIdx = 0;
      }
    } else {
      kIdx = 0;
    }
  });

  let matrixRainActive = false;

  function syncMatrixModeState() {
    const isMatrix = document.body.classList.contains('matrix-mode');
    
    if (isMatrix) {
      // 1. Ensure fonts are loaded
      if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=JetBrains+Mono"]')) {
        const fontPreconnect1 = document.createElement('link');
        fontPreconnect1.rel = 'preconnect';
        fontPreconnect1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(fontPreconnect1);

        const fontPreconnect2 = document.createElement('link');
        fontPreconnect2.rel = 'preconnect';
        fontPreconnect2.href = 'https://fonts.gstatic.com';
        fontPreconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreconnect2);

        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Orbitron:wght@600;700;800&family=Patrick+Hand&family=Space+Grotesk:wght@400;500;700&display=swap';
        document.head.appendChild(fontLink);
      }

      // 2. Ensure styles are loaded
      if (!document.getElementById('matrixStyle')) {
        const style = document.createElement('style');
        style.id = 'matrixStyle';
        style.textContent = `
          body.matrix-mode {
            background: #000000 !important;
            color: #00ff66 !important;
            font-family: "Space Grotesk", sans-serif !important;
          }
          body.matrix-mode * {
            border-color: #00ff66 !important;
            box-shadow: 0 0 5px rgba(0, 255, 102, 0.1) !important;
          }
          body.matrix-mode h1,
          body.matrix-mode h2,
          body.matrix-mode h3,
          body.matrix-mode .nav-logo,
          body.matrix-mode .hero-title,
          body.matrix-mode .section-title,
          body.matrix-mode .app-title {
            font-family: "Orbitron", sans-serif !important;
            color: #00ff66 !important;
            text-shadow: 0 0 10px rgba(0, 255, 102, 0.8), 0 0 20px rgba(0, 255, 102, 0.4) !important;
          }
          body.matrix-mode p,
          body.matrix-mode span,
          body.matrix-mode a,
          body.matrix-mode div:not(.custom-cyber-alert-modal) {
            color: #00ff66 !important;
          }
          body.matrix-mode .card,
          body.matrix-mode .app-card,
          body.matrix-mode section,
          body.matrix-mode .concept-card {
            background: rgba(0, 15, 5, 0.85) !important;
            border: 1px solid #00ff66 !important;
            backdrop-filter: none !important;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.25) !important;
          }
          body.matrix-mode code,
          body.matrix-mode pre,
          body.matrix-mode .code-font,
          body.matrix-mode .monospace-text,
          body.matrix-mode input,
          body.matrix-mode textarea,
          body.matrix-mode select {
            font-family: "JetBrains Mono", monospace !important;
            background: #000b03 !important;
            color: #00ff66 !important;
          }
          body.matrix-mode .note-card,
          body.matrix-mode .handwritten,
          body.matrix-mode .casual-note,
          body.matrix-mode blockquote {
            font-family: "Patrick Hand", cursive !important;
            font-size: 1.2rem !important;
            color: #a3ffd0 !important;
          }
        `;
        document.head.appendChild(style);
      }

      // 3. Start Matrix rain if not already active
      if (!matrixRainActive) {
        matrixRainActive = true;
        let rainCanvas = document.getElementById('heroParticles');
        let cleanUpCanvas = false;
        if (!rainCanvas) {
          rainCanvas = document.createElement('canvas');
          rainCanvas.id = 'matrixRainCanvas';
          rainCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.25;';
          document.body.appendChild(rainCanvas);
          cleanUpCanvas = true;
        }

        const ctx = rainCanvas.getContext('2d');
        let width = rainCanvas.width = window.innerWidth;
        let height = rainCanvas.height = window.innerHeight;

        const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
        const fontSize = 16;
        const columns = Math.floor(width / fontSize) + 1;
        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
          rainDrops[x] = Math.random() * -100;
        }

        function drawMatrixRain() {
          if (!document.body.classList.contains('matrix-mode')) {
            matrixRainActive = false;
            if (cleanUpCanvas && document.getElementById('matrixRainCanvas')) {
              document.getElementById('matrixRainCanvas').remove();
            } else if (document.getElementById('heroParticles')) {
              const canvas = document.getElementById('heroParticles');
              const pCtx = canvas.getContext('2d');
              pCtx.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
          }

          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = window.matrixRainColor || '#00ff66';
          ctx.font = fontSize + 'px monospace';

          for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
              rainDrops[i] = 0;
            }
            rainDrops[i]++;
          }
          requestAnimationFrame(drawMatrixRain);
        }

        const handleResize = () => {
          if (document.body.classList.contains('matrix-mode')) {
            width = rainCanvas.width = window.innerWidth;
            height = rainCanvas.height = window.innerHeight;
          }
        };
        window.addEventListener('resize', handleResize);
        drawMatrixRain();
      }
    } else {
      // Clean up rain canvas if present
      if (document.getElementById('matrixRainCanvas')) {
        document.getElementById('matrixRainCanvas').remove();
      }
      matrixRainActive = false;
    }
  }

  // Monitor class changes to body
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        syncMatrixModeState();
      }
    });
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Initial check on load
  syncMatrixModeState();
  // Global Holographic Portal Transition Loader
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link || !link.href) return;
    
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;
    if (link.target === "_blank") return;

    e.preventDefault();

    const portal = document.createElement("div");
    portal.className = "app-shell-portal-loader";
    portal.innerHTML = `
      <div class="portal-spinner-wrap">
        <div class="portal-spinner"></div>
        <div class="portal-glow"></div>
        <span class="portal-text">WARPING TO NODE...</span>
      </div>
    `;
    document.body.appendChild(portal);

    if (typeof window.initAudio === "function") window.initAudio();
    const ctx = window.audioCtx;
    if (ctx && ctx.state === "suspended") ctx.resume();
    if (ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }

    setTimeout(() => {
      portal.classList.add("active");
      setTimeout(() => {
        window.location.href = link.href;
      }, 350);
    }, 50);
  });

  // ── Glassmorphism Floating Music Dock & Dark Mode Toggle ──
  const injectMusicDock = () => {
    if (document.getElementById("glassMusicDock")) return;
    const dock = document.createElement("div");
    dock.id = "glassMusicDock";
    dock.className = "glass-music-dock";
    dock.innerHTML = `
      <div class="dock-vinyl" id="dockVinyl"></div>
      <div class="dock-info">
        <div class="dock-title">Better From The Crown</div>
        <div class="dock-artist">Krishiv Velocity</div>
      </div>
      <button class="dock-btn" id="dockThemeToggleBtn" title="Toggle Theme (Dark/Light)">🌙</button>
      <button class="dock-btn" id="dockPlayBtn" title="Play/Pause Track">▶</button>
    `;
    document.body.appendChild(dock);

    const playBtn = document.getElementById("dockPlayBtn");
    const vinyl = document.getElementById("dockVinyl");
    const themeBtn = document.getElementById("dockThemeToggleBtn");

    let isPlaying = false;
    let audio = null;

    const playTrack = () => {
      if (!audio) {
        audio = new Audio("better_from_the_crown.mp3");
        audio.loop = true;
      }
      if (audio.paused) {
        audio.play().then(() => {
          playBtn.innerText = "⏸";
          vinyl.classList.add("playing");
          isPlaying = true;
        }).catch(() => {});
      } else {
        audio.pause();
        playBtn.innerText = "▶";
        vinyl.classList.remove("playing");
        isPlaying = false;
      }
    };

    playBtn.addEventListener("click", playTrack);

    // Sync theme toggle with existing themes
    themeBtn.addEventListener("click", () => {
      let curTheme = safeGet(THEME_KEY, "default");
      const nextTheme = curTheme === "solar" ? "neon" : "solar";
      safeSet(THEME_KEY, nextTheme);
      applyTheme(nextTheme);
      themeBtn.innerText = nextTheme === "solar" ? "☀" : "🌙";
    });

    let curTheme = safeGet(THEME_KEY, "default");
    themeBtn.innerText = curTheme === "solar" ? "☀" : "🌙";
  };

  // ── Kinetic Typography scroll controller ──
  const initKineticTypography = () => {
    const headers = document.querySelectorAll(".section-heading h2, .section-heading .eyebrow");
    headers.forEach((h) => {
      h.classList.add("kinetic-text");
      h.style.display = "inline-block";
      h.style.transition = "transform 0.1s ease-out";
      h.style.willChange = "transform";
    });

    window.addEventListener("scroll", () => {
      const kineticElements = document.querySelectorAll(".kinetic-text");
      kineticElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        if (rect.top < viewHeight && rect.bottom > 0) {
          const relativeScroll = (rect.top - viewHeight / 2) / (viewHeight / 2);
          el.style.transform = `skewX(${relativeScroll * 10}deg) translateX(${relativeScroll * 15}px)`;
        }
      });
    });
  };

  // ── 3D Tilt Effect ──
  const initTiltEffect = () => {
    const cards = document.querySelectorAll(".project-card, .app-verse-card, .app-card");
    cards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const dx = x - xc;
        const dy = y - yc;
        
        const rx = -(dy / yc) * 15;
        const ry = (dx / xc) * 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
        card.style.transition = "transform 0.1s ease-out";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        card.style.transition = "transform 0.5s ease-out";
      });
    });
  };

  // ── Glow Trailing Cursor ──
  const initTrailingCursor = () => {
    const aura = document.getElementById("cursorAura");
    if (!aura) return;

    const hoverElements = document.querySelectorAll(".project-card, .app-verse-card, .app-card, .btn, a, button");
    hoverElements.forEach(el => {
      el.addEventListener("mouseenter", () => {
        aura.style.width = "450px";
        aura.style.height = "450px";
        aura.style.background = "radial-gradient(circle, rgba(0, 242, 255, 0.3) 0%, transparent 70%)";
      });
      el.addEventListener("mouseleave", () => {
        aura.style.width = "300px";
        aura.style.height = "300px";
        aura.style.background = "radial-gradient(circle, rgba(0, 220, 255, 0.15) 0%, transparent 70%)";
      });
    });
  };

  // ── Smooth Scroll Anchor Links ──
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === "#") return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ── AI Status Badge ──
  const injectStatusBadge = () => {
    if (document.getElementById("aiStatusBadge")) return;
    const badge = document.createElement("div");
    badge.id = "aiStatusBadge";
    badge.style.position = "fixed";
    badge.style.bottom = "24px";
    badge.style.left = "24px";
    badge.style.zIndex = "9999";
    badge.style.background = "rgba(10, 25, 47, 0.6)";
    badge.style.backdropFilter = "blur(12px)";
    badge.style.webkitBackdropFilter = "blur(12px)";
    badge.style.border = "1px solid rgba(0, 242, 255, 0.25)";
    badge.style.padding = "8px 16px";
    badge.style.borderRadius = "999px";
    badge.style.fontFamily = "'Fira Code', monospace";
    badge.style.fontSize = "0.75rem";
    badge.style.color = "#fff";
    badge.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
    badge.style.display = "flex";
    badge.style.alignItems = "center";
    badge.style.gap = "8px";
    badge.style.transition = "all 0.3s ease";
    badge.innerHTML = `
      <span style="width: 8px; height: 8px; border-radius: 50%; background: #00f2ff; box-shadow: 0 0 10px #00f2ff;" id="statusIndicator"></span>
      Krylo Agent: <strong id="statusText" style="color: #00f2ff;">Coding</strong>
    `;
    document.body.appendChild(badge);

    const updateStatus = async () => {
      try {
        const res = await fetch("/api/agent/status");
        if (res.ok) {
          const data = await res.json();
          const textEl = document.getElementById("statusText");
          const indEl = document.getElementById("statusIndicator");
          if (textEl && indEl) {
            textEl.innerText = data.status;
            if (data.status === "Coding") {
              textEl.style.color = "#00f2ff";
              indEl.style.background = "#00f2ff";
              indEl.style.boxShadow = "0 0 10px #00f2ff";
            } else if (data.status === "Gaming") {
              textEl.style.color = "#ff0055";
              indEl.style.background = "#ff0055";
              indEl.style.boxShadow = "0 0 10px #ff0055";
            } else {
              textEl.style.color = "#94a3b8";
              indEl.style.background = "#94a3b8";
              indEl.style.boxShadow = "none";
            }
          }
        }
      } catch {}
    };

    updateStatus();
    setInterval(updateStatus, 10000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectMusicDock();
      initKineticTypography();
      initTiltEffect();
      initTrailingCursor();
      initSmoothScroll();
      injectStatusBadge();
    });
  } else {
    injectMusicDock();
    initKineticTypography();
    initTiltEffect();
    initTrailingCursor();
    initSmoothScroll();
    injectStatusBadge();
  }
})();