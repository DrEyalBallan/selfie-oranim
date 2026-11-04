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

    const levelTitle = calc.overallLevel.titleHe;
    const weakestDomain = [...calc.domainResults].sort((a, b) => a.score - b.score)[0];
    const strongestDomain = [...calc.domainResults].sort((a, b) => b.score - a.score)[0];

    // 1. Mandatory Syllabus AI Policy Card (כרטיס מדיניות AI לסילבוס - שדה חובה במודל)
    let policyCardTitle = "כרטיס מדיניות שימוש בבינה מלאכותית בקורס (מודל הנתיב הכפול – אורנים)";
    let policyBadge = "⚖️ נתיב כפול: נתיב מוגן + נתיב משלב בינה מלאכותית מבוקר";
    let policyRulesHe = [];

    if (policyMode === "dual_track") {
      policyRulesHe = [
        `🔒 **נתיב מוגן (ללא שימוש בבינה מלאכותית):** במטלות הקריאה הקרובה, בדיונים בכיתה, בניתוח הראשוני ('טיוטת האפס') ובהצגה בעל-פה – העבודה תתבצע באופן עצמאי לחלוטין ללא סיוע כלי בינה מלאכותית, במטרה לפתח חשיבה עצמאית, סוכנות אנושית ומיומנויות יסוד דיסציפלינריות.`,
        `🤖 **נתיב משלב בינה מלאכותית (בשימוש מושכל וביקורתי):** בשלבי הרחבת החקר, אתגור טיעונים, עיבוד מדיה או בניית תוצר יישומי – מותר ומומלץ להיעזר בכלי בינה מלאכותית כ'שותף מאתגר חשיבה', בכפוף לאימות מלא של כל מקור ביבליוגרפי ועובדה.`,
        `📝 **חובת שקיפות ותיעוד ('הצהרת שימוש'):** בכל הגשה שבה נעשה שימוש בבינה מלאכותית, יש לצרף בנספח את טופס ההצהרה הכולל: (א) שם הכלי, (ב) הפרומפטים המרכזיים, (ג) מה שונה, נערך או נדחה מתוך התוצר ומדוע.`,
        `🛡️ **פרטיות ואתיקה:** חל איסור מוחלט להזין לכלי בינה מלאכותית פרטים מזהים של תלמידים, מטופלים, עמיתים או מידע רגיש מהשדה החינוכי.`
      ];
    } else if (policyMode === "guided_ai") {
      policyCardTitle = "כרטיס מדיניות שימוש בבינה מלאכותית בקורס (שילוב מונחה ופיתוח סוכנות)";
      policyBadge = "🚀 שילוב בינה מלאכותית מונחה בכל שלבי הפרויקט";
      policyRulesHe = [
        `🧠 **עקרון 'חשיבה אנושית תחילה':** לפני כל פנייה לכלי בינה מלאכותית, הסטודנט/ית נדרש/ת לגבש מתווה חשיבה עצמאי או טיוטה ראשונית.`,
        `🔍 **אימות מקורות וביקורתיות:** האחריות האקדמית והמקצועית על דיוק העובדות, המקורות והציטוטים מוטלת במלואה על המגיש/ה. יש לאמת כל מקור במאגרים אקדמיים.`,
        `📋 **תיעוד יומן דיאלוג:** ההערכה בקורס מתייחסת לאיכות הדיאלוג עם הבינה המלאכותית ולאופן שבו הסטודנט/ית שיפר/ה וביקר/ה את תוצרי המכונה.`
      ];
    } else {
      policyCardTitle = "כרטיס מדיניות שימוש בבינה מלאכותית בקורס (ליבה מוגנת + פיגומי למידה)";
      policyBadge = "🛡️ ליבת הערכה מוגנת + שימוש בבינה מלאכותית כחונך למידה אישי בלבד";
      policyRulesHe = [
        `✍️ **מטלות ההערכה המסכמות בקורס מוגנות:** כתיבת העבודות והמבחנים מתבצעת באופן עצמאי ללא ניסוח או כתיבה על ידי כלי בינה מלאכותית.`,
        `💡 **שימוש מותר ללמידה עצמית:** ניתן להיעזר בכלי בינה מלאכותית על חומרי הקורס לצורך הבהרת מושגים, תרגול שאלות חזרה וסיעור מוחות ראשוני בלבד.`
      ];
    }

    // 2. Three-Tier Action Plan ("ללמוד, ללמד, לשכתב")
    const threeTierPlan = [
      {
        stage: "שלב 1: ללמוד (המרצה כלומד מתפתח)",
        focusDomain: weakestDomain.titleHe,
        currentLevel: weakestDomain.level.titleHe,
        actionHe:
          weakestDomain.score < 45
            ? `חיזוק ממוקד בציר **${weakestDomain.shortHe}** (כעת ברמת ${weakestDomain.level.titleHe}): התנסות מודרכת בתבנית עבודה אחת מוכנה בקורס "${courseName}" בליווי מרכז החדשנות.`
            : `שכלול מיומנות מתקדמת בציר **${weakestDomain.shortHe}** (כעת ברמת ${weakestDomain.level.titleHe}): מעבר משימוש שוטף לניתוח ראיות וכיול מדויק של הכלים בקורס "${courseName}".`
      },
      {
        stage: "שלב 2: ללמד (הוראת הכשירות ללומדים בכיתה)",
        focusDomain: "אוריינות בינה מלאכותית ביקורתית וסוכנות אנושית",
        currentLevel: calc.pedagogicalLevel.titleHe,
        actionHe: `הקדשת 20 דקות בשיעור להדגמה חיה בקורס "${courseName}" (${deptObj.nameHe}): הצגת תוצר בתחום הדעת, איתור שגיאות והטיות משותף עם הלומדים (${learnerType}), והדגמת עקרון 'חשיבה אנושית תחילה'.`
      },
      {
        stage: "שלב 3: לשכתב (עיצוב מחדש של מטלה והערכה בסילבוס)",
        focusDomain: strongestDomain.titleHe,
        currentLevel: strongestDomain.level.titleHe,
        actionHe: `מינוף נקודת החוזק שלך בציר **${strongestDomain.shortHe}** (רמת ${strongestDomain.level.titleHe}) לשכתוב מטלת האמצע/הסיום בקורס "${courseName}" למטלה דו-נתיבית הכוללת הערכת תהליך והגנה אישית.`
      }
    ];

    // 3. Redesigned Assignment & Rubric Blueprint
    const assignmentBlueprint = {
      titleHe: `מתווה מטלה משודרגת לקורס: "${courseName}"`,
      stepsHe: [
        {
          stepNum: 1,
          trackType: "🔒 נתיב מוגן – 30% מהציון",
          title: "טיוטת האפס ומיפוי מושגי עצמאי",
          desc: "הלומדים מנסחים בכיתה (או בדף עבודה מוגן) את שאלת החקר/הניתוח הראשוני ומקשרים אותה ל-2 מקורות ליבה מהסילבוס ללא שימוש בבינה מלאכותית."
        },
        {
          stepNum: 2,
          trackType: "🤖 נתיב משלב בינה מלאכותית מבוקר – 40% מהציון",
          title: "דיאלוג ביקורתי, אתגור ויצירת תוצר",
          desc: "הלומדים מנהלים דיאלוג מובנה לאתגור הטיעון שלהם, בודקים ומאמתים כל מראה מקום, ומתעדים ביומן קצר 3 תיקונים שביצעו מתוך שיקול דעת מקצועי."
        },
        {
          stepNum: 3,
          trackType: "🎤 הערכת תהליך ורפלקציה – 30% מהציון",
          title: "הצגה קצרה / הגנה בעל-פה ורפלקציה",
          desc: "הצגת התוצר בכיתה (3–5 דקות) או בווידאו קצר + מענה על שאלת הבנה בעל-פה ורפלקציה: היכן בא לידי ביטוי הקול האישי שלי מול המכונה?"
        }
      ],
      rubricCriteria: [
        { criterion: "עומק דיסציפלינרי ושליטה במושגי היסוד (נתיב מוגן)", weight: "30%", desc: "דיוק תיאורטי, הבנה עצמאית וחיבור לספרות הקורס" },
        { criterion: "איכות הדיאלוג והביקורתיות (סוכנות אנושית)", weight: "25%", desc: "פרומפטים מושכלים, זיהוי שגיאות והטיות ועריכה אנושית מהותית" },
        { criterion: "התאמה פדגוגית / דיפרנציאלית ויצירתיות התוצר", weight: "25%", desc: "רלוונטיות לשדה החינוכי, נגישות ומקוריות הפתרון" },
        { criterion: "שקיפות אתית, אימות מקורות ורפלקציה", weight: "20%", desc: "הצהרת שימוש מלאה, ציטוטים מאומתים ורפלקציה כנה על התהליך" }
      ]
    };

    // 4. Copyable Mega-Prompt for external AI assistant
    const copyablePrompt = `אני ${window.SELFIE_CONFIG.profiles[submission.role]?.labelHe || "מרצה במכללה"} ב${deptObj.nameHe}, ומלמד/ת את הקורס "${courseName}" עבור ${learnerType}.
השלמתי כעת מיפוי כשירות טכנו-פדגוגית ובינה מלאכותית:
- רמת הכשירות הכוללת שלי: ${levelTitle} (${calc.overallScore}%)
- נקודת החוזק המרכזית שלי: ${strongestDomain.titleHe} (${strongestDomain.score}%)
- ציר המיקוד שלי לצמיחה: ${weakestDomain.titleHe} (${weakestDomain.score}%)

אנא פעל כיועץ טכנו-פדגוגי אקדמי בכיר ובנה עבורי:
1. הצעה מפורטת לשדרוג יחידת הוראה אחת בסילבוס של הקורס "${courseName}" שמשלבת 'נתיב מוגן' ו'נתיב משלב בינה מלאכותית'.
2. משימת כיתה קצרה (15 דקות) שמפתחת אצל הסטודנטים סוכנות אנושית וחשיבה ביקורתית כלפי תוצרי בינה מלאכותית בתחום הדעת של הקורס.
3. מדרג פיגומים שמותאם לרמת הכשירות הנוכחית שלי (${levelTitle}) כדי שאוכל ליישם זאת בביטחון כבר בשבוע הבא.`;

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
