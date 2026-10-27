/**
 * SELFIE 2.0 – מאגר נתוני הדגמה מחקרי (אורנים – תוכנית פריזמה)
 * כולל מדגם מזווג (Paired Pre-Post), משיבי פתיחה בלבד (Attrition / טרם השלימו סיום) ומשיבי סיום בלבד (Late Joiners),
 * כדי להמחיש בזמן אמת את ההבדל בין חישוב מזווג תקף לבין החישוב החתכי השגוי של ה-SELFIE הישן.
 */

window.SELFIE_DEMO_COHORT = (function () {
  function makeResponses(baseCode, overrides = {}) {
    const itemIds = [
      "1.1", "1.2", "1.3",
      "2.1", "2.2", "2.3",
      "3.1", "3.2", "3.3",
      "4.1", "4.2", "4.3",
      "5.1", "5.2", "5.3",
      "6.1", "6.2", "6.3"
    ];
    const res = {};
    itemIds.forEach((id) => {
      res[id] = overrides[id] || baseCode;
    });
    return res;
  }

  return [
    // =========================================================================
    // 1. PAIRED PARTICIPANTS (Answered BOTH Pre & Post - Same ParticipantHash!)
    // =========================================================================

    // החוג ללשון עברית (חוג עוגן)
    {
      id: "sub_heb_1_pre",
      participantHash: "PID-HEB001",
      name: "ד״ר אושרי זיגלבוים",
      email: "oshri.z@oranim.ac.il",
      role: "lecturer",
      department: "hebrew",
      courseName: "מי אני ומה שמי? – חקר שמות פרטיים",
      pulse: "pre_2026",
      timestamp: "2026-10-18T10:15:00Z",
      prePerception: "B2",
      postPerception: "B2",
      personalGoal: "שילוב שולחנות בריחה דיגיטליים ומחקר גישוש על לשון ומגדר ב-AI",
      responses: makeResponses("B2", { "1.3": "C1", "3.1": "B1", "5.1": "B2", "6.3": "C1" })
    },
    {
      id: "sub_heb_1_post",
      participantHash: "PID-HEB001",
      name: "ד״ר אושרי זיגלבוים",
      email: "oshri.z@oranim.ac.il",
      role: "lecturer",
      department: "hebrew",
      courseName: "מי אני ומה שמי? – חקר שמות פרטיים",
      pulse: "post_2027",
      timestamp: "2027-06-12T11:20:00Z",
      prePerception: "C1",
      postPerception: "C2",
      personalGoal: "הובלת ערב לשון ומגדר על הבר ומנטורינג חוצה-חוגים",
      responses: makeResponses("C1", { "1.3": "C2", "3.1": "C1", "5.1": "C2", "5.2": "C1", "6.3": "C2" })
    },

    {
      id: "sub_heb_2_pre",
      participantHash: "PID-HEB002",
      name: "ד״ר רונית כץ (לשון)",
      email: "ronit.k@oranim.ac.il",
      role: "lecturer",
      department: "hebrew",
      courseName: "דידקטיקה של הלשון לעל-יסודי",
      pulse: "pre_2026",
      timestamp: "2026-10-20T09:30:00Z",
      prePerception: "B1",
      postPerception: "A2",
      personalGoal: "בניית מטלת הערכה המשלבת נתיב מוגן ונתיב משלב AI",
      responses: makeResponses("A2", { "1.1": "B1", "2.1": "B1", "6.1": "B2", "3.1": "A2", "5.2": "A2" })
    },
    {
      id: "sub_heb_2_post",
      participantHash: "PID-HEB002",
      name: "ד״ר רונית כץ (לשון)",
      email: "ronit.k@oranim.ac.il",
      role: "lecturer",
      department: "hebrew",
      courseName: "דידקטיקה של הלשון לעל-יסודי",
      pulse: "post_2027",
      timestamp: "2027-06-14T14:00:00Z",
      prePerception: "B1",
      postPerception: "B2",
      personalGoal: "הטמעת מחוון הערכת תהליך ודיאלוג מול AI",
      responses: makeResponses("B2", { "1.1": "B2", "2.1": "B2", "3.1": "B2", "5.2": "B1", "6.3": "B1" })
    },

    // החוג לחינוך מיוחד
    {
      id: "sub_spec_1_pre",
      participantHash: "PID-SPEC001",
      name: "ד״ר דנה ברק הראל",
      email: "dana.bh@oranim.ac.il",
      role: "lecturer",
      department: "spec_ed",
      courseName: "הוראה מותאמת ואסטרטגיות התערבות בחנ״מ",
      pulse: "pre_2026",
      timestamp: "2026-10-22T12:10:00Z",
      prePerception: "B1",
      postPerception: "B1",
      personalGoal: "פיתוח פיילוט בוט תל״א (תוכנית לימודים אישית) עם שמירה על פרטיות",
      responses: makeResponses("B1", { "4.1": "B2", "4.2": "B2", "5.3": "B2", "3.1": "B1", "6.3": "B2" })
    },
    {
      id: "sub_spec_1_post",
      participantHash: "PID-SPEC001",
      name: "ד״ר דנה ברק הראל",
      email: "dana.bh@oranim.ac.il",
      role: "lecturer",
      department: "spec_ed",
      courseName: "הוראה מותאמת ואסטרטגיות התערבות בחנ״מ",
      pulse: "post_2027",
      timestamp: "2027-06-15T10:00:00Z",
      prePerception: "B2",
      postPerception: "C1",
      personalGoal: "הרחבת בוט התל״א לכלל קורסי ההתנסות בחוג",
      responses: makeResponses("C1", { "4.1": "C2", "4.2": "C2", "5.3": "C1", "3.1": "B2", "6.3": "C1" })
    },

    {
      id: "sub_spec_2_pre",
      participantHash: "PID-SPEC002",
      name: "לילך לייזר יבין",
      email: "lilach.y@oranim.ac.il",
      role: "lecturer",
      department: "spec_ed",
      courseName: "כתיבה אקדמית ואתיקה בבינה מלאכותית (שנה א׳)",
      pulse: "pre_2026",
      timestamp: "2026-10-22T12:25:00Z",
      prePerception: "B2",
      postPerception: "B1",
      personalGoal: "פיתוח אוריינות ביקורתית ואימות מקורות אצל סטודנטים שנה א׳",
      responses: makeResponses("B1", { "2.1": "B2", "2.3": "B2", "4.1": "B2", "5.2": "B1", "6.1": "B2" })
    },
    {
      id: "sub_spec_2_post",
      participantHash: "PID-SPEC002",
      name: "לילך לייזר יבין",
      email: "lilach.y@oranim.ac.il",
      role: "lecturer",
      department: "spec_ed",
      courseName: "כתיבה אקדמית ואתיקה בבינה מלאכותית (שנה א׳)",
      pulse: "post_2027",
      timestamp: "2027-06-16T09:15:00Z",
      prePerception: "B2",
      postPerception: "C1",
      personalGoal: "הטמעת מחוון הערכת תהליך ושקיפות פרומפטים בכל קורסי שנה א׳",
      responses: makeResponses("B2", { "2.1": "C1", "2.3": "C1", "3.1": "C1", "4.1": "C1", "5.2": "C1" })
    },

    {
      id: "sub_spec_3_pre",
      participantHash: "PID-SPEC003",
      name: "ד״ר הילה שכטר סולומון",
      email: "hila.s@oranim.ac.il",
      role: "lecturer",
      department: "spec_ed",
      courseName: "למידה מבוססת מקום (PBL) ו-AI בחינוך המיוחד",
      pulse: "pre_2026",
      timestamp: "2026-10-24T08:40:00Z",
      prePerception: "B1",
      postPerception: "B1",
      personalGoal: "חיבור מרחבי למידה חוץ-כיתתיים לכלי AI מותאמים לתלמידי חנ״מ",
      responses: makeResponses("B1", { "1.3": "B2", "4.1": "B2", "3.2": "A2", "5.1": "A2" })
    },
    {
      id: "sub_spec_3_post",
      participantHash: "PID-SPEC003",
      name: "ד״ר הילה שכטר סולומון",
      email: "hila.s@oranim.ac.il",
      role: "lecturer",
      department: "spec_ed",
      courseName: "למידה מבוססת מקום (PBL) ו-AI בחינוך המיוחד",
      pulse: "post_2027",
      timestamp: "2027-06-18T11:30:00Z",
      prePerception: "B2",
      postPerception: "B2",
      personalGoal: "תיעוד 3 התערבויות בשדה ההתנסות",
      responses: makeResponses("B2", { "1.3": "C1", "4.1": "C1", "4.3": "C1", "3.2": "B1", "5.1": "B2" })
    },

    // החוג לספרות, דרמה ומבע יצירתי
    {
      id: "sub_lit_1_pre",
      participantHash: "PID-LIT001",
      name: "ד״ר אריאל פרידן",
      email: "ariel.f@oranim.ac.il",
      role: "lecturer",
      department: "lit_drama",
      courseName: "פרשנות טקסט, יצירה ובינה מלאכותית",
      pulse: "pre_2026",
      timestamp: "2026-10-25T10:00:00Z",
      prePerception: "B1",
      postPerception: "B1",
      personalGoal: "השוואת קריאה קרובה ללא AI מול דיאלוג פרשני עם AI",
      responses: makeResponses("B1", { "1.1": "B2", "3.1": "B1", "5.1": "B2", "5.2": "B2", "6.3": "B2" })
    },
    {
      id: "sub_lit_1_post",
      participantHash: "PID-LIT001",
      name: "ד״ר אריאל פרידן",
      email: "ariel.f@oranim.ac.il",
      role: "lecturer",
      department: "lit_drama",
      courseName: "פרשנות טקסט, יצירה ובינה מלאכותית",
      pulse: "post_2027",
      timestamp: "2027-06-19T13:45:00Z",
      prePerception: "B2",
      postPerception: "C1",
      personalGoal: "הובלת מודל הנתיב הכפול (מוגן + משלב AI) ב-6 קורסי עומק",
      responses: makeResponses("C1", { "3.1": "C2", "5.1": "C1", "5.2": "C2", "6.3": "C1" })
    },

    // החוג לתקשורת ולקולנוע חברתי
    {
      id: "sub_med_1_pre",
      participantHash: "PID-MED001",
      name: "ד״ר אוהד אופז",
      email: "ohad.o@oranim.ac.il",
      role: "lecturer",
      department: "media",
      courseName: "עדות והקשבה – ארכיון 710 וקולנוע דוקומנטרי",
      pulse: "pre_2026",
      timestamp: "2026-10-25T15:10:00Z",
      prePerception: "B2",
      postPerception: "B2",
      personalGoal: "שילוב אתי של כלי דימויים, תמלול ויומני AI בהפקות תיעודיות",
      responses: makeResponses("B2", { "2.2": "C1", "2.3": "B2", "5.3": "C1", "3.1": "B1", "3.2": "B1" })
    },
    {
      id: "sub_med_1_post",
      participantHash: "PID-MED001",
      name: "ד״ר אוהד אופז",
      email: "ohad.o@oranim.ac.il",
      role: "lecturer",
      department: "media",
      courseName: "עדות והקשבה – ארכיון 710 וקולנוע דוקומנטרי",
      pulse: "post_2027",
      timestamp: "2027-06-20T16:00:00Z",
      prePerception: "C1",
      postPerception: "C1",
      personalGoal: "הטמעת יומן בינה מלאכותית ותיקוף אתי בכל הפקות הגמר",
      responses: makeResponses("C1", { "2.2": "C2", "2.3": "C2", "5.3": "C2", "3.1": "C1", "6.3": "C1" })
    },

    // החוג להוראת אנגלית (באנגלית!)
    {
      id: "sub_eng_1_pre",
      participantHash: "PID-ENG001",
      name: "Dr. Sarah Levine (EFL)",
      email: "sarah.l@oranim.ac.il",
      role: "lecturer",
      department: "english",
      courseName: "EFL Methodology & AI Language Tutors",
      pulse: "pre_2026",
      timestamp: "2026-10-26T11:00:00Z",
      prePerception: "B1",
      postPerception: "A2",
      personalGoal: "Integrating speaking simulation bots for EFL student-teachers",
      responses: makeResponses("A2", { "1.1": "B1", "2.2": "B1", "4.2": "B1", "6.1": "B2" })
    },
    {
      id: "sub_eng_1_post",
      participantHash: "PID-ENG001",
      name: "Dr. Sarah Levine (EFL)",
      email: "sarah.l@oranim.ac.il",
      role: "lecturer",
      department: "english",
      courseName: "EFL Methodology & AI Language Tutors",
      pulse: "post_2027",
      timestamp: "2027-06-21T10:30:00Z",
      prePerception: "B2",
      postPerception: "B2",
      personalGoal: "Custom rubric-aligned EFL writing and speaking bots",
      responses: makeResponses("B2", { "1.3": "C1", "2.2": "B2", "3.3": "C1", "4.2": "C1" })
    },

    // =========================================================================
    // 2. ATTRITION COHORT (Answered Pulse 1 ONLY - Did NOT answer Pulse 2 yet!)
    // Notice these respondents had lower initial scores (A1/A2).
    // In the old unmatched SELFIE tool, their absence in Pulse 2 artificially
    // inflated the Post group average! Our Paired Engine isolates them cleanly.
    // =========================================================================
    {
      id: "sub_attr_1_pre",
      participantHash: "PID-SPEC009",
      name: "ד״ר יעל מזרחי (חנ״מ)",
      email: "yael.m@oranim.ac.il",
      role: "lecturer",
      department: "spec_ed",
      courseName: "מבוא להתפתחות הילד",
      pulse: "pre_2026",
      timestamp: "2026-10-28T09:00:00Z",
      prePerception: "A2",
      postPerception: "A1",
      personalGoal: "להכיר כלי בסיסי אחד להנגשת מאמרים לסטודנטים",
      responses: makeResponses("A1", { "1.1": "A2", "4.1": "A2", "6.1": "B1" })
    },
    {
      id: "sub_attr_2_pre",
      participantHash: "PID-SPEC010",
      name: "ד״ר אמיר גולן (חנ״מ)",
      email: "amir.g@oranim.ac.il",
      role: "lecturer",
      department: "spec_ed",
      courseName: "סוגיות בשילוב והכלה",
      pulse: "pre_2026",
      timestamp: "2026-10-29T10:15:00Z",
      prePerception: "B1",
      postPerception: "A2",
      personalGoal: "עדכון סעיף ה-AI בסילבוס הקורס",
      responses: makeResponses("A2", { "1.2": "A1", "3.1": "A1", "5.2": "A1", "6.1": "B1" })
    },
    {
      id: "sub_attr_3_pre",
      participantHash: "PID-SOC004",
      name: "ד״ר תמר אלון (חח״ק)",
      email: "tamar.a@oranim.ac.il",
      role: "lecturer",
      department: "soc_comm",
      courseName: "חינוך בלתי פורמלי וקהילה",
      pulse: "pre_2026",
      timestamp: "2026-10-30T14:20:00Z",
      prePerception: "A2",
      postPerception: "A1",
      personalGoal: "בחינת שימוש בלוח שיתופי בשיעור",
      responses: makeResponses("A1", { "1.2": "A2", "6.1": "A2", "6.3": "A2" })
    },
    {
      id: "sub_attr_4_pre",
      participantHash: "PID-LIT005",
      name: "ד״ר גיל שפירא (ספרות)",
      email: "gil.s@oranim.ac.il",
      role: "lecturer",
      department: "lit_drama",
      courseName: "תולדות הדרמה הקלאסית",
      pulse: "pre_2026",
      timestamp: "2026-11-01T11:00:00Z",
      prePerception: "A1",
      postPerception: "A1",
      personalGoal: "שמירה על נתיב מוגן של קריאה וכתיבה בכיתה",
      responses: makeResponses("A1", { "3.1": "A2", "6.1": "B1" })
    },

    // =========================================================================
    // 3. LATE JOINERS (Answered Pulse 2 ONLY - Did NOT answer Pulse 1!)
    // Notice these respondents are tech-enthusiasts who answered at the end of the year.
    // In the old SELFIE tool, they contaminated the Post group average!
    // =========================================================================
    {
      id: "sub_late_1_post",
      participantHash: "PID-MEDIA008",
      name: "ד״ר מיה מזור (תקשורת)",
      email: "maya.m@oranim.ac.il",
      role: "lecturer",
      department: "media",
      courseName: "חדשנות דיגיטלית, וודקאסט ובינה מלאכותית",
      pulse: "post_2027",
      timestamp: "2027-06-22T09:45:00Z",
      prePerception: "C1",
      postPerception: "C2",
      personalGoal: "הובלת סדנאות וודקאסט ויצירת מדיה מבוססת AI לסגל",
      responses: makeResponses("C2", { "3.2": "C1", "4.1": "C1" })
    },
    {
      id: "sub_late_2_post",
      participantHash: "PID-FIELD012",
      name: "עינת ברקוביץ׳ (מד״פית ומורה מאמנת)",
      email: "einat.b@oranim.ac.il",
      role: "teacher",
      department: "field",
      courseName: "הנחיית התנסות מעשית בשדה",
      pulse: "post_2027",
      timestamp: "2027-06-22T15:30:00Z",
      prePerception: "B2",
      postPerception: "C1",
      personalGoal: "שימוש במחוון צפייה דיגיטלי משולב AI בהדרכת סטודנטים בשדה",
      responses: makeResponses("C1", { "1.1": "C1", "3.3": "C2", "4.2": "C1", "6.3": "C1" })
    }
  ];
})();
