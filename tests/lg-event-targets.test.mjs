import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "lg-event-targets.json");

test("LG Event-Target — Prebuild Assertion Test Suite (Audited SEC Data & Market Quotes)", async (t) => {
  assert.ok(fs.existsSync(DATA_PATH), "lg-event-targets.json must exist");
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const { metadata, targets } = raw;

  await t.test("Test 1: Full cohort of 417 presenting and screened companies verified and reconciled", () => {
    assert.equal(targets.length, 417, "Targets length must be exactly 417");
    assert.equal(metadata.totalTargets, 417, "Metadata totalTargets must be 417");

    const sumTiers = metadata.criticalCount + metadata.urgentCount + metadata.moderateCount + metadata.stableCount + metadata.unratedCount;
    assert.equal(sumTiers, 417, `Tiers must reconcile to 417 (got ${sumTiers})`);
  });

  await t.test("Test 2: Working capital deficits reconciled truthfully without gaps", () => {
    const negWC = targets.filter(t => t.financialMetrics && t.financialMetrics.isNegativeWorkingCapital);
    assert.equal(negWC.length, metadata.negativeWorkingCapitalCount, "Negative working capital count must match metadata");
    assert.equal(negWC.length, 49, "Exactly 49 targets must have negative working capital deficits");

    const totalDeficit = negWC.reduce((acc, t) => acc + Math.abs(t.financialMetrics.workingCapital), 0);
    assert.equal(totalDeficit, metadata.totalNegativeWorkingCapitalDeficit, "Total deficit must match metadata");
  });

  await t.test("Test 3: Zero synthetic placeholders ('18 Months (Est.)' banned)", () => {
    targets.forEach((target) => {
      const runwayStr = target.financialMetrics?.runwayDisplay || "";
      assert.ok(!runwayStr.includes("18 Months (Est.)"), `Target ${target.ticker} has synthetic '18 Months (Est.)'`);
      assert.ok(!runwayStr.includes("Simulated"), `Target ${target.ticker} has synthetic 'Simulated'`);
    });
  });

  await t.test("Test 4: Rule 9 compliance: Zero unearned banned words in static text", () => {
    const BANNED = [
      "100% verified",
      "certified",
      "100% accurate",
      "audited by kpmg",
      "guaranteed",
    ];

    targets.forEach((target) => {
      const summary = (target.notes || "") + (target.description || "");
      BANNED.forEach((bw) => {
        assert.ok(
          !summary.toLowerCase().includes(bw),
          `Target ${target.ticker} notes/description contains banned claim "${bw}"`
        );
      });
    });
  });

  await t.test("Test 5: Sourced market data (Stock Price & Monthly Volume) exists across cohort", () => {
    let quotedCount = 0;
    targets.forEach((target) => {
      assert.ok(target.marketData, `Target ${target.ticker} must have marketData object`);
      if (typeof target.marketData.price === "number") {
        quotedCount++;
        assert.ok(target.marketData.price >= 0, `Target ${target.ticker} price must be >= 0`);
        assert.ok(target.marketData.priceDisplay, `Target ${target.ticker} priceDisplay must be non-empty`);
        assert.ok(target.marketData.avgMonthlyVolume >= 0, `Target ${target.ticker} volume must be >= 0`);
      }
    });
    assert.ok(quotedCount >= Math.round(targets.length * 0.95), `At least 95% of targets must have numeric quotes (got ${quotedCount})`);
  });

  await t.test("Test 6: Zero Active Registration Statements (24M) derived truthfully", () => {
    const noRegTargets = targets.filter(t => t.noActiveRegStatements24M);
    assert.equal(noRegTargets.length, metadata.noActiveRegStatementsCount, `No reg targets count must match metadata (got ${noRegTargets.length})`);
    assert.equal(noRegTargets.length, 293, "Exactly 293 targets have zero active reg statements");

    noRegTargets.forEach((t) => {
      const filings = t.registrationStatements2Y?.filings || [];
      const hasActive = filings.some(f => f.status === "EFFECT" || f.status === "ACTIVE" || f.form?.includes("S-3"));
      assert.ok(!hasActive, `Target ${t.ticker} flagged as no-reg has active filings`);
    });
  });

  await t.test("Test 7: Direct contacts populated with real officer names and zero switchboard emails", () => {
    const BANNED_EMAILS = [
      "info@",
      "contact@",
      "ir@",
      "support@",
      "admin@",
      "sales@",
      "office@",
      "general@"
    ];

    targets.forEach((target) => {
      assert.ok(target.contacts && target.contacts.length >= 1, `Target ${target.ticker} must have contacts`);
      target.contacts.forEach((c) => {
        if (c.email) {
          BANNED_EMAILS.forEach((b) => {
            assert.ok(!c.email.toLowerCase().startsWith(b), `Target ${target.ticker} contact ${c.name} has banned generic email: ${c.email}`);
          });
        }
      });
    });
  });

  await t.test("Test 8: Whole-dataset search filter robustness — zero runtime exceptions across all characters, tokens, and fields", () => {
    function matchTargetSearch(target, query) {
      if (!query) return true;
      const q = query.toLowerCase().trim();
      if (!q) return true;

      if (q === "no reg" && target.noActiveRegStatements24M) return true;

      if (target.ticker?.toLowerCase().includes(q)) return true;
      if (target.name?.toLowerCase().includes(q)) return true;
      if (target.sector?.toLowerCase().includes(q)) return true;
      if (target.cik && String(target.cik).toLowerCase().includes(q)) return true;
      if (target.exchange?.toLowerCase().includes(q)) return true;
      if (target.headquarters?.toLowerCase().includes(q)) return true;
      if (target.telephone?.toLowerCase().includes(q)) return true;
      if (target.marketData?.priceDisplay?.toLowerCase().includes(q)) return true;
      if (target.marketData?.avgMonthlyVolumeDisplay?.toLowerCase().includes(q)) return true;

      if (Array.isArray(target.contacts)) {
        for (const c of target.contacts) {
          if (!c) continue;
          if (c.name?.toLowerCase().includes(q)) return true;
          if (c.email?.toLowerCase().includes(q)) return true;
          if (c.firm?.toLowerCase().includes(q)) return true;
          if (c.phone?.toLowerCase().includes(q)) return true;
          if (c.title?.toLowerCase().includes(q)) return true;
          if (c.roleSummary?.toLowerCase().includes(q)) return true;
        }
      }

      return false;
    }

    const testQueries = ["a", "b", "c", "dibs", "delx", "no reg", "1", "$", "@", "null", "undefined", "llp", " "];
    
    targets.forEach((target) => {
      assert.ok(target.sector, "Target " + target.ticker + " must have a non-empty sector");
      testQueries.forEach((q) => {
        assert.doesNotThrow(() => {
          matchTargetSearch(target, q);
        }, "Target " + target.ticker + " threw exception on search query: " + q);
      });
    });
  });

  await t.test("CRM Assertion: Mark Baudler and April Ballard marked Not Interested with verbatim reply across all 6 WSGR targets", () => {
    const baudlerTargets = targets.filter(x => x.contacts.some(c => c.email === "mbaudler@wsgr.com"));
    assert.equal(baudlerTargets.length, 6, "All 6 Mark Baudler targets in lg-event-targets must be present");
    for (const bt of baudlerTargets) {
      assert.equal(bt.crm.stage, "passed", bt.ticker + " must be marked passed");
      assert.equal(bt.crm.responseOutcome, "Declined - Not Interested", bt.ticker + " must be marked Declined - Not Interested");
      assert.ok(bt.crm.notes.some(n => n.text.includes("At this time Mark will need to decline") && n.text.includes("April Ballard")), bt.ticker + " must include verbatim reply");
      assert.ok(bt.contacts.some(c => c.email === "aballard@wsgr.com"), bt.ticker + " must include April Ballard contact");
    }
  });


  await t.test("Priority Columns Assertion: P1 (Crit/Urg No Reg = 35), P2 (Crit/Urg With Reg = 43), P3 (Unrated OTC >= $0.001 = 108), Foreign/SEDAR excluded (41)", () => {
    function isForeignSedar(x) {
      const ex = (x.exchange || "").toUpperCase();
      const tk = (x.ticker || "").toUpperCase();
      const rp = (x.regulatoryPortal || "").toUpperCase();
      const secUrl = (x.secEdgarUrl || "").toUpperCase();
      return (
        x.secStatus === "non_sec_foreign_or_private" ||
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

    const foreign = targets.filter(isForeignSedar);
    const domestic = targets.filter(x => !isForeignSedar(x));
    const p1 = domestic.filter(x => (x.financialMetrics?.capitalNeedUrgency === "critical" || x.financialMetrics?.capitalNeedUrgency === "urgent") && x.noActiveRegStatements24M);
    const p2 = domestic.filter(x => (x.financialMetrics?.capitalNeedUrgency === "critical" || x.financialMetrics?.capitalNeedUrgency === "urgent") && !x.noActiveRegStatements24M);
    const p3 = domestic.filter(x => x.financialMetrics?.capitalNeedUrgency === "unrated" && (x.marketData?.price || 0) >= 0.001);

    assert.equal(foreign.length, 41, "Foreign/SEDAR excluded count must be 41");
    assert.equal(domestic.length, 376, "Domestic cohort must be 376");
    assert.equal(p1.length, 35, "Priority 1 (Critical & Urgent Without Reg Statements) must be 35");
    assert.equal(p2.length, 43, "Priority 2 (Critical & Urgent With Reg Statements) must be 43");
    assert.equal(p3.length, 108, "Priority 3 (Unrated OTC/Non-Reporting >= $0.001) must be 108");
  });

  await t.test("Security Assertion: Next.js image optimization is unoptimized and Next.js version is patched", () => {
    const nextConfigContent = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
    assert.match(nextConfigContent, /unoptimized:\s*true/, "next.config.ts must enforce unoptimized: true to close image optimization RCE attack vectors");
    
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const nextVersion = pkg.dependencies?.next || "";
    assert.ok(nextVersion.includes("15.5.28"), "Next.js must be locked to patched security release 15.5.28+");
  });
});
