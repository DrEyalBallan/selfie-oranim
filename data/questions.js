/**
 * SELFIE 2.0 (סלפי החדש) – מאגר ההיגדים המאוזן והמותאם לתפקידים (DigCompEdu + AI Competency 2.0)
 * 6 תחומים מאוזנים × 3 היגדים לתחום = 18 היגדי ליבה (משקל שווה: 16.67% לכל תחום)
 * תומך ב-3 פרופילים: מרצה במכללה (lecturer), סטודנט/ית להוראה (student), מורה בשדה / מד"פ (teacher)
 * תומך בדו-לשוניות מלאה: עברית (he) ואנגלית (en)
 */

window.SELFIE_CONFIG = {
  version: "2.0.0",
  profiles: {
    lecturer: {
      id: "lecturer",
      labelHe: "מרצה / סגל אקדמי במכללה",
      labelEn: "College Lecturer / Academic Faculty",
      icon: "🎓",
      contextHe: "הוראה בקורסים אקדמיים, סמינריונים, הנחיית סטודנטים להוראה ומחקר",
      contextEn: "Teaching academic courses, seminars, mentoring student-teachers, and research",
      learnerTermHe: "סטודנטים",
      learnerTermEn: "students",
      courseTermHe: "בקורסים האקדמיים שלי",
      courseTermEn: "in my academic courses",
      orgTermHe: "בחוג ובמכללה",
      orgTermEn: "in my department and college"
    },
    student: {
      id: "student",
      labelHe: "סטודנט/ית להוראה (פרח הוראה)",
      labelEn: "Student-Teacher (Pre-service Educator)",
      icon: "🌱",
      contextHe: "למידה אקדמית במכללה, התנסות מעשית בשדה ובניית מערכי שיעור",
      contextEn: "Academic learning, practicum teaching in schools, and lesson planning",
      learnerTermHe: "תלמידים בהתנסות",
      learnerTermEn: "pupils in practicum",
      courseTermHe: "בהתנסות המעשית ובלימודיי",
      courseTermEn: "in my practicum and studies",
      orgTermHe: "במסלול ההכשרה ובבית הספר המאמן",
      orgTermEn: "in my training program and host school"
    },
    teacher: {
      id: "teacher",
      labelHe: "מורה בשדה / מד״פ (מדריך פדגוגי)",
      labelEn: "School Teacher / Pedagogical Mentor",
      icon: "🏫",
      contextHe: "הוראה בכיתה, הובלת תלמידים, עבודה עם צוות בית הספר והדרכת מתמחים",
      contextEn: "Classroom teaching, student guidance, school team collaboration, and mentoring",
      learnerTermHe: "תלמידים",
      learnerTermEn: "pupils/students",
      courseTermHe: "בכיתות הלימוד שלי",
      courseTermEn: "in my classrooms",
      orgTermHe: "בצוות המקצועי ובבית הספר",
      orgTermEn: "in my subject team and school"
    }
  },

  departments: [
    { id: "hebrew", nameHe: "החוג ללשון עברית (חוג עוגן)", nameEn: "Hebrew Language Dept.", lead: "ד״ר אושרי זיגלבוים", targetStaff: 18 },
    { id: "spec_ed", nameHe: "החוג לחינוך מיוחד", nameEn: "Special Education Dept.", lead: "ד״ר דנה ברק הראל ולילך יבין", targetStaff: 40 },
    { id: "lit_drama", nameHe: "החוג לספרות, דרמה ומבע יצירתי", nameEn: "Literature, Drama & Creative Expression", lead: "ד״ר אריאל פרידן", targetStaff: 22 },
    { id: "media", nameHe: "החוג לתקשורת ולקולנוע חברתי", nameEn: "Communication & Social Cinema", lead: "ד״ר אוהד אופז וד״ר מיה מזור", targetStaff: 16 },
    { id: "soc_comm", nameHe: "החוג לחינוך חברתי-קהילתי", nameEn: "Social-Community Education", lead: "צוות החח״ק", targetStaff: 20 },
    { id: "english", nameHe: "החוג להוראת אנגלית", nameEn: "English Language Education", lead: "צוות אנגלית", targetStaff: 18 },
    { id: "stem", nameHe: "החוג למדעים ומתמטיקה", nameEn: "Science & Mathematics Education", lead: "צוות מדעים", targetStaff: 24 },
    { id: "field", nameHe: "מדור שדה והמד״פיות", nameEn: "Field Practicum & Pedagogical Mentors", lead: "צוות מדור שדה", targetStaff: 60 },
    { id: "general", nameHe: "כלל-מכללתי / יחידות רוחב", nameEn: "College-Wide / Cross-Disciplinary", lead: "היחידה לקידום הוראה וחדשנות", targetStaff: 30 }
  ],

  pulses: [
    { id: "pre_2026", nameHe: "פעימה א׳ – תחילת שנה", nameEn: "Pulse 1", shortHe: "פעימה א׳", order: 1 },
    { id: "mid_2027", nameHe: "פעימת אמצע שנה", nameEn: "Mid-Year", shortHe: "פעימת אמצע", order: 2 },
    { id: "post_2027", nameHe: "פעימה ב׳ – סוף שנה", nameEn: "Pulse 2", shortHe: "פעימה ב׳", order: 3 }
  ],

  levels: [
    {
      code: "A1",
      numeric: 1,
      normalizedScore: 0,
      bandMin: 0,
      bandMax: 16.66,
      oldEuBandMin: 0,
      oldEuBandMax: 20,
      titleHe: "מודעות ראשונית",
      titleEn: "מודעות ראשונית",
      verbHe: "אני מודע/ת",
      verbEn: "I am aware",
      taxonomyStageHe: "ללמוד",
      color: "#dc2626",
      bgLight: "#fef2f2",
      descHe: "היכרות ראשונית ותיאורטית עם הפוטנציאל של כלים דיגיטליים ובינה מלאכותית בהוראה, ללא יישום סדיר בפועל.",
      descEn: ""
    },
    {
      code: "A2",
      numeric: 2,
      normalizedScore: 20,
      bandMin: 16.67,
      bandMax: 33.33,
      oldEuBandMin: 20,
      oldEuBandMax: 35,
      titleHe: "התנסות בסיסית",
      titleEn: "התנסות בסיסית",
      verbHe: "התנסיתי",
      verbEn: "I have tried",
      taxonomyStageHe: "ללמוד",
      color: "#ea580c",
      bgLight: "#fff7ed",
      descHe: "התנסות נקודתית וראשונית בכלים דיגיטליים ובכלי בינה מלאכותית לצרכים בסיסיים.",
      descEn: ""
    },
    {
      code: "B1",
      numeric: 3,
      normalizedScore: 40,
      bandMin: 33.34,
      bandMax: 50.0,
      oldEuBandMin: 35,
      oldEuBandMax: 50,
      titleHe: "שילוב שוטף",
      titleEn: "שילוב שוטף",
      verbHe: "אני משלב/ת באופן שוטף",
      verbEn: "I regularly integrate",
      taxonomyStageHe: "ללמד",
      color: "#eab308",
      bgLight: "#fefce8",
      descHe: "שימוש סדיר ומכוון במגוון כלים דיגיטליים ובינה מלאכותית כחלק מתהליכי ההוראה, הלמידה וההערכה השוטפים.",
      descEn: ""
    },
    {
      code: "B2",
      numeric: 4,
      normalizedScore: 60,
      bandMin: 50.01,
      bandMax: 66.66,
      oldEuBandMin: 50,
      oldEuBandMax: 70,
      titleHe: "מומחיות פדגוגית",
      titleEn: "מומחיות פדגוגית",
      verbHe: "אני מנתח/ת ומתאים/ה פדגוגית",
      verbEn: "I critically analyze & adapt",
      taxonomyStageHe: "ללמד ברמה מתקדמת",
      color: "#84cc16",
      bgLight: "#f7fee7",
      descHe: "בחירה מושכלת וביקורתית של טכנולוגיות ובינה מלאכותית לפי מטרות פדגוגיות מדויקות, תוך התאמה לשונות הלומדים.",
      descEn: ""
    },
    {
      code: "C1",
      numeric: 5,
      normalizedScore: 80,
      bandMin: 66.67,
      bandMax: 83.33,
      oldEuBandMin: 70,
      oldEuBandMax: 85,
      titleHe: "שכתוב ועיצוב מחדש",
      titleEn: "שכתוב ועיצוב מחדש",
      verbHe: "אני מעצב/ת מחדש ומשתף/ת",
      verbEn: "I redesign & co-create",
      taxonomyStageHe: "לשכתב",
      color: "#22c55e",
      bgLight: "#f0fdf4",
      descHe: "עיצוב מחדש ושיטתי של תכני הלימוד, הסילבוס ודרכי ההערכה בשיתוף הלומדים ועמיתים מתוך רפלקציה מתמדת.",
      descEn: ""
    },
    {
      code: "C2",
      numeric: 6,
      normalizedScore: 100,
      bandMin: 83.34,
      bandMax: 100,
      oldEuBandMin: 85,
      oldEuBandMax: 100,
      titleHe: "חלוציות ויצירת פרדיגמה",
      titleEn: "חלוציות ויצירת פרדיגמה",
      verbHe: "אני מפתח/ת מתודולוגיות חדשות ומוביל/ה",
      verbEn: "I pioneer & innovate",
      taxonomyStageHe: "לשכתב וליצור",
      color: "#15803d",
      bgLight: "#dcfce7",
      descHe: "פיתוח מודלים פדגוגיים חדשים, כלים ופרקטיקות פורצות דרך והפצתם בקהילה האקדמית והחינוכית.",
      descEn: ""
    }
  ],

  trainingTracks: [
    {
      id: "track_foundations",
      nameHe: "מסלול א׳: יסודות, ביטחון ואוריינות AI מעשית",
      nameEn: "Track A: Foundations, Confidence & Practical AI Literacy",
      targetLevels: ["A1", "A2"],
      badgeColor: "sky",
      hours: "ליווי אישי + 3 מפגשי מעבדה מעשיים (Hands-on)",
      deliverableHe: "שילוב כרטיס מדיניות AI בסילבוס + התנסות מונחית בכלי עזר אחד להוראה",
      descHe: "מסלול תומך ומדורג המקנה ביטחון טכנולוגי, היכרות מעשית עם כלי ליבה חינמיים (כגון NotebookLM, Gemini, Claude) וגיבוש גבולות גזרה ברורים בקורס ללא הצפה טכנולוגית."
    },
    {
      id: "track_redesign",
      nameHe: "מסלול ב׳: שכתוב פדגוגי, הערכה חלופית ועיצוב נתיבי למידה",
      nameEn: "Track B: Pedagogical Redesign, Alternative Assessment & Dual-Track Design",
      targetLevels: ["B1", "B2"],
      badgeColor: "indigo",
      hours: "קהילת למידה חוגית + מעבדת שכתוב הערכה",
      deliverableHe: "סילבוס מעודכן הכולל ׳נתיב מוגן ללא AI׳ + ׳נתיב משלב AI׳ ומחוון הערכת תהליך",
      descHe: "מסלול עומק המתמקד במעבר משימוש טכני לעיצוב מחדש של מטלות הקורס: בניית מטלות חסינות-העתקה, הערכת תהליך ודיאלוג מול AI, ושילוב פיגומים דיפרנציאליים."
    },
    {
      id: "track_pioneers",
      nameHe: "מסלול ג׳: חלוצים, מנטורים חוגיים ומחקר פדגוגי מלווה",
      nameEn: "Track C: Pioneers, Departmental Mentors & Action Research",
      targetLevels: ["C1", "C2"],
      badgeColor: "purple",
      hours: "חממת מובילים מוסדית + ליווי מחקר פעולה",
      deliverableHe: "פיתוח מודל/כלי יישומי (בוט/סוכן קורסי), הובלת עמיתים בחוג ופרסום/הצגת מחקר מלווה",
      descHe: "מסלול מובילים המיועד למרצים בעלי כשירות גבוהה: פיתוח סוכני AI ייעודיים לקורסים, הובלת שולחנות עגולים בחוג, ותיעוד אמפירי של השינוי הפדגוגי."
    }
  ],

  domains: [
    {
      id: "dom1_pedagogy",
      num: 1,
      weight: 1 / 6,
      axis: "pedagogical",
      titleHe: "פדגוגיה, הוראה ולמידה דיגיטלית",
      titleEn: "Digital Pedagogy, Teaching & Learning",
      shortHe: "פדגוגיה והוראה",
      shortEn: "Pedagogy",
      color: "#2563eb",
      icon: "🎯",
      sourceRef: "DigCompEdu Area 3 + Prizma Pedagogy",
      descHe: "תכנון, עיצוב והנחיה של תהליכי הוראה ולמידה פעילים בסביבות דיגיטליות, היברידיות ואימרסיביות.",
      items: [
        {
          id: "1.1",
          axis: "pedagogical",
          titleHe: "עיצוב סביבות הוראה ולמידה דיגיטליות",
          titleEn: "Designing Digital Teaching & Learning Environments",
          introHe: {
            lecturer: "תכנון ושילוב של סביבות דיגיטליות וכלים טכנו-פדגוגיים בקורסים האקדמיים לקידום הבנה מעמיקה.",
            student: "תכנון מערכי שיעור ופעילויות המשלבים כלים דיגיטליים לקידום למידה משמעותית בהתנסות בשדה.",
            teacher: "תכנון ושילוב של סביבות וכלים דיגיטליים בכיתה לקידום הבנה ומעורבות של התלמידים."
          },
          introEn: "Designing and integrating digital environments and techno-pedagogical tools to enhance deep learning.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שכלים וסביבות דיגיטליות יכולים להעשיר את ההוראה והלמידה (כגון מצגות אינטראקטיביות, סביבת מוודל, כלים שיתופיים).",
            A2: "**התנסיתי** בשילוב נקודתי של כלים דיגיטליים בהוראה שלי לצורך הצגת תוכן או הפעלה קצרה בשיעור.",
            B1: "אני **משלב/ת באופן שוטף** כלים דיגיטליים תומכי פדגוגיה פעילה (כגון חקר מודרך, סקרים חיים, לוחות שיתופיים, למידה היברידית).",
            B2: "אני **מנתח/ת ובוחר/ת ביקורתית** סביבות דיגיטליות לפי התאמתן המדויקת למטרות הלמידה ולמאפייני הלומדים בקורס.",
            C1: "אני **מעצב/ת מחדש** את מבנה השיעורים והקורס בשיתוף הלומדים כך שהטכנולוגיה מאפשרת פדגוגיה שלא הייתה אפשרית בלעדיה.",
            C2: "אני **מפתח/ת ומוביל/ה** מתודולוגיות הוראה דיגיטליות חדשניות ומהווה מקור השראה והדגמה בקהילה המקצועית."
          },
          statementsEn: {
            A1: "I am **aware** that digital environments and tools can enrich teaching and learning.",
            A2: "I **have tried** using digital tools occasionally to present content or run short classroom activities.",
            B1: "I **regularly integrate** digital tools that support active pedagogy (inquiry, live polls, collaborative boards).",
            B2: "I **critically select and adapt** digital environments to match specific learning goals and learner needs.",
            C1: "I **systematically redesign** my course structure with learners so technology enables transformative pedagogy.",
            C2: "I **pioneer and share** innovative digital teaching methodologies across my academic/educational community."
          },
          levelUpHe: {
            A1: "בחרו יחידת הוראה אחת בסמסטר הקרוב ושלבו בה פעילות דיגיטלית קצרה (כגון שאלת פתיחה אינטראקטיבית או לוח שיתופי).",
            A2: "עברו משימוש להצגת מידע בלבד להפעלה שבה הלומדים עצמם יוצרים או מגיבים תוך כדי השיעור.",
            B1: "הגדירו לכל כלי דיגיטלי בקורס מהו הערך הפדגוגי הייחודי שלו, והסירו כלים שאינם משרתים מטרת עומק.",
            B2: "שתפו את הלומדים בעיצוב יחידת למידה אחת ובחרו יחד איתם את הסביבה הדיגיטלית המתאימה לפיצוח האתגר.",
            C1: "תעדו את מודל ההוראה שפיתחתם כמקרה בוחן ושתפו אותו בפורום החוגי או במרכז החדשנות.",
            C2: "המשיכו להוביל מחקר מלווה על אפקטיביות המודל שלכם ולהנחות עמיתים באימוצו."
          }
        },
        {
          id: "1.2",
          axis: "pedagogical",
          titleHe: "למידה שיתופית ושיח עמיתים דיגיטלי",
          titleEn: "Collaborative Learning & Digital Peer Discourse",
          introHe: {
            lecturer: "עיצוב תהליכי עבודת צוות, בניית ידע משותפת ושיח אקדמי בין סטודנטים במרחבים דיגיטליים.",
            student: "הפעלת למידה שיתופית ועבודת צוות של תלמידים באמצעות סביבות דיגיטליות בהתנסות.",
            teacher: "קידום עבודת צוות, חקר משותף ושיח עמיתים בין תלמידים באמצעות כלים דיגיטליים."
          },
          introEn: "Designing collaborative knowledge-building and peer discourse using digital spaces.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שכלים דיגיטליים יכולים לתמוך בלמידה שיתופית ובעבודת צוות בין לומדים.",
            A2: "**התנסיתי** במתן משימה שבה לומדים עובדים יחד על מסמך או מצגת משותפת בענן.",
            B1: "אני **משלב/ת באופן שוטף** פעילויות שיתופיות דיגיטליות שבהן צוותי לומדים חוקרים, מתעדים ובונים תוצר משותף.",
            B2: "אני **מתכנן/ת ומנטר/ת** תהליכי שיתוף פעולה דיגיטליים עם חלוקת תפקידים מובנית, אחריות הדדית ומשוב עמיתים.",
            C1: "אני **מעצב/ת מחדש** את הקורס כקהילת ידע שיתופית שבה הלומדים מבקרים, משכללים ומרחיבים את תוצרי עמיתיהם.",
            C2: "אני **יוזם/ת ומוביל/ה** פרויקטים שיתופיים דיגיטליים חוצי-קורסים, חוצי-דיסציפלינות או בין-מוסדיים."
          },
          statementsEn: {
            A1: "I am **aware** that digital tools can support collaborative learning among students.",
            A2: "I **have tried** assigning tasks where learners collaborate on a shared cloud document or presentation.",
            B1: "I **regularly implement** collaborative digital activities where teams research and co-create artifacts.",
            B2: "I **design and monitor** structured digital collaboration with clear roles, accountability, and peer feedback.",
            C1: "I **redesign** my course as a collaborative knowledge community where learners peer-review and build on each other's work.",
            C2: "I **initiate and lead** cross-course, interdisciplinary, or inter-institutional digital collaborative projects."
          },
          levelUpHe: {
            A1: "פתחו מסמך שיתופי (Google Docs / Padlet / Miro) בשיעור הבא ובקשו מזוגות לומדים להזין בו תובנה משותפת.",
            A2: "הגדירו במשימה השיתופית תפקידים ברורים לכל חבר צוות (למשל: חוקר, מבקר, עורך, מציג).",
            B1: "שלבו שלב מובנה של 'משוב עמיתים מבוסס מחוון' בין הקבוצות לפני ההגשה הסופית.",
            B2: "אפשרו לקבוצות הלומדים לבחור בעצמן את כלי ניהול הפרויקט והשיתוף ולתעד את תהליך החשיבה הקבוצתי.",
            C1: "חברו את הקורס שלכם לקורס מקביל בחוג אחר או במוסד אחר לפרויקט משותף אחד.",
            C2: "פרסמו את מתודולוגיית הקהילה השיתופית שלכם כמודל מוסדי."
          }
        },
        {
          id: "1.3",
          axis: "pedagogical",
          titleHe: "למידה חווייתית, סימולציות ומרחבים חדשניים",
          titleEn: "Experiential Learning, Simulations & Innovative Spaces",
          introHe: {
            lecturer: "שילוב סימולציות דיגיטליות, מרחבים אימרסיביים, חדרי בריחה לימודיים או למידה מבוססת מקום בקורס.",
            student: "התנסות בפיתוח והפעלה של משחקים לימודיים, סימולציות או מרחבי למידה חדשניים.",
            teacher: "שימוש בסימולציות, משחקים לימודיים, מרחבים אימרסיביים ולמידה חוץ-כיתתית נתמכת דיגיטל."
          },
          introEn: "Integrating digital simulations, immersive spaces, educational escape rooms, or place-based learning.",
          statementsHe: {
            A1: "אני **מודע/ת** לקיומם של מרחבי למידה חדשניים, סימולציות דיגיטליות וכלי אימרסיה במוסד ומחוצה לו.",
            A2: "**התנסיתי** באופן ראשוני בהפעלת סימולציה דיגיטלית, משחק לימודי או שימוש במרכז החדשנות.",
            B1: "אני **משלב/ת** בקורס פעילויות של למידה התנסותית/סימולטיבית (כגון סימולציית שיחה, שולחן בריחה דיגיטלי, חקר במרחב).",
            B2: "אני **מתאים/ה ובוחר/ת** כלים סימולטיביים ומרחבים פיזיים-דיגיטליים כדי לתרגל דילמות מקצועיות ומצבי אמת.",
            C1: "אני **מעצב/ת בשיתוף הלומדים** סימולציות דיגיטליות ותרחישי אמת שבהם הלומדים עצמם יוצרים את הסביבה החווייתית.",
            C2: "אני **מפתח/ת** מתודולוגיות חדשות ללמידה אימרסיבית וסימולטיבית ומדריך/ה סגל בבניית מרחבים כאלה."
          },
          statementsEn: {
            A1: "I am **aware** of innovative learning spaces, digital simulations, and immersive tools.",
            A2: "I **have tried** running a digital simulation, educational game, or session in the innovation center.",
            B1: "I **integrate** experiential/simulation activities (e.g., role-play bots, digital escape rooms, spatial inquiry).",
            B2: "I **select and adapt** simulations and hybrid spaces to practice authentic professional dilemmas.",
            C1: "I **co-design** digital simulations and scenarios with learners where they build experiential environments.",
            C2: "I **develop and lead** new methodologies for immersive and simulation-based learning across the institution."
          },
          levelUpHe: {
            A1: "תאמו מפגש היכרות במרכז החדשנות או התנסו בסימולציית תפקיד קצרה בשיעור.",
            A2: "חברו את ההתנסות החווייתית לדיון רפלקטיבי מובנה שמקשר בין החוויה לתיאוריה האקדמית.",
            B1: "בנו תרחיש סימולציה (למשל באמצעות בוט דמות) המדמה דילמה מקצועית אמיתית מהשדה.",
            B2: "תנו ללומדים לתכנן בעצמם שולחן בריחה או סימולציה עבור עמיתיהם סביב סוגיית ליבה בקורס.",
            C1: "שכללו את הסימולציה עם איסוף נתונים על החלטות הלומדים לניתוח כיתתי מעמיק.",
            C2: "הובילו סדנת הדגמה לסגל החוג במרכז החדשנות."
          }
        }
      ]
    },

    {
      id: "dom2_resources",
      num: 2,
      weight: 1 / 6,
      axis: "pedagogical",
      titleHe: "משאבים דיגיטליים ויצירת תוכן בסיוע AI",
      titleEn: "Digital Resources & AI-Assisted Content Creation",
      shortHe: "משאבים ויצירת תוכן",
      shortEn: "Resources & Creation",
      color: "#0d9488",
      icon: "🎨",
      sourceRef: "DigCompEdu Area 2 + AI Competency 2.0 (Domain 2)",
      descHe: "איתור ביקורתי, אימות מקורות, יצירה, שכתוב ועריכה של חומרי הוראה ומדיה בשילוב כלי דיגיטל ו-בינה מלאכותית יוצרת.",
      items: [
        {
          id: "2.1",
          axis: "pedagogical",
          titleHe: "איתור מידע, אימות נתונים וביקורתיות כלפי תוצרי AI",
          titleEn: "Information Search, Fact-Checking & Critical AI Verification",
          introHe: {
            lecturer: "חיפוש אקדמי מושכל, הצלבת מקורות ואימות קפדני של מידע ותוצרים המופקים על ידי מודלי שפה וכלי AI.",
            student: "איתור מקורות מידע מהימנים ובדיקה ביקורתית של מידע ותוצרים המתקבלים מכלי בינה מלאכותית.",
            teacher: "איתור חומרי הוראה איכותיים ואימות ביקורתי של עובדות ומקורות המופקים בכלי חיפוש ובינה מלאכותית."
          },
          introEn: "Academic search, source triangulation, and rigorous verification of AI-generated outputs.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שמודלי AI ומנועי חיפוש עלולים לייצר מידע שגוי ('הזיות') או מקורות בדויים.",
            A2: "**התנסיתי** בבדיקה בסיסית של תשובות שהתקבלו מ-AI מול מנוע חיפוש רגיל או מאגר אקדמי.",
            B1: "אני **מפעיל/ה באופן שוטף** אסטרטגיות אימות והצלבת מקורות (כגון שימוש ב-NotebookLM/Perplexity/Google Scholar עם מקורות מעוגנים).",
            B2: "אני **מנתח/ת ביקורתית** את איכות הראיות, ההטיות הסמויות ונקודות העיוורון בתוצרי AI ומנחה את הלומדים לעשות זאת.",
            C1: "אני **מעצב/ת מטלות חקר** שבהן הלומדים נדרשים לאתר שגיאות, לאמת מקורות ולהשוות ביקורתית בין תוצר AI לספרות המחקרית.",
            C2: "אני **מפתח/ת מחוונים ומתודולוגיות** להערכת מהימנות מידע בעידן ה-AI ומשתף/ת אותם עם הסגל והקהילה."
          },
          statementsEn: {
            A1: "I am **aware** that AI models and search engines can produce hallucinations or fabricated citations.",
            A2: "I **have tried** basic fact-checking of AI responses against standard search engines or academic databases.",
            B1: "I **regularly apply** verification strategies and source-grounded tools (e.g., NotebookLM, Scholar triangulation).",
            B2: "I **critically analyze** evidence quality, biases, and blind spots in AI outputs and guide learners accordingly.",
            C1: "I **design inquiry tasks** where learners audit, fact-check, and compare AI outputs against peer-reviewed literature.",
            C2: "I **develop rubrics and protocols** for information verification in the AI era and share them institutionally."
          },
          levelUpHe: {
            A1: "התנסו בכלי המעגן תשובות במקורות בלבד (כגון NotebookLM על מאמרי הקורס שלכם) ובדקו את הציטוטים.",
            A2: "אמצו כלל קבוע: כל טענה עובדתית או הפניה ביבליוגרפית מ-AI נבדקת במקור הראשוני לפני שימוש.",
            B1: "הציגו בכיתה דוגמה חיה של 'הזיית AI' בתחום הדעת שלכם ונתחו יחד עם הלומדים מדוע היא נוצרה.",
            B2: "בנו משימה קצרה שבה הלומדים מקבלים טקסט שנוצר ב-AI וצריכים לסמן בו אי-דיוקים ולהביא סימוכין מתקנים.",
            C1: "שלבו מחוון אימות מקורות כחלק קבוע מהערכת כל עבודה בקורס.",
            C2: "הובילו סדנה חוגית על אוריינות מידע וחקר אקדמי אמין בעידן ה-בינה מלאכותית יוצרת."
          }
        },
        {
          id: "2.2",
          axis: "pedagogical",
          titleHe: "יצירה ושכתוב של חומרי למידה ומדיה בסיוע AI",
          titleEn: "Creating & Adapting Learning Materials with Digital & AI Tools",
          introHe: {
            lecturer: "יצירה, עריכה והתאמה של חומרי הוראה (מצגות, תרחישים, סרטונים, פודקאסטים, דוגמאות קוד/סימולציה) בסיוע כלי דיגיטל ו-AI.",
            student: "יצירת חומרי למידה מגוונים (מצגות, סרטונים, דפי עבודה, המחשות) בסיוע כלים דיגיטליים ובינה מלאכותית.",
            teacher: "פיתוח ועיבוד של חומרי הוראה מגוונים ומותאמים לכיתה בסיוע כלי יצירה דיגיטליים ובינה מלאכותית."
          },
          introEn: "Creating, editing, and adapting instructional materials and media using digital and בינה מלאכותית יוצרת tools.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שניתן ליצור ולערוך חומרי הוראה מגוונים (טקסט, מצגות, תמונות, שמע, וידאו) בסיוע כלים דיגיטליים ו-AI.",
            A2: "**התנסיתי** ביצירת חומר הוראה בסיסי (כגון שלד למצגת, שאלות חזרה או תמונה להמחשה) באמצעות כלי AI.",
            B1: "אני **יוצר/ת ומשכתב/ת באופן שוטף** חומרי למידה מגוונים (מקרי בוחן, תרגולים מדורגים, המחשות ויזואליות, תקצירי קול) בסיוע AI.",
            B2: "אני **משלב/ת מיומנות פדגוגית ועיצובית** כדי לזקק, לערוך ולהתאים תוצרי AI כך שיעמדו בסטנדרט אקדמי ופדגוגי גבוה.",
            C1: "אני **מפתח/ת מאגרי למידה אינטראקטיביים ודינמיים** (כולל יישומונים/Vibe Coding או סוכני למידה מותאמים) לקורסים שלי.",
            C2: "אני **יוצר/ת ומוביל/ה** פיתוח של סביבות תוכן מקוריות ופתוחות המשמשות מרצים ולומדים נוספים בחוג ובמכללה."
          },
          statementsEn: {
            A1: "I am **aware** that instructional materials (text, slides, images, audio, video) can be created with digital/AI tools.",
            A2: "I **have tried** generating basic teaching materials (slide outlines, review questions, illustrations) with AI.",
            B1: "I **regularly create and adapt** diverse learning resources (case studies, tiered exercises, visuals, audio) using AI.",
            B2: "I **critically refine and edit** AI-generated materials to ensure high academic and pedagogical standards.",
            C1: "I **develop interactive learning artifacts** (including custom learning bots or Vibe-Coded mini-apps) for my courses.",
            C2: "I **pioneer and share** original open educational environments used by colleagues across the institution."
          },
          levelUpHe: {
            A1: "נסו להפיק באמצעות AI שלושה מקרי בוחן (Case Studies) קצרים להמחשת מושג מופשט בשיעור הקרוב.",
            A2: "התנסו בהמרת מאמר או הרצאה לתוצר רב-ערוצי (למשל סקירת שמע ב-NotebookLM או אינפוגרפיקה מובנית).",
            B1: "בנו תבנית פרומפט קבועה לקורס שלכם שמייצרת דוגמאות ותרגולים מותאמים לרמות שונות של לומדים.",
            B2: "התנסו ב-AI Studio / Claude Artifacts ליצירת יישומון אינטראקטיבי קטן שממחיש מושג ליבה בקורס.",
            C1: "שתפו את הכלים והחומרים האינטראקטיביים שיצרתם במאגר החוגי המשותף.",
            C2: "הנחו עמיתים בסדנת יצירת תוצרים אינטראקטיביים (Vibe Coding / Custom Bots) להוראה."
          }
        },
        {
          id: "2.3",
          axis: "pedagogical",
          titleHe: "ניהול משאבים, זכויות יוצרים וציטוט תקין של AI",
          titleEn: "Resource Management, Copyright & Proper AI Attribution",
          introHe: {
            lecturer: "שמירה על זכויות יוצרים, קניין רוחני, רישוי פתוח וכללי ציטוט וייחוס שקופים של תוצרי AI באקדמיה.",
            student: "הקפדה על זכויות יוצרים, מתן קרדיט תקין ושקיפות בשימוש בחומרים דיגיטליים ובתוצרי בינה מלאכותית.",
            teacher: "ניהול מאורגן של חומרי הוראה דיגיטליים תוך שמירה על זכויות יוצרים ומתן קרדיט תקין למקורות ולכלי AI."
          },
          introEn: "Respecting copyright, intellectual property, open licenses, and transparent AI attribution.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך ששימוש בחומרים מהרשת ובתוצרי AI כפוף לכללי זכויות יוצרים, אתיקה ומתן קרדיט.",
            A2: "**התנסיתי** במתן קרדיט בסיסי לתמונות, מקורות ותוצרי AI שבהם השתמשתי בחומרי ההוראה שלי.",
            B1: "אני **מקפיד/ה באופן שוטף** על שימוש חוקי בחומרים, ציון מקורות ורישום שקוף של אופן השימוש ב-AI בחומרי הקורס.",
            B2: "אני **מנחה את הלומדים** כיצד לצטט כראוי מקורות דיגיטליים וכיצד למלא 'הצהרת שימוש ב-AI' מפורטת ושקופה.",
            C1: "אני **מטמיע/ה בקורס** נהלים מובנים של יושרה אקדמית, רישוי פתוח (Creative Commons) ותיעוד פרומפטים ותהליכי יצירה.",
            C2: "אני **שותף/ה לגיבוש מדיניות מוסדית/חוגית** בנושא זכויות יוצרים, קניין רוחני וציטוט אקדמי של בינה מלאכותית."
          },
          statementsEn: {
            A1: "I am **aware** that online materials and AI outputs are subject to copyright and attribution rules.",
            A2: "I **have tried** adding basic credits to images, sources, and AI outputs used in my teaching materials.",
            B1: "I **regularly comply** with copyright rules and transparently disclose AI use in my course materials.",
            B2: "I **guide learners** on proper digital citation and how to complete a transparent AI Use Declaration.",
            C1: "I **embed structured protocols** for academic integrity, open licensing, and prompt-process documentation.",
            C2: "I **contribute to institutional policy** on copyright, intellectual property, and academic AI attribution."
          },
          levelUpHe: {
            A1: "הוסיפו שקופית או הערת שוליים בחומרי ההוראה שלכם המציינת באילו כלי AI נעשה שימוש להכנתם (Modeling לשקיפות).",
            A2: "הכירו את טופס 'הצהרת שימוש ב-AI לסטודנט' של המכללה ושלבו אותו בדף הקורס.",
            B1: "הנחו את הלומדים לצרף נספח קצר לעבודותיהם המתאר את הדיאלוג שלהם עם ה-AI וכיצד ערכו את התוצר.",
            B2: "שלבו במחוון ההערכה סעיף המייחס משקל לשקיפות התיעוד ולאיכות האימות של המקורות.",
            C1: "פתחו מאגר דוגמאות חוגי לציטוט וייחוס תקין של כלי AI שונים במחקר ובהוראה.",
            C2: "הובילו עדכון של הנחיות היושרה האקדמית בחוג לאור כלי ה-AI החדשים."
          }
        }
      ]
    },

    {
      id: "dom3_assessment",
      num: 3,
      weight: 1 / 6,
      axis: "pedagogical",
      titleHe: "הערכה מעצבת, משוב ועיצוב מטלות בעידן ה-AI",
      titleEn: "Formative Assessment, Feedback & Assignment Design in the AI Era",
      shortHe: "הערכה ומשוב",
      shortEn: "Assessment",
      color: "#7c3aed",
      icon: "📊",
      sourceRef: "DigCompEdu Area 4 + Prizma Dual-Track Assessment",
      descHe: "עיצוב מחדש של דרכי ההערכה: שילוב נתיב מוגן ללא AI ונתיב משלב AI, הערכת תהליך מול תוצר, ומתן משוב מקדם למידה.",
      items: [
        {
          id: "3.1",
          axis: "pedagogical",
          titleHe: "עיצוב מטלות הערכה בעידן ה-AI (נתיב מוגן + נתיב משלב)",
          titleEn: "Designing Assessment in the AI Era (Protected & AI-Integrated Tracks)",
          introHe: {
            lecturer: "התאמת מטלות הקורס למציאות שבה כלי AI זמינים לכל סטודנט: שילוב הערכת תהליך, הגנה בעל-פה, ונתיבים מובחנים (ללא AI / עם AI).",
            student: "תכנון דרכי הערכה מגוונות הבודקות הבנה אמיתית ותהליך חשיבה של תלמידים בעידן הבינה המלאכותית.",
            teacher: "עיצוב משימות הערכה בכיתה המבחינות בין שליטה במיומנויות יסוד ללא AI לבין יצירה וחקר בשילוב AI."
          },
          introEn: "Adapting course assignments to the AI era using process assessment and dual-track design.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שמטלות מסורתיות לבית חשיפות לשימוש פסיבי ב-AI ולכן נדרש עדכון בדרכי ההערכה.",
            A2: "**התנסיתי** בעדכון ראשוני של הנחיות מטלה או בהגדרת גבולות מותר ואסור לשימוש ב-AI במטלת הקורס.",
            B1: "אני **משלב/ת בקורס** הבחנה ברורה בין מטלות 'נתיב מוגן' (ללא AI, בכיתה/בעל-פה) לבין מטלות 'נתיב משלב AI'.",
            B2: "אני **מתכנן/ת מטלות הערכה מבוססות-תהליך** שבהן הציון ניתן על החשיבה הביקורתית, הדיוק הפדגוגי והרפלקציה על תוצר ה-AI.",
            C1: "אני **מעצב/ת מחדש** את מערך ההערכה בקורס עם מחוונים מתוקפים להערכת תוצרים משולבי-AI ופרזנטציות הגנה אישיות.",
            C2: "אני **מפתח/ת מודלים ומחוונים חדשניים** להערכה בעידן ה-AI ומוביל/ה מעבדות הערכה ושיפוט עמיתים בחוג."
          },
          statementsEn: {
            A1: "I am **aware** that traditional take-home assignments are vulnerable to passive AI use and require redesign.",
            A2: "I **have tried** updating assignment guidelines or clarifying permitted vs. prohibited AI use.",
            B1: "I **implement** a clear distinction between 'Protected No-AI' tasks and 'AI-Integrated' tasks in my course.",
            B2: "I **design process-based assessments** grading critical thinking, pedagogical accuracy, and reflection on AI outputs.",
            C1: "I **systematically redesign** course assessment with validated rubrics for AI-integrated artifacts and oral defenses.",
            C2: "I **pioneer assessment models and rubrics** for the AI era and lead departmental assessment labs."
          },
          levelUpHe: {
            A1: "מפו את מטלות הקורס שלכם וסמנו אילו מהן ניתן לפתור בלחיצת כפתור ב-ChatGPT.",
            A2: "הגדירו בסילבוס הקרוב לפחות מרכיב אחד ב'נתיב מוגן' (בכיתה/בזמן אמת) ומרכיב אחד ב'נתיב משלב AI'.",
            B1: "העבירו לפחות 30% ממשקל המטלה המשלבת AI מהתוצר הסופי אל תיעוד תהליך העבודה, הפרומפטים והעריכה האנושית.",
            B2: "שלבו מחוון הערכה מפורש הבודק חשיבה ביקורתית, הוראה דיפרנציאלית ועמידה בכללי אתיקה בתוצר ה-AI.",
            C1: "קיימו סבב הערכה כפולה עם עמית בחוג לתיקוף המחוון על 3 תוצרי לומדים.",
            C2: "הובילו מעבדת שכתוב מטלות עבור מרצי החוג."
          }
        },
        {
          id: "3.2",
          axis: "pedagogical",
          titleHe: "ניתוח ראיות למידה ומיפוי התקדמות",
          titleEn: "Analyzing Learning Evidence & Progress Tracking",
          introHe: {
            lecturer: "שימוש בנתונים דיגיטליים (מערכת מוודל, שאלוני הבנה, ניתוח תוצרים) לזיהוי פערי הבנה בזמן אמת והתאמת ההוראה.",
            student: "איסוף וניתוח של נתוני התקדמות ותשובות תלמידים לצורך זיהוי קשיים והתאמת המשך השיעור.",
            teacher: "שימוש בנתונים מסביבות הלמידה הדיגיטליות ומבדקים מעצבים למיפוי מצב הכיתה וכל תלמיד."
          },
          introEn: "Using digital evidence and formative data to identify comprehension gaps in real time.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שסביבות למידה דיגיטליות מפיקות נתונים שיכולים לסייע במעקב אחר התקדמות הלומדים.",
            A2: "**התנסיתי** בבדיקת דוחות בסיסיים (כגון השתתפות ב-מוודל או תוצאות חידון קצר) כדי לראות מי השלים משימות.",
            B1: "אני **אוסף/ת ומנתח/ת באופן שוטף** מידע מעצב (סקרים חיים, מבדקי הבנה, תוצרי ביניים) כדי לזהות תפיסות שגויות.",
            B2: "אני **משתמש/ת בכלי ניתוח ו-AI** לזיהוי דפוסים חוזרים בתשובות הלומדים ומעדכן/ת את השיעור הבא בהתאם לממצאים.",
            C1: "אני **משתף/ת את הלומדים** בנתוני ההתקדמות שלהם ומנחה אותם לבצע ניטור עצמי ולהגדיר יעדי שיפור אישיים.",
            C2: "אני **מפתח/ת כלי מיפוי ודשבורדים** פדגוגיים המאפשרים מעקב רציף ומבוסס-ראיות אחר התפתחות כשירויות הלומדים."
          },
          statementsEn: {
            A1: "I am **aware** that digital environments generate data useful for tracking learner progress.",
            A2: "I **have tried** viewing basic reports (e.g., LMS completion or quiz scores) to check task submission.",
            B1: "I **regularly collect and analyze** formative data (live polls, exit tickets) to spot misconceptions.",
            B2: "I **use analytics and AI tools** to identify patterns in learner responses and adapt subsequent lessons.",
            C1: "I **engage learners** in reviewing their own progress data to foster self-monitoring and goal setting.",
            C2: "I **develop mapping tools and pedagogical dashboards** for evidence-based competency tracking."
          },
          levelUpHe: {
            A1: "שלבו 'כרטיס יציאה' דיגיטלי של 2 דקות בסוף השיעור (שאלה אחת על מושג הליבה ושאלה אחת על מה שנותר לא ברור).",
            A2: "הקדישו 5 דקות בפתח השיעור הבא להצגת תמונת המצב שעלתה מכרטיס היציאה הקודם.",
            B1: "היעזרו ב-AI (ללא פרטים מזהים) לסיכום תמטי מהיר של שאלות או קשיים שעלו מתשובות הלומדים.",
            B2: "בנו מעקב רב-נקודתי לאורך הסמסטר שמזהה לומדים שזקוקים לתמיכה מוקדמת לפני מטלת הסיום.",
            C1: "תנו ללומדים לנתח בעצמם את התקדמותם בין טיוטה א' לטיוטה ב' מול מחוון הקורס.",
            C2: "שתפו את מתודולוגיית איסוף הראיות שלכם במחקר המלווה החוגי."
          }
        },
        {
          id: "3.3",
          axis: "pedagogical",
          titleHe: "משוב מותאם אישית ומחוונים דיגיטליים מקדמי למידה",
          titleEn: "Personalized Feedback & Digital Formative Rubrics",
          introHe: {
            lecturer: "מתן משוב בונה, ממוקד ומהיר לסטודנטים באמצעים דיגיטליים (כולל משוב קולי/וידאו, הערות ממוקדות וסוכני משוב מבוססי מחוון).",
            student: "מתן משוב מקדם למידה לתלמידים ולעמיתים באמצעות מחוונים דיגיטליים וכלי משוב.",
            teacher: "מתן משוב אישי ומקדם לתלמידים באמצעים דיגיטליים ומחוונים שקופים המאפשרים תיקון וצמיחה."
          },
          introEn: "Providing timely, actionable feedback using digital rubrics, audio/video notes, and AI feedback assistants.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שכלים דיגיטליים וכלי AI יכולים לסייע במתן משוב מהיר ומפורט יותר ללומדים.",
            A2: "**התנסיתי** במתן הערות דיגיטליות על גבי עבודות או בשימוש במחוון דיגיטלי בסיסי.",
            B1: "אני **משתמש/ת באופן שוטף** בכלי משוב דיגיטליים מגוונים (מחוונים מובנים, הערות ממוקדות, משוב קולי) לקידום למידה.",
            B2: "אני **משלב/ת משוב מעצב דו-שלבי** (טיוטה -> משוב מבוסס מחוון/AI -> שיפור) המאפשר ללומדים לתקן ולהשתפר לפני הציון הסופי.",
            C1: "אני **בונה ומכוון/ת כלי עזר/בוטים מבוססי מחוון** המספקים ללומדים משוב מעצב מיידי 24/7 על טיוטותיהם לצד המשוב האנושי שלי.",
            C2: "אני **מוביל/ה פיתוח של מערכות משוב והערכה חכמות** בקורסים ומנחה סגל בשילוב אחראי של AI בתהליכי משוב."
          },
          statementsEn: {
            A1: "I am **aware** that digital and AI tools can support faster, more detailed feedback to learners.",
            A2: "I **have tried** providing digital annotations on assignments or using a basic online rubric.",
            B1: "I **regularly use** diverse digital feedback tools (structured rubrics, inline comments, audio feedback).",
            B2: "I **implement two-stage formative feedback** (draft -> rubric/AI feedback -> revision) prior to final grading.",
            C1: "I **configure rubric-aligned AI assistants** to give learners 24/7 formative feedback on drafts alongside my human review.",
            C2: "I **lead the development of smart feedback systems** and mentor faculty on ethical AI-assisted feedback."
          },
          levelUpHe: {
            A1: "פרסמו את מחוון ההערכה של המטלה מראש בסביבת הקורס כך שהקריטריונים יהיו שקופים ללומדים.",
            A2: "נסו לתת משוב קולי קצר (דקה אחת) או משוב מבוסס 3 קריטריונים מרכזיים על טיוטת ביניים.",
            B1: "אפשרו הגשת טיוטה ראשונה לקבלת משוב מעצב ממוקד לפני הגשת המטלה המסכמת.",
            B2: "בנו פרומפט מובנה המבוסס על מחוון הקורס שלכם שבו הלומדים יכולים לבדוק את הטיוטה שלהם עצמאית לפני ההגשה.",
            C1: "פתחו סוכן משוב ייעודי לקורס שמספק שאלות מכוונות (Scaffolding) מבלי לכתוב את העבודה במקום הלומד.",
            C2: "שתפו את סוכן המשוב והמחוון שלכם עם מרצים נוספים בחוג."
          }
        }
      ]
    },

    {
      id: "dom4_empowering",
      num: 4,
      weight: 1 / 6,
      axis: "pedagogical",
      titleHe: "העצמת לומדים, נגישות והוראה מותאמת אישית",
      titleEn: "Empowering Learners, Accessibility & Personalized Learning",
      shortHe: "העצמה ונגישות",
      shortEn: "Empowerment",
      color: "#ea580c",
      icon: "🌱",
      sourceRef: "DigCompEdu Area 5 + Special Ed & Differential Pedagogy",
      descHe: "שימוש בטכנולוגיה וב-AI להנגשת הלמידה, מתן מענה לשונות קוגניטיבית ושפתית, ובניית מסלולי למידה מותאמים אישית.",
      items: [
        {
          id: "4.1",
          axis: "pedagogical",
          titleHe: "נגישות דיגיטלית והכלה של לומדים עם צרכים מגוונים",
          titleEn: "Digital Accessibility & Inclusion of Diverse Learners",
          introHe: {
            lecturer: "הנגשת חומרי הקורס והפעילויות לסטודנטים עם לקויות למידה, הפרעות קשב, שונות שפתית (עברית/ערבית/אנגלית) או מוגבלויות.",
            student: "התאמת חומרי הלמידה והשיעורים לתלמידים עם צרכים מיוחדים, לקויות למידה או שונות שפתית באמצעות כלים דיגיטליים.",
            teacher: "שימוש בטכנולוגיות מסייעות ובכלי AI להנגשת הלמידה לתלמידים עם צרכים מיוחדים ושונות בכיתה."
          },
          introEn: "Ensuring digital accessibility and inclusion for learners with learning disabilities, ADHD, or linguistic diversity.",
          statementsHe: {
            A1: "אני **מודע/ת** לחשיבות ההנגשה הדיגיטלית וליכולת של כלים טכנולוגיים לסייע ללומדים עם צרכים מגוונים.",
            A2: "**התנסיתי** בהתאמה בסיסית של חומרי למידה (כגון טקסט קריא, כתוביות בסרטון או הקראה קולית).",
            B1: "אני **מיישם/ת באופן שוטף** עקרונות נגישות ועיצוב אוניברסלי ללמידה בחומרי הקורס (ייצוג חזותי, שמיעתי וטקסטואלי).",
            B2: "אני **משתמש/ת בכלי AI וטכנולוגיות מסייעות** כדי לפשט טקסטים מורכבים, לתרגם מושגים ולהתאים חומרים לשונות שפתית וקוגניטיבית.",
            C1: "אני **מעצב/ת סביבות למידה גמישות** ומנחה את הלומדים להשתמש בכלי AI כפיגומים אישיים מותאמים לצורכיהם (ובחינוך: לבניית תל״א חכם).",
            C2: "אני **מפתח/ת ומוביל/ה** כלים ומתודולוגיות להנגשה ולחינוך מיוחד מבוסס-AI ומדריך/ה עמיתים וסטודנטים בתחום."
          },
          statementsEn: {
            A1: "I am **aware** of digital accessibility principles and assistive technologies for diverse learners.",
            A2: "I **have tried** basic accessibility adaptations (readable fonts, video captions, text-to-speech).",
            B1: "I **regularly apply** Universal Design for Learning principles across my course materials.",
            B2: "I **use AI and assistive tools** to scaffold complex texts, bridge language gaps, and support neurodiverse learners.",
            C1: "I **design flexible learning environments** and train learners to use AI as personalized cognitive scaffolds.",
            C2: "I **pioneer AI-powered inclusion and IEP methodologies** and mentor educators across the institution."
          },
          levelUpHe: {
            A1: "וודאו שכל קובצי ה-PDF והמצגות בקורס שלכם קריאים לטכנולוגיות הקראה וכוללים חלוקה ברורה לכותרות.",
            A2: "הציעו ללומדים לצד טקסט אקדמי ארוך גם תקציר מובנה או גרסת שמע (למשל באמצעות NotebookLM).",
            B1: "שלבו מילון מונחים רב-לשוני או כלי תרגום/הבהרה מבוסס AI עבור מושגי יסוד מורכבים בקורס.",
            B2: "אפשרו ללומדים לבחור בין מספר אופני הבעה והגשה של הידע (טקסט כתוב, פרזנטציה מוקלטת, מפה מושגית).",
            C1: "פתחו תבנית של 'פיגום AI מותאם אישית' לתמיכה בתיפקודים ניהוליים וארגון למידה של הלומדים.",
            C2: "שתפו את פרקטיקות ההנגשה וה-UDL שלכם כמודל מוסדי."
          }
        },
        {
          id: "4.2",
          axis: "pedagogical",
          titleHe: "דיפרנציאציה ומסלולי למידה מותאמים אישית",
          titleEn: "Differentiation & Personalized Learning Pathways",
          introHe: {
            lecturer: "מתן מענה לרמות ידע קודם שונות ולתחומי עניין מגוונים של הסטודנטים באמצעות משימות מדורגות ומסלולי בחירה.",
            student: "בניית פעילויות מדורגות המותאמות לרמות השונות של התלמידים בכיתה בסיוע כלים דיגיטליים.",
            teacher: "התאמת קצב, רמת קושי ותוכן הלמידה לכל תלמיד באמצעות סביבות דיגיטליות וכלי בינה מלאכותית."
          },
          introEn: "Addressing diverse prior knowledge and interests through tiered tasks and personalized pathways.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שכלים דיגיטליים ו-AI מאפשרים להתאים את הלמידה לרמות שונות של לומדים.",
            A2: "**התנסיתי** במתן חומרי העשרה או תרגול נוסף בדיגיטל ללומדים שזקוקים לחיזוק או לאתגר.",
            B1: "אני **משלב/ת** פעילויות דיגיטליות מדורגות המאפשרות ללומדים להתקדם בקצב שלהם או לבחור נושא חקר הקרוב לליבם.",
            B2: "אני **משתמש/ת ב-AI** ליצירת גרסאות מותאמות של משימות וטקסטים בדרגות מורכבות שונות ולמתן תמיכה דיפרנציאלית.",
            C1: "אני **מעצב/ת מסלולי למידה אדפטיביים** שבהם כל לומד נעזר בסביבה דיגיטלית/סוכן AI כחונך אישי (Tutor) המותאם לרמתו.",
            C2: "אני **מפתח/ת מודלים פדגוגיים להוראה מותאמת אישית** בקנה מידה רחב ומוביל/ה מחקר והכשרה בתחום."
          },
          statementsEn: {
            A1: "I am **aware** that digital and AI tools enable personalized learning for different readiness levels.",
            A2: "I **have tried** providing supplementary digital enrichment or practice materials for specific learners.",
            B1: "I **integrate** tiered digital activities allowing learners to progress at their own pace or choose inquiry topics.",
            B2: "I **use AI** to generate differentiated task versions and complexity levels tailored to diverse learners.",
            C1: "I **design adaptive learning pathways** where learners interact with Socratic AI tutors tailored to their level.",
            C2: "I **develop scalable personalized learning models** and lead institutional training and research on them."
          },
          levelUpHe: {
            A1: "הוסיפו במטלה הקרובה אפשרות בחירה בין שני נושאים או שתי רמות עומק.",
            A2: "היעזרו ב-AI כדי לייצר מתוך מאמר אחד 3 רמות של שאלות מנחות (בסיס, יישום, חשיבה ביקורתית מתקדמת).",
            B1: "בנו ב-מוודל או בסביבת הקורס נתיב בחירה שמאפשר ללומדים להתמקד בזווית הדיסציפלינרית הרלוונטית להם.",
            B2: "הנחו את הלומדים להשתמש בפרומפט 'מורה סוקרטי' שמתאים את רמת השאלות לתשובותיהם בזמן אמת.",
            C1: "פתחו בוט חונך קורסי שמזהה את רמת הלומד ומספק לו רמזים מדורגים.",
            C2: "הציגו את מודל הפרסונליזציה שלכם בפורום ראשי החוגים."
          }
        },
        {
          id: "4.3",
          axis: "pedagogical",
          titleHe: "מעורבות פעילה וטיפוח למידה בהכוונה עצמית",
          titleEn: "Active Engagement & Self-Regulated Learning",
          introHe: {
            lecturer: "שימוש בכלים דיגיטליים להפיכת הסטודנטים מלומדים פסיביים לחוקרים פעילים המנהלים את תהליך הלמידה והרפלקציה שלהם.",
            student: "הפעלת התלמידים כלומדים עצמאיים וחוקרים פעילים באמצעות כלים דיגיטליים.",
            teacher: "קידום מעורבות פעילה, סקרנות וניהול עצמי של הלמידה בקרב התלמידים בסביבה דיגיטלית."
          },
          introEn: "Transforming learners from passive consumers into active, self-regulated investigators using digital tools.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שכלים דיגיטליים יכולים לעודד מעורבות פעילה ולמידה עצמאית של הלומדים.",
            A2: "**התנסיתי** בשילוב כלים אינטראקטיביים בשיעור (כגון חידון חי או סיעור מוחות דיגיטלי) לעורר קשב ומעורבות.",
            B1: "אני **מפעיל/ת את הלומדים באופן שוטף** בחקר פעיל, פתרון בעיות ויצירת תוצרים דיגיטליים במקום האזנה פסיבית.",
            B2: "אני **מעצב/ת סביבות למידה** שבהן הלומדים מתכננים את שלבי הפרויקט שלהם, מתעדים תהליך ומבצעים רפלקציה מתמשכת.",
            C1: "אני **מנחה את הלומדים** לבנות תיק עבודות דיגיטלי (ePortfolio) ויומן רפלקציה המתעד את צמיחתם המקצועית לאורך הקורס.",
            C2: "אני **יוצר/ת תרבות למידה אוטונומית** שבה הלומדים שותפים בעיצוב הסילבוס, בהובלת שיעורים ובמחקר פעיל."
          },
          statementsEn: {
            A1: "I am **aware** that digital tools can foster active engagement and independent learning.",
            A2: "I **have tried** using interactive classroom tools (live quizzes, digital brainstorming) to boost attention.",
            B1: "I **regularly engage learners** in active inquiry, problem-solving, and digital creation rather than passive listening.",
            B2: "I **design learning environments** where learners plan project stages, document progress, and reflect continuously.",
            C1: "I **guide learners** in curating digital ePortfolios and reflection journals documenting their professional growth.",
            C2: "I **cultivate an autonomous learning culture** where learners co-design the syllabus and lead inquiry."
          },
          levelUpHe: {
            A1: "החליפו 15 דקות של הרצאה פרונטלית במשימת חקר קצרה בזוגות מול מקור דיגיטלי.",
            A2: "בקשו מהלומדים לנסח בעצמם 2 שאלות חקר חדשות בעקבות החומר שנלמד.",
            B1: "הוסיפו לכל פרויקט בקורס 'יומן תהליך' קצר שבו הלומד מתעד החלטות, קשיים ופתרונות.",
            B2: "שלבו רפלקציה מטה-קוגניטיבית בסיום כל שלב: 'מה למדתי לבד, במה נעזרתי ב-AI, ומה אעשה אחרת בפעם הבאה'.",
            C1: "אמצו מבנה של תיק עבודות דיגיטלי (ePortfolio) מצטבר לאורך הקורס.",
            C2: "שתפו סטודנטים נבחרים בהצגת תוצריהם בכנס המחקר והיצירה של המכללה."
          }
        }
      ]
    },

    {
      id: "dom5_ai_agency",
      num: 5,
      weight: 1 / 6,
      axis: "pedagogical",
      titleHe: "אוריינות AI ביקורתית, פעלנות ואתיקה",
      titleEn: "Critical AI Literacy, Human Agency & Ethics (MoE AI 2.0 Model)",
      shortHe: "אוריינות AI ואתיקה",
      shortEn: "AI Agency & Ethics",
      color: "#db2777",
      icon: "🧠",
      sourceRef: "מודל כשירויות בינה מלאכותית 2.0 למורים (משרד החינוך / פילו ואליוסף) + DigCompEdu Area 6",
      descHe: "הבנת מנגנוני פעולת ה-AI, ניהול דיאלוג מושכל, שמירה על סוכנות אנושית ומניעת תלות קוגניטיבית, לצד תפקוד אתי ומוסרי.",
      items: [
        {
          id: "5.1",
          axis: "pedagogical",
          titleHe: "הבנת מנגנוני ה-AI, הטיות אלגוריתמיות והשפעה רגשית-קוגניטיבית",
          titleEn: "Understanding AI Mechanisms, Algorithmic Bias & Cognitive-Emotional Impact",
          introHe: {
            lecturer: "הבנה ופיתוח מודעות אצל הסטודנטים לאופן הפעולה ההסתברותי של מודלי שפה, להטיות מובנות (תרבותיות/מגדריות) ולהשפעת ה-AI על החשיבה והרגש.",
            student: "הבנה כיצד פועלת בינה מלאכותית, זיהוי הטיות בתוצרים ומודעות להשפעת השימוש בה על החשיבה והרגשות.",
            teacher: "פיתוח הבנה אצל התלמידים כיצד AI עובד (חיזוי סטטיסטי ולא 'חשיבה אנושית'), זיהוי הטיות ושמירה על חוסן רגשי."
          },
          introEn: "Understanding probabilistic AI mechanisms, algorithmic biases, and cognitive-emotional effects on learners.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שבינה מלאכותית פועלת כמנגנון חיזוי סטטיסטי ועלולה לשקף הטיות תרבותיות, מגדריות וחברתיות.",
            A2: "**התנסיתי** בבחינת דוגמאות שבהן מודל AI מציג הטיה או יוצר אשליה של אמפתיה ושיפוט אנושי.",
            B1: "אני **מדגים/ה ומסביר/ה בשיעורים** את ההבדל בין חשיבה אנושית לבין עיבוד שפה סטטיסטי ואת המגבלות המובנות של כלי AI.",
            B2: "אני **מוביל/ה עם הלומדים ניתוח ביקורתי** של הטיות (לשוניות, תרבותיות, מגדריות, היסטוריות) בתוצרי AI בתחום הדעת שלנו.",
            C1: "אני **מעצב/ת פעילויות מחקר וגישוש** שבהן הלומדים חוקרים אמפירית כיצד AI מעצב תפיסות מציאות, קשב ורגש.",
            C2: "אני **מפתח/ת ידע, מחקר ומתודולוגיות** בחזית החיבור שבין בינה מלאכותית, קוגניציה, חברה וחינוך."
          },
          statementsEn: {
            A1: "I am **aware** that AI operates as a statistical prediction engine and can reflect cultural or gender biases.",
            A2: "I **have tried** examining examples where an AI model exhibits bias or simulates human empathy.",
            B1: "I **explain and demonstrate** in class the difference between human cognition and statistical language modeling.",
            B2: "I **lead critical analyses** with learners on linguistic, cultural, and disciplinary biases in AI outputs.",
            C1: "I **design exploratory research tasks** where learners empirically investigate how AI shapes cognition and society.",
            C2: "I **contribute research and methodologies** at the intersection of AI, human cognition, ethics, and education."
          },
          levelUpHe: {
            A1: "בצעו ניסוי קצר מול כלי AI בתחום הדעת שלכם ובדקו אילו נקודות מבט או אוכלוסיות נעדרות מהתשובה הראשונית שלו.",
            A2: "הקדישו 10 דקות בשיעור להמחשה מדוע צ'אטבוט אינו 'יודע' או 'מרגיש', אלא מחשב הסתברות של מילים (Tokens).",
            B1: "בקשו מהלומדים להשוות תשובה של AI בעברית מול אנגלית/ערבית על אותה סוגיה ולנתח את הפערים התרבותיים.",
            B2: "שלבו דיון ביקורתי על האופן שבו הסתמכות יתר על AI עלולה לשחוק קשב עמוק ומאמץ קוגניטיבי בריא.",
            C1: "הנחו מחקר גישוש כיתתי קטן הבוחן הטיות או דפוסי ייצוג של AI בדיסציפלינה שלכם.",
            C2: "הציגו את ממצאי החקר הכיתתי בערב עיון או בכנס אקדמי."
          }
        },
        {
          id: "5.2",
          axis: "pedagogical",
          titleHe: "סוכנות אנושית, הנדסת פרומפטים ומניעת 'הורדת הילוך קוגניטיבית'",
          titleEn: "Human Agency, Dialogic Prompting & Preventing Cognitive Offloading",
          introHe: {
            lecturer: "פיתוח יכולת שליטה וניהול דיאלוג מושכל מול AI תוך שמירה בלתי מתפשרת על הסוכנות האנושית, החשיבה העצמאית תחילה והיצירתיות של הלומד.",
            student: "שימוש ב-AI כשותף מרחיב חשיבה (ולא כתחליף לחשיבה עצמאית) תוך ניהול פרומפטים מדויקים ושימור הקול האישי.",
            teacher: "הנחיית התלמידים לחשוב עצמאית לפני הפנייה ל-AI ולהשתמש בו כמאתגר חשיבה ולא כקיצור דרך שמוותר על מאמץ."
          },
          introEn: "Mastering dialogic prompting while preserving human agency, independent thinking first, and cognitive effort.",
          statementsHe: {
            A1: "אני **מודע/ת** לסכנה של 'הורדת הילוך קוגניטיבית' (Cognitive Offloading) כלומדים נותנים ל-AI לחשוב ולכתוב במקומם.",
            A2: "**התנסיתי** בניסוח הנחיות מפורטות יותר (Prompts) כדי לקבל מ-AI משוב או כיווני חשיבה במקום תשובה מוכנה מראש.",
            B1: "אני **מיישם/ת ומנחה** עבודה לפי עקרון 'חשיבה אנושית תחילה': גיבוש עמדה/טיוטה עצמאית לפני פתיחת דיאלוג עם ה-AI.",
            B2: "אני **מאמן/ת את הלומדים** בניהול דיאלוג איטרטיבי וביקורתי עם ה-AI (הגדרת תפקיד, אילוצים, אתגור טענות נגד ושכתוב עצמאי).",
            C1: "אני **מעצב/ת תהליכי למידה** שבהם הלומד פועל כ'במאי/עורך ראשי' המפעיל סוכני AI להרחבת גבולות היצירה והמחקר שלו.",
            C2: "אני **מפתח/ת מסגרות פדגוגיות** לטיפוח פעלנות וריבונות קוגניטיבית בעידן ה-AI ומוביל/ה הכשרות בנושא."
          },
          statementsEn: {
            A1: "I am **aware** of the risk of cognitive offloading when learners let AI think and write in their place.",
            A2: "I **have tried** crafting structured prompts to get feedback or brainstorming ideas rather than ready-made answers.",
            B1: "I **practice and teach** 'Human Thinking First': forming an independent draft/stance before engaging AI.",
            B2: "I **train learners** in iterative, critical AI dialogue (role framing, constraints, counter-arguments, human editing).",
            C1: "I **design learning processes** where the learner acts as 'Editor-in-Chief', orchestrating AI to amplify original inquiry.",
            C2: "I **develop pedagogical frameworks** for cultivating human agency and cognitive sovereignty in the AI era."
          },
          levelUpHe: {
            A1: "אמצו כלל זהב בכיתה: '10 דקות ראשונות של חשיבה ושרבוט על דף/מסמך סגור – ורק אז פונים ל-AI'.",
            A2: "למדו את הלומדים לבקש מה-AI: 'אל תכתוב לי את התשובה, אלא שאל אותי 3 שאלות שיעזרו לי לשפר את הטיעון שלי'.",
            B1: "דרשו במטלות להציג את 'טיוטת האפס' האנושית לצד התוצר שלאחר הדיאלוג עם ה-AI.",
            B2: "תרגלו בכיתה 'ביום משפט' ל-AI: הלומדים מבקשים מה-AI לבקר את הטיעון שלהם, ואז מחליטים מנומקת אילו הערות לקבל ואילו לדחות.",
            C1: "בנו ספריית פרומפטים דיסציפלינרית לקורס המעודדת חשיבה מסדר גבוה (אנליזה, סינתזה, יצירה).",
            C2: "הובילו מחקר פעולה על שימור הקול האישי והסוכנות האנושית בקורסים משלבי AI."
          }
        },
        {
          id: "5.3",
          axis: "pedagogical",
          titleHe: "אתיקה, פרטיות מידע ואזרחות דיגיטלית אחראית",
          titleEn: "AI Ethics, Data Privacy & Responsible Digital Citizenship",
          introHe: {
            lecturer: "שמירה קפדנית על פרטיות מידע רגיש של סטודנטים ותלמידים, מניעת העלאת מידע מזהה לכלי AI חיצוניים, וגיבוש אתיקה מקצועית.",
            student: "שמירה על פרטיות תלמידים, הימנעות מהזנת מידע אישי או רגיש לכלי AI, והתנהלות אתית ובטוחה ברשת.",
            teacher: "הקפדה על הנחיות הבטיחות והפרטיות של משרד החינוך, הגנה על מידע אישי של תלמידים והוראת אזרחות דיגיטלית."
          },
          introEn: "Protecting student data privacy, preventing sensitive data exposure in public AI tools, and fostering ethical conduct.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שאין להזין מידע אישי, ציונים או פרטים מזהים של לומדים/מטופלים לתוך כלי AI ציבוריים.",
            A2: "**התנסיתי** במחיקת פרטים מזהים (אנונימיזציה) לפני העלאת טקסט או מקרה בוחן לכלי דיגיטלי או AI.",
            B1: "אני **מקפיד/ה באופן שיטתי** על כללי פרטיות מידע, אבטחת נתונים והגדרת כללי אתיקה ברורים בסילבוס ובכיתה.",
            B2: "אני **מנחה את הלומדים** לזיהוי דילמות אתיות (זיופים עמוקים, פרטיות קטינים בחינוך ובחנ״מ, אחריות מקצועית).",
            C1: "אני **מגבש/ת יחד עם הלומדים** אמנה אתית כיתתית/מקצועית לשימוש אחראי, אנושי ובטוח בבינה מלאכותית בשדה החינוכי.",
            C2: "אני **מוביל/ה כתיבת מדיניות ונהלי אתיקה ופרטיות** ברמת החוג או המוסד ומדריך/ה סגל וסטודנטים ביישומם."
          },
          statementsEn: {
            A1: "I am **aware** that personal data, grades, or identifiable student records must never be entered into public AI tools.",
            A2: "I **have tried** anonymizing texts or case descriptions before using them in digital or AI tools.",
            B1: "I **systematically enforce** data privacy rules and establish clear ethical AI guidelines in my syllabus and classroom.",
            B2: "I **guide learners** in navigating ethical dilemmas (deepfakes, minor privacy in special ed/schools, professional liability).",
            C1: "I **co-create an ethical AI charter** with my learners for responsible, humane technology use in educational practice.",
            C2: "I **lead the formulation of institutional AI ethics and privacy policies** and train faculty on compliance."
          },
          levelUpHe: {
            A1: "הכירו את כללי האנונימיזציה המלאה לפני כל התייעצות פדגוגית מול כלי AI.",
            A2: "הטמיעו בסילבוס שלכם את 'כרטיס מדיניות ה-AI' הרשמי של הקורס.",
            B1: "קיימו בשיעור הראשון 10 דקות של שיח תיאום ציפיות אתי על שימוש אחראי ושקוף ב-AI בקורס.",
            B2: "נתחו בכיתה אירוע דילמה אתית אמיתי מהשדה החינוכי (למשל שימוש ב-AI לכתיבת דוח אבחון/תל״א לתלמיד).",
            C1: "תנו ללומדים לנסח קוד אתי למחנך בעידן ה-AI כחלק מהכשרתם המקצועית.",
            C2: "הצטרפו לצוות גיבוש מסמך מדיניות ה-AI המוסדי של המכללה."
          }
        }
      ]
    },

    {
      id: "dom6_engagement",
      num: 6,
      weight: 1 / 6,
      axis: "leadership",
      titleHe: "פיתוח מקצועי, רפלקציה והובלה ארגונית",
      titleEn: "Professional Engagement, Reflection & Organizational Leadership",
      shortHe: "פיתוח מקצועי והובלה",
      shortEn: "Leadership & Growth",
      color: "#0284c7",
      icon: "🚀",
      sourceRef: "DigCompEdu Area 1 + Prizma Institutional Community",
      descHe: "ניהול סביבות הלמידה והתקשורת המקצועית, פרקטיקה רפלקטיבית מתמשכת, למידת עמיתים והובלת שינוי בחוג ובמוסד.",
      items: [
        {
          id: "6.1",
          axis: "pedagogical",
          titleHe: "ניהול סביבת הקורס ותקשורת מקצועית",
          titleEn: "Course Environment Management & Professional Communication",
          introHe: {
            lecturer: "ארגון סביבת הקורס הדיגיטלית בצורה בהירה, נגישה ומזמינה, וניהול תקשורת אפקטיבית עם סטודנטים ועמיתים.",
            student: "ארגון סביבות למידה דיגיטליות ותקשורת מקצועית מסודרת עם תלמידים, מרצים ומורים מאמנים.",
            teacher: "ניהול סביבת הכיתה הדיגיטלית ותקשורת מקצועית, רציפה ומכבדת עם תלמידים, הורים וצוות בית הספר."
          },
          introEn: "Organizing clear, accessible LMS course environments and maintaining effective professional communication.",
          statementsHe: {
            A1: "אני **מודע/ת** לחשיבות של סביבת קורס דיגיטלית מאורגנת וערוצי תקשורת מסודרים עם הלומדים והסגל.",
            A2: "**התנסיתי** בהעלאת סילבוס, מצגות והודעות בסיסיות לסביבת הקורס המקוונת.",
            B1: "אני **מנהל/ת באופן שוטף** סביבת קורס מובנית, בהירה ומעודכנת המשלבת משאבים, מטלות וערוצי תקשורת ברורים.",
            B2: "אני **מתכנן/ת ומעצב/ת** את סביבת הקורס כמרחב למידה חווייתי ונגיש התומך בניווט עצמאי ובמעקב אחר אבני דרך.",
            C1: "אני **מייעל/ת ומשדרג/ת** את סביבות הקורס והתקשורת הארגונית באמצעות אוטומציות, תבניות חכמות וכלי עזר דיגיטליים.",
            C2: "אני **מוביל/ה סטנדרטים ותבניות מוסדיות** לסביבות למידה דיגיטליות מתקדמות ומשתף/ת אותן עם כלל הסגל."
          },
          statementsEn: {
            A1: "I am **aware** of the importance of an organized LMS course environment and clear communication channels.",
            A2: "I **have tried** uploading syllabi, presentations, and basic announcements to the online course space.",
            B1: "I **regularly maintain** a structured, clear, up-to-date course environment integrating resources and tasks.",
            B2: "I **design** my online course space as an engaging, navigable learning hub supporting milestone tracking.",
            C1: "I **enhance and streamline** course environments and communication using smart templates and digital workflows.",
            C2: "I **lead institutional standards and templates** for advanced digital learning environments across faculty."
          },
          levelUpHe: {
            A1: "ארגנו את דף ה-מוודל של הקורס לפי יחידות נושא או שבועות ברורים עם כותרות אחידות.",
            A2: "הוסיפו בראש דף הקורס 'מפת דרכים לקורס' וכרטיס מדיניות AI בולט ונגיש.",
            B1: "שלבו בכל יחידה ב-מוודל לא רק קובץ לקריאה אלא גם שאלת מיקוד או פעילות קצרה.",
            B2: "בקשו משוב קצר מ-3 לומדים על בהירות הניווט וחוויית המשתמש בדף הקורס שלכם.",
            C1: "בנו תבנית קורס למופת שניתן לשכפל בקלות לקורסים נוספים בחוג.",
            C2: "שתפו את התבנית עם צוות קידום הוראה ומרכז החדשנות להפצה רוחבית."
          }
        },
        {
          id: "6.2",
          axis: "pedagogical",
          titleHe: "פרקטיקה רפלקטיבית ולמידה מקצועית מתמשכת",
          titleEn: "Reflective Practice & Continuous Professional Learning",
          introHe: {
            lecturer: "בחינה רפלקטיבית שיטתית של ההוראה שלי, הצבת יעדי צמיחה אישיים והשתתפות פעילה בלמידה מקצועית בתחומי החדשנות וה-AI.",
            student: "ביצוע רפלקציה שיטתית על ההתנסות בהוראה ולמידה עצמאית מתמשכת של כלים וגישות פדגוגיות חדשות.",
            teacher: "רפלקציה מתמדת על פרקטיקות ההוראה בכיתה ולמידה מקצועית שוטפת של חידושים טכנו-פדגוגיים."
          },
          introEn: "Systematic self-reflection on teaching practice, goal setting, and continuous professional learning in AI & pedagogy.",
          statementsHe: {
            A1: "אני **מודע/ת** לכך שרפלקציה על ההוראה ולמידה מקצועית מתמשכת חיוניות לפיתוח הכשירות הדיגיטלית שלי.",
            A2: "**השתתפתי** במפגש חשיפה, וובינר או סדנה ראשונית בנושא שילוב טכנולוגיה ובינה מלאכותית בהוראה.",
            B1: "אני **משתתף/ת באופן פעיל** בהכשרות, מתנסה בכלים חדשים ומציב/ה לעצמי יעד שינוי פדגוגי בכל סמסטר.",
            B2: "אני **מבצע/ת הערכה ורפלקציה שיטתית** על השינויים שהכנסתי להוראה (על בסיס תוצרי לומדים ומשוב) ומעדכן/ת את הפרקטיקה שלי.",
            C1: "אני **חוקר/ת באופן אמפירי את ההוראה שלי** ומתעד/ת תובנות מבוססות-נתונים מתהליכי ההטמעה.",
            C2: "אני **מפרסם/ת ומציג/ה** מחקרים, מאמרים או פוסטרים אקדמיים על חדשנות בהוראה ובינה מלאכותית בכנסים ובכתבי עת."
          },
          statementsEn: {
            A1: "I am **aware** that reflection and continuous learning are essential for developing my digital competence.",
            A2: "I **have attended** an introductory webinar or workshop on integrating technology and AI in teaching.",
            B1: "I **actively participate** in professional learning, test new tools, and set a concrete pedagogical change goal each semester.",
            B2: "I **systematically evaluate and reflect** on my teaching innovations using learner outcomes and feedback.",
            C1: "I **conduct empirical Action Research (SoTL)** on my teaching and document data-driven implementation insights.",
            C2: "I **publish and present** academic papers, posters, or studies on educational AI and pedagogical innovation."
          },
          levelUpHe: {
            A1: "הגדירו בעקבות מילוי שאלון זה יעד אישי אחד קטן ומדיד לסמסטר הקרוב.",
            A2: "הירשמו למסלול ההדרכה המותאם לפרופיל שלכם במרכז החדשנות ויישמו כלי אחד שנלמד בו.",
            B1: "תעדו ביומן קצר מה עבד טוב ומה דרש דיוק לאחר הפעלת המשימה החדשה בכיתה.",
            B2: "השוו בין תוצרי הלומדים שלכם השנה לתוצרים משנים קודמות כדי לאמוד את איכות השינוי.",
            C1: "נסחו תקציר למחקר מלווה או מקרה בוחן להצגה בכנס המחקר והיצירה השנתי של המכללה.",
            C2: "הובילו כתיבה משותפת של מאמר או פוסטר מחקרי עם עמיתים מהחוג."
          }
        },
        {
          id: "6.3",
          axis: "leadership",
          titleHe: "שיתוף ידע, ליווי עמיתים והובלת תרבות חדשנות בחוג",
          titleEn: "Knowledge Sharing, Peer Mentoring & Leading Departmental Innovation",
          introHe: {
            lecturer: "שיתוף עמיתים בחוג בפרקטיקות מוצלחות, תמיכה הדדית בקהילת הסגל והובלת מהלכי הטמעה מערכתיים.",
            student: "שיתוף עמיתים ללימודים בחומרים, כלים ותובנות פדגוגיות והובלת יוזמות למידה משותפות.",
            teacher: "שיתוף צוות המורים בבית הספר בפרקטיקות מוצלחות, הדרכת עמיתים והובלת יוזמות חדשנות בית-ספריות."
          },
          introEn: "Sharing successful practices with peers, mutual support in faculty communities, and leading systemic innovation.",
          statementsHe: {
            A1: "אני **מודע/ת** לערך של למידת עמיתים ושיתוף ידע טכנו-פדגוגי בתוך צוות החוג/המוסד.",
            A2: "**שיתפתי** באופן אקראי עמית או שניים בכלי דיגיטלי או ברעיון להוראה שניסיתי.",
            B1: "אני **משתתף/ת פעיל/ה** בשיח הפדגוגי החוגי ומשתף/ת מניסיוני, מחומריי ומהאתגרים שפגשתי בהטמעת AI.",
            B2: "אני **מייעץ/ת ותומך/ת בעמיתים** באופן מכוון בבחירת כלים, בשכתוב מטלות ובפתרון דילמות פדגוגיות.",
            C1: "אני **מנחה ומוביל/ה** מפגשי למידת עמיתים, סדנאות חוגיות או פיתוח משותף של קורסים עם אנשי סגל נוספים.",
            C2: "אני **יוזם/ת ומוביל/ה אסטרטגיה מערכתית** ותוכניות הכשרה חוצות-חוגים לקידום חדשנות פדגוגית ו-AI במוסד ומחוצה לו."
          },
          statementsEn: {
            A1: "I am **aware** of the value of peer learning and sharing techno-pedagogical knowledge within my department.",
            A2: "I **have occasionally shared** a digital tool or teaching idea with one or two colleagues.",
            B1: "I **actively participate** in departmental pedagogical discourse and share my materials and implementation lessons.",
            B2: "I **advise and support colleagues** purposefully in tool selection, assignment redesign, and pedagogical dilemmas.",
            C1: "I **facilitate and lead** peer learning sessions, departmental workshops, or collaborative course design.",
            C2: "I **initiate and lead systemic strategy** and cross-departmental programs for pedagogical AI innovation."
          },
          levelUpHe: {
            A1: "שתפו בישיבת החוג הקרובה תובנה אחת או שאלה שעלתה לכם בעקבות המיפוי.",
            A2: "העלו מטלה אחת או פרומפט מוצלח שיצרתם לתיקייה השיתופית של החוג.",
            B1: "חברו לעמית אחד בחוג לתכנון משותף או צפייה הדדית ביחידת הוראה משלבת AI.",
            B2: "הציגו במשך 10 דקות בישיבת החוג הדגמה קצרה של פרקטיקה שעבדה לכם בקורס.",
            C1: "קחו חלק בהובלת קהילת הלמידה החוגית וליווי מרצים במסלול היסודות.",
            C2: "הובילו שיתוף פעולה בין-חוגי או בין-מכללתי במסגרת תוכנית פריזמה."
          }
        }
      ]
    }
  ]
};
