import { MaximTarget } from "./types";

export type PriorityBucketId =
  | "priority_1_crit_urgent_no_reg"
  | "priority_2_crit_urgent_with_reg"
  | "priority_3_unrated_otc_gte_001"
  | "other_domestic"
  | "foreign_sedar";

/**
 * Identifies Foreign / SEDAR / Cross-Border issuers (TSX, TSXV, CSE, CNSX, ASX, FSE, TASE, SEDAR+)
 * so they are excluded by default ("Forget Foreign issuers (Sedar) for the moment").
 */
export function isForeignSedarIssuer(t: MaximTarget): boolean {
  const ex = (t.exchange || "").toUpperCase();
  const tk = (t.ticker || "").toUpperCase();
  const rp = (t.regulatoryPortal || "").toUpperCase();
  const secUrl = (t.secEdgarUrl || "").toUpperCase();

  return (
    t.secStatus === "non_sec_foreign_or_private" ||
    rp.includes("SEDAR") ||
    secUrl.includes("SEDAR") ||
    tk.startsWith("TSX:") ||
    tk.startsWith("TSXV:") ||
    tk.startsWith("CSE:") ||
    tk.startsWith("CNSX:") ||
    tk.startsWith("LSE:") ||
    tk.startsWith("ASX:") ||
    tk.endsWith(".V") ||
    tk.endsWith(".TO") ||
    tk.endsWith(".CN") ||
    ex.includes("TSX") ||
    ex.includes("SEDAR") ||
    ex.includes("CSE") ||
    ex.includes("CNSX") ||
    ex.includes("ASX") ||
    ex.includes("FSE") ||
    ex.includes("TASE")
  );
}

/**
 * Classifies each issuer into the user's 3 Priority Columns:
 * - Priority 1: Both critical and urgent flagged issuers (without reg statements)
 * - Priority 2: Both critical and urgent issuers (with reg statements)
 * - Priority 3: Unrated issuers (OTC and/or non-reporting filers) with stock price at $0.001 or greater
 */
export function getPriorityBucket(t: MaximTarget): PriorityBucketId {
  if (isForeignSedarIssuer(t)) {
    return "foreign_sedar";
  }

  const urgency = t.financialMetrics?.capitalNeedUrgency;
  const isCritOrUrgent = urgency === "critical" || urgency === "urgent";

  if (isCritOrUrgent && t.noActiveRegStatements24M) {
    return "priority_1_crit_urgent_no_reg";
  }

  if (isCritOrUrgent && !t.noActiveRegStatements24M) {
    return "priority_2_crit_urgent_with_reg";
  }

  if (urgency === "unrated" && (t.marketData?.price ?? 0) >= 0.001) {
    return "priority_3_unrated_otc_gte_001";
  }

  return "other_domestic";
}

export function getPriorityOrderWeight(t: MaximTarget): number {
  const bucket = getPriorityBucket(t);
  switch (bucket) {
    case "priority_1_crit_urgent_no_reg":
      return t.financialMetrics?.capitalNeedUrgency === "critical" ? 10 : 15;
    case "priority_2_crit_urgent_with_reg":
      return t.financialMetrics?.capitalNeedUrgency === "critical" ? 20 : 25;
    case "priority_3_unrated_otc_gte_001":
      return 30;
    case "other_domestic":
      return 40;
    case "foreign_sedar":
      return 99;
  }
}

export function getPriorityBadgeMeta(t: MaximTarget): {
  shortLabel: string;
  fullLabel: string;
  className: string;
} {
  const bucket = getPriorityBucket(t);
  switch (bucket) {
    case "priority_1_crit_urgent_no_reg":
      return {
        shortLabel: "P1 • CRIT/URG (NO REG)",
        fullLabel: "Priority 1: Critical & Urgent (Without Reg Statements)",
        className: "bg-rose-950/80 text-rose-300 border-rose-500/50"
      };
    case "priority_2_crit_urgent_with_reg":
      return {
        shortLabel: "P2 • CRIT/URG (WITH REG)",
        fullLabel: "Priority 2: Critical & Urgent (With Reg Statements)",
        className: "bg-amber-950/80 text-amber-300 border-amber-500/50"
      };
    case "priority_3_unrated_otc_gte_001":
      return {
        shortLabel: "P3 • UNRATED OTC (≥$0.001)",
        fullLabel: "Priority 3: Unrated (OTC / Non-Reporting ≥ $0.001)",
        className: "bg-cyan-950/80 text-cyan-300 border-cyan-500/50"
      };
    case "other_domestic":
      return {
        shortLabel: "SECONDARY (MOD/STABLE/<$0.001)",
        fullLabel: "Secondary Domestic Tier",
        className: "bg-zinc-900 text-zinc-400 border-zinc-700"
      };
    case "foreign_sedar":
      return {
        shortLabel: "FOREIGN / SEDAR (EXCLUDED)",
        fullLabel: "Foreign / SEDAR Issuer",
        className: "bg-zinc-950 text-zinc-500 border-zinc-800"
      };
  }
}
