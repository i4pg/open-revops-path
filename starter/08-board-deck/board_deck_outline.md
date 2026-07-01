# Board Deck Outline — Sales-Efficiency Proposal (SCQA)

Slide-by-slide skeleton for the Capstone III board proposal (module 9.3),
storyboarded as SCQA and built for executive data storytelling (module 10.2).

Rules:
- One idea per slide. The **slide title is the takeaway** (an assertion, not a
  label). If the titles read top-to-bottom, they should tell the whole story.
- Every chart cites its metric (`metrics.yml` id) and source of record.
- Answer first (Pyramid Principle), evidence second.

---

## Storyline spine (fill before making slides)
- **S**ituation: _TODO one line_
- **C**omplication: _TODO one line — the efficiency leak_
- **Q**uestion: _TODO — the decision the board must make_
- **A**nswer: _TODO — your recommendation in one line_

---

## Slides

**1. Title / ask.** Sales-efficiency proposal. Subtitle = the one-line ask and
the decision requested today.

**2. Executive summary (the whole story on one slide).** SCQA in four bullets +
the headline number and the ask. A board member who only reads this slide should
be able to vote.

**3. Situation — where liquidity efficiency stands today.** Baseline: GMV, active
buyers, take-rate, subsidy per unit of GMV. `metrics.yml`: gmv, active_buyer.

**4. Complication — the leak.** The 1-2 charts that show friction and/or subsidy
destroying efficient GMV (pocket-margin waterfall headline from `04-`, or the
activation-funnel drop from `03-`). This is the emotional turn of the story.

**5. Root cause.** Issue-tree branch that the evidence points to (from `01-`).
Show you diagnosed, not guessed. Rule out the alternatives briefly.

**6. The question / decision.** State plainly what the board is being asked to
decide. Frame as a choice, not an open-ended discussion.

**7. Recommendation.** The answer, up front. What we do, the mechanism by which
it lifts efficiency (less friction and/or less subsidy per SAR of GMV).

**8. Evidence it works — quantified.** Expected impact with the backtest/forecast
behind it (from `06-`), including accuracy (WAPE) so the number is credible.

**9. Options & tradeoffs.** A vs B vs do-nothing, on cost and impact. Make the
recommended option the obvious pick without hiding its tradeoff.

**10. Plan & milestones.** Phased rollout, owners, dates, the systems touched
(SmartSuite / Salla / NetSuite / Make-n8n). Show it's operable, not theoretical.

**11. Risks & guardrails.** Top 3 risks + the early-warning metric that trips
before they hurt (ties to `09-liquidity` instrumentation).

**12. The ask (repeat #1).** Explicit approval, budget, owner, first checkpoint.
End where you started — close the loop.

---

### Appendix (hold in reserve, do not present unless asked)
Methodology, metric definitions, model assumptions, sensitivity, reconciliation
of GMV/active-buyer between OMS and NetSuite, full option analysis.
