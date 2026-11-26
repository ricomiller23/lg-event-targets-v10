"use client";

import React from "react";
import { MaximTarget } from "@/lib/types";
import { getPriorityBucket, PriorityBucketId } from "@/lib/priority";
import { Flame, Layers, FileX, DollarSign, ChevronRight, Mail } from "lucide-react";

interface PriorityColumnsViewProps {
  targets: MaximTarget[];
  onSelect: (target: MaximTarget) => void;
  activePriorityFilter?: string;
  onSelectPriorityFilter?: (bucket: string) => void;
}

const PRIORITY_COLUMNS: {
  id: PriorityBucketId;
  priorityBadge: string;
  title: string;
  subtitle: string;
  borderClass: string;
  headerBgClass: string;
  badgeClass: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "priority_1_crit_urgent_no_reg",
    priorityBadge: "PRIORITY 1",
    title: "Critical & Urgent Flagged Issuers (Without Reg Statements)",
    subtitle: "Both Critical (<3mo) & Urgent (3-6mo) issuers with ZERO S-1/S-3/S-8/F-1/F-3 filings in past 24M (Foreign/SEDAR excluded)",
    borderClass: "border-rose-500/40 bg-rose-950/10",
    headerBgClass: "bg-rose-950/40 border-b border-rose-500/30",
    badgeClass: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
    icon: <FileX className="w-4 h-4 text-rose-400 shrink-0" />
  },
  {
    id: "priority_2_crit_urgent_with_reg",
    priorityBadge: "PRIORITY 2",
    title: "Critical & Urgent Issuers (With Reg Statements)",
    subtitle: "Both Critical (<3mo) & Urgent (3-6mo) issuers with active S-3/S-1/ATM registration statements on file (Foreign/SEDAR excluded)",
    borderClass: "border-amber-500/40 bg-amber-950/10",
    headerBgClass: "bg-amber-950/40 border-b border-amber-500/30",
    badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
    icon: <Layers className="w-4 h-4 text-amber-400 shrink-0" />
  },
  {
    id: "priority_3_unrated_otc_gte_001",
    priorityBadge: "PRIORITY 3",
    title: "Unrated Issuers (OTC & Non-Reporting Filers) • Price ≥ $0.001",
    subtitle: "Unrated OTCID, OTCQB, OTCQX, Pink Limited & non-reporting/stale filers trading at $0.001 or greater (Foreign/SEDAR excluded)",
    borderClass: "border-cyan-500/40 bg-cyan-950/10",
    headerBgClass: "bg-cyan-950/40 border-b border-cyan-500/30",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
    icon: <DollarSign className="w-4 h-4 text-cyan-400 shrink-0" />
  }
];

export const PriorityColumnsView: React.FC<PriorityColumnsViewProps> = ({
  targets,
  onSelect,
  activePriorityFilter,
  onSelectPriorityFilter
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PRIORITY_COLUMNS.map((col) => {
          const colTargets = targets
            .filter((t) => getPriorityBucket(t) === col.id)
            .sort((a, b) => {
              if (col.id !== "priority_3_unrated_otc_gte_001") {
                const aCrit = a.financialMetrics.capitalNeedUrgency === "critical" ? 0 : 1;
                const bCrit = b.financialMetrics.capitalNeedUrgency === "critical" ? 0 : 1;
                if (aCrit !== bCrit) return aCrit - bCrit;
                return (a.financialMetrics.runwayMonths ?? 999) - (b.financialMetrics.runwayMonths ?? 999);
              }
              return (b.marketData?.price ?? 0) - (a.marketData?.price ?? 0);
            });

          const isSelectedFilter = activePriorityFilter === col.id;

          return (
            <div
              key={col.id}
              className={`rounded-2xl border flex flex-col overflow-hidden transition-all ${col.borderClass} ${
                isSelectedFilter ? "ring-2 ring-amber-400 shadow-lg" : ""
              }`}
            >
              {/* Column Header */}
              <div className={`p-3.5 ${col.headerBgClass} space-y-1.5`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {col.icon}
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase ${col.badgeClass}`}>
                      {col.priorityBadge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onSelectPriorityFilter && (
                      <button
                        type="button"
                        onClick={() => onSelectPriorityFilter(isSelectedFilter ? "all_priority" : col.id)}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 cursor-pointer"
                      >
                        {isSelectedFilter ? "Showing Only This Column" : "Filter Table"}
                      </button>
                    )}
                    <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-full bg-zinc-950 text-white border border-zinc-800">
                      {colTargets.length}
                    </span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-white leading-snug">{col.title}</h3>
                <p className="text-[10px] text-zinc-400 leading-relaxed">{col.subtitle}</p>
              </div>

              {/* Column Cards List */}
              <div className="p-3 space-y-2.5 overflow-y-auto max-h-[640px] flex-1 bg-zinc-950/40">
                {colTargets.map((t) => {
                  const m = t.financialMetrics;
                  const mk = t.marketData;
                  const counsel = t.contacts.find(
                    (c) =>
                      c.id.includes("counsel") ||
                      (c.title && c.title.toLowerCase().includes("counsel")) ||
                      (c.name && c.name.toLowerCase().includes("esq"))
                  );
                  const ceo = t.contacts.find((c) => c.id.includes("ceo")) || t.contacts[0];

                  return (
                    <div
                      key={t.id}
                      id={"btn-dossier-" + t.ticker.toLowerCase()}
                      onClick={() => onSelect(t)}
                      role="button"
                      tabIndex={0}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-500/60 transition-all cursor-pointer shadow-sm hover:shadow-md space-y-2 group"
                    >
                      {/* Top Row: Ticker, Exchange, Urgency & Reg Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-black text-sm text-white group-hover:text-amber-400">
                              {t.ticker}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                              {t.exchange}
                            </span>
                            {t.noActiveRegStatements24M ? (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40">
                                NO REG (24M)
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
                                WITH REG ({t.regStatementForms24M?.slice(0, 2).join(", ") || "S-3/S-1"})
                              </span>
                            )}
                          </div>
                          <h4 className="text-[11px] font-semibold text-zinc-300 truncate mt-0.5" title={t.name}>
                            {t.name}
                          </h4>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-xs text-emerald-400">
                            {mk?.priceDisplay || "$0.00"}
                          </div>
                          <div className="text-[9px] font-mono text-zinc-500">
                            Vol: {mk?.avgMonthlyVolumeDisplay || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Middle Row: Urgency, Runway, Cash & Deficit */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-zinc-900 text-[10px] font-mono">
                        <div>
                          <span className="text-zinc-500 block text-[9px]">Tier / Runway</span>
                          <span
                            className={`font-bold ${
                              m.capitalNeedUrgency === "critical"
                                ? "text-rose-400"
                                : m.capitalNeedUrgency === "urgent"
                                  ? "text-amber-400"
                                  : "text-cyan-400"
                            }`}
                          >
                            {m.capitalNeedUrgency.toUpperCase()}{" "}
                            {m.runwayMonths ? `(${m.runwayMonths}m)` : ""}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[9px]">Cash</span>
                          <span className="text-zinc-200 font-semibold">
                            {m.cashOnHand !== null ? `$${(m.cashOnHand / 1e6).toFixed(2)}M` : m.cashOnHandDisplay}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-500 block text-[9px]">Work. Cap.</span>
                          <span className={m.isNegativeWorkingCapital ? "text-rose-400 font-semibold" : "text-zinc-300"}>
                            {m.isNegativeWorkingCapital
                              ? `-$${(m.workingCapitalDeficit / 1e6).toFixed(1)}M`
                              : m.workingCapital !== null
                                ? `+$${(m.workingCapital / 1e6).toFixed(1)}M`
                                : t.secStatus === "non_reporting_otc"
                                  ? "Non-Reporting OTC"
                                  : "Stale / Unrated"}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Counsel & CEO */}
                      <div className="pt-1.5 border-t border-zinc-900 flex items-center justify-between gap-2 text-[10px] text-zinc-400">
                        <span className="truncate" title={counsel ? `${counsel.name} (${counsel.firm})` : ceo?.name}>
                          {counsel ? `Counsel: ${counsel.name}` : `CEO: ${ceo?.name || "Management"}`}
                        </span>
                        <span className="text-amber-400 inline-flex items-center gap-0.5 font-semibold shrink-0">
                          <span>Dossier</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
