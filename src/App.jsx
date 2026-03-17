import { useState, useEffect, useRef } from "react";

const palette = {
  bg: "#08080d",
  card: "#131320",
  cardHover: "#1a1a2e",
  border: "#232336",
  borderHover: "#3a3a54",
  accent: "#e07a5f",
  accentHover: "#e8946e",
  accentGlow: "rgba(224,122,95,0.12)",
  accentSubtle: "rgba(224,122,95,0.05)",
  text: "#ededf0",
  textSec: "#a3a1b0",
  textMut: "#706e82",
};

const SECTIONS = ["Home", "About", "Skills", "Case Studies", "Contact"];

function useMedia(q) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(q);
    setM(mql.matches);
    const h = (e) => setM(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, [q]);
  return m;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`, ...style }}>{children}</div>;
}

function Pill({ label }) {
  const [h, setH] = useState(false);
  return (
    <span onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "inline-block", padding: "6px 15px", borderRadius: 22,
      border: `1px solid ${h ? palette.accent : palette.border}`,
      color: h ? palette.accent : palette.textSec,
      background: h ? palette.accentSubtle : "transparent",
      fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif",
      transition: "all 0.2s ease", cursor: "default",
    }}>{label}</span>
  );
}

function CaseCard({ title, problem, approach, tools, result, num, mob }) {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(false);
  const mono = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: palette.accent, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 6 };
  return (
    <div onClick={() => setOpen(!open)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? palette.cardHover : palette.card, border: `1px solid ${h || open ? palette.borderHover : palette.border}`, borderRadius: 14, padding: mob ? "20px" : "24px 28px", cursor: "pointer", transition: "all 0.2s ease", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...mono, marginBottom: 8, fontSize: 11 }}>Case Study {String(num).padStart(2, "0")}</div>
          <h3 style={{ fontSize: mob ? 16 : 18, color: palette.text, margin: 0, fontFamily: "'Source Serif 4', serif", fontWeight: 400, lineHeight: 1.4 }}>{title}</h3>
        </div>
        <div style={{ width: 26, height: 26, borderRadius: 13, border: `1px solid ${palette.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.3s ease", color: palette.textMut, fontSize: 17 }}>+</div>
      </div>
      {open && (
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${palette.border}` }}>
          {[{ l: "Problem", t: problem }, { l: "Approach", t: approach }].map(({ l, t }) => (
            <div key={l} style={{ marginBottom: 16 }}>
              <div style={mono}>{l}</div>
              <p style={{ color: palette.textSec, fontSize: 14, lineHeight: 1.75, margin: 0, fontFamily: "'IBM Plex Sans', sans-serif" }}>{t}</p>
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...mono, marginBottom: 8 }}>Tools</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tools.map((t) => <span key={t} style={{ padding: "3px 11px", borderRadius: 10, background: palette.accentGlow, color: palette.accentHover, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>{t}</span>)}
            </div>
          </div>
          <div>
            <div style={mono}>Result</div>
            <p style={{ color: palette.text, fontSize: 14, lineHeight: 1.75, margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500 }}>{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const LI = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 110-4.128 2.064 2.064 0 010 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;

function Btn({ href, children, primary, icon, onClick }) {
  const [h, setH] = useState(false);
  const Tag = href ? "a" : "button";
  const props = href ? { href, target: "_blank", rel: "noopener noreferrer" } : { onClick };
  return (
    <Tag {...props} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 26px", borderRadius: 26,
      textDecoration: "none", fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500,
      transition: "all 0.25s ease", cursor: "pointer",
      transform: h ? "translateY(-2px)" : "none",
      ...(primary
        ? { background: h ? palette.accentHover : palette.accent, color: "#fff", border: "none", boxShadow: h ? `0 6px 20px ${palette.accentGlow}` : "none" }
        : { background: "transparent", border: `1px solid ${h ? palette.accent : palette.border}`, color: h ? palette.accent : palette.text }),
    }}>{icon}{children}</Tag>
  );
}

const cases = [
  { title: "Tracing a CRM Sync Failure Using API Version Comparison", problem: "An enterprise client's CRM integration produced duplicate records and missing conversation data. The sync service appeared functional but data integrity had silently degraded.", approach: "Compared API responses between two major versions of the data export endpoint using Postman, isolating field-level discrepancies. Mapped the sync architecture and used timestamp analysis to narrow when data loss began.", tools: ["Postman", "REST APIs", "Datadog", "Sentry"], result: "Identified a version-specific field mapping gap causing silent data loss. Escalated with full evidence to platform engineering, leading to a targeted fix." },
  { title: "Debugging an LLM Hallucination in a Production AI Agent", problem: "An AI agent generated fabricated URLs in customer-facing responses. The knowledge base had correct information but the LLM invented links instead of retrieving them.", approach: "Pulled the full LLM reasoning trace: retrieval found the correct article, response generation was accurate, but the validation layer rejected it and the model substituted a hallucinated URL. Cross-referenced agent instruction sets to find the conflict.", tools: ["LLM Observability", "Agent Config", "Knowledge Base"], result: "Confirmed a conflict between system instructions and the response validation filter. Documented as a reusable diagnostic framework across deployments." },
  { title: "Resolving a Cross-Platform Handoff Failure via API Investigation", problem: "Conversations failed to transfer from AI agent to live support. Agents saw blank transcripts after handoff, impacting resolution times.", approach: "Traced the messaging API switchboard flow end-to-end. Inspected transfer events and webhook payloads to find where context dropped. Correlated with observability logs and error traces.", tools: ["Postman", "Messaging APIs", "Datadog", "Sentry"], result: "Isolated a timing issue where handoff fired before transcript assembly completed. Fix restored full delivery. Authored investigation docs for the team." },
  { title: "Diagnosing a Language Detection Misfire in a Multilingual AI Agent", problem: "A multilingual AI agent misclassified user language, triggering wrong flows. Intermittent and hard to reproduce.", approach: "Analyzed LLM traces comparing NLP detection confidence scores against input. Found short messages were misclassified. Mapped thresholds and tested edge cases against routing logic.", tools: ["LLM Observability", "Agent Config", "Feature Flags"], result: "Confirmed threshold sensitivity for short text. Escalated with reproduction steps, leading to a platform-level confidence scoring improvement." },
  { title: "Investigating a Validation Filter Blocking Correct AI Responses", problem: "An AI agent returned fallback responses despite having relevant knowledge articles. Resolution rates declined with no knowledge base changes.", approach: "Traced the full reasoning chain: retrieval and generation were correct, but the validation filter rejected at the final stage. Compared global rules against topic-specific exception clauses.", tools: ["LLM Observability", "Agent Config", "Knowledge Base"], result: "Discovered global restriction rules overriding topic exceptions. Provided config fix and documented the pattern as a reusable framework." },
];

const skills = [
  { name: "Investigation & Debugging", items: ["Root Cause Analysis", "API Debugging", "Log Analysis", "LLM Trace Analysis", "Cross-Platform Troubleshooting", "Error Pattern Recognition"] },
  { name: "Observability & Monitoring", items: ["Datadog", "LLM Observability Platforms", "Sentry", "Postman", "Feature Flag Management", "PagerDuty"] },
  { name: "AI & LLM Systems", items: ["LLM Evaluation", "Prompt Engineering", "Conversational AI", "NLP / Language Detection", "Knowledge Retrieval", "AI Agent Configuration"] },
  { name: "APIs & Integrations", items: ["REST APIs", "Messaging APIs", "CRM Integrations", "Data Export APIs", "Webhook Debugging", "OAuth Flows"] },
  { name: "Technical Communication", items: ["Technical Docs", "Escalation Framing", "KB Authoring", "Cross-Functional Collab", "Client Communication"] },
];

const tl = [
  { p: "2025 — Present", r: "AI Operations Specialist", o: "Enterprise Conversational AI Platform", d: "Deep technical investigation across an AI platform serving 60+ enterprise accounts. API debugging, LLM trace analysis, cross-platform handoff troubleshooting." },
  { p: "Previous", r: "Technical Support & CX", o: "Major E-Commerce & BPO Companies", d: "Foundation in customer experience, technical troubleshooting, and high-volume support at scale." },
];

export default function Portfolio() {
  const mob = useMedia("(max-width: 768px)");
  const tab = useMedia("(max-width: 1024px)");
  const [sec, setSec] = useState(0);
  const refs = useRef([]);
  const pad = mob ? "24px" : tab ? "48px" : "10%";

  useEffect(() => {
    const fn = () => { const y = window.scrollY + window.innerHeight * 0.35; refs.current.forEach((r, i) => { if (r && y >= r.offsetTop) setSec(i); }); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (i) => refs.current[i]?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: palette.bg, color: palette.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: `14px ${pad}`, background: "rgba(8,8,13,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: `1px solid ${palette.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>DJ<span style={{ color: palette.accent }}>.</span></span>
        {!mob && <nav style={{ display: "flex", gap: 24 }}>{SECTIONS.map((s, i) => (
          <button key={s} onClick={() => go(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: sec === i ? palette.accent : palette.textMut, transition: "color 0.2s" }}>{s}</button>
        ))}</nav>}
        <Btn href="https://www.linkedin.com/in/dayanajoseph" icon={<LI />}>{mob ? "" : "LinkedIn"}</Btn>
      </header>

      {/* HERO */}
      <section ref={(el) => (refs.current[0] = el)} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: `0 ${pad}`, paddingTop: 80 }}>
        <FadeIn><div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: palette.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18, fontWeight: 500 }}>AI Operations Specialist</div></FadeIn>
        <FadeIn delay={0.06}><h1 style={{ fontSize: mob ? 46 : tab ? 60 : 84, fontFamily: "'Source Serif 4', serif", fontWeight: 300, lineHeight: 1.06, margin: 0, letterSpacing: "-0.02em" }}>Dayana<br /><span style={{ color: palette.accent, fontWeight: 400 }}>Joseph</span></h1></FadeIn>
        <FadeIn delay={0.1}><p style={{ fontSize: mob ? 12 : 13, color: palette.textMut, fontFamily: "'IBM Plex Mono', monospace", marginTop: 12 }}>API & AI Agent Troubleshooting · LLM Evaluation · Prompt Engineering</p></FadeIn>
        <FadeIn delay={0.14}><p style={{ fontSize: mob ? 16 : 18, color: palette.textSec, maxWidth: 480, lineHeight: 1.7, marginTop: 22, fontWeight: 300 }}>I investigate complex AI platform issues that others can't solve. From LLM hallucinations to cross-platform handoff failures, I trace problems to their root cause.</p></FadeIn>
        <FadeIn delay={0.2}><div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <Btn primary onClick={() => go(3)}>View Case Studies</Btn>
          <Btn href="https://www.linkedin.com/in/dayanajoseph" icon={<LI />}>LinkedIn</Btn>
        </div></FadeIn>
      </section>

      {/* ABOUT */}
      <section ref={(el) => (refs.current[1] = el)} style={{ padding: `90px ${pad}` }}>
        <FadeIn><div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: palette.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>About</div>
        <h2 style={{ fontSize: mob ? 26 : 40, fontFamily: "'Source Serif 4', serif", fontWeight: 300, margin: "0 0 36px", lineHeight: 1.2, maxWidth: 600 }}>Turning complex AI issues into <em style={{ color: palette.accent }}>clear answers</em></h2></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 32 : 44, maxWidth: 920 }}>
          <FadeIn delay={0.06}><div>
            <p style={{ fontSize: 15, color: palette.textSec, lineHeight: 1.8, margin: 0, fontWeight: 300 }}>I'm an AI Operations Specialist focused on deep technical troubleshooting across enterprise conversational AI platforms. My work spans LLM reasoning engines, API integrations, CRM handoffs, and multilingual NLP systems.</p>
            <p style={{ fontSize: 15, color: palette.textSec, lineHeight: 1.8, marginTop: 16, fontWeight: 300 }}>I don't stop at symptoms. I trace every issue through observability logs, API responses, and LLM reasoning chains until I find the root cause, then document it for others.</p>
          </div></FadeIn>
          <FadeIn delay={0.1}><div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {tl.map((t) => (
              <div key={t.p} style={{ padding: "16px 20px", borderLeft: `2px solid ${palette.accent}`, background: palette.card, borderRadius: "0 12px 12px 0" }}>
                <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: palette.accent, letterSpacing: "0.08em", marginBottom: 4, fontWeight: 500 }}>{t.p}</div>
                <div style={{ fontSize: 16, color: palette.text, fontFamily: "'Source Serif 4', serif" }}>{t.r}</div>
                <div style={{ fontSize: 12, color: palette.textMut, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>{t.o}</div>
                <p style={{ fontSize: 13, color: palette.textSec, lineHeight: 1.6, margin: 0 }}>{t.d}</p>
              </div>
            ))}
            <div style={{ display: "flex", gap: 32, marginTop: 4 }}>
              {[["160+", "Tickets Resolved"], ["60+", "Enterprise Accounts"]].map(([n, l]) => (
                <div key={l}><div style={{ fontSize: 30, fontFamily: "'Source Serif 4', serif", color: palette.accent, fontWeight: 300 }}>{n}</div><div style={{ fontSize: 11, color: palette.textMut, fontFamily: "'IBM Plex Mono', monospace" }}>{l}</div></div>
              ))}
            </div>
          </div></FadeIn>
        </div>
      </section>

      {/* SKILLS */}
      <section ref={(el) => (refs.current[2] = el)} style={{ padding: `90px ${pad}` }}>
        <FadeIn><div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: palette.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>Skills & Tools</div>
        <h2 style={{ fontSize: mob ? 26 : 40, fontFamily: "'Source Serif 4', serif", fontWeight: 300, margin: "0 0 36px" }}>Technical toolkit</h2></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3, 1fr)", gap: 18, maxWidth: 960 }}>
          {skills.map((c, i) => (
            <FadeIn key={c.name} delay={i * 0.05}><div style={{ padding: "22px", background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 14 }}>
              <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: palette.accent, marginBottom: 12, fontWeight: 500 }}>{c.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{c.items.map((s) => <Pill key={s} label={s} />)}</div>
            </div></FadeIn>
          ))}
        </div>
      </section>

      {/* CASES */}
      <section ref={(el) => (refs.current[3] = el)} style={{ padding: `90px ${pad}` }}>
        <FadeIn><div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: palette.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>Case Studies</div>
        <h2 style={{ fontSize: mob ? 26 : 40, fontFamily: "'Source Serif 4', serif", fontWeight: 300, margin: "0 0 8px" }}>Investigation deep dives</h2>
        <p style={{ fontSize: 14, color: palette.textSec, maxWidth: 480, lineHeight: 1.7, marginBottom: 32, fontWeight: 300 }}>Real investigations from enterprise AI deployments, sanitized for confidentiality. Click to expand.</p></FadeIn>
        <div style={{ maxWidth: 700 }}>{cases.map((cs, i) => <FadeIn key={i} delay={i * 0.05}><CaseCard {...cs} num={i + 1} mob={mob} /></FadeIn>)}</div>
      </section>

      {/* CONTACT */}
      <section ref={(el) => (refs.current[4] = el)} style={{ padding: `90px ${pad} 50px` }}>
        <FadeIn><div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: palette.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>Contact</div>
        <h2 style={{ fontSize: mob ? 26 : 40, fontFamily: "'Source Serif 4', serif", fontWeight: 300, margin: "0 0 18px" }}>Let's <em style={{ color: palette.accent }}>connect</em></h2>
        <p style={{ fontSize: 14, color: palette.textSec, maxWidth: 440, lineHeight: 1.7, marginBottom: 28, fontWeight: 300 }}>Open to conversations about AI operations, LLM troubleshooting, prompt engineering, and opportunities in AI/CX.</p></FadeIn>
        <FadeIn delay={0.06}><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Btn href="https://www.linkedin.com/in/dayanajoseph" icon={<LI />}>LinkedIn</Btn>
          <Btn href="mailto:dayanajosephofficial@gmail.com" icon={<span>✉</span>}>Email</Btn>
        </div></FadeIn>
        <div style={{ marginTop: 70, paddingTop: 20, borderTop: `1px solid ${palette.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 11, color: palette.textMut, fontFamily: "'IBM Plex Mono', monospace" }}>© 2026 Dayana Joseph</span>
          <span style={{ fontSize: 11, color: palette.textMut, fontFamily: "'IBM Plex Mono', monospace" }}>Toronto, Canada</span>
        </div>
      </section>
    </div>
  );
}
