/**
 * SELFIE 2.0 Psychometric & Longitudinal Paired Scoring Engine
 * Fixes the 6 mathematical & methodological flaws of the original EU SELFIEforTEACHERS tool:
 * 1. True Paired Within-Subjects Pre-Post matching (ParticipantHash longitudinal pairing) vs. Unmatched Cross-Sectional averages.
 * 2. Balanced Domain Weighting (each of the 6 domains = 16.67%) vs. Unweighted item sums (where Area 1 had 9 items and Area 4 had 3).
 * 3. True 0–100% Normalized Scale with symmetric 16.67% level bands vs. 16.67% floor and asymmetric 20/35/50/70/85% cutoffs.
 * 4. Separation of Pedagogical & AI Classroom Mastery from Organizational Peer Leadership.
 * 5. Non-compensatory domain minimum alerts + N/A ("Not Applicable to my course/role") denominator exclusion.
 * 6. Metacognitive calibration gap (Pre-perception vs. Actual vs. Post-perception).
 */

window.SelfieScoringEngine = (function () {
  const LEVEL_MAP = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
    NA: null
  };

  // Deterministic privacy-preserving hash for pairing participants across pulses
  function hashParticipantId(rawIdentifier) {
    const clean = String(rawIdentifier || "").trim().toLowerCase();
    if (!clean) return "anon_" + Math.random().toString(36).slice(2, 10);
    let h1 = 0xdeadbeef ^ clean.length;
    let h2 = 0x41c6ce57 ^ clean.length;
    for (let i = 0, ch; i < clean.length; i++) {
      ch = clean.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const hex = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(12, "0");
    return "PID-" + hex.toUpperCase();
  }

  // Convert normalized 0-100 score to symmetric DigCompEdu / SELFIE 2.0 level
  function getSymmetricLevel(score0to100) {
    const levels = window.SELFIE_CONFIG.levels;
    const s = Math.max(0, Math.min(100, Number(score0to100) || 0));
    if (s < 16.67) return levels[0]; // A1 (0 - 16.66%)
    if (s < 33.34) return levels[1]; // A2 (16.67 - 33.33%)
    if (s <= 50.0) return levels[2]; // B1 (33.34 - 50.00%)
    if (s < 66.67) return levels[3]; // B2 (50.01 - 66.66%)
    if (s < 83.34) return levels[4]; // C1 (66.67 - 83.33%)
    return levels[5];                // C2 (83.34 - 100%)
  }

  // Original flawed EU SELFIEforTEACHERS gauge cutoffs (Figure 29, page 31 of PDF)
  function getOldEuLevel(rawPct0to100) {
    const levels = window.SELFIE_CONFIG.levels;
    const s = Math.max(0, Math.min(100, Number(rawPct0to100) || 0));
    if (s <= 20) return levels[0]; // A1: 0-20%
    if (s <= 35) return levels[1]; // A2: 20-35%
    if (s <= 50) return levels[2]; // B1: 35-50%
    if (s <= 70) return levels[3]; // B2: 50-70%
    if (s <= 85) return levels[4]; // C1: 70-85%
    return levels[5];              // C2: 85-100%
  }

  /**
   * Computes full psychometric profile for a single questionnaire submission
   * @param {Object} submission - { responses: { "1.1": "B2", ... }, prePerception: "B1", postPerception: "B2", role: "lecturer", ... }
   */
  function calculateSubmissionScores(submission) {
    const config = window.SELFIE_CONFIG;
    const responses = (submission && submission.responses) || {};

    const domainResults = [];
    let validDomainsSum = 0;
    let validDomainsCount = 0;

    let pedItemsSum = 0;
    let pedItemsCount = 0;
    let leadItemsSum = 0;
    let leadItemsCount = 0;

    // For Old EU Flawed simulation:
    // In the original EU tool, Area 1 (Professional Engagement) had 9 items, Area 4 (Assessment) had 3 items, etc.
    // And each item was scored 1..6 divided by 6 (so A1 = 16.67% minimum floor).
    const oldEuWeightsByDomain = {
      dom1_pedagogy: 5,    // Area 3 in EU had 5 items
      dom2_resources: 5,   // Area 2 in EU had 5 items
      dom3_assessment: 3,  // Area 4 in EU had only 3 items!
      dom4_empowering: 4,  // Area 5 in EU had 4 items
      dom5_ai_agency: 6,   // Area 6 in EU had 6 items
      dom6_engagement: 9   // Area 1 in EU had 9 items!
    };
    let oldEuWeightedRawSum = 0;
    let oldEuTotalSimulatedItems = 0;

    const allItemDetails = [];

    config.domains.forEach((dom) => {
      let domNormSum = 0;
      let domRaw1to6Sum = 0;
      let domValidCount = 0;
      let domNaCount = 0;

      dom.items.forEach((item) => {
        const ansCode = responses[item.id] || "A1";
        if (ansCode === "NA") {
          domNaCount++;
          allItemDetails.push({
            itemId: item.id,
            domainId: dom.id,
            domainTitleHe: dom.titleHe,
            itemTitleHe: item.titleHe,
            code: "NA",
            numeric: null,
            normalized: null,
            oldEuPct: 0,
            levelObj: null,
            nextLevelCode: "A1",
            levelUpTipHe: item.levelUpHe.A1
          });
          return;
        }

        const num = LEVEL_MAP[ansCode] || 1;
        // True 0-100 normalization: A1(1)->0%, A2(2)->20%, B1(3)->40%, B2(4)->60%, C1(5)->80%, C2(6)->100%
        const norm = ((num - 1) / 5) * 100;
        // Old EU raw percentage: A1(1)->16.67%, A2(2)->33.33%, B1(3)->50%, B2(4)->66.67%, C1(5)->83.33%, C2(6)->100%
        const oldPct = (num / 6) * 100;

        domNormSum += norm;
        domRaw1to6Sum += num;
        domValidCount++;

        if (item.axis === "leadership" || dom.id === "dom6_engagement" && item.id === "6.3") {
          leadItemsSum += norm;
          leadItemsCount++;
        } else {
          pedItemsSum += norm;
          pedItemsCount++;
        }

        const levelObj = config.levels.find((l) => l.code === ansCode) || config.levels[0];
        const nextLevelIdx = Math.min(config.levels.length - 1, num); // 1->index 1 (A2), 6->index 5 (C2)
        const nextLevelCode = config.levels[nextLevelIdx].code;

        allItemDetails.push({
          itemId: item.id,
          domainId: dom.id,
          domainTitleHe: dom.titleHe,
          domainShortHe: dom.shortHe,
          domainColor: dom.color,
          itemTitleHe: item.titleHe,
          itemTitleEn: item.titleEn,
          code: ansCode,
          numeric: num,
          normalized: Math.round(norm * 10) / 10,
          oldEuPct: Math.round(oldPct * 10) / 10,
          levelObj,
          nextLevelCode,
          levelUpTipHe: item.levelUpHe[ansCode] || ""
        });
      });

      const domScore = domValidCount > 0 ? domNormSum / domValidCount : 0;
      const domOldEuPct = domValidCount > 0 ? ((domRaw1to6Sum / domValidCount) / 6) * 100 : 16.67;
      const domMeanNumeric = domValidCount > 0 ? domRaw1to6Sum / domValidCount : 1;

      if (domValidCount > 0) {
        validDomainsSum += domScore;
        validDomainsCount++;
      }

      const simWeight = oldEuWeightsByDomain[dom.id] || 5;
      oldEuWeightedRawSum += domOldEuPct * simWeight;
      oldEuTotalSimulatedItems += simWeight;

      const domLevel = getSymmetricLevel(domScore);
      const domOldEuLevel = getOldEuLevel(domOldEuPct);

      domainResults.push({
        id: dom.id,
        num: dom.num,
        titleHe: dom.titleHe,
        titleEn: dom.titleEn,
        shortHe: dom.shortHe,
        shortEn: dom.shortEn,
        color: dom.color,
        icon: dom.icon,
        weightPct: 16.67,
        validItems: domValidCount,
        naItems: domNaCount,
        score: Math.round(domScore * 10) / 10,
        meanNumeric: Math.round(domMeanNumeric * 100) / 100,
        level: domLevel,
        oldEuScore: Math.round(domOldEuPct * 10) / 10,
        oldEuLevel: domOldEuLevel
      });
    });

    // Balanced overall score across all valid domains (equal weight per domain!)
    const overallScore = validDomainsCount > 0 ? Math.round((validDomainsSum / validDomainsCount) * 10) / 10 : 0;
    const overallLevel = getSymmetricLevel(overallScore);

    // Old EU distorted score (unweighted item sum across unbalanced domains + 16.67% floor + asymmetric bands)
    const oldEuOverallScore = oldEuTotalSimulatedItems > 0
      ? Math.round((oldEuWeightedRawSum / oldEuTotalSimulatedItems) * 10) / 10
      : 16.7;
    const oldEuOverallLevel = getOldEuLevel(oldEuOverallScore);

    // Dual Axis: Pedagogical & AI Classroom Depth vs. Organizational & Peer Leadership
    const pedagogicalIndex = pedItemsCount > 0 ? Math.round((pedItemsSum / pedItemsCount) * 10) / 10 : overallScore;
    // Leadership index combines 6.3 + C1/C2 indicators across domain 6
    const dom6 = domainResults.find((d) => d.id === "dom6_engagement");
    const leadershipIndex = leadItemsCount > 0
      ? Math.round(((leadItemsSum / leadItemsCount) * 0.7 + (dom6 ? dom6.score * 0.3 : 0)) * 10) / 10
      : overallScore;

    // Non-compensatory check: detect if high organizational score masks low core AI/Assessment/Pedagogy score
    const corePedagogicalDomains = domainResults.filter((d) =>
      ["dom1_pedagogy", "dom3_assessment", "dom5_ai_agency"].includes(d.id)
    );
    const minCoreDomain = corePedagogicalDomains.reduce(
      (min, d) => (d.score < min.score ? d : min),
      corePedagogicalDomains[0]
    );
    const hasCompensationWarning = (dom6 && dom6.score - minCoreDomain.score >= 30);

    // Differential Training Track Assignment (uses Pedagogical & AI Core so administrative skill doesn't misassign a teacher!)
    const effectiveTrackScore = hasCompensationWarning
      ? Math.round((pedagogicalIndex * 0.75 + minCoreDomain.score * 0.25) * 10) / 10
      : overallScore;
    const effectiveTrackLevel = getSymmetricLevel(effectiveTrackScore);

    let assignedTrack = config.trainingTracks[0];
    if (["B1", "B2"].includes(effectiveTrackLevel.code)) {
      assignedTrack = config.trainingTracks[1];
    } else if (["C1", "C2"].includes(effectiveTrackLevel.code)) {
      assignedTrack = config.trainingTracks[2];
    }

    // Strengths & Priority Growth Items
    const validItems = allItemDetails.filter((it) => it.numeric !== null);
    const sortedAsc = [...validItems].sort((a, b) => a.normalized - b.normalized);
    const sortedDesc = [...validItems].sort((a, b) => b.normalized - a.normalized);

    const priorityGrowthItems = sortedAsc.slice(0, 3);
    const topStrengthItems = sortedDesc.slice(0, 3);

    // Metacognitive Calibration (Pre-perception vs Actual vs Post-perception)
    const preCode = submission.prePerception || overallLevel.code;
    const postCode = submission.postPerception || overallLevel.code;
    const preLevelObj = config.levels.find((l) => l.code === preCode) || overallLevel;
    const postLevelObj = config.levels.find((l) => l.code === postCode) || overallLevel;
    const calibrationGapSteps = overallLevel.numeric - preLevelObj.numeric; // positive = underestimated self, negative = overestimated self (Dunning-Kruger)

    return {
      overallScore,
      overallLevel,
      oldEuOverallScore,
      oldEuOverallLevel,
      scoreDistortionGap: Math.round((oldEuOverallScore - overallScore) * 10) / 10,
      levelChangedBetweenModels: overallLevel.code !== oldEuOverallLevel.code,
      pedagogicalIndex,
      pedagogicalLevel: getSymmetricLevel(pedagogicalIndex),
      leadershipIndex,
      leadershipLevel: getSymmetricLevel(leadershipIndex),
      hasCompensationWarning,
      minCoreDomain,
      assignedTrack,
      domainResults,
      allItemDetails,
      priorityGrowthItems,
      topStrengthItems,
      metacognitive: {
        preCode: preLevelObj.code,
        preTitleHe: preLevelObj.titleHe,
        preNorm: preLevelObj.normalizedScore,
        actualCode: overallLevel.code,
        actualTitleHe: overallLevel.titleHe,
        actualNorm: overallScore,
        postCode: postLevelObj.code,
        postTitleHe: postLevelObj.titleHe,
        postNorm: postLevelObj.normalizedScore,
        calibrationGapSteps
      }
    };
  }

  // Approximate two-tailed p-value from Student's t-distribution
  function approximateTwoTailedPValue(tAbs, df) {
    if (!df || df < 1 || !isFinite(tAbs)) return 1.0;
    // Normal / Wallace approximation for t-distribution tail probability
    const z = Math.abs(tAbs) * Math.sqrt((df - 0.5) / df);
    const pOneTail = 0.5 * Math.erfc ? 0.5 * Math.erfc(z / Math.SQRT2) : normalCdfComplement(z);
    return Math.max(0.0001, Math.min(1.0, pOneTail * 2));
  }

  function normalCdfComplement(z) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const prob =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? prob : 1 - prob;
  }

  /**
   * Computes Institutional & Departmental Longitudinal Paired Pre-Post Analysis
   * Explicitly separates:
   * 1. Paired Cohort (Answered BOTH Pre & Post) -> True within-subject scientific delta
   * 2. Attrition Cohort (Answered Pre ONLY) -> Actionable follow-up list
   * 3. Late Joiners Cohort (Answered Post ONLY) -> Excluded from paired delta to prevent selection bias
   * Plus shows the Flawed Unmatched Cross-Sectional comparison side-by-side!
   */
  function calculateInstitutionalPairedAnalysis(allSubmissions, filterDeptId = "all", filterRole = "all") {
    const config = window.SELFIE_CONFIG;
    const filtered = (allSubmissions || []).filter((sub) => {
      if (filterDeptId !== "all" && sub.department !== filterDeptId) return false;
      if (filterRole !== "all" && sub.role !== filterRole) return false;
      return true;
    });

    // Enrich each submission with calculated scores
    const enriched = filtered.map((sub) => {
      const pid = sub.participantHash || hashParticipantId(sub.email || sub.participantId || sub.name);
      const calc = calculateSubmissionScores(sub);
      return {
        ...sub,
        participantHash: pid,
        calc
      };
    });

    // Group by participantHash
    const byParticipant = new Map();
    enriched.forEach((sub) => {
      if (!byParticipant.has(sub.participantHash)) {
        byParticipant.set(sub.participantHash, {
          participantHash: sub.participantHash,
          name: sub.name || "משיב/ה אנונימי/ת",
          email: sub.email || "",
          department: sub.department || "general",
          role: sub.role || "lecturer",
          pre: null,
          mid: null,
          post: null
        });
      }
      const entry = byParticipant.get(sub.participantHash);
      if (sub.pulse === "pre_2026") entry.pre = sub;
      else if (sub.pulse === "mid_2027") entry.mid = sub;
      else if (sub.pulse === "post_2027") entry.post = sub;
    });

    const pairedParticipants = [];
    const attritionParticipants = []; // Pre only (missing Post!)
    const lateJoinersParticipants = []; // Post only (missing Pre!)
    const allPreSubmissions = [];
    const allPostSubmissions = [];

    byParticipant.forEach((p) => {
      if (p.pre) allPreSubmissions.push(p.pre);
      if (p.post) allPostSubmissions.push(p.post);

      if (p.pre && p.post) {
        const preScore = p.pre.calc.overallScore;
        const postScore = p.post.calc.overallScore;
        const delta = Math.round((postScore - preScore) * 10) / 10;

        const domainDeltas = {};
        config.domains.forEach((dom) => {
          const dPre = p.pre.calc.domainResults.find((d) => d.id === dom.id)?.score || 0;
          const dPost = p.post.calc.domainResults.find((d) => d.id === dom.id)?.score || 0;
          domainDeltas[dom.id] = {
            pre: dPre,
            post: dPost,
            delta: Math.round((dPost - dPre) * 10) / 10
          };
        });

        pairedParticipants.push({
          ...p,
          preScore,
          postScore,
          delta,
          preLevel: p.pre.calc.overallLevel.code,
          postLevel: p.post.calc.overallLevel.code,
          domainDeltas
        });
      } else if (p.pre && !p.post) {
        attritionParticipants.push({
          ...p,
          preScore: p.pre.calc.overallScore,
          preLevel: p.pre.calc.overallLevel.code,
          assignedTrack: p.pre.calc.assignedTrack
        });
      } else if (!p.pre && p.post) {
        lateJoinersParticipants.push({
          ...p,
          postScore: p.post.calc.overallScore,
          postLevel: p.post.calc.overallLevel.code
        });
      }
    });

    // 1. TRUE PAIRED STATISTICS (Within-Subjects on N_paired)
    const nPaired = pairedParticipants.length;
    let pairedPreMean = 0;
    let pairedPostMean = 0;
    let pairedMeanDelta = 0;
    let pairedSdDelta = 0;
    let tStat = 0;
    let pValue = 1.0;
    let cohensDz = 0;

    if (nPaired > 0) {
      pairedPreMean = pairedParticipants.reduce((s, p) => s + p.preScore, 0) / nPaired;
      pairedPostMean = pairedParticipants.reduce((s, p) => s + p.postScore, 0) / nPaired;
      pairedMeanDelta = pairedParticipants.reduce((s, p) => s + p.delta, 0) / nPaired;

      if (nPaired > 1) {
        const varianceDelta =
          pairedParticipants.reduce((s, p) => s + Math.pow(p.delta - pairedMeanDelta, 2), 0) /
          (nPaired - 1);
        pairedSdDelta = Math.sqrt(varianceDelta);
        const seDelta = pairedSdDelta / Math.sqrt(nPaired);
        if (seDelta > 0) {
          tStat = pairedMeanDelta / seDelta;
          pValue = approximateTwoTailedPValue(Math.abs(tStat), nPaired - 1);
          cohensDz = pairedMeanDelta / pairedSdDelta;
        }
      }
    }

    // 2. FLAWED UNMATCHED CROSS-SECTIONAL STATISTICS (All Pre N1 vs All Post N2 - as done in old SELFIE)
    const nAllPre = allPreSubmissions.length;
    const nAllPost = allPostSubmissions.length;
    const unmatchedPreMean =
      nAllPre > 0 ? allPreSubmissions.reduce((s, x) => s + x.calc.overallScore, 0) / nAllPre : 0;
    const unmatchedPostMean =
      nAllPost > 0 ? allPostSubmissions.reduce((s, x) => s + x.calc.overallScore, 0) / nAllPost : 0;
    const unmatchedRawDiff = unmatchedPostMean - unmatchedPreMean;

    // Also compute Old EU Formula Unmatched Cross-Sectional (double distortion: wrong formula + unmatched sample)
    const oldEuUnmatchedPreMean =
      nAllPre > 0 ? allPreSubmissions.reduce((s, x) => s + x.calc.oldEuOverallScore, 0) / nAllPre : 0;
    const oldEuUnmatchedPostMean =
      nAllPost > 0 ? allPostSubmissions.reduce((s, x) => s + x.calc.oldEuOverallScore, 0) / nAllPost : 0;
    const oldEuUnmatchedDiff = oldEuUnmatchedPostMean - oldEuUnmatchedPreMean;

    // Domain-by-domain comparison (Paired vs Unmatched)
    const domainComparisons = config.domains.map((dom) => {
      const domPairedPre =
        nPaired > 0
          ? pairedParticipants.reduce((s, p) => s + p.domainDeltas[dom.id].pre, 0) / nPaired
          : 0;
      const domPairedPost =
        nPaired > 0
          ? pairedParticipants.reduce((s, p) => s + p.domainDeltas[dom.id].post, 0) / nPaired
          : 0;
      const domPairedDelta = domPairedPost - domPairedPre;

      const domUnmatchedPre =
        nAllPre > 0
          ? allPreSubmissions.reduce(
              (s, x) => s + (x.calc.domainResults.find((d) => d.id === dom.id)?.score || 0),
              0
            ) / nAllPre
          : 0;
      const domUnmatchedPost =
        nAllPost > 0
          ? allPostSubmissions.reduce(
              (s, x) => s + (x.calc.domainResults.find((d) => d.id === dom.id)?.score || 0),
              0
            ) / nAllPost
          : 0;

      return {
        id: dom.id,
        num: dom.num,
        titleHe: dom.titleHe,
        shortHe: dom.shortHe,
        color: dom.color,
        icon: dom.icon,
        pairedPre: Math.round(domPairedPre * 10) / 10,
        pairedPost: Math.round(domPairedPost * 10) / 10,
        pairedDelta: Math.round(domPairedDelta * 10) / 10,
        unmatchedPre: Math.round(domUnmatchedPre * 10) / 10,
        unmatchedPost: Math.round(domUnmatchedPost * 10) / 10,
        unmatchedDelta: Math.round((domUnmatchedPost - domUnmatchedPre) * 10) / 10
      };
    });

    // Track distribution based on latest available reflection per participant
    const trackCounts = {
      track_foundations: 0,
      track_redesign: 0,
      track_pioneers: 0
    };
    byParticipant.forEach((p) => {
      const latest = p.post || p.mid || p.pre;
      if (latest && latest.calc && latest.calc.assignedTrack) {
        trackCounts[latest.calc.assignedTrack.id] =
          (trackCounts[latest.calc.assignedTrack.id] || 0) + 1;
      }
    });

    return {
      totalUniqueParticipants: byParticipant.size,
      cohorts: {
        paired: pairedParticipants,
        attrition: attritionParticipants,
        lateJoiners: lateJoinersParticipants
      },
      pairedStats: {
        n: nPaired,
        preMean: Math.round(pairedPreMean * 10) / 10,
        postMean: Math.round(pairedPostMean * 10) / 10,
        meanDelta: Math.round(pairedMeanDelta * 10) / 10,
        sdDelta: Math.round(pairedSdDelta * 10) / 10,
        tStat: Math.round(tStat * 100) / 100,
        pValue: Math.round(pValue * 10000) / 10000,
        cohensDz: Math.round(cohensDz * 100) / 100,
        preLevel: getSymmetricLevel(pairedPreMean),
        postLevel: getSymmetricLevel(pairedPostMean)
      },
      unmatchedStats: {
        nPre: nAllPre,
        nPost: nAllPost,
        preMean: Math.round(unmatchedPreMean * 10) / 10,
        postMean: Math.round(unmatchedPostMean * 10) / 10,
        rawDiff: Math.round(unmatchedRawDiff * 10) / 10,
        oldEuPreMean: Math.round(oldEuUnmatchedPreMean * 10) / 10,
        oldEuPostMean: Math.round(oldEuUnmatchedPostMean * 10) / 10,
        oldEuDiff: Math.round(oldEuUnmatchedDiff * 10) / 10,
        biasInflationGap: Math.round((unmatchedRawDiff - pairedMeanDelta) * 10) / 10
      },
      domainComparisons,
      trackCounts
    };
  }

  return {
    hashParticipantId,
    getSymmetricLevel,
    getOldEuLevel,
    calculateSubmissionScores,
    calculateInstitutionalPairedAnalysis
  };
})();
