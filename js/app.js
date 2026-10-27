/**
 * SELFIE 2.0 (סלפי החדש) – Main Application Controller & Interactive Visualizations
 */

window.SelfieApp = (function () {
  const STORAGE_KEY_COHORT = "selfie2_cohort_submissions_v1";
  const STORAGE_KEY_CURRENT = "selfie2_current_draft_v1";

  let state = {
    lang: "he", // "he" | "en"
    activeTab: "assessment", // "assessment" | "report" | "ai_advisor" | "badge" | "dashboard" | "methodology"
    activeDomainIdx: 0,
    currentDraft: {
      name: "ד״ר איל בלן",
      email: "eyal.b@oranim.ac.il",
      role: "lecturer",
      department: "general",
      courseName: "חדשנות פדגוגית ובינה מלאכותית בחינוך",
      pulse: "pre_2026",
      prePerception: "B2",
      postPerception: "B2",
      personalGoal: "הטמעת מודל הנתיב הכפול (מוגן + משלב AI) ומדידה מזווגת בקורסים",
      artifactUrl: "",
      reflectionNotes: "",
      responses: {}
    },
    aiOptions: {
      courseName: "",
      learnerType: "שנים א׳–ג׳ (הכשרת מורים)",
      policyMode: "dual_track"
    },
    dashboardFilterDept: "all",
    dashboardFilterRole: "all",
    dashboardCohortView: "paired", // "paired" | "attrition" | "late"
    dashboardComparisonMode: "paired_valid", // "paired_valid" | "unmatched_flawed"
    simAttritionPreN: 17,
    simAttritionPostN: 9,
    simDropoutBias: 18,
    simB1Count: 31,
    cohortSubmissions: []
  };

  function init() {
    loadStateFromStorage();
    ensureDefaultResponses();
    renderAll();
    syncFromCloudIfNeeded();
  }

  function loadStateFromStorage() {
    try {
      const savedCohort = localStorage.getItem(STORAGE_KEY_COHORT);
      if (savedCohort) {
        const parsed = JSON.parse(savedCohort);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.cohortSubmissions = parsed;
        } else {
          state.cohortSubmissions = [...window.SELFIE_DEMO_COHORT];
        }
      } else {
        state.cohortSubmissions = [...window.SELFIE_DEMO_COHORT];
      }

      const savedDraft = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        state.currentDraft = { ...state.currentDraft, ...parsedDraft };
      }
    } catch (e) {
      state.cohortSubmissions = [...window.SELFIE_DEMO_COHORT];
    }
  }

  function saveStateToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_COHORT, JSON.stringify(state.cohortSubmissions));
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(state.currentDraft));
    } catch (e) {
      console.warn("Storage save warning:", e);
    }
  }

  function ensureDefaultResponses() {
    const res = state.currentDraft.responses || {};
    const defaultProfile = {
      "1.1": "B2", "1.2": "B2", "1.3": "C1",
      "2.1": "B2", "2.2": "C1", "2.3": "B2",
      "3.1": "B1", "3.2": "B1", "3.3": "B2",
      "4.1": "B2", "4.2": "B1", "4.3": "B2",
      "5.1": "C1", "5.2": "B2", "5.3": "C1",
      "6.1": "B2", "6.2": "C1", "6.3": "C1"
    };
    window.SELFIE_CONFIG.domains.forEach((dom) => {
      dom.items.forEach((it) => {
        if (!res[it.id]) {
          res[it.id] = defaultProfile[it.id] || "B1";
        }
      });
    });
    state.currentDraft.responses = res;
  }

  async function syncFromCloudIfNeeded() {
    try {
      const resp = await fetch("/api/selfie");
      if (resp.ok) {
        const data = await resp.json();
        if (data && Array.isArray(data.submissions) && data.submissions.length > 0) {
          state.cohortSubmissions = data.submissions;
          saveStateToStorage();
          if (state.activeTab === "dashboard") renderActiveTab();
        }
      }
    } catch (e) {
      // Running locally without Cloudflare Functions; local storage is used seamlessly
    }
  }

  async function pushSubmissionToCloud(submissionRecord) {
    try {
      await fetch("/api/selfie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_reflection",
          submission: submissionRecord
        })
      });
    } catch (e) {
      // Saved locally
    }
  }

  // Format bold markdown **text** to HTML
  function formatBold(str) {
    if (!str) return "";
    return String(str).replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-indigo-950 underline decoration-indigo-400 decoration-2 underline-offset-2">$1</strong>');
  }

  function setTab(tabId) {
    state.activeTab = tabId;
    renderHeaderNav();
    renderActiveTab();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleLanguage() {
    state.lang = state.lang === "he" ? "en" : "he";
    document.documentElement.dir = state.lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = state.lang;
    renderAll();
  }

  function setRole(roleId) {
    state.currentDraft.role = roleId;
    saveStateToStorage();
    renderAll();
  }

  function updateDraftField(field, value) {
    state.currentDraft[field] = value;
    saveStateToStorage();
    const pidEl = document.getElementById("live-pid-badge");
    if (pidEl) {
      pidEl.textContent = window.SelfieScoringEngine.hashParticipantId(
        state.currentDraft.email || state.currentDraft.name
      );
    }
  }

  function selectItemResponse(itemId, levelCode) {
    state.currentDraft.responses[itemId] = levelCode;
    saveStateToStorage();
    renderAssessmentView();
    renderTopQuickStats();
  }

  function applyQuickPreset(presetType) {
    const res = {};
    const allIds = [];
    window.SELFIE_CONFIG.domains.forEach((d) => d.items.forEach((i) => allIds.push(i.id)));

    if (presetType === "newcomer") {
      allIds.forEach((id, idx) => (res[id] = idx % 3 === 0 ? "A2" : "A1"));
      state.currentDraft.prePerception = "A2";
      state.currentDraft.postPerception = "A1";
    } else if (presetType === "integrator") {
      allIds.forEach((id, idx) => (res[id] = idx % 2 === 0 ? "B1" : "B2"));
      state.currentDraft.prePerception = "B1";
      state.currentDraft.postPerception = "B2";
    } else if (presetType === "pioneer") {
      allIds.forEach((id, idx) => (res[id] = idx % 3 === 0 ? "C2" : "C1"));
      state.currentDraft.prePerception = "C1";
      state.currentDraft.postPerception = "C2";
    } else if (presetType === "distortion_demo") {
      // Demonstrates Old SELFIE Flaws:
      // Pure B1 across almost everything, except high in Domain 6 (Administration/Communication)
      // In old EU SELFIE: jumps into B2 (Expert - 55%+) because of the 50% boundary & 9 items in Area 1!
      // In New SELFIE 2.0: accurately diagnosed at B1 (43.3%) with compensation alert!
      allIds.forEach((id) => (res[id] = "B1"));
      res["6.1"] = "C1";
      res["6.2"] = "B2";
      res["6.3"] = "C1";
      res["3.1"] = "A2";
      res["5.2"] = "A2";
      state.currentDraft.prePerception = "B2";
      state.currentDraft.postPerception = "B1";
    }

    state.currentDraft.responses = res;
    saveStateToStorage();
    renderAll();
    showToast("נטען פרופיל הדגמה לשאלון – ניתן לעבור מיד לדוח האישי ולראות את הניתוח!");
  }

  function submitCurrentReflection() {
    const pid = window.SelfieScoringEngine.hashParticipantId(
      state.currentDraft.email || state.currentDraft.name
    );
    const newRecord = {
      id: "sub_" + Date.now(),
      participantHash: pid,
      name: state.currentDraft.name || "משיב/ה",
      email: state.currentDraft.email || "",
      role: state.currentDraft.role,
      department: state.currentDraft.department,
      courseName: state.currentDraft.courseName,
      pulse: state.currentDraft.pulse,
      timestamp: new Date().toISOString(),
      prePerception: state.currentDraft.prePerception,
      postPerception: state.currentDraft.postPerception,
      personalGoal: state.currentDraft.personalGoal,
      artifactUrl: state.currentDraft.artifactUrl,
      reflectionNotes: state.currentDraft.reflectionNotes,
      responses: { ...state.currentDraft.responses }
    };

    // Replace existing record for same participantHash + pulse so paired structure stays clean
    const existingIdx = state.cohortSubmissions.findIndex(
      (s) => s.participantHash === pid && s.pulse === newRecord.pulse
    );
    if (existingIdx !== -1) {
      state.cohortSubmissions[existingIdx] = newRecord;
    } else {
      state.cohortSubmissions.unshift(newRecord);
    }

    saveStateToStorage();
    pushSubmissionToCloud(newRecord);
    showToast("השאלון נשמר ושויך למזהה המזווג הקבוע שלך (" + pid + ")!");
    setTab("report");
  }

  function showToast(msg) {
    const el = document.getElementById("selfie-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden", "opacity-0");
    el.classList.add("opacity-100");
    setTimeout(() => {
      el.classList.add("opacity-0");
      setTimeout(() => el.classList.add("hidden"), 300);
    }, 3800);
  }

  function renderAll() {
    renderHeaderNav();
    renderTopQuickStats();
    renderActiveTab();
  }

  function renderHeaderNav() {
    const navContainer = document.getElementById("main-tabs-nav");
    if (!navContainer) return;

    const tabs = [
      { id: "assessment", icon: "📝", labelHe: "1. שאלון סלפי 2.0", labelEn: "1. SELFIE 2.0 Survey" },
      { id: "report", icon: "📊", labelHe: "2. דוח אישי ושיבוץ למסלול", labelEn: "2. Personal Report & Track" },
      { id: "ai_advisor", icon: "🤖", labelHe: "3. יועץ AI לסילבוס", labelEn: "3. AI Syllabus Advisor" },
      { id: "badge", icon: "🏅", labelHe: "4. תעודה ותג דיגיטלי", labelEn: "4. Certificate & Badge" },
      { id: "dashboard", icon: "👑", labelHe: "5. דשבורד מחקרי מזווג (Pre-Post)", labelEn: "5. Paired Research Dashboard" },
      { id: "methodology", icon: "🔬", labelHe: "6. מעבדת הכשלים (ישן מול חדש)", labelEn: "6. Methodology Audit Lab" }
    ];

    navContainer.innerHTML = tabs
      .map((t) => {
        const active = state.activeTab === t.id;
        return `<button onclick="SelfieApp.setTab('${t.id}')"
          class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            active
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]"
              : "bg-white/80 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80"
          }">
          <span>${t.icon}</span>
          <span>${state.lang === "he" ? t.labelHe : t.labelEn}</span>
        </button>`;
      })
      .join("");

    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
      langBtn.innerHTML =
        state.lang === "he"
          ? `<span>🌐</span> <span>English (EFL)</span>`
          : `<span>🌐</span> <span>עברית (RTL)</span>`;
    }
  }

  function renderTopQuickStats() {
    const bar = document.getElementById("top-live-summary");
    if (!bar) return;

    const calc = window.SelfieScoringEngine.calculateSubmissionScores(state.currentDraft);
    const pid = window.SelfieScoringEngine.hashParticipantId(
      state.currentDraft.email || state.currentDraft.name
    );
    const profileObj = window.SELFIE_CONFIG.profiles[state.currentDraft.role];

    bar.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-sm">
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            ${profileObj.icon} ${state.lang === "he" ? profileObj.labelHe : profileObj.labelEn}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200" title="מזהה קבוע להשוואה מזווגת בין פעימה א׳ לפעימה ב׳">
            🔗 Paired ID: <span id="live-pid-badge">${pid}</span>
          </span>
          <span class="text-xs text-slate-500 hidden md:inline">
            6 תחומים מאוזנים (16.67% לכל תחום) • מותאם ל-10 דקות מילוי
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span class="text-xs text-slate-500">ציון סלפי 2.0 מתוקן:</span>
            <span class="text-sm font-black px-2 py-0.5 rounded-lg text-white" style="background:${calc.overallLevel.color}">
              ${calc.overallLevel.code} (${calc.overallScore}%)
            </span>
          </div>
          <div class="hidden sm:flex items-center gap-1.5 bg-amber-50/90 border border-amber-200 px-3 py-1.5 rounded-xl text-xs text-amber-900" title="מה שהיית מקבל בנוסחה המעוותת של ה-SELFIE האירופי הישן">
            <span>בסלפי הישן:</span>
            <span class="font-bold line-through decoration-rose-500">${calc.oldEuOverallLevel.code} (${calc.oldEuOverallScore}%)</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderActiveTab() {
    const main = document.getElementById("main-view-container");
    if (!main) return;

    if (state.activeTab === "assessment") renderAssessmentView();
    else if (state.activeTab === "report") renderReportView();
    else if (state.activeTab === "ai_advisor") renderAiAdvisorView();
    else if (state.activeTab === "badge") renderBadgeView();
    else if (state.activeTab === "dashboard") renderDashboardView();
    else if (state.activeTab === "methodology") renderMethodologyView();
  }

  // ===========================================================================
  // TAB 1: INTERACTIVE ASSESSMENT VIEW
  // ===========================================================================
  function renderAssessmentView() {
    const main = document.getElementById("main-view-container");
    const config = window.SELFIE_CONFIG;
    const draft = state.currentDraft;
    const isHe = state.lang === "he";
    const pid = window.SelfieScoringEngine.hashParticipantId(draft.email || draft.name);

    const activeDom = config.domains[state.activeDomainIdx] || config.domains[0];

    main.innerHTML = `
      <div class="space-y-6">
        <!-- Role, Paired Identity & Demo Presets Card -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>🎯</span>
                <span>${isHe ? "הגדרת פרופיל וזיהוי מזווג רב-פעימתי (Longitudinal Paired ID)" : "Profile & Longitudinal Paired Identification"}</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-600 mt-1">
                ${isHe
                  ? "המערכת מתאימה את ניסוח השאלות לתפקידך ומייצרת מזהה מזווג קבוע כדי להבטיח שפעימה א׳ תושווה אך ורק לפעימה ב׳ של אותו אדם."
                  : "Questions adapt to your role and generate a persistent Paired ID so Pulse 1 is strictly compared with Pulse 2 of the same individual."}
              </p>
            </div>

            <!-- Role Switcher Pills -->
            <div class="flex flex-wrap gap-2">
              ${Object.values(config.profiles)
                .map((prof) => {
                  const active = draft.role === prof.id;
                  return `<button onclick="SelfieApp.setRole('${prof.id}')"
                    class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }">
                    <span>${prof.icon}</span>
                    <span>${isHe ? prof.labelHe : prof.labelEn}</span>
                  </button>`;
                })
                .join("")}
            </div>
          </div>

          <!-- Form Fields for Paired Identification -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">${isHe ? "שם מלא (או כינוי קבוע)" : "Full Name / Alias"}</label>
              <input type="text" value="${draft.name}" oninput="SelfieApp.updateDraftField('name', this.value)"
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none"
                placeholder="${isHe ? "למשל: ד״ר אושרי זיגלבוים" : "e.g., Dr. Sarah Levine"}" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">${isHe ? "אימייל מוסדי (לזיווג Pre-Post)" : "Institutional Email (Paired Key)"}</label>
              <input type="email" value="${draft.email}" oninput="SelfieApp.updateDraftField('email', this.value)"
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none font-mono"
                placeholder="name@oranim.ac.il" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">${isHe ? "חוג / יחידה אקדמית" : "Department / Unit"}</label>
              <select onchange="SelfieApp.updateDraftField('department', this.value)"
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none bg-white">
                ${config.departments
                  .map(
                    (d) =>
                      `<option value="${d.id}" ${draft.department === d.id ? "selected" : ""}>${
                        isHe ? d.nameHe : d.nameEn
                      }</option>`
                  )
                  .join("")}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">${isHe ? "פעימת מדידה" : "Assessment Pulse"}</label>
              <select onchange="SelfieApp.updateDraftField('pulse', this.value)"
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-indigo-300 bg-indigo-50/50 font-bold text-indigo-950 focus:outline-none">
                ${config.pulses
                  .map(
                    (p) =>
                      `<option value="${p.id}" ${draft.pulse === p.id ? "selected" : ""}>${
                        isHe ? p.nameHe : p.nameEn
                      }</option>`
                  )
                  .join("")}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">${isHe ? "קורס / מקצוע מרכזי" : "Primary Course / Subject"}</label>
              <input type="text" value="${draft.courseName}" oninput="SelfieApp.updateDraftField('courseName', this.value)"
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none"
                placeholder="${isHe ? "שם הקורס לשדרוג הסילבוס" : "Course name"}" />
            </div>
          </div>

          <!-- Pre-perception & Quick Demo Fill Bar -->
          <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold text-slate-700">💭 ${isHe ? "איך את/ה מעריך/ה את רמתך לפני מילוי השאלון?" : "Self-perceived level BEFORE taking the survey:"}</span>
              <div class="flex gap-1">
                ${config.levels
                  .map((lv) => {
                    const active = draft.prePerception === lv.code;
                    return `<button onclick="SelfieApp.updateDraftField('prePerception', '${lv.code}'); SelfieApp.renderAssessmentView();"
                      class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        active
                          ? "text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }" style="${active ? "background:" + lv.color : ""}">
                      ${lv.code}
                    </button>`;
                  })
                  .join("")}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-[11px] font-bold text-slate-500 ml-1">⚡ ${isHe ? "מילוי הדגמה מהיר:" : "Quick Demo Presets:"}</span>
              <button onclick="SelfieApp.applyQuickPreset('newcomer')" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700">🌱 ${isHe ? "מתחיל (A1-A2)" : "Newcomer"}</button>
              <button onclick="SelfieApp.applyQuickPreset('integrator')" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200">🚀 ${isHe ? "משלב (B1-B2)" : "Integrator"}</button>
              <button onclick="SelfieApp.applyQuickPreset('pioneer')" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200">👑 ${isHe ? "חלוץ (C1-C2)" : "Pioneer"}</button>
              <button onclick="SelfieApp.applyQuickPreset('distortion_demo')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200">⚠️ ${isHe ? "הדגמת עיוות הסלפי הישן" : "Old SELFIE Flaw Demo"}</button>
            </div>
          </div>
        </div>

        <!-- 6 Balanced Domains Stepper -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          ${config.domains
            .map((dom, idx) => {
              const isSelected = state.activeDomainIdx === idx;
              const answeredCount = dom.items.filter((i) => draft.responses[i.id]).length;
              return `<button onclick="SelfieApp.setDomainIdx(${idx})"
                class="flex flex-col items-start p-3 rounded-2xl border text-right transition-all ${
                  isSelected
                    ? "bg-white border-2 shadow-md scale-[1.01]"
                    : "bg-white/70 border-slate-200 hover:bg-white"
                }" style="${isSelected ? "border-color:" + dom.color : ""}">
                <div class="flex items-center justify-between w-full mb-1">
                  <span class="text-lg">${dom.icon}</span>
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">${answeredCount}/3 • 16.7%</span>
                </div>
                <div class="text-xs font-extrabold text-slate-900 line-clamp-1">${dom.num}. ${
                isHe ? dom.shortHe : dom.shortEn
              }</div>
              </button>`;
            })
            .join("")}
        </div>

        <!-- Active Domain Header & 3 Items -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div class="p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3" style="background: linear-gradient(135deg, ${activeDom.color}, #1e1b4b)">
            <div>
              <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-90">
                <span>${isHe ? `תחום ${activeDom.num} מתוך 6 (משקל קבוע ומאוזן: 16.67%)` : `Domain ${activeDom.num} of 6 (Balanced Weight: 16.67%)`}</span>
                <span>•</span>
                <span>${activeDom.sourceRef}</span>
              </div>
              <h3 class="text-xl font-black mt-1 flex items-center gap-2">
                <span>${activeDom.icon}</span>
                <span>${isHe ? activeDom.titleHe : activeDom.titleEn}</span>
              </h3>
              <p class="text-xs sm:text-sm opacity-90 mt-1">${activeDom.descHe}</p>
            </div>
            <div class="flex items-center gap-2 self-end sm:self-center">
              ${
                state.activeDomainIdx > 0
                  ? `<button onclick="SelfieApp.setDomainIdx(${state.activeDomainIdx - 1})" class="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold">→ ${isHe ? "תחום קודם" : "Prev"}</button>`
                  : ""
              }
              ${
                state.activeDomainIdx < config.domains.length - 1
                  ? `<button onclick="SelfieApp.setDomainIdx(${state.activeDomainIdx + 1})" class="px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold">${isHe ? "התחום הבא" : "Next"} ←</button>`
                  : ""
              }
            </div>
          </div>

          <div class="divide-y divide-slate-200">
            ${activeDom.items
              .map((item) => {
                const selectedCode = draft.responses[item.id] || "B1";
                const introText = isHe
                  ? item.introHe[draft.role] || item.introHe.lecturer
                  : item.introEn;
                const statements = isHe ? item.statementsHe : item.statementsEn;

                return `
                  <div class="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors">
                    <div class="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-black text-white mr-1" style="background:${activeDom.color}">
                          ${item.id}
                        </span>
                        <h4 class="inline text-base sm:text-lg font-extrabold text-slate-900">
                          ${isHe ? item.titleHe : item.titleEn}
                        </h4>
                        <p class="text-xs sm:text-sm text-slate-600 mt-1">${introText}</p>
                      </div>
                      <button onclick="SelfieApp.selectItemResponse('${item.id}', 'NA')"
                        class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedCode === "NA"
                            ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }" title="מוחרג מהמכנה ואינו מוריד את ממוצע התחום (תיקון כשל האופציה השביעית בסלפי הישן)">
                        🚫 ${isHe ? "לא רלוונטי לתפקידי/לקורס (מוחרג מהמכנה)" : "Not Applicable (Excluded from denominator)"}
                      </button>
                    </div>

                    <!-- 6 Progression Statements Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
                      ${config.levels
                        .map((lv) => {
                          const isChosen = selectedCode === lv.code;
                          const stText = statements[lv.code] || "";
                          return `
                            <div onclick="SelfieApp.selectItemResponse('${item.id}', '${lv.code}')"
                              class="cursor-pointer rounded-xl p-3.5 border-2 transition-all flex flex-col justify-between ${
                                isChosen
                                  ? "bg-indigo-50/70 shadow-md scale-[1.01]"
                                  : "bg-white border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50"
                              }" style="${isChosen ? "border-color:" + lv.color : ""}">
                              <div>
                                <div class="flex items-center justify-between gap-2 mb-2">
                                  <span class="px-2.5 py-0.5 rounded-lg text-xs font-black text-white" style="background:${lv.color}">
                                    ${lv.code} • ${lv.normalizedScore}%
                                  </span>
                                  <span class="text-[11px] font-bold text-slate-500">${isHe ? lv.titleHe : lv.titleEn}</span>
                                </div>
                                <p class="text-xs sm:text-[13px] text-slate-800 leading-relaxed">
                                  ${formatBold(stText)}
                                </p>
                              </div>
                              <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span>${lv.taxonomyStageHe}</span>
                                ${isChosen ? `<span class="font-bold text-indigo-700">✔ נבחר</span>` : `<span>בחר/י</span>`}
                              </div>
                            </div>
                          `;
                        })
                        .join("")}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>

          <!-- Footer Navigation & Submit -->
          <div class="bg-slate-50 p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold text-slate-700">🎯 ${isHe ? "תפיסת מסוגלות לאחר הרפלקציה:" : "Self-perceived level AFTER reflection:"}</span>
              ${config.levels
                .map((lv) => {
                  const active = draft.postPerception === lv.code;
                  return `<button onclick="SelfieApp.updateDraftField('postPerception', '${lv.code}'); SelfieApp.renderAssessmentView();"
                    class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      active ? "text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
                    }" style="${active ? "background:" + lv.color : ""}">
                    ${lv.code}
                  </button>`;
                })
                .join("")}
            </div>

            <div class="flex items-center gap-3">
              ${
                state.activeDomainIdx < config.domains.length - 1
                  ? `<button onclick="SelfieApp.setDomainIdx(${state.activeDomainIdx + 1})"
                      class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow">
                      המשך לתחום ${state.activeDomainIdx + 2} מתוך 6 ←
                    </button>`
                  : ""
              }
              <button onclick="SelfieApp.submitCurrentReflection()"
                class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                <span>📊</span>
                <span>${isHe ? "שמור שאלון והפק דוח אישי + שיבוץ למסלול" : "Save & Generate Personal Report"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setDomainIdx(idx) {
    state.activeDomainIdx = idx;
    renderAssessmentView();
  }

  // ===========================================================================
  // TAB 2: PERSONAL REPORT & DIFFERENTIAL TRACK ASSIGNMENT
  // ===========================================================================
  function renderReportView() {
    const main = document.getElementById("main-view-container");
    const calc = window.SelfieScoringEngine.calculateSubmissionScores(state.currentDraft);
    const pid = window.SelfieScoringEngine.hashParticipantId(
      state.currentDraft.email || state.currentDraft.name
    );

    // Check if this participant has both Pre & Post in cohortSubmissions for Personal Paired Delta!
    const myPre = state.cohortSubmissions.find(
      (s) => s.participantHash === pid && s.pulse === "pre_2026"
    );
    const myPost = state.cohortSubmissions.find(
      (s) => s.participantHash === pid && s.pulse === "post_2027"
    );
    let personalPairedHtml = "";
    if (myPre && myPost) {
      const preCalc = window.SelfieScoringEngine.calculateSubmissionScores(myPre);
      const postCalc = window.SelfieScoringEngine.calculateSubmissionScores(myPost);
      const myDelta = Math.round((postCalc.overallScore - preCalc.overallScore) * 10) / 10;
      personalPairedHtml = `
        <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white mb-1">
                ✔ זיהוי מזווג אישי נמצא במערכת (${pid})
              </span>
              <h3 class="text-base sm:text-lg font-black text-emerald-950">
                ההתקדמות האישית המזווגת שלך: מפעימה א׳ (פתיחת שנה) לפעימה ב׳ (סיום שנה)
              </h3>
              <p class="text-xs text-emerald-800">
                השוואה מדויקת של התשובות שלך עצמך בין שתי הפעימות (ללא ערבוב עם משיבים אחרים).
              </p>
            </div>
            <div class="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-emerald-200 shadow-sm">
              <div class="text-center">
                <div class="text-[11px] text-slate-500">פעימה א׳ (Pre)</div>
                <div class="text-base font-black text-slate-800">${preCalc.overallLevel.code} (${preCalc.overallScore}%)</div>
              </div>
              <div class="text-lg font-black text-emerald-600">←</div>
              <div class="text-center">
                <div class="text-[11px] text-slate-500">פעימה ב׳ (Post)</div>
                <div class="text-base font-black text-emerald-700">${postCalc.overallLevel.code} (${postCalc.overallScore}%)</div>
              </div>
              <div class="px-3 py-1 rounded-lg bg-emerald-600 text-white font-black text-sm">
                ${myDelta >= 0 ? "+" + myDelta : myDelta}% Δ
              </div>
            </div>
          </div>
        </div>
      `;
    }

    main.innerHTML = `
      <div class="space-y-6">
        ${personalPairedHtml}

        <!-- Top 3 Summary Cards: Gauge, Dual-Axis & Model Comparison, Differential Track -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- Card 1: Symmetric Normalized Speedometer Gauge -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col items-center justify-between text-center">
            <div class="w-full flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500">רמת כשירות כוללת (מאוזנת 0–100%)</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">6 צירים שווי-משקל</span>
            </div>

            <div class="my-2">
              ${buildGaugeSvg(calc.overallScore, calc.overallLevel)}
            </div>

            <div class="w-full bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-right">
              <div class="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>${calc.overallLevel.titleHe}</span>
                <span style="color:${calc.overallLevel.color}">${calc.overallLevel.taxonomyStageHe}</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">${calc.overallLevel.descHe}</p>
            </div>
          </div>

          <!-- Card 2: Dual Axis (Pedagogy vs Leadership) + Old vs New SELFIE Comparison -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 class="text-sm font-black text-slate-900 mb-1">🔀 הפרדת צירים: עומק פדגוגי מול הובלת עמיתים</h3>
              <p class="text-xs text-slate-500 mb-3">
                בניגוד ל-SELFIE הישן שבו מרצה ללא תפקיד הדרכתי נחסם מרמות C1–C2, כאן שני הצירים נמדדים בנפרד:
              </p>

              <div class="space-y-3">
                <div class="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200">
                  <div class="flex items-center justify-between text-xs font-bold text-indigo-950 mb-1">
                    <span>🎓 מדד עומק פדגוגי ו-AI בהוראה</span>
                    <span class="px-2 py-0.5 rounded bg-indigo-600 text-white">${calc.pedagogicalLevel.code} • ${calc.pedagogicalIndex}%</span>
                  </div>
                  <div class="w-full h-2.5 bg-indigo-100 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-600 rounded-full" style="width:${calc.pedagogicalIndex}%"></div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-sky-50/60 border border-sky-200">
                  <div class="flex items-center justify-between text-xs font-bold text-sky-950 mb-1">
                    <span>🤝 מדד הובלת עמיתים ומערכתיות בחוג</span>
                    <span class="px-2 py-0.5 rounded bg-sky-600 text-white">${calc.leadershipLevel.code} • ${calc.leadershipIndex}%</span>
                  </div>
                  <div class="w-full h-2.5 bg-sky-100 rounded-full overflow-hidden">
                    <div class="h-full bg-sky-600 rounded-full" style="width:${calc.leadershipIndex}%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Live Audit Box: What Old EU SELFIE Would Have Calculated -->
            <div class="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300">
              <div class="flex items-center justify-between text-xs font-black text-amber-950 mb-1">
                <span>⚖️ השוואה חיה מול נוסחת ה-SELFIE הישן:</span>
                <span class="px-2 py-0.5 rounded bg-amber-200 text-amber-950">פער: ${calc.scoreDistortionGap > 0 ? "+" : ""}${calc.scoreDistortionGap}%</span>
              </div>
              <p class="text-[11px] text-amber-900 leading-relaxed">
                על אותן תשובות בדיוק, הכלי האירופי הישן היה מחשב לך <strong>${calc.oldEuOverallScore}% (${calc.oldEuOverallLevel.code})</strong> במקום <strong>${calc.overallScore}% (${calc.overallLevel.code})</strong> בגלל רצפת ה-16.7%, משקל היתר של 9 שאלות מנהלה, והספים הלא-סימטריים.
              </p>
              ${
                calc.hasCompensationWarning
                  ? `<div class="mt-2 pt-2 border-t border-amber-300 text-[11px] font-bold text-rose-800">
                      ⚠️ זוהתה 'הטיית פיצוי': ציון ארגוני גבוה ממסך פער בציר "${calc.minCoreDomain.shortHe}" (${calc.minCoreDomain.score}%). השיבוץ למסלול תוקן בהתאם!
                    </div>`
                  : ""
              }
            </div>
          </div>

          <!-- Card 3: Automatic Differential Training Track Assignment & Metacognitive Calibration -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div class="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
              <div class="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
                🎯 שיבוץ אוטומטי למסלול הדרכה דיפרנציאלי (פריזמה אורנים)
              </div>
              <h3 class="text-base sm:text-lg font-black text-white">
                ${calc.assignedTrack.nameHe}
              </h3>
              <p class="text-xs text-slate-200 mt-1.5 leading-relaxed">
                ${calc.assignedTrack.descHe}
              </p>
              <div class="mt-3 pt-2.5 border-t border-white/15 text-xs text-indigo-200">
                <strong>תוצר יישומי במסלול:</strong> ${calc.assignedTrack.deliverableHe}
              </div>
            </div>

            <!-- Metacognitive Calibration Pre vs Actual vs Post -->
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-xs font-black text-slate-800 mb-2">🪞 כיול מטה-קוגניטיבי (תפיסה עצמית מול ביצוע בפועל)</div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white p-2 rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-500">לפני השאלון</div>
                  <div class="text-sm font-black text-slate-800">${calc.metacognitive.preCode}</div>
                </div>
                <div class="bg-indigo-50 p-2 rounded-lg border border-indigo-200">
                  <div class="text-[10px] text-indigo-700 font-bold">בפועל (מדוד)</div>
                  <div class="text-sm font-black text-indigo-900">${calc.metacognitive.actualCode} (${calc.overallScore}%)</div>
                </div>
                <div class="bg-white p-2 rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-500">אחרי הרפלקציה</div>
                  <div class="text-sm font-black text-slate-800">${calc.metacognitive.postCode}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Radar Chart & Domain Bars Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- 6-Domain Radar Chart -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col items-center">
            <div class="w-full flex items-center justify-between mb-2">
              <h3 class="text-base font-black text-slate-900">🕸️ מפת רדאר טכנו-פדגוגית ו-AI לפי 6 התחומים</h3>
              <span class="text-xs text-slate-500">משקל שווה: 16.67% לכל ציר</span>
            </div>
            <div class="w-full flex justify-center">
              ${buildRadarSvg(calc.domainResults)}
            </div>
          </div>

          <!-- 6-Domain Horizontal Breakdown & Old vs New per Domain -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-base font-black text-slate-900 mb-1">📊 פירוט ציונים לפי תחומים (0–100% מנורמל)</h3>
              <p class="text-xs text-slate-500 mb-4">כל תחום מורכב מ-3 היגדי ליבה מאוזנים. פריטים שסומנו "לא רלוונטי" הוחרגו מהמכנה.</p>

              <div class="space-y-3.5">
                ${calc.domainResults
                  .map(
                    (d) => `
                  <div>
                    <div class="flex items-center justify-between text-xs font-bold mb-1">
                      <span class="flex items-center gap-1.5 text-slate-800">
                        <span>${d.icon}</span>
                        <span>${d.num}. ${d.titleHe}</span>
                        ${d.naItems > 0 ? `<span class="text-[10px] px-1.5 py-0.2 bg-slate-200 rounded">(${d.naItems} הוחרגו)</span>` : ""}
                      </span>
                      <span class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-white font-black" style="background:${d.level.color}">${d.level.code}</span>
                        <span class="font-black text-slate-900">${d.score}%</span>
                      </span>
                    </div>
                    <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500" style="width:${Math.max(4, d.score)}%; background:${d.color}"></div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button onclick="SelfieApp.setTab('ai_advisor')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm">
                🤖 גזור תוכנית עבודה וכרטיס AI לסילבוס ←
              </button>
              <button onclick="SelfieApp.setTab('badge')" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold">
                🏅 לתעודה ולתג הדיגיטלי
              </button>
            </div>
          </div>
        </div>

        <!-- Top 3 Priority Growth Recommendations -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <h3 class="text-base sm:text-lg font-black text-slate-900 mb-1">🚀 3 צעדים ממוקדים לקפיצת מדרגה ("Level Up" אישי)</h3>
          <p class="text-xs text-slate-500 mb-4">המלצות יישומיות מיידיות שנגזרו מתוך 3 ההיגדים שבהם יש לך את פוטנציאל הצמיחה הגבוה ביותר:</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${calc.priorityGrowthItems
              .map(
                (it, idx) => `
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="px-2 py-0.5 rounded text-[11px] font-black text-white" style="background:${it.domainColor}">
                      יעד ${idx + 1} • סעיף ${it.itemId}
                    </span>
                    <span class="text-xs font-bold text-slate-700">
                      מ-${it.code} ← ל-${it.nextLevelCode}
                    </span>
                  </div>
                  <h4 class="text-sm font-extrabold text-slate-900 mb-1.5">${it.itemTitleHe}</h4>
                  <p class="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                    💡 <strong>המלצה ליישום:</strong> ${it.levelUpTipHe}
                  </p>
                </div>
                <div class="mt-2 text-[11px] text-slate-500 font-semibold">תחום: ${it.domainShortHe}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // TAB 3: AI SYLLABUS & PEDAGOGY ARCHITECT VIEW
  // ===========================================================================
  function renderAiAdvisorView() {
    const main = document.getElementById("main-view-container");
    const calc = window.SelfieScoringEngine.calculateSubmissionScores(state.currentDraft);
    const blueprint = window.SelfieAiAdvisor.generateSyllabusBlueprint(
      state.currentDraft,
      calc,
      state.aiOptions
    );

    main.innerHTML = `
      <div class="space-y-6">
        <!-- Controls Header -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mb-1">
                🤖 אדריכל סילבוס ופדגוגיה מבוסס פרופיל SELFIE 2.0
              </span>
              <h2 class="text-lg sm:text-xl font-black text-slate-900">
                תוכנית עבודה אישית לקורס וכרטיס מדיניות AI מוכן לסילבוס
              </h2>
              <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
                מותאם אוטומטית לרמת הכשירות שלך (${calc.overallLevel.code} – ${calc.overallScore}%), למסלול ההכשרה שלך ולמודל כשירויות AI 2.0 של משרד החינוך ("ללמוד, ללמד, לשכתב").
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">שם הקורס / המקצוע לשדרוג</label>
              <input type="text" value="${blueprint.courseName}"
                oninput="SelfieApp.updateAiOption('courseName', this.value)"
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">מאפייני הלומדים בקורס</label>
              <select onchange="SelfieApp.updateAiOption('learnerType', this.value)"
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none">
                <option value="שנה א׳ – מבואות ומיומנויות אקדמיות" ${blueprint.learnerType.includes("שנה א") ? "selected" : ""}>שנה א׳ – מבואות ומיומנויות אקדמיות</option>
                <option value="שנים א׳–ג׳ (הכשרת מורים)" ${blueprint.learnerType.includes("א׳–ג׳") ? "selected" : ""}>שנים א׳–ג׳ (הכשרת מורים והתנסות)</option>
                <option value="סמינריון מחקרי / תואר שני M.Ed" ${blueprint.learnerType.includes("סמינריון") ? "selected" : ""}>סמינריון מחקרי / תואר שני M.Ed</option>
                <option value="מסלול הסבת אקדמאים להוראה" ${blueprint.learnerType.includes("הסבת") ? "selected" : ""}>מסלול הסבת אקדמאים להוראה</option>
                <option value="תלמידי בית ספר (יסודי / על-יסודי)" ${blueprint.learnerType.includes("תלמידי") ? "selected" : ""}>תלמידי בית ספר (יסודי / על-יסודי)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">מודל מדיניות AI בקורס</label>
              <select onchange="SelfieApp.updateAiOption('policyMode', this.value)"
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-indigo-300 bg-indigo-50/50 font-bold text-indigo-950 focus:outline-none">
                <option value="dual_track" ${blueprint.policyMode === "dual_track" ? "selected" : ""}>⚖️ מודל הנתיב הכפול (מוגן ללא AI + משלב AI)</option>
                <option value="guided_ai" ${blueprint.policyMode === "guided_ai" ? "selected" : ""}>🚀 שילוב AI מונחה מלא (Human-in-the-Loop)</option>
                <option value="protected_core" ${blueprint.policyMode === "protected_core" ? "selected" : ""}>🛡️ ליבת הערכה מוגנת + AI כחונך למידה בלבד</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Ready-to-Copy Syllabus AI Policy Card (Mandatory Field in Oranim Syllabus) -->
        <div class="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
            <div>
              <span class="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-1">
                ${blueprint.policyBadge}
              </span>
              <h3 class="text-lg font-black">${blueprint.policyCardTitle}</h3>
              <p class="text-xs text-slate-300">מוכן להעתקה ולהדבקה בשדה החובה של כרטיס ה-AI במערכת הסילבוסים וב-Moodle</p>
            </div>
            <button onclick="SelfieApp.copySyllabusCard()" class="px-4 py-2 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 text-xs font-black shadow self-start sm:self-center">
              📋 העתק כרטיס מדיניות לסילבוס
            </button>
          </div>

          <div id="syllabus-policy-card-text" class="space-y-2.5 pt-4 text-xs sm:text-sm text-slate-100 leading-relaxed">
            <div class="font-bold text-indigo-200">קורס: "${blueprint.courseName}" | ${blueprint.deptNameHe}</div>
            ${blueprint.policyRulesHe
              .map((rule) => `<div class="p-3 rounded-xl bg-white/10 border border-white/10">${formatBold(rule)}</div>`)
              .join("")}
          </div>
        </div>

        <!-- 3-Tier Plan: Learn, Teach, Rewrite -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <h3 class="text-base sm:text-lg font-black text-slate-900 mb-1">
            🧭 תוכנית עבודה ב-3 רמות מעורבות: ללמוד • ללמד • לשכתב
          </h3>
          <p class="text-xs text-slate-500 mb-4">
            מבוסס על מודל כשירויות בינה מלאכותית 2.0 למורים (פילו ואליוסף, משרד החינוך) ונגזר מהפרופיל האישי שלך:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${blueprint.threeTierPlan
              .map(
                (t, idx) => `
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-black bg-indigo-600 text-white mb-2">
                    ${t.stage}
                  </span>
                  <div class="text-xs font-bold text-slate-500 mb-1">ציר מיקוד: ${t.focusDomain} (${t.currentLevel})</div>
                  <p class="text-xs sm:text-sm text-slate-800 leading-relaxed">${formatBold(t.actionHe)}</p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Dual-Track Assignment Blueprint & Rubric -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <h3 class="text-base font-black text-slate-900 mb-3">📐 ${blueprint.assignmentBlueprint.titleHe}</h3>
            <div class="space-y-3">
              ${blueprint.assignmentBlueprint.stepsHe
                .map(
                  (s) => `
                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div class="text-xs font-black text-indigo-700 mb-0.5">${s.trackType}</div>
                  <div class="text-sm font-extrabold text-slate-900">${s.stepNum}. ${s.title}</div>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">${s.desc}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-base font-black text-slate-900 mb-3">📋 מחוון הערכה מומלץ למטלה משולבת AI</h3>
              <div class="overflow-hidden rounded-xl border border-slate-200">
                <table class="w-full text-right text-xs">
                  <thead class="bg-slate-100 text-slate-800 font-bold">
                    <tr>
                      <th class="p-2.5">קריטריון הערכה</th>
                      <th class="p-2.5 w-16 text-center">משקל</th>
                      <th class="p-2.5">מה נבדק בפועל?</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    ${blueprint.assignmentBlueprint.rubricCriteria
                      .map(
                        (r) => `
                      <tr>
                        <td class="p-2.5 font-bold text-slate-900">${r.criterion}</td>
                        <td class="p-2.5 text-center font-black text-indigo-700">${r.weight}</td>
                        <td class="p-2.5 text-slate-600">${r.desc}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Copyable AI Mega-Prompt -->
            <div class="mt-4 p-3.5 rounded-xl bg-purple-50 border border-purple-200">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-black text-purple-950">✨ מגה-פרומפט מותאם אישית להמשך פיתוח מול Claude / ChatGPT / Gemini</span>
                <button onclick="SelfieApp.copyMegaPrompt()" class="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold">
                  העתק פרומפט
                </button>
              </div>
              <pre id="advisor-mega-prompt" class="text-[11px] text-purple-900 whitespace-pre-wrap font-sans bg-white/80 p-2.5 rounded-lg border border-purple-200 max-h-28 overflow-y-auto">${blueprint.copyablePrompt}</pre>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function updateAiOption(key, val) {
    state.aiOptions[key] = val;
    if (key === "courseName") {
      state.currentDraft.courseName = val;
      saveStateToStorage();
    }
    renderAiAdvisorView();
  }

  function copySyllabusCard() {
    const el = document.getElementById("syllabus-policy-card-text");
    if (!el) return;
    navigator.clipboard.writeText(el.innerText);
    showToast("כרטיס מדיניות ה-AI לסילבוס הועתק ללוח!");
  }

  function copyMegaPrompt() {
    const el = document.getElementById("advisor-mega-prompt");
    if (!el) return;
    navigator.clipboard.writeText(el.innerText);
    showToast("המגה-פרומפט האישי הועתק ללוח!");
  }

  // ===========================================================================
  // TAB 4: DIGITAL BADGE, CERTIFICATE & ePORTFOLIO
  // ===========================================================================
  function renderBadgeView() {
    const main = document.getElementById("main-view-container");
    const calc = window.SelfieScoringEngine.calculateSubmissionScores(state.currentDraft);
    const draft = state.currentDraft;
    const pid = window.SelfieScoringEngine.hashParticipantId(draft.email || draft.name);
    const deptObj =
      window.SELFIE_CONFIG.departments.find((d) => d.id === draft.department) ||
      window.SELFIE_CONFIG.departments[0];
    const pulseObj =
      window.SELFIE_CONFIG.pulses.find((p) => p.id === draft.pulse) ||
      window.SELFIE_CONFIG.pulses[0];
    const dateStr = new Date().toLocaleDateString("he-IL");

    main.innerHTML = `
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Official Certificate (2 cols) -->
          <div class="lg:col-span-2 bg-white rounded-2xl border-2 border-indigo-200 p-6 sm:p-8 shadow-md relative overflow-hidden" id="printable-certificate">
            <div class="border-4 border-double border-indigo-900/20 rounded-xl p-6 relative">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div class="text-xs font-black uppercase tracking-widest text-indigo-600">
                    מכללת אורנים • תוכנית פריזמה • המרכז לקידום הוראה וחדשנות
                  </div>
                  <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    תעודת השלמת מיפוי ורפלקציה טכנו-פדגוגית (SELFIE 2.0)
                  </h2>
                </div>
                <div class="shrink-0">
                  ${buildDigitalBadgeSvg(calc.overallLevel, calc.overallScore)}
                </div>
              </div>

              <div class="py-6 space-y-4 text-right">
                <p class="text-sm text-slate-600">זאת לתעודה כי:</p>
                <div class="text-2xl font-black text-indigo-950">${draft.name || "משתתף/ת"}</div>
                <div class="text-sm font-bold text-slate-700">
                  ${deptObj.nameHe} • קורס/תחום: "${draft.courseName}"
                </div>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  השלים/ה בהצלחה את תהליך הרפלקציה והמיפוי העצמי במודל <strong>SELFIE 2.0 המשופר</strong> (המשלב את מסגרת DigCompEdu האירופית עם מודל כשירויות הבינה המלאכותית 2.0 של משרד החינוך) במסגרת <strong>${pulseObj.nameHe}</strong>.
                </p>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div class="text-[11px] text-slate-500">רמת כשירות כוללת</div>
                    <div class="text-base font-black" style="color:${calc.overallLevel.color}">${calc.overallLevel.code} (${calc.overallScore}%)</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div class="text-[11px] text-slate-500">מדד פדגוגיה ו-AI</div>
                    <div class="text-base font-black text-indigo-900">${calc.pedagogicalLevel.code} (${calc.pedagogicalIndex}%)</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div class="text-[11px] text-slate-500">מסלול מותאם</div>
                    <div class="text-xs font-black text-slate-800">${calc.assignedTrack.nameHe.split(":")[0]}</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div class="text-[11px] text-slate-500">מזהה מחקרי מזווג</div>
                    <div class="text-xs font-mono font-bold text-emerald-800">${pid}</div>
                  </div>
                </div>

                <div class="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950">
                  <strong>🎯 יעד שינוי ופיתוח אישי שנבחר:</strong> ${draft.personalGoal || "שילוב מושכל של נתיב מוגן ונתיב משלב AI בהוראה ובהערכה"}
                </div>
              </div>

              <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div>תאריך הפקה: <strong>${dateStr}</strong></div>
                <div>אימות מתודולוגי: <strong>Paired Longitudinal Engine v2.0</strong></div>
                <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow print:hidden">
                  🖨️ הדפס / שמור תעודה כ-PDF
                </button>
              </div>
            </div>
          </div>

          <!-- ePortfolio & Personal Goal Journal (1 col) -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 class="text-base font-black text-slate-900 mb-1">📂 תיק עבודות רפלקטיבי (ePortfolio)</h3>
              <p class="text-xs text-slate-500 mb-4">
                תיעוד יעד השינוי האישי והתוצר היישומי שלך בין פעימה א׳ לפעימה ב׳:
              </p>

              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">יעד השינוי האישי שלי בקורס השנה:</label>
                  <textarea rows="3" oninput="SelfieApp.updateDraftField('personalGoal', this.value)"
                    class="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none">${draft.personalGoal}</textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">קישור לתוצר / מטלה משודרגת / בוט קורסי:</label>
                  <input type="url" value="${draft.artifactUrl || ""}" oninput="SelfieApp.updateDraftField('artifactUrl', this.value)"
                    placeholder="https://..."
                    class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none font-mono" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">רפלקציה על ההפעלה בכיתה ועל תוצרי הלומדים:</label>
                  <textarea rows="4" oninput="SelfieApp.updateDraftField('reflectionNotes', this.value)"
                    placeholder="מה עבד היטב? אילו אתגרים עלו בשילוב ה-AI? מה אדייק בפעימה הבאה?"
                    class="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none">${draft.reflectionNotes || ""}</textarea>
                </div>
              </div>
            </div>

            <button onclick="SelfieApp.submitCurrentReflection()"
              class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow">
              💾 שמור יעד ותיעוד בתיק העבודות המזווג
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // TAB 5: INSTITUTIONAL & RESEARCH DASHBOARD (TRUE PAIRED PRE-POST ENGINE)
  // ===========================================================================
  function renderDashboardView() {
    const main = document.getElementById("main-view-container");
    const config = window.SELFIE_CONFIG;
    const analysis = window.SelfieScoringEngine.calculateInstitutionalPairedAnalysis(
      state.cohortSubmissions,
      state.dashboardFilterDept,
      state.dashboardFilterRole
    );

    const ps = analysis.pairedStats;
    const us = analysis.unmatchedStats;
    const isPairedMode = state.dashboardComparisonMode === "paired_valid";

    main.innerHTML = `
      <div class="space-y-6">
        <!-- Dashboard Header & Filters -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-900">
                  👑 חדר מחקר וניהול מוסדי • אורנים – פריזמה
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                  מנוע השוואה מזווגת (Paired Within-Subjects)
                </span>
              </div>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-1">
                דשבורד מיפוי אוריינות סגל והשוואת פעימה א׳ מול פעימה ב׳ של אותם נבדקים בדיוק
              </h2>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <select onchange="SelfieApp.setDashboardDept(this.value)"
                class="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white">
                <option value="all" ${state.dashboardFilterDept === "all" ? "selected" : ""}>🏛️ כלל החוגים והיחידות (${state.cohortSubmissions.length} שאלונים)</option>
                ${config.departments
                  .map(
                    (d) =>
                      `<option value="${d.id}" ${state.dashboardFilterDept === d.id ? "selected" : ""}>${d.nameHe}</option>`
                  )
                  .join("")}
              </select>

              <button onclick="SelfieApp.exportPairedCsv()"
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5">
                <span>📥</span>
                <span>ייצוא קובץ מחקר מזווג (CSV / SPSS)</span>
              </button>
            </div>
          </div>

          <!-- Methodological Mode Switcher: Paired Valid vs Unmatched Flawed -->
          <div class="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold text-slate-700">שיטת חישוב השינוי המוצגת:</span>
              <button onclick="SelfieApp.setDashboardComparisonMode('paired_valid')"
                class="px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  isPairedMode
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }">
                ✅ השוואה מזווגת תקפה (רק משיבים שענו גם ב-Pre וגם ב-Post: N=${ps.n})
              </button>
              <button onclick="SelfieApp.setDashboardComparisonMode('unmatched_flawed')"
                class="px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  !isPairedMode
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }">
                ⚠️ השוואה חתכית שגויה כמו ב-SELFIE הישן (ערבוב N1=${us.nPre} בהתחלה מול N2=${us.nPost} בסוף)
              </button>
            </div>

            <div class="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950">
              🔍 פער הטיית מדגם לא-מזווג: <strong>${us.biasInflationGap > 0 ? "+" : ""}${us.biasInflationGap}%</strong> (ניפוח מלאכותי בגלל נשירת מתחילים והצטרפות מאוחרים!)
            </div>
          </div>
        </div>

        <!-- 4 KPI Cards Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- KPI 1: Paired Sample N vs Attrition -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
            <div class="text-xs font-bold text-slate-500">מבנה המדגם וזיווג פעימות</div>
            <div class="mt-2 flex items-baseline justify-between">
              <div class="text-2xl font-black text-emerald-700">${ps.n} מזווגים</div>
              <span class="text-xs font-bold text-slate-500">מתוך ${analysis.totalUniqueParticipants} משיבים</span>
            </div>
            <div class="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-[11px]">
              <div class="bg-emerald-50 text-emerald-900 rounded p-1 font-bold" title="ענו גם בפעימה א׳ וגם בפעימה ב׳">
                ✔ ${analysis.cohorts.paired.length} מזווגים
              </div>
              <div class="bg-amber-50 text-amber-900 rounded p-1 font-bold" title="ענו בפעימה א׳ וטרם השלימו פעימה ב׳">
                ⏳ ${analysis.cohorts.attrition.length} חסרי סיום
              </div>
              <div class="bg-purple-50 text-purple-900 rounded p-1 font-bold" title="ענו רק בפעימה ב׳ ללא פעימה א׳">
                🆕 ${analysis.cohorts.lateJoiners.length} סיום בלבד
              </div>
            </div>
          </div>

          <!-- KPI 2: True Paired Delta -->
          <div class="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-900">שינוי מזווג אמיתי (Paired Δ)</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">N=${ps.n} קבועים</span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-black text-emerald-700">+${ps.meanDelta}%</span>
              <span class="text-xs font-bold text-slate-600">(${ps.preMean}% ← ${ps.postMean}%)</span>
            </div>
            <div class="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
              <span>SD(Δ) = ${ps.sdDelta}%</span>
              <span class="font-bold text-indigo-800">${ps.preLevel.code} ← ${ps.postLevel.code}</span>
            </div>
          </div>

          <!-- KPI 3: Paired t-test & Effect Size -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
            <div class="text-xs font-bold text-slate-500">מובהקות סטטיסטית וגודל אפקט (Paired t)</div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-black text-indigo-900">d = ${ps.cohensDz}</span>
              <span class="text-xs font-bold text-emerald-700">${ps.cohensDz >= 0.8 ? "(אפקט חזק מאוד)" : ps.cohensDz >= 0.5 ? "(אפקט בינוני-גבוה)" : "(אפקט מתון)"}</span>
            </div>
            <div class="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between font-mono">
              <span>t(${Math.max(0, ps.n - 1)}) = ${ps.tStat}</span>
              <span class="font-bold text-emerald-700">p = ${ps.pValue < 0.001 ? "< 0.001" : ps.pValue}</span>
            </div>
          </div>

          <!-- KPI 4: Flawed Unmatched Comparison (What Old SELFIE Shows) -->
          <div class="bg-rose-50/70 rounded-2xl border border-rose-200 p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-rose-900">⚠️ אילו חושב לא-מזווג (כמו ב-SELFIE הישן)</span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-black text-rose-700">+${us.rawDiff}%</span>
              <span class="text-xs font-bold text-rose-800">(${us.preMean}% [N=${us.nPre}] ← ${us.postMean}% [N=${us.nPost}])</span>
            </div>
            <div class="mt-3 pt-2.5 border-t border-rose-200/80 text-[11px] text-rose-900">
              שגיאת אמידה של <strong>${us.biasInflationGap > 0 ? "+" : ""}${us.biasInflationGap}%</strong> כי ${analysis.cohorts.attrition.length} משיבי פתיחה נשרו ו-${analysis.cohorts.lateJoiners.length} הצטרפו בסוף!
            </div>
          </div>
        </div>

        <!-- Paired Slope Graph (Spaghetti Plot) & Domain Pre-Post Comparison -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Visual 1: Individual Paired Trajectories (Slope Graph) -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <div>
                <h3 class="text-base font-black text-slate-900">📈 גרף שיפועים מזווג (Paired Trajectories – קו לכל משיב)</h3>
                <p class="text-xs text-slate-500">כל קו מייצג אדם אמיתי שענה גם בפעימה א׳ וגם בפעימה ב׳. נקודות כתומות = ענו רק בפתיחה; סגולות = רק בסיום.</p>
              </div>
            </div>
            <div class="mt-3 flex justify-center">
              ${buildPairedSlopeSvg(analysis)}
            </div>
          </div>

          <!-- Visual 2: Domain-by-Domain Pre vs Post Comparison -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-base font-black text-slate-900">
                  📊 השוואת 6 התחומים: ${isPairedMode ? "מדגם מזווג תקף (Paired)" : "מדגם לא-מזווג מוטה (Unmatched)"}
                </h3>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${isPairedMode ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}">
                  ${isPairedMode ? "תקף מחקרית" : "מוטה מתודולוגית"}
                </span>
              </div>

              <div class="space-y-3.5">
                ${analysis.domainComparisons
                  .map((d) => {
                    const preVal = isPairedMode ? d.pairedPre : d.unmatchedPre;
                    const postVal = isPairedMode ? d.pairedPost : d.unmatchedPost;
                    const deltaVal = isPairedMode ? d.pairedDelta : d.unmatchedDelta;
                    return `
                      <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span class="text-slate-800">${d.icon} ${d.num}. ${d.titleHe}</span>
                          <span class="text-emerald-700 font-black">
                            ${preVal}% ← ${postVal}% (${deltaVal >= 0 ? "+" + deltaVal : deltaVal}%)
                          </span>
                        </div>
                        <div class="space-y-1">
                          <div class="flex items-center gap-2">
                            <span class="text-[10px] w-14 text-slate-500">פעימה א׳</span>
                            <div class="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div class="h-full bg-slate-500 rounded-full" style="width:${preVal}%"></div>
                            </div>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="text-[10px] w-14 font-bold text-indigo-700">פעימה ב׳</span>
                            <div class="flex-1 h-2.5 bg-indigo-100 rounded-full overflow-hidden">
                              <div class="h-full rounded-full" style="width:${postVal}%; background:${d.color}"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- 3-Cohort Participant Table & Attrition Follow-up Manager -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div class="flex flex-wrap gap-2">
              <button onclick="SelfieApp.setDashboardCohortView('paired')"
                class="px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  state.dashboardCohortView === "paired"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }">
                ✅ משיבים מזווגים – ענו בשתי הפעימות (${analysis.cohorts.paired.length})
              </button>
              <button onclick="SelfieApp.setDashboardCohortView('attrition')"
                class="px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  state.dashboardCohortView === "attrition"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                }">
                ⏳ ענו רק בפעימה א׳ – נדרשת תזכורת לפעימה ב׳ (${analysis.cohorts.attrition.length})
              </button>
              <button onclick="SelfieApp.setDashboardCohortView('late')"
                class="px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  state.dashboardCohortView === "late"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100"
                }">
                🆕 ענו רק בפעימה ב׳ – מופרדים מהמחקר המזווג (${analysis.cohorts.lateJoiners.length})
              </button>
            </div>

            ${
              state.dashboardCohortView === "attrition" && analysis.cohorts.attrition.length > 0
                ? `<button onclick="SelfieApp.copyAttritionReminder()" class="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm">
                    📩 העתק הודעת תזכורת ממוקדת לחוגים להשלמת הזיווג
                  </button>`
                : ""
            }
          </div>

          <div class="pt-4 overflow-x-auto">
            ${renderCohortTableHtml(analysis)}
          </div>
        </div>
      </div>
    `;
  }

  function renderCohortTableHtml(analysis) {
    const config = window.SELFIE_CONFIG;
    if (state.dashboardCohortView === "paired") {
      if (analysis.cohorts.paired.length === 0) {
        return `<div class="p-6 text-center text-sm text-slate-500">אין עדיין משיבים מזווגים בחתך זה.</div>`;
      }
      return `
        <table class="w-full text-right text-xs">
          <thead class="bg-slate-100 text-slate-700 font-bold">
            <tr>
              <th class="p-3">מזהה מזווג (Paired ID)</th>
              <th class="p-3">שם המשיב/ה</th>
              <th class="p-3">חוג</th>
              <th class="p-3">פעימה א׳ (Pre)</th>
              <th class="p-3">פעימה ב׳ (Post)</th>
              <th class="p-3">שינוי אישי (Δi)</th>
              <th class="p-3">מסלול הדרכה</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${analysis.cohorts.paired
              .map((p) => {
                const dept = config.departments.find((d) => d.id === p.department)?.nameHe || p.department;
                return `
                  <tr class="hover:bg-slate-50">
                    <td class="p-3 font-mono font-bold text-emerald-700">${p.participantHash}</td>
                    <td class="p-3 font-bold text-slate-900">${p.name}</td>
                    <td class="p-3 text-slate-600">${dept}</td>
                    <td class="p-3 font-bold">${p.preLevel} (${p.preScore}%)</td>
                    <td class="p-3 font-bold text-indigo-700">${p.postLevel} (${p.postScore}%)</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded font-black ${
                        p.delta >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }">
                        ${p.delta >= 0 ? "+" + p.delta : p.delta}%
                      </span>
                    </td>
                    <td class="p-3 text-slate-600">${p.post.calc.assignedTrack.nameHe.split(":")[0]}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      `;
    } else if (state.dashboardCohortView === "attrition") {
      return `
        <div class="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
          💡 <strong>חשיבות מתודולוגית:</strong> המרצים בטבלה זו מילאו את פעימה א׳ (רובם ברמות הבסיס A1–A2), אך טרם מילאו את פעימה ב׳. ב-SELFIE הישן, היעדרם בפעימה ב׳ גרם לממוצע סוף השנה לקפוץ באופן מלאכותי! כאן הם מזוהים במדויק כדי להשלים את המענה ב-10 הדקות בישיבת החוג.
        </div>
        <table class="w-full text-right text-xs">
          <thead class="bg-amber-100/70 text-amber-950 font-bold">
            <tr>
              <th class="p-3">מזהה מזווג</th>
              <th class="p-3">שם המשיב/ה</th>
              <th class="p-3">אימייל לתזכורת</th>
              <th class="p-3">חוג</th>
              <th class="p-3">ציון פעימה א׳</th>
              <th class="p-3">מסלול שהומלץ</th>
              <th class="p-3">סטטוס פעימה ב׳</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${analysis.cohorts.attrition
              .map((p) => {
                const dept = config.departments.find((d) => d.id === p.department)?.nameHe || p.department;
                return `
                  <tr class="hover:bg-amber-50/40">
                    <td class="p-3 font-mono font-bold text-amber-800">${p.participantHash}</td>
                    <td class="p-3 font-bold text-slate-900">${p.name}</td>
                    <td class="p-3 font-mono text-slate-600">${p.email}</td>
                    <td class="p-3 text-slate-600">${dept}</td>
                    <td class="p-3 font-bold">${p.preLevel} (${p.preScore}%)</td>
                    <td class="p-3 text-slate-700">${p.assignedTrack.nameHe.split(":")[0]}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">⏳ ממתין להשלמת פעימה ב׳</span></td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      `;
    } else {
      return `
        <div class="mb-3 p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950">
          💡 <strong>חשיבות מתודולוגית:</strong> משיבים אלו מילאו רק את שאלון סוף השנה (פעימה ב׳) מבלי שמילאו שאלון פתיחה. ב-SELFIE הישן הם נכנסו לממוצע סוף השנה וזיהמו את ההשוואה מול תחילת השנה. במערכת שלנו הם מוצגים בנפרד ואינם מעוותים את ה-Δ המזווג.
        </div>
        <table class="w-full text-right text-xs">
          <thead class="bg-purple-100/70 text-purple-950 font-bold">
            <tr>
              <th class="p-3">מזהה</th>
              <th class="p-3">שם המשיב/ה</th>
              <th class="p-3">חוג</th>
              <th class="p-3">ציון פעימה ב׳</th>
              <th class="p-3">סיבת הפרדה מהמדגם המזווג</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${analysis.cohorts.lateJoiners
              .map((p) => {
                const dept = config.departments.find((d) => d.id === p.department)?.nameHe || p.department;
                return `
                  <tr class="hover:bg-purple-50/40">
                    <td class="p-3 font-mono font-bold text-purple-800">${p.participantHash}</td>
                    <td class="p-3 font-bold text-slate-900">${p.name}</td>
                    <td class="p-3 text-slate-600">${dept}</td>
                    <td class="p-3 font-bold text-purple-900">${p.postLevel} (${p.postScore}%)</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">ללא שאלון פתיחה (Pre)</span></td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      `;
    }
  }

  function setDashboardDept(deptId) {
    state.dashboardFilterDept = deptId;
    renderDashboardView();
  }

  function setDashboardComparisonMode(mode) {
    state.dashboardComparisonMode = mode;
    renderDashboardView();
  }

  function setDashboardCohortView(view) {
    state.dashboardCohortView = view;
    renderDashboardView();
  }

  function copyAttritionReminder() {
    const analysis = window.SelfieScoringEngine.calculateInstitutionalPairedAnalysis(
      state.cohortSubmissions,
      state.dashboardFilterDept,
      state.dashboardFilterRole
    );
    const names = analysis.cohorts.attrition.map((p) => `${p.name} (${p.email})`).join(", ");
    const msg = `שלום רב,\nלקראת סיכום השנה בתוכנית פריזמה באורנים, אנו משלימים את המיפוי המזווג (פעימה ב׳ של סקר SELFIE 2.0).\nמכיוון שמילאת את פעימה א׳ בתחילת השנה, המענה שלך בפעימה ב׳ (כ-8 דקות) חיוני להשוואה מחקרית תקפה ולקבלת דוח ההתקדמות האישי והתעודה.\nמשיבים להשלמה: ${names}`;
    navigator.clipboard.writeText(msg);
    showToast("נוסח התזכורת הממוקדת להשלמת פעימה ב׳ הועתק ללוח!");
  }

  function exportPairedCsv() {
    const analysis = window.SelfieScoringEngine.calculateInstitutionalPairedAnalysis(
      state.cohortSubmissions,
      state.dashboardFilterDept,
      state.dashboardFilterRole
    );
    const headers = [
      "ParticipantHash",
      "Name",
      "Department",
      "Role",
      "CohortStatus",
      "Pre_Overall_Score",
      "Pre_Level",
      "Post_Overall_Score",
      "Post_Level",
      "Paired_Delta",
      "Dom1_Pedagogy_Delta",
      "Dom2_Resources_Delta",
      "Dom3_Assessment_Delta",
      "Dom4_Empowering_Delta",
      "Dom5_AI_Agency_Delta",
      "Dom6_Leadership_Delta"
    ];

    const rows = [];
    analysis.cohorts.paired.forEach((p) => {
      rows.push([
        p.participantHash,
        `"${p.name}"`,
        p.department,
        p.role,
        "PAIRED_VALID",
        p.preScore,
        p.preLevel,
        p.postScore,
        p.postLevel,
        p.delta,
        p.domainDeltas.dom1_pedagogy.delta,
        p.domainDeltas.dom2_resources.delta,
        p.domainDeltas.dom3_assessment.delta,
        p.domainDeltas.dom4_empowering.delta,
        p.domainDeltas.dom5_ai_agency.delta,
        p.domainDeltas.dom6_engagement.delta
      ]);
    });
    analysis.cohorts.attrition.forEach((p) => {
      rows.push([
        p.participantHash,
        `"${p.name}"`,
        p.department,
        p.role,
        "PRE_ONLY_ATTRITION",
        p.preScore,
        p.preLevel,
        "",
        "",
        "",
        "", "", "", "", "", ""
      ]);
    });
    analysis.cohorts.lateJoiners.forEach((p) => {
      rows.push([
        p.participantHash,
        `"${p.name}"`,
        p.department,
        p.role,
        "POST_ONLY_LATE_JOINER",
        "",
        "",
        p.postScore,
        p.postLevel,
        "",
        "", "", "", "", "", ""
      ]);
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SELFIE_2_Paired_Longitudinal_Dataset_Oranim.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("קובץ המחקר המזווג (CSV מותאם ל-SPSS/Excel) הורד בהצלחה!");
  }

  // ===========================================================================
  // TAB 6: METHODOLOGY AUDIT LAB (WHY OLD SELFIE WAS WRONG VS NEW SELFIE 2.0)
  // ===========================================================================
  function renderMethodologyView() {
    const main = document.getElementById("main-view-container");

    // Interactive Simulator 1: Unmatched Sample & Attrition Bias (e.g. 17 in Pre vs 9 in Post)
    const preN = Number(state.simAttritionPreN) || 17;
    const postN = Math.min(preN, Number(state.simAttritionPostN) || 9);
    const trueIndividualGain = 8; // True gain of each teacher is +8%
    const baselineMean = 42;
    // When lower-scoring participants drop out at Post, the remaining postN participants had higher baseline by simDropoutBias
    const selectionShift = Math.round(((preN - postN) / Math.max(1, preN)) * Number(state.simDropoutBias));
    const fakeUnmatchedPostMean = baselineMean + selectionShift + trueIndividualGain;
    const fakeUnmatchedDelta = fakeUnmatchedPostMean - baselineMean;

    // Interactive Simulator 2: Scale Floor & Boundary Distortion (B1 count out of 32)
    const b1Count = Number(state.simB1Count);
    const b2Count = 32 - b1Count;
    const oldEuRawPoints = b1Count * 3 + b2Count * 4;
    const oldEuPct = Math.round((oldEuRawPoints / 192) * 1000) / 10;
    const oldEuAssigned = window.SelfieScoringEngine.getOldEuLevel(oldEuPct);
    const newNormPct = Math.round((((b1Count * 40 + b2Count * 60) / 32)) * 10) / 10;
    const newAssigned = window.SelfieScoringEngine.getSymmetricLevel(newNormPct);

    main.innerHTML = `
      <div class="space-y-6">
        <!-- Executive Summary Banner -->
        <div class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-200 border border-rose-400/30 mb-2">
            🔬 נייר עמדה מתודולוגי ומערכתי חי (להצגה מול משרד החינוך / תוכנית פריזמה)
          </span>
          <h2 class="text-xl sm:text-2xl font-black">
            6 כשלי המדידה והחישוב ב-SELFIE המקורי – וכיצד מנוע SELFIE 2.0 פותר אותם
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            ניתוח מתמטי ופסיכומטרי של כלי ה-SELFIEforTEACHERS האירופי (דו״ח JRC EUR 31151 EN) ושל אופן הפעלתו במכללות חושף כשלים מובנים במבחן עצמו שמשרד החינוך לא נתן עליהם את הדעת. להלן ההוכחות החיות והסימולטורים:
          </p>
        </div>

        <!-- Interactive Simulator 1: Unmatched Pre-Post Comparison Flaw -->
        <div class="bg-white rounded-2xl border-2 border-rose-200 p-5 sm:p-6 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span class="px-2.5 py-0.5 rounded bg-rose-600 text-white text-xs font-black">כשל #1 – החמור ביותר מחקרית</span>
              <h3 class="inline text-base sm:text-lg font-black text-slate-900 mr-2">
                השוואת אנשים שונים בתחילת שנה לעומת סוף שנה (Unmatched Cross-Sectional vs. Paired Pre-Post)
              </h3>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <div class="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>מה קורה בכלי ה-SELFIE המקורי?</strong> בעמ׳ 16 ו-38 של ה-Toolkit הרשמי מוגדר שהדוח הקבוצתי מנתק את הקשר לחשבון המשתמש ומפיק רק ממוצע קבוצתי לאותו סבב. כשמשרד החינוך דרש מהמכללות להפיק דוח פתיחה ודוח סיום, הוא השווה <strong>ממוצע של קבוצת משיבים אחת בתחילת השנה ($N_1$)</strong> מול <strong>ממוצע של תת-קבוצה אחרת בסוף השנה ($N_2$)</strong>!
              </p>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div class="font-black text-slate-900">📌 דוגמאות אמת מתוך דוח הביצוע של פריזמה (תשפ״ו):</div>
                <div>• <strong>החוג לחינוך מיוחד:</strong> מתוך 40 מרצים, <strong>17 ענו בפעימה א׳</strong> ורק <strong>9 ענו בפעימה ב׳</strong>.</div>
                <div>• <strong>החוג לחינוך חברתי-קהילתי:</strong> מתוך 20 מרצים, <strong>9 ענו בפעימה א׳</strong> ורק <strong>4 ענו בפעימה ב׳</strong>.</div>
                <div class="text-rose-800 font-bold pt-1">
                  מכיוון שהנושרים בסוף השנה הם לרוב מרצים פחות טכנולוגיים (או שמשיבים חדשים ענו בסוף השנה), השוואת הממוצעים הקבוצתיים מייצרת "שיפור מדומה" (הטיית נשירה ובחירה עצמית) שאינו משקף למידה אמיתית!
                </div>
              </div>

              <!-- Quick Presets from Real Report -->
              <div class="flex flex-wrap gap-2 pt-1">
                <button onclick="SelfieApp.setSimAttrition(17, 9, 20)" class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold">
                  טען נתוני חנ״מ תשפ״ו (17 בהתחלה ← 9 בסוף)
                </button>
                <button onclick="SelfieApp.setSimAttrition(9, 4, 22)" class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold">
                  טען נתוני חח״ק תשפ״ו (9 בהתחלה ← 4 בסוף)
                </button>
              </div>
            </div>

            <!-- Interactive Attrition Bias Calculator -->
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
              <div class="text-xs font-black text-slate-800">🎛️ סימולטור הטיית מדגם לא-מזווג (נסו להזיז את המחוון):</div>

              <div class="space-y-2.5 text-xs">
                <div>
                  <div class="flex justify-between font-bold">
                    <span>מספר משיבים בפעימה א׳ (תחילת שנה - N1):</span>
                    <span class="text-indigo-700">${preN} מרצים</span>
                  </div>
                  <input type="range" min="6" max="40" value="${preN}"
                    oninput="SelfieApp.updateSimField('simAttritionPreN', this.value)" class="w-full accent-indigo-600" />
                </div>

                <div>
                  <div class="flex justify-between font-bold">
                    <span>מספר משיבים בפעימה ב׳ (סוף שנה - N2):</span>
                    <span class="text-rose-700">${postN} מרצים</span>
                  </div>
                  <input type="range" min="2" max="${preN}" value="${postN}"
                    oninput="SelfieApp.updateSimField('simAttritionPostN', this.value)" class="w-full accent-rose-600" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <div class="text-[11px] font-bold text-emerald-900">✅ שינוי אמיתי מזווג (N=${postN} קבועים)</div>
                  <div class="text-2xl font-black text-emerald-700 mt-1">+${trueIndividualGain}%</div>
                  <div class="text-[10px] text-emerald-800 mt-0.5">משווה כל אדם רק לעצמו (Paired)</div>
                </div>
                <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                  <div class="text-[11px] font-bold text-rose-900">❌ מה שמציג ה-SELFIE הישן (N1=${preN} מול N2=${postN})</div>
                  <div class="text-2xl font-black text-rose-700 mt-1">+${fakeUnmatchedDelta}%</div>
                  <div class="text-[10px] text-rose-800 mt-0.5">זיוף של +${fakeUnmatchedDelta - trueIndividualGain}% עקב הטיית נשירה!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Simulator 2: Floor 16.67% & Boundary 50% Distortion + Domain Weight Flaw -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Flaw #2: Unbalanced Domain Weights (Proven from EU PDF p. 31-32) -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <span class="px-2.5 py-0.5 rounded bg-amber-600 text-white text-xs font-black">כשל #2 – הוכחה מתוך עמ׳ 31–32 ב-PDF האירופי</span>
              <h3 class="text-base font-black text-slate-900 mt-2">
                עיוות משקולות חמור בין התחומים (9 שאלות במנהלה מול 3 בהערכה)
              </h3>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                במבחן ה-SELFIE המקורי יש 32 שאלות ללא איזון משקולות: לתחום 1 (מעורבות ארגונית ומנהלות) יש <strong>9 שאלות (28.1% מהמבחן!)</strong>, ואילו לתחום 4 (הערכה) יש <strong>3 שאלות בלבד (9.4%)</strong>.
              </p>

              <div class="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div class="font-black text-slate-900">בדיקת הדוגמה הרשמית מתוך איורים 29 ו-31 ב-PDF של האיחוד האירופי:</div>
                <div class="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div class="p-1.5 bg-white rounded border">תחום 1 (9 שאלות): <strong>59% (B2)</strong> → 32/54 נק׳</div>
                  <div class="p-1.5 bg-white rounded border">תחום 2 (5 שאלות): <strong>57% (B2)</strong> → 17/30 נק׳</div>
                  <div class="p-1.5 bg-white rounded border">תחום 3 (5 שאלות): <strong>60% (B2)</strong> → 18/30 נק׳</div>
                  <div class="p-1.5 bg-emerald-50 rounded border border-emerald-200">תחום 4 (3 שאלות): <strong>78% (C1)</strong> → 14/18 נק׳</div>
                  <div class="p-1.5 bg-emerald-50 rounded border border-emerald-200">תחום 5 (4 שאלות): <strong>75% (C1)</strong> → 18/24 נק׳</div>
                  <div class="p-1.5 bg-emerald-50 rounded border border-emerald-200">תחום 6 (6 שאלות): <strong>75% (C1)</strong> → 27/36 נק׳</div>
                </div>
                <div class="pt-1 text-slate-800">
                  • <strong>ממוצע מאוזן של 6 התחומים:</strong> <span class="font-bold text-emerald-700">(59+57+60+78+75+75)/6 = 67.33%</span> (חצי מהתחומים ברמת C1!).<br/>
                  • <strong>מה חישב ה-SELFIE האירופי בפועל?</strong> חיבור גולמי של 32 השאלות: <span class="font-bold text-rose-700">126 / 192 = 65.625% ≈ 66% (B2)</span> כי תחום 1 המנהלתי משך את הציון למטה פי 3 מתחום ההערכה!
                </div>
              </div>
            </div>

            <div class="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 font-bold">
              ✔ התיקון ב-SELFIE 2.0: כל אחד מ-6 התחומים שווה בדיוק 16.67% (3 היגדי ליבה מאוזנים לכל תחום).
            </div>
          </div>

          <!-- Flaw #3: Scale Floor (16.67%) & Asymmetric Thresholds Simulator -->
          <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <span class="px-2.5 py-0.5 rounded bg-purple-600 text-white text-xs font-black">כשל #3 – פרדוקס רצפת ה-16.67% והגבול ב-50%</span>
              <h3 class="text-base font-black text-slate-900 mt-2">
                איך מרצה שעונה B1 ב-31 מתוך 32 שאלות מוכתר כ"מומחה (B2)"?
              </h3>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                במד המהירות של ה-SELFIE הישן (איור 29 בעמ׳ 31 ב-PDF), גבול B1 הוא <strong>35%–50%</strong> וגבול B2 הוא <strong>50%–70%</strong>. אבל B1 שווה 3 מתוך 6 נקודות – כלומר <strong>בדיוק 50.0%!</strong> לכן תשובה אחת בלבד של B2 מתוך 32 שאלות מקפיצה מרצה B1 לרמת "מומחה (B2)"!
              </p>

              <div class="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="text-xs font-bold flex justify-between">
                  <span>בחר כמה שאלות מתוך 32 המרצה ענה B1 (והיתר B2):</span>
                  <span class="text-indigo-700 font-black">${b1Count} תשובות B1 ו-${b2Count} תשובות B2</span>
                </div>
                <input type="range" min="16" max="32" value="${b1Count}"
                  oninput="SelfieApp.updateSimField('simB1Count', this.value)" class="w-full accent-purple-600" />

                <div class="grid grid-cols-2 gap-3 pt-1">
                  <div class="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center">
                    <div class="text-[11px] font-bold text-rose-900">ב-SELFIE האירופי הישן</div>
                    <div class="text-lg font-black text-rose-700 mt-0.5">${oldEuAssigned.code} (${oldEuPct}%)</div>
                    <div class="text-[10px] text-rose-800">${b1Count === 31 ? "תשובה אחת B2 הקפיצה למומחה!" : "חישוב מוטה סף 50%"}</div>
                  </div>
                  <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                    <div class="text-[11px] font-bold text-emerald-900">ב-SELFIE 2.0 המתוקן</div>
                    <div class="text-lg font-black text-emerald-700 mt-0.5">${newAssigned.code} (${newNormPct}%)</div>
                    <div class="text-[10px] text-emerald-800">סולם 0–100% מכויל וסימטרי</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-bold">
              ✔ התיקון ב-SELFIE 2.0: נרמול אמיתי 0%–100% (A1=0%, A2=20%, B1=40%, B2=60%, C1=80%, C2=100%) עם רצועות סימטריות של 16.67%.
            </div>
          </div>
        </div>

        <!-- Summary Comparison Table of All 6 Fixes -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm overflow-x-auto">
          <h3 class="text-base font-black text-slate-900 mb-3">📋 טבלת סיכום: 6 הכשלים ב-SELFIE הישן מול הפתרון ב-SELFIE 2.0</h3>
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-100 text-slate-800 font-bold">
              <tr>
                <th class="p-3">ממד המדידה</th>
                <th class="p-3 text-rose-800">הכשל ב-SELFIE המקורי (איחוד אירופי / משרד החינוך)</th>
                <th class="p-3 text-emerald-800">הפתרון במנוע SELFIE 2.0 החדש (אורנים)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr>
                <td class="p-3 font-bold">1. השוואת תחילת שנה לסוף שנה</td>
                <td class="p-3 text-rose-900 bg-rose-50/40">משווה ממוצע קבוצתי אנונימי של אנשים מסוימים בהתחלה ($N_1$) לממוצע של אנשים אחרים בסוף ($N_2$) – הטיית נשירה חמורה.</td>
                <td class="p-3 text-emerald-900 bg-emerald-50/40 font-semibold">זיהוי מזווג (<code>Paired ID</code>) שמחשב Δ אישי, מבחן t מזווג ו-Cohen's dz רק על נבדקים שענו בשתי הפעימות, ומבודד נושרים ומצטרפים מאוחרים.</td>
              </tr>
              <tr>
                <td class="p-3 font-bold">2. משקולות התחומים בציון הכולל</td>
                <td class="p-3 text-rose-900 bg-rose-50/40">9 שאלות על מנהלה ותקשורת ארגונית (28.1%) מול 3 שאלות בלבד על הערכה (9.4%).</td>
                <td class="p-3 text-emerald-900 bg-emerald-50/40 font-semibold">6 תחומים מאוזנים × 3 היגדי ליבה = משקל שווה ומדויק של 16.67% לכל תחום.</td>
              </tr>
              <tr>
                <td class="p-3 font-bold">3. כיול הסקאלה וגבולות הרמות</td>
                <td class="p-3 text-rose-900 bg-rose-50/40">מי שעונה A1 בכל השאלות מתחיל ב-16.67% (צמוד ל-A2 ב-20%), ומי שעונה B1 (50%) קופץ ל-B2 בגלל שאלה בודדת.</td>
                <td class="p-3 text-emerald-900 bg-emerald-50/40 font-semibold">נרמול מלא מ-0% עד 100% עם 6 רצועות סימטריות שוות (16.67% לכל רמה).</td>
              </tr>
              <tr>
                <td class="p-3 font-bold">4. עומק פדגוגי מול הדרכת עמיתים</td>
                <td class="p-3 text-rose-900 bg-rose-50/40">רמות C1–C2 בודקות הדרכת קולגות במקום פדגוגיה, וחוסמות מרצה מצטיין שאינו בתפקיד ניהולי.</td>
                <td class="p-3 text-emerald-900 bg-emerald-50/40 font-semibold">הפרדה דו-צירית בין "מדד עומק פדגוגי ו-AI בהוראה" (ללמוד-ללמד-לשכתב) לבין "מדד הובלת עמיתים".</td>
              </tr>
              <tr>
                <td class="p-3 font-bold">5. האופציה ה-7 ("לא רלוונטי")</td>
                <td class="p-3 text-rose-900 bg-rose-50/40">מאחדת "לא יודע" עם "לא רלוונטי" ומענישה ב-0 נקודות שמורידות את הממוצע.</td>
                <td class="p-3 text-emerald-900 bg-emerald-50/40 font-semibold">כפתור "לא רלוונטי לתפקידי/לקורס" שמחריג את הפריט מהמכנה ללא קנס מתמטי.</td>
              </tr>
              <tr>
                <td class="p-3 font-bold">6. התאמה ל-AI, לתפקיד ולשפה</td>
                <td class="p-3 text-rose-900 bg-rose-50/40">נכתב ב-2021 לבתי ספר, ללא GenAI, ארוך ומייגע (30 דק׳), וגרם לאי-מענה בחוג לאנגלית.</td>
                <td class="p-3 text-emerald-900 bg-emerald-50/40 font-semibold">משלב את מודל כשירויות AI 2.0, מותאם ל-10 דק׳, גמיש למרצה/סטודנט/מורה ודו-לשוני (עברית + English).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function updateSimField(field, val) {
    state[field] = Number(val);
    renderMethodologyView();
  }

  function setSimAttrition(pre, post, bias) {
    state.simAttritionPreN = pre;
    state.simAttritionPostN = post;
    state.simDropoutBias = bias;
    renderMethodologyView();
  }

  // ===========================================================================
  // SVG VISUALIZATION BUILDERS (GAUGE, RADAR, PAIRED SLOPE, DIGITAL BADGE)
  // ===========================================================================
  function buildGaugeSvg(score, levelObj) {
    const angle = -90 + (score / 100) * 180;
    const rad = ((angle - 90) * Math.PI) / 180;
    const cx = 130;
    const cy = 115;
    const r = 88;
    const nx = cx + (r - 14) * Math.cos((angle - 90) * (Math.PI / 180));
    const ny = cy + (r - 14) * Math.sin((angle - 90) * (Math.PI / 180));

    return `
      <svg width="260" height="150" viewBox="0 0 260 150" class="mx-auto">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#64748b"/>
            <stop offset="20%" stop-color="#0284c7"/>
            <stop offset="40%" stop-color="#0d9488"/>
            <stop offset="60%" stop-color="#4f46e5"/>
            <stop offset="80%" stop-color="#7c3aed"/>
            <stop offset="100%" stop-color="#db2777"/>
          </linearGradient>
        </defs>
        <!-- Background Track -->
        <path d="M 35 115 A 95 95 0 0 1 225 115" fill="none" stroke="#e2e8f0" stroke-width="18" stroke-linecap="round"/>
        <!-- Gradient Arc -->
        <path d="M 35 115 A 95 95 0 0 1 225 115" fill="none" stroke="url(#gaugeGrad)" stroke-width="18" stroke-linecap="round"
          stroke-dasharray="${Math.round((score / 100) * 298)} 300"/>
        <!-- Level Labels along arc -->
        <text x="20" y="132" font-size="10" font-weight="bold" fill="#64748b">A1</text>
        <text x="42" y="60" font-size="10" font-weight="bold" fill="#0284c7">A2</text>
        <text x="95" y="25" font-size="10" font-weight="bold" fill="#0d9488">B1</text>
        <text x="155" y="25" font-size="10" font-weight="bold" fill="#4f46e5">B2</text>
        <text x="208" y="60" font-size="10" font-weight="bold" fill="#7c3aed">C1</text>
        <text x="232" y="132" font-size="10" font-weight="bold" fill="#db2777">C2</text>
        <!-- Needle -->
        <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="7" fill="#1e293b"/>
        <!-- Center Score Badge -->
        <text x="${cx}" y="102" text-anchor="middle" font-size="24" font-weight="900" fill="${levelObj.color}">${levelObj.code}</text>
        <text x="${cx}" y="138" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a">${score}%</text>
      </svg>
    `;
  }

  function buildRadarSvg(domainResults) {
    const size = 290;
    const cx = size / 2;
    const cy = size / 2;
    const maxR = 98;
    const n = domainResults.length;

    function pt(idx, pct) {
      const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
      const r = (Math.max(8, pct) / 100) * maxR;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    }

    const rings = [25, 50, 75, 100]
      .map((levelPct) => {
        const pts = domainResults.map((_, i) => pt(i, levelPct).join(",")).join(" ");
        return `<polygon points="${pts}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`;
      })
      .join("");

    const axes = domainResults
      .map((d, i) => {
        const [x2, y2] = pt(i, 100);
        const [lx, ly] = pt(i, 122);
        return `
          <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
          <text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="800" fill="#1e293b">
            ${d.shortHe} (${d.score}%)
          </text>
        `;
      })
      .join("");

    const dataPts = domainResults.map((d, i) => pt(i, d.score).join(",")).join(" ");
    const dots = domainResults
      .map((d, i) => {
        const [x, y] = pt(i, d.score);
        return `<circle cx="${x}" cy="${y}" r="5" fill="${d.color}" stroke="#fff" stroke-width="2"/>`;
      })
      .join("");

    return `
      <svg width="340" height="290" viewBox="-25 0 340 290" class="overflow-visible">
        ${rings}
        ${axes}
        <polygon points="${dataPts}" fill="rgba(79, 70, 229, 0.22)" stroke="#4f46e5" stroke-width="2.5"/>
        ${dots}
      </svg>
    `;
  }

  function buildPairedSlopeSvg(analysis) {
    const w = 420;
    const h = 230;
    const xPre = 95;
    const xPost = 325;
    const yTop = 25;
    const yBot = 195;

    function yPos(score) {
      return yBot - (Math.max(0, Math.min(100, score)) / 100) * (yBot - yTop);
    }

    const gridLines = [0, 25, 50, 75, 100]
      .map((val) => {
        const y = yPos(val);
        return `
          <line x1="${xPre - 25}" y1="${y}" x2="${xPost + 25}" y2="${y}" stroke="#f1f5f9" stroke-width="1"/>
          <text x="${xPre - 35}" y="${y + 3}" font-size="10" fill="#94a3b8" text-anchor="end">${val}%</text>
        `;
      })
      .join("");

    // Paired lines (Green)
    const pairedLines = analysis.cohorts.paired
      .map((p) => {
        const y1 = yPos(p.preScore);
        const y2 = yPos(p.postScore);
        return `
          <line x1="${xPre}" y1="${y1}" x2="${xPost}" y2="${y2}" stroke="#10b981" stroke-width="2.2" opacity="0.8"/>
          <circle cx="${xPre}" cy="${y1}" r="4.5" fill="#059669"><title>${p.name} (Pre: ${p.preScore}%)</title></circle>
          <circle cx="${xPost}" cy="${y2}" r="4.5" fill="#059669"><title>${p.name} (Post: ${p.postScore}%, Δ: +${p.delta}%)</title></circle>
        `;
      })
      .join("");

    // Attrition dots on Pre axis (Amber - missing Post!)
    const attritionDots = analysis.cohorts.attrition
      .map((p, idx) => {
        const y1 = yPos(p.preScore);
        return `<circle cx="${xPre - 12 - (idx % 2) * 8}" cy="${y1}" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1"><title>${p.name} – ענה רק בפתיחה (${p.preScore}%)</title></circle>`;
      })
      .join("");

    // Late Joiners dots on Post axis (Purple - missing Pre!)
    const lateDots = analysis.cohorts.lateJoiners
      .map((p, idx) => {
        const y2 = yPos(p.postScore);
        return `<circle cx="${xPost + 12 + (idx % 2) * 8}" cy="${y2}" r="4.5" fill="#9333ea" stroke="#fff" stroke-width="1"><title>${p.name} – ענה רק בסיום (${p.postScore}%)</title></circle>`;
      })
      .join("");

    // Mean Paired Line (Thick Indigo)
    const meanY1 = yPos(analysis.pairedStats.preMean);
    const meanY2 = yPos(analysis.pairedStats.postMean);

    return `
      <svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" class="max-w-md">
        ${gridLines}
        <line x1="${xPre}" y1="${yTop}" x2="${xPre}" y2="${yBot}" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="${xPost}" y1="${yTop}" x2="${xPost}" y2="${yBot}" stroke="#cbd5e1" stroke-width="2"/>
        ${pairedLines}
        ${attritionDots}
        ${lateDots}
        ${
          analysis.pairedStats.n > 0
            ? `<line x1="${xPre}" y1="${meanY1}" x2="${xPost}" y2="${meanY2}" stroke="#312e81" stroke-width="4" stroke-dasharray="5 3"/>
               <circle cx="${xPre}" cy="${meanY1}" r="6" fill="#312e81"/>
               <circle cx="${xPost}" cy="${meanY2}" r="6" fill="#312e81"/>`
            : ""
        }
        <text x="${xPre}" y="${yBot + 20}" text-anchor="middle" font-size="11" font-weight="800" fill="#334155">פעימה א׳ (Pre)</text>
        <text x="${xPost}" y="${yBot + 20}" text-anchor="middle" font-size="11" font-weight="800" fill="#334155">פעימה ב׳ (Post)</text>
      </svg>
    `;
  }

  function buildDigitalBadgeSvg(levelObj, score) {
    return `
      <svg width="96" height="96" viewBox="0 0 100 100">
        <polygon points="50,4 90,26 90,74 50,96 10,74 10,26" fill="${levelObj.color}" stroke="#e2e8f0" stroke-width="3"/>
        <polygon points="50,11 83,30 83,70 50,89 17,70 17,30" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="50" y="34" text-anchor="middle" font-size="9" font-weight="800" fill="#ffffff">SELFIE 2.0</text>
        <text x="50" y="58" text-anchor="middle" font-size="24" font-weight="900" fill="#ffffff">${levelObj.code}</text>
        <text x="50" y="75" text-anchor="middle" font-size="10" font-weight="700" fill="#ffffff">${score}%</text>
      </svg>
    `;
  }

  return {
    init,
    setTab,
    toggleLanguage,
    setRole,
    updateDraftField,
    selectItemResponse,
    applyQuickPreset,
    submitCurrentReflection,
    setDomainIdx,
    updateAiOption,
    copySyllabusCard,
    copyMegaPrompt,
    setDashboardDept,
    setDashboardComparisonMode,
    setDashboardCohortView,
    copyAttritionReminder,
    exportPairedCsv,
    updateSimField,
    setSimAttrition
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.SelfieApp.init();
});
