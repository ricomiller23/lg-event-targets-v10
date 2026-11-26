#!/usr/bin/env node

/**
 * EQUITY LINE & CLEAN SHELLS — CORRECTED LAWYER RE-DISPATCH ENGINE
 * 
 * Target: 18 Researched & Corrected Lead Securities Counsel Partners
 * (All bouncebacks, firm migrations, and forwardings resolved)
 * Sender: Eric Miller <ricomiller@icloud.com>
 * Channel: Native Apple Mail via AppleScript
 */

import { execSync } from 'child_process';
import fs from 'fs';

const CORRECTED_TARGETS = [
  {
    name: "Kenneth Cutler, Esq.",
    firm: "Dorsey & Whitney LLP",
    email: "cutler.ken@dorsey.com",
    phone: "(212) 415-9200",
    primaryClient: "Co-Diagnostics, Inc. (CODX)",
    representedTickers: ["CODX", "DAIO", "TSX: PHX", "CVSI", "TRSI", "GZIC", "BTZI", "CTGO", "DPRO", "FATN", "ABAT"],
    runway: "~18 months",
    cash: "$44.3M",
    wc: "deficit of $2.4M",
    shelf: "Active S-3 shelf on file (S-3, S-8, 424B5)"
  },
  {
    name: "Brad L. Shiffman, Esq.",
    firm: "Blank Rome LLP",
    email: "brad.shiffman@blankrome.com",
    phone: "(212) 885-5000",
    primaryClient: "Sharing Economy International Inc. (SEII)",
    representedTickers: ["SEII", "LINK", "ZOMD", "BDGR", "BLQC", "OZSC", "UMAC"],
    runway: "~0.2 months",
    cash: "$0.0M",
    wc: "working capital surplus of $13.9M",
    shelf: "Zero active S-3 shelf registration statements on file in past 24 months"
  },
  {
    name: "Dinesh Banani, Esq.",
    firm: "Pinsent Masons LLP",
    email: "dinesh.banani@pinsentmasons.com",
    phone: "+44 20 7418 7000",
    primaryClient: "Autogenomics / Kintara Therapeutics (ATGN)",
    representedTickers: ["ATGN", "KWY", "CAPC", "HIRU", "BBLR", "SNRY", "NBND", "LSE: SWC"],
    runway: "~1.1 months",
    cash: "$0.3M",
    wc: "working capital deficit of $2.1M",
    shelf: "Active registration on file"
  },
  {
    name: "Stuart M. Falber, Esq.",
    firm: "Wilmer Cutler Pickering Hale and Dorr LLP",
    email: "stuart.falber@wilmerhale.com",
    phone: "(617) 526-6663",
    primaryClient: "Koil Energy Solutions, Inc. (KLNG)",
    representedTickers: ["KLNG", "ARG", "RDGL", "AGDY", "BLLB", "GCEI", "LTCN", "FLNA"],
    runway: "~4.5 months",
    cash: "$0.8M",
    wc: "working capital deficit of $1.2M",
    shelf: "Zero active S-3 shelf registration statements on file in past 24 months"
  },
  {
    name: "Catherine Youdan, Esq.",
    firm: "Blake, Cassels & Graydon LLP",
    email: "catherine.youdan@blakes.com",
    phone: "(416) 863-2513",
    primaryClient: "Intellicheck, Inc. (IDN)",
    representedTickers: ["IDN", "ZDC", "SKPO", "PRDL", "PTKN", "GPFT", "TII"],
    runway: "~15 months",
    cash: "$8.4M",
    wc: "working capital surplus of $9.1M",
    shelf: "Active S-3 shelf on file (S-3, S-8)"
  },
  {
    name: "Marc D. Jaffe, Esq.",
    firm: "Latham & Watkins LLP",
    email: "marc.jaffe@lw.com",
    phone: "(212) 906-1200",
    primaryClient: "Voip-Pal.Com Inc (VPLM)",
    representedTickers: ["VPLM", "GELS", "TMG", "FUNN", "ITNS", "BMXC", "RDZN"],
    runway: "~2.4 months",
    cash: "$0.4M",
    wc: "working capital deficit of $3.8M",
    shelf: "Zero active S-3 shelf registration statements on file in past 24 months"
  },
  {
    name: "Richard Segal, Esq.",
    firm: "Cooley LLP",
    email: "rsegal@cooley.com",
    phone: "(212) 479-6000",
    primaryClient: "Mobiquity Technologies, Inc. (MOBQ)",
    representedTickers: ["MOBQ", "BLM", "NMTC", "ATWT", "BIEL", "GTCH", "JUNO", "AMSS", "CDZI", "DDC", "APRE", "EVAX", "KYNB", "PALI", "SLS"],
    runway: "~1.2 months",
    cash: "$0.5M",
    wc: "working capital deficit of $4.2M",
    shelf: "Active S-3 shelf on file (S-3, S-8, 424B5)"
  },
  {
    name: "Douglas M. Foley, Esq.",
    firm: "Kaufman & Canoles, P.C.",
    email: "douglas.foley@kaufcan.com",
    phone: "(804) 771-5746",
    primaryClient: "NORTHWEST BIOTHERAPEUTICS INC (NWBO)",
    representedTickers: ["NWBO", "ATCH", "MAMA", "NGCG", "TXTM", "IGEX", "AMZE", "MBRX"],
    runway: "~1.5 months",
    cash: "$4.2M",
    wc: "working capital deficit of $28.4M",
    shelf: "Active registration on file"
  },
  {
    name: "Barry I. Grossman, Esq.",
    firm: "Ellenoff Grossman & Schole LLP",
    email: "bigrossman@egsllp.com",
    phone: "(212) 370-1300",
    primaryClient: "Cardiff Lexington Corp (CDIX)",
    representedTickers: ["CDIX", "SALT", "MPTI", "WNBD", "CYBL", "PREC", "PNXP", "MTVA"],
    runway: "~2.1 months",
    cash: "$0.2M",
    wc: "working capital deficit of $1.9M",
    shelf: "Zero active S-3 shelf registration statements on file in past 24 months"
  },
  {
    name: "Rick A. Werner, Esq.",
    firm: "Haynes Boone",
    email: "rick.werner@haynesboone.com",
    phone: "(212) 659-7300",
    primaryClient: "Aspira Women's Health Inc. (AWHL)",
    representedTickers: ["AWHL", "ACNT", "VLTLF", "HDUP", "BZRD", "MMEX", "PTPI", "LUCD"],
    runway: "~4.2 months",
    cash: "$3.1M",
    wc: "working capital deficit of $2.8M",
    shelf: "Active S-3 shelf on file (S-3, 424B5)"
  },
  {
    name: "Stephen M. Leitzell, Esq.",
    firm: "Dechert LLP",
    email: "stephen.leitzell@dechert.com",
    phone: "(215) 994-2000",
    primaryClient: "Investview, Inc. (INVU)",
    representedTickers: ["INVU", "ASYS", "KOPN", "AIMH", "MRNJ", "LBRG", "DPUI", "GANX"],
    runway: "~6.8 months",
    cash: "$7.2M",
    wc: "working capital surplus of $4.1M",
    shelf: "Active registration on file"
  },
  {
    name: "Shawn M. Turner, Esq.",
    firm: "Holland & Knight LLP",
    email: "shawn.turner@hklaw.com",
    phone: "(303) 974-6660",
    primaryClient: "Kingston Resources / Vaso Corp (VASO)",
    representedTickers: ["VASO", "BOS.TO", "KINS", "RECX", "GBHL", "ENZC", "KITL", "FJET"],
    runway: "~12 months",
    cash: "$14.5M",
    wc: "working capital surplus of $11.2M",
    shelf: "Active S-3 shelf on file (S-3, S-8)"
  },
  {
    name: "Stephen Cohen, Esq.",
    firm: "Sheppard, Mullin, Richter & Hampton LLP",
    email: "scohen@sheppardmullin.com",
    phone: "(212) 653-8700",
    primaryClient: "Cyber Enviro-Tech, Inc. (CETI)",
    representedTickers: ["CETI", "ACON", "ACFN", "KLYG", "KDOZ", "AERG", "GSAC", "KOAN", "UMGP", "XCPL", "CCLX", "DWAY", "ONAR", "FLZH", "RTB", "MDCX", "NTHI"],
    runway: "~0.8 months",
    cash: "$0.1M",
    wc: "working capital deficit of $3.5M",
    shelf: "Zero active S-3 shelf registration statements on file in past 24 months"
  },
  {
    name: "Ryan J. Dzierniejko, Esq.",
    firm: "Skadden, Arps, Slate, Meagher & Flom LLP",
    email: "ryan.dzierniejko@skadden.com",
    phone: "(212) 735-3712",
    primaryClient: "Edgemode, Inc. (EDGM)",
    representedTickers: ["EDGM", "ACCS", "JSDA", "BUKS", "FMCC", "VPER", "BYRG", "NIPG"],
    runway: "~1.4 months",
    cash: "$0.2M",
    wc: "working capital deficit of $4.1M",
    shelf: "Zero active S-3 shelf registration statements on file in past 24 months"
  },
  {
    name: "Christopher J. Doyle, Esq.",
    firm: "Hogan Lovells US LLP",
    email: "christopher.doyle@hoganlovells.com",
    phone: "(212) 918-3127",
    primaryClient: "INTELLIGENT BIO SOLUTIONS INC. (INBS)",
    representedTickers: ["INBS", "ZDGE", "HCMC", "TKOI", "BFCH", "INND", "UMH"],
    runway: "~5.5 months",
    cash: "$6.1M",
    wc: "working capital deficit of $1.5M",
    shelf: "Active S-3 shelf on file (S-3, 424B5)"
  },
  {
    name: "Steven M. Skolnick, Esq.",
    firm: "Lowenstein Sandler LLP",
    email: "sskolnick@lowenstein.com",
    phone: "(973) 597-2476",
    primaryClient: "iQSTEL Inc (IQST)",
    representedTickers: ["IQST", "WNBD", "CYBL", "PRDL"],
    runway: "~8.2 months",
    cash: "$4.8M",
    wc: "working capital surplus of $2.2M",
    shelf: "Active S-3 shelf on file (S-3, S-8)"
  },
  {
    name: "Craig V. Butler, Esq.",
    firm: "Law Offices of Craig V. Butler",
    email: "cbutler@craigbutlerlaw.com",
    phone: "(949) 484-5667",
    primaryClient: "WEED, INC. (BUDZ)",
    representedTickers: ["BUDZ"],
    runway: "~2.1 months",
    cash: "$0.1M",
    wc: "working capital deficit of $3.8M",
    shelf: "Active registration on file"
  },
  {
    name: "Jonathan H. Talcott, Esq.",
    firm: "Nelson Mullins Riley & Scarborough LLP",
    email: "jon.talcott@nelsonmullins.com",
    phone: "(202) 689-2806",
    primaryClient: "Nelson Mullins Securities Practice Issuers (DUOT, DJT, RCAT, CYBT, etc.)",
    representedTickers: ["DUOT", "DJT", "RCAT", "CYBT", "PINK", "EVHO", "CRVH", "CGLD", "CTM"],
    runway: "Practice-Wide Review",
    cash: "Active Portfolios",
    wc: "Active Working Capital Portfolios",
    shelf: "Active S-3 & Form 10 filers across practice"
  }
];

function buildBody(t) {
  const otherClientsText = t.representedTickers.length > 1
    ? `\n• Monitored Corporate Clients Across Your Practice: ${t.representedTickers.join(", ")}`
    : "";

  if (t.email === "jon.talcott@nelsonmullins.com") {
    return `Dear Jonathan,

Thank you for your prompt note. Understood completely that WEED is not in your current portfolio (we have updated our registry accordingly).

I am following up with you directly given your leadership as Co-Chair of the Securities Practice Group at Nelson Mullins. Our institutional capital desk specializes in structured public market financings, non-toxic growth facilities, and balance sheet recapitalizations for NASDAQ, NYSE, and OTC-listed corporate issuers.

We are reaching out to explore capital solutions for other corporate issuers across your securities practice:

### 1. Committed Equity Line of Credit (ELOC / Equity Purchase Facility)
We provide committed equity line facilities ($5M to $25M+, calibrated to market capitalization and trading volume) structured to deliver continuous, predictable capital access directly to the treasury:
• 100% Issuer-Controlled: The company dictates the timing, frequency, and size of every draw.
• Non-Toxic Architecture: No fixed conversion ratios, no pre-set resets, and zero restrictive debt covenants.
• Fully Accommodating: We are completely open to suggestions and terms to accommodate counsel and board preferences—including tailored floor price limits, customized draw thresholds, blackout period flexibility, volume discounts, and customized commitment fees.

### 2. Seasoned, Clean Shell Vehicles Available (Reverse Mergers)
Additionally, for your private corporate clients seeking an expedited or alternative path to public market quotation, we maintain a portfolio of clean, seasoned public shell vehicles (both SEC-reporting OTC and clean corporate platforms with clean cap tables, verified shareholder structures, and zero toxic legacy liabilities). These vehicles are immediately available for reverse mergers, business combinations, or alternative listing transactions.

If you have corporate clients facing capital constraints, shelf overhang, or private clients evaluating reverse mergers, we can move quickly to structure an accommodating solution.

Are you open to a brief 10-minute introductory call this week?

Respectfully,

Eric Miller
Managing Principal
Special Situations & Capital Formation Desk
ricomiller@icloud.com • (480) 287-2227`;
  }

  return `Dear ${t.name},

I am reaching out to you in your capacity as outside securities and corporate counsel representing ${t.primaryClient} as well as other corporate issuers across your practice at ${t.firm}.

Our institutional capital desk specializes in structured public market financings, non-toxic growth capital, and balance sheet recapitalizations for NASDAQ, NYSE, and OTC-listed corporate issuers.

Based on our review of recent SEC periodic disclosures across your client coverage:
• Liquidity Profile: ${t.primaryClient} (${t.runway} cash runway, ${t.wc})
• Shelf Profile: ${t.shelf}${otherClientsText}

### 1. Committed Equity Line of Credit (ELOC / Equity Purchase Facility)
We are currently offering committed equity line facilities (typically $5M to $25M+, calibrated to market capitalization and daily trading volume) structured to provide continuous, predictable capital access directly to the treasury:
• 100% Issuer-Controlled: The company dictates the timing, frequency, and size of every draw.
• Non-Toxic Architecture: No fixed conversion ratios, no pre-set resets, and zero restrictive debt covenants.
• Fully Accommodating & Structurally Flexible: We are completely open to suggestions and terms to accommodate counsel and board preferences—including tailored floor price limits, customized draw thresholds, blackout period flexibility, volume discounts, and customized commitment fees.

### 2. Practice-Wide Applicability / Other Corporate Clients
If ${t.representedTickers[0]} is not currently in need of an equity line facility or already has satisfactory financing mechanisms in place, we would welcome the opportunity to discuss this facility for ANY of the other public issuers, emerging growth companies, or corporate clients that your securities practice group at ${t.firm} represents. If you have another client facing capital constraints, shelf overhang, or working capital needs, we can move quickly to structure an accommodating equity line solution.

### 3. Seasoned, Clean Shell Vehicles Available
Additionally, for your private corporate clients seeking an expedited or alternative path to public market quotation, we maintain a portfolio of clean, seasoned public shell vehicles (both SEC-reporting OTC and clean corporate platforms with clean cap tables, verified shareholder structures, and zero toxic legacy liabilities). These vehicles are immediately available for reverse mergers, business combinations, or alternative listing transactions.

We would welcome an introductory discussion with you or your corporate finance partners this week to explore how we can support your corporate practice.

Are you available for a brief 10-minute introductory call this week?

Respectfully,

Eric Miller
Managing Principal
Special Situations & Capital Formation Desk
ricomiller@icloud.com • (480) 287-2227`;
}

function sendViaAppleMail(target) {
  const subject = `CONFIDENTIAL // FOR SECURITIES COUNSEL: ${target.primaryClient} — Committed Equity Line Facility & Available Clean Shells`;
  const body = buildBody(target);
  const recipient = target.email;
  const sender = "Eric Miller <ricomiller@icloud.com>";

  const escapedSubject = subject.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const escapedBody = body.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  const appleScript = `
tell application "Mail"
  set theSubject to "${escapedSubject}"
  set theBody to "${escapedBody}"
  set theRecipient to "${recipient}"
  set theSender to "${sender}"
  
  set newMessage to make new outgoing message with properties {subject:theSubject, content:theBody, visible:false}
  tell newMessage
    set sender to theSender
    make new to recipient at end of to recipients with properties {address:theRecipient}
    send
  end tell
end tell
`;

  try {
    execSync(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, { stdio: 'pipe' });
    console.log(`Status:  ✓ SENT VIA APPLE MAIL (${sender})`);
    return true;
  } catch (err) {
    console.error(`❌ Apple Mail Error for ${recipient}: ${err.message}`);
    return false;
  }
}

async function run() {
  console.log("======================================================================");
  console.log("EQUITY LINE & CLEAN SHELLS — CORRECTED LAWYERS RE-DISPATCH ENGINE");
  console.log("======================================================================");
  console.log(`Total Corrected Candidates: ${CORRECTED_TARGETS.length}`);
  console.log("Sender: Eric Miller <ricomiller@icloud.com>");
  console.log("======================================================================\n");

  let sent = 0;
  for (let i = 0; i < CORRECTED_TARGETS.length; i++) {
    const t = CORRECTED_TARGETS[i];
    console.log(`[${i + 1}/${CORRECTED_TARGETS.length}] ${t.name} (${t.firm})`);
    console.log(`Email:   ${t.email} | Phone: ${t.phone}`);
    console.log(`Client:  ${t.primaryClient} [Tickers: ${t.representedTickers.join(", ")}]`);

    const ok = sendViaAppleMail(t);
    if (ok) sent++;
    console.log("----------------------------------------------------------------------");
    // Pacing delay to avoid AppleEvent thread exhaustion
    execSync("sleep 3");
  }

  console.log(`\n======================================================================`);
  console.log(`SUMMARY: Sent ${sent} of ${CORRECTED_TARGETS.length} corrected messages.`);
  console.log("======================================================================");
}

run();
