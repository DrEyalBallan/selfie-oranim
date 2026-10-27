/**
 * SELFIE 2.0 – AI Syllabus & Pedagogical Course Architect (יועץ AI אישי לסילבוס ולקורס)
 * גוזר תוכנית עבודה מותאמת אישית לסילבוס, כרטיס מדיניות AI מוכן להטמעה במודל,
 * מתווה הערכה דו-נתיבי (נתיב מוגן ללא AI + נתיב משלב AI) ומחוון מותאם לפי פרופיל ה-SELFIE 2.0 של המשיב.
 */

window.SelfieAiAdvisor = (function () {
  function generateSyllabusBlueprint(submission, calc, customOptions = {}) {
    const courseName =
      customOptions.courseName ||
      submission.courseName ||
      (submission.role === "teacher" ? "מקצוע ההוראה בכיתה" : "הקורס האקדמי שלי");
    const policyMode = customOptions.policyMode || "dual_track"; // dual_track | guided_ai | protected_core
    const learnerType = customOptions.learnerType || "שנים א׳–ג׳ (הכשרת מורים)";
    const deptObj =
      window.SELFIE_CONFIG.departments.find((d) => d.id === submission.department) ||
      window.SELFIE_CONFIG.departments[0];

    const levelCode = calc.overallLevel.code;
    const weakestDomain = [...calc.domainResults].sort((a, b) => a.score - b.score)[0];
    const strongestDomain = [...calc.domainResults].sort((a, b) => b.score - a.score)[0];

    // 1. Mandatory Syllabus AI Policy Card (כרטיס מדיניות AI לסילבוס - שדה חובה במודל)
    let policyCardTitle = "כרטיס מדיניות שימוש בבינה מלאכותית בקורס (מודל הנתיב הכפול – אורנים)";
    let policyBadge = "⚖️ נתיב כפול: נתיב מוגן ללא AI + נתיב משלב AI מבוקר";
    let policyRulesHe = [];

    if (policyMode === "dual_track") {
      policyRulesHe = [
        `🔒 **נתיב מוגן (ללא שימוש ב-AI):** במטלות הקריאה הקרובה, בדיונים בכיתה, בניתוח הראשוני ('טיוטת האפס') ובהצגה בעל-פה – העבודה תתבצע באופן עצמאי לחלוטין ללא סיוע כלי בינה מלאכותית, במטרה לפתח חשיבה עצמאית, סוכנות אנושית ומיומנויות יסוד דיסציפלינריות.`,
        `🤖 **נתיב משלב AI (בשימוש מושכל וביקורתי):** בשלבי הרחבת החקר, אתגור טיעונים, עיבוד מדיה או בניית תוצר יישומי – מותר ומומלץ להיעזר בכלי AI כ'שותף מאתגר חשיבה', בכפוף לאימות מלא של כל מקור ביבליוגרפי ועובדה.`,
        `📝 **חובת שקיפות ותיעוד ('הצהרת AI'):** בכל הגשה שבה נעשה שימוש ב-AI, יש לצרף בנספח את טופס הצהרת השימוש ב-AI הכולל: (א) שם הכלי, (ב) הפרומפטים המרכזיים, (ג) מה שונה, נערך או נדחה מתוך תוצר ה-AI ומדוע.`,
        `🛡️ **פרטיות ואתיקה:** חל איסור מוחלט להזין לכלי AI פרטים מזהים של תלמידים, מטופלים, עמיתים או מידע רגיש מהשדה החינוכי.`
      ];
    } else if (policyMode === "guided_ai") {
      policyCardTitle = "כרטיס מדיניות שימוש בבינה מלאכותית בקורס (שילוב מונחה ופיתוח סוכנות)";
      policyBadge = "🚀 שילוב AI מונחה בכל שלבי הפרויקט (Human-in-the-Loop)";
      policyRulesHe = [
        `🧠 **עקרון 'חשיבה אנושית תחילה':** לפני כל פנייה לכלי AI, הסטודנט/ית נדרש/ת לגבש מתווה חשיבה עצמאי או טיוטה ראשונית.`,
        `🔍 **אימות מקורות וביקורתיות:** האחריות האקדמית והמקצועית על דיוק העובדות, המקורות והציטוטים מוטלת במלואה על המגיש/ה. יש לאמת כל מקור במאגרים אקדמיים.`,
        `📋 **תיעוד יומן דיאלוג AI:** ההערכה בקורס מתייחסת לאיכות הדיאלוג עם ה-AI ולאופן שבו הסטודנט/ית שיפר/ה וביקר/ה את תוצרי המכונה.`
      ];
    } else {
      policyCardTitle = "כרטיס מדיניות שימוש בבינה מלאכותית בקורס (ליבה מוגנת + פיגומי למידה)";
      policyBadge = "🛡️ ליבת הערכה מוגנת + שימוש ב-AI כחונך למידה אישי בלבד";
      policyRulesHe = [
        `✍️ **מטלות ההערכה המסכמות בקורס מוגנות:** כתיבת העבודות והמבחנים מתבצעת באופן עצמאי ללא ניסוח או כתיבה על ידי כלי AI.`,
        `💡 **שימוש מותר ללמידה עצמית:** ניתן להיעזר בכלי AI (כגון NotebookLM על חומרי הקורס) לצורך הבהרת מושגים, תרגול שאלות חזרה וסיעור מוחות ראשוני בלבד.`
      ];
    }

    // 2. Three-Tier Action Plan based on Ministry of Education AI Competency 2.0 ("ללמוד, ללמד, לשכתב")
    const threeTierPlan = [
      {
        stage: "שלב 1: ללמוד (המרצה כלומד מתפתח)",
        focusDomain: weakestDomain.titleHe,
        currentLevel: weakestDomain.level.code,
        actionHe:
          weakestDomain.score < 45
            ? `חיזוק ממוקד בציר **${weakestDomain.shortHe}** (כעת ברמת ${weakestDomain.level.code}): התנסות מודרכת בתבנית עבודה אחת מוכנה בקורס "${courseName}" בליווי מרכז החדשנות.`
            : `שכלול מיומנות מתקדמת בציר **${weakestDomain.shortHe}** (כעת ברמת ${weakestDomain.level.code}): מעבר משימוש שוטף לניתוח ראיות וכיול מדויק של הכלים בקורס "${courseName}".`
      },
      {
        stage: "שלב 2: ללמד (הוראת הכשירות ללומדים בכיתה)",
        focusDomain: "אוריינות AI ביקורתית ופעלנות (Agency)",
        currentLevel: calc.pedagogicalLevel.code,
        actionHe: `הקדשת 20 דקות בשיעור להדגמה חיה (Modeling) בקורס "${courseName}" (${deptObj.nameHe}): הצגת תוצר AI בתחום הדעת, איתור שגיאות/הטיות משותף עם הלומדים (${learnerType}), והדגמת עקרון 'חשיבה אנושית תחילה'.`
      },
      {
        stage: "שלב 3: לשכתב (עיצוב מחדש של מטלה והערכה בסילבוס)",
        focusDomain: strongestDomain.titleHe,
        currentLevel: strongestDomain.level.code,
        actionHe: `מינוף נקודת החוזק שלך בציר **${strongestDomain.shortHe}** (רמת ${strongestDomain.level.code}) לשכתוב מטלת האמצע/הסיום בקורס "${courseName}" למטלה דו-נתיבית הכוללת הערכת תהליך והגנה אישית.`
      }
    ];

    // 3. Redesigned Assignment & Rubric Blueprint
    const assignmentBlueprint = {
      titleHe: `מתווה מטלה משודרגת לקורס: "${courseName}"`,
      stepsHe: [
        {
          stepNum: 1,
          trackType: "🔒 נתיב מוגן (ללא AI) – 30% מהציון",
          title: "טיוטת האפס ומיפוי מושגי עצמאי",
          desc: "הלומדים מנסחים בכיתה (או בדף עבודה מוגן) את שאלת החקר/הניתוח הראשוני ומקשרים אותה ל-2 מקורות ליבה מהסילבוס ללא שימוש ב-AI."
        },
        {
          stepNum: 2,
          trackType: "🤖 נתיב משלב AI מבוקר – 40% מהציון",
          title: "דיאלוג ביקורתי, אתגור ויצירת תוצר",
          desc: "הלומדים מנהלים דיאלוג מובנה עם AI לאתגור הטיעון שלהם, בודקים ומאמתים כל מראה מקום, ומתעדים ביומן קצר 3 תיקונים שביצעו מתוך שיקול דעת מקצועי."
        },
        {
          stepNum: 3,
          trackType: "🎤 הערכת תהליך ורפלקציה – 30% מהציון",
          title: "הצגה קצרה / הגנה בעל-פה ורפלקציה על פעלנות (Agency)",
          desc: "הצגת התוצר בכיתה (3–5 דקות) או בווידאו קצר + מענה על שאלת הבנה בעל-פה ורפלקציה: היכן בא לידי ביטוי הקול האישי שלי מול המכונה?"
        }
      ],
      rubricCriteria: [
        { criterion: "עומק דיסציפלינרי ושליטה במושגי היסוד (נתיב מוגן)", weight: "30%", desc: "דיוק תיאורטי, הבנה עצמאית וחיבור לספרות הקורס" },
        { criterion: "איכות הדיאלוג והביקורתיות מול ה-AI (סוכנות אנושית)", weight: "25%", desc: "פרומפטים מושכלים, זיהוי הזיות/הטיות ועריכה אנושית מהותית" },
        { criterion: "התאמה פדגוגית / דיפרנציאלית ויצירתיות התוצר", weight: "25%", desc: "רלוונטיות לשדה החינוכי, נגישות ומקוריות הפתרון" },
        { criterion: "שקיפות אתית, אימות מקורות ורפלקציה מטה-קוגניטיבית", weight: "20%", desc: "הצהרת AI מלאה, ציטוטים מאומתים ורפלקציה כנה על התהליך" }
      ]
    };

    // 4. Copyable Mega-Prompt for external AI assistant
    const copyablePrompt = `אני ${window.SELFIE_CONFIG.profiles[submission.role]?.labelHe || "מרצה במכללה"} ב${deptObj.nameHe}, ומלמד/ת את הקורס "${courseName}" עבור ${learnerType}.
השלמתי כעת מיפוי כשירות טכנו-פדגוגית ו-AI בכלי SELFIE 2.0:
- רמת הכשירות הכוללת שלי: ${levelCode} (${calc.overallScore}%)
- מדד עומק פדגוגי ו-AI: ${calc.pedagogicalIndex}% | מדד הובלת עמיתים: ${calc.leadershipIndex}%
- נקודת החוזק המרכזית שלי: ${strongestDomain.titleHe} (${strongestDomain.score}%)
- ציר המיקוד שלי לצמיחה: ${weakestDomain.titleHe} (${weakestDomain.score}%)
- מסלול ההכשרה המותאם לי: ${calc.assignedTrack.nameHe}

אנא פעל כיועץ טכנו-פדגוגי אקדמי בכיר ובנה עבורי:
1. הצעה מפורטת לשדרוג יחידת הוראה אחת בסילבוס של הקורס "${courseName}" שמשלבת 'נתיב מוגן ללא AI' ו'נתיב משלב AI'.
2. משימת כיתה קצרה (15 דקות) שמפתחת אצל הסטודנטים סוכנות אנושית (Agency) וחשיבה ביקורתית כלפי תוצרי AI בתחום הדעת של הקורס.
3. מדרג פיגומים (Scaffolding) שמותאם לרמת הכשירות הנוכחית שלי (${levelCode}) כדי שאוכל ליישם זאת בביטחון כבר בשבוע הבא.`;

    return {
      courseName,
      deptNameHe: deptObj.nameHe,
      learnerType,
      policyMode,
      policyCardTitle,
      policyBadge,
      policyRulesHe,
      threeTierPlan,
      assignmentBlueprint,
      copyablePrompt
    };
  }

  return {
    generateSyllabusBlueprint
  };
})();
