"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck, FileText, Mail, Zap, Lightbulb, ArrowRight } from "lucide-react";
import { useInspector } from "./InspectorContext";
import { useStore } from "./StoreContext";

/* ─────────────────────────────────────────────────────────────
   Medical Term Tooltip
   ───────────────────────────────────────────────────────────── */
function CustomTooltip({ children, content }: { children: React.ReactNode, content: string }) {
    if (!content) return <>{children}</>;
    return (
        <span className="group" style={{ position: "relative", cursor: "help", borderBottom: "1px dashed #8A8F98" }}>
            {children}
            <span
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "0",
                    marginBottom: "8px",
                    background: "#1B1B1B",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    lineHeight: 1.4,
                    whiteSpace: "normal",
                    width: "max-content",
                    maxWidth: "220px",
                    pointerEvents: "none",
                    zIndex: 100,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    fontWeight: 400
                }}
            >
                {content}
                <svg width="10" height="5" viewBox="0 0 10 5" style={{ position: "absolute", top: "100%", left: "12px" }}>
                    <polygon points="0,0 10,0 5,5" fill="#1B1B1B" />
                </svg>
            </span>
        </span>
    );
}

/* ─────────────────────────────────────────────────────────────
   Mock PDF Document Preview
   ───────────────────────────────────────────────────────────── */

function PDFPreview() {
    const rows = [
        { test: "Glucose, Fasting", value: "142", range: "70–100 mg/dL", flag: "H", desc: "Blood sugar level after fasting for at least 8 hours." },
        { test: "BUN", value: "22", range: "7–20 mg/dL", flag: "H", desc: "Blood Urea Nitrogen, a measure of kidney function." },
        { test: "Creatinine", value: "1.2", range: "0.7–1.3 mg/dL", flag: "", desc: "A waste product from muscle metabolism, used to check kidney function." },
        { test: "eGFR", value: "65", range: ">60 mL/min", flag: "", desc: "Estimated Glomerular Filtration Rate. Measures how well your kidneys are filtering blood." },
        { test: "HbA1c", value: "8.6%", range: "<7.0%", flag: "H", highlight: true, desc: "A 3-month average of blood sugar levels. Higher levels mean poor glucose control." },
        { test: "Sodium", value: "140", range: "136–145 mEq/L", flag: "", desc: "An electrolyte that helps maintain fluid balance and nerve function." },
        { test: "Potassium", value: "4.5", range: "3.5–5.0 mEq/L", flag: "", desc: "An electrolyte essential for heart and muscle function." },
        { test: "Calcium", value: "9.2", range: "8.5–10.5 mg/dL", flag: "", desc: "Important for bone health, muscle contractions, and nerve signaling." },
        { test: "LDL Cholesterol", value: "155", range: "<100 mg/dL", flag: "H", desc: "Low-Density Lipoprotein, often called 'bad' cholesterol." },
        { test: "Albumin", value: "4.2", range: "3.5–5.5 g/dL", flag: "", desc: "A protein made by the liver that keeps fluid from leaking out of blood vessels." },
    ];

    return (
        <div
            style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
            }}
        >
            {/* PDF header bar */}
            <div
                style={{
                    padding: "20px 24px 16px",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} strokeWidth={1.5} style={{ color: "#EB5757" }} />
                    <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-muted)" }}>
                        Laboratory Report
                    </span>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-foreground)" }}>
                    Complete Metabolic Panel
                </p>
                <p style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "2px" }}>
                    Collected: Mar 3, 2026 · Reported: Mar 3, 2026 · Ordering: Dr. M. Chen
                </p>
            </div>

            {/* Table */}
            <div style={{ padding: "0" }}>
                {/* Header row */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: "1fr 100px 140px 50px",
                        padding: "10px 24px",
                        borderBottom: "1px solid var(--color-border)",
                        background: "var(--color-surface-secondary)",
                        fontSize: "10px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--color-muted)",
                    }}
                >
                    <span>Test</span>
                    <span>Result</span>
                    <span>Reference</span>
                    <span>Flag</span>
                </div>

                {/* Data rows */}
                {rows.map((row, i) => (
                    <div
                        key={i}
                        className={`grid ${row.highlight ? "pdf-row-highlight" : ""}`}
                        style={{
                            gridTemplateColumns: "1fr 100px 140px 50px",
                            padding: row.highlight ? "10px 24px 10px 21px" : "10px 24px",
                            borderBottom: i < rows.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
                            alignItems: "center",
                            transition: "background 0.15s ease",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: row.highlight ? 600 : 400,
                                color: "var(--color-foreground)",
                            }}
                        >
                            {row.highlight ? (
                                <CustomTooltip content={row.desc}><span className="highlight-glow">{row.test}</span></CustomTooltip>
                            ) : (
                                <CustomTooltip content={row.desc}>{row.test}</CustomTooltip>
                            )}
                        </span>
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: row.highlight ? 700 : 500,
                                color: row.flag === "H" ? "#EB5757" : "var(--color-foreground)",
                            }}
                        >
                            {row.highlight ? (
                                <span className="highlight-glow">{row.value}</span>
                            ) : (
                                row.value
                            )}
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>
                            {row.range}
                        </span>
                        <span
                            style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: row.flag === "H" ? "#EB5757" : "var(--color-muted)",
                            }}
                        >
                            {row.flag}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Mock Gmail Thread Preview
   ───────────────────────────────────────────────────────────── */

function GmailPreview() {
    const { state } = useStore();
    return (
        <div
            style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
            }}
        >
            {/* Email header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)" }}>
                <div className="flex items-center gap-2 mb-1">
                    <Mail size={14} strokeWidth={1.5} style={{ color: "#5E6AD2" }} />
                    <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-muted)" }}>
                        Gmail Thread
                    </span>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-foreground)" }}>
                    Re: Follow-up on recent symptoms
                </p>
                <p style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "2px" }}>
                    {state.patientProfile.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com → dr.chen@wellreadmed.com
                </p>
            </div>

            {/* Thread messages */}
            <div style={{ padding: "20px 24px" }}>
                {/* Message 1 — from patient */}
                <div style={{ marginBottom: "20px" }}>
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "var(--color-primary-soft)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "var(--color-primary)",
                            }}
                        >
                            {state.patientProfile.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", fontWeight: 500 }}>{state.patientProfile.name}</span>
                            <span style={{ fontSize: "11px", color: "var(--color-muted)", marginLeft: "8px" }}>Mar 6, 2026 8:45 AM</span>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "40px", fontSize: "13.5px", lineHeight: 1.7, color: "var(--color-foreground)" }}>
                        <p>Hi Dr. Chen,</p>
                        <p style={{ marginTop: "8px" }}>
                            I wanted to reach out about some new symptoms. Recently, <span className="highlight-glow" style={{ fontWeight: 500 }}>I've noticed recent numbness and tingling in my toes</span>, along with blurry vision that comes and goes throughout the day.
                        </p>
                        <p style={{ marginTop: "8px" }}>
                            It's been consistently bothering me, particularly at night, and I'm a bit worried since my last tests weren't great.
                        </p>
                        <p style={{ marginTop: "8px" }}>
                            Should I come in sooner than my scheduled appointment next week?
                        </p>
                        <p style={{ marginTop: "12px" }}>Thanks,<br />{state.patientProfile.name.split(" ")[0]}</p>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "var(--color-border-subtle)", margin: "16px 0" }} />

                {/* Message 2 — from doctor */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "var(--color-success-soft)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "var(--color-success)",
                            }}
                        >
                            MC
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", fontWeight: 500 }}>Dr. M. Chen</span>
                            <span style={{ fontSize: "11px", color: "var(--color-muted)", marginLeft: "8px" }}>Mar 6, 2026 10:12 AM</span>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "40px", fontSize: "13.5px", lineHeight: 1.7, color: "var(--color-foreground)" }}>
                        <p>{state.patientProfile.name.split(" ")[0]},</p>
                        <p style={{ marginTop: "8px" }}>
                            Thank you for letting me know. The tingling in your toes and blurry vision are important symptoms that we should investigate promptly, especially alongside your recent high HbA1c spike.
                        </p>
                        <p style={{ marginTop: "8px" }}>
                            I am moving your appointment up, and my team will call you to confirm. We will perform a comprehensive foot examination and adjust your care plan.
                        </p>
                        <p style={{ marginTop: "12px" }}>Best,<br />Dr. Chen</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Insight Sidebar (inside the modal)
   ───────────────────────────────────────────────────────────── */

function InsightSidebar({ type }: { type: "pdf" | "gmail" | "calendar" }) {
    const insights = type === "pdf"
        ? [
            {
                title: "HbA1c Critical Spike",
                description: "Value 8.6% represents a significant worsening of glycemic control, an abrupt increase flagging potential onset of microvascular complications.",
                severity: "high" as const,
            },
            {
                title: "Fasting Glucose Elevated",
                description: "Fasting glucose of 142 mg/dL confirms prolonged hyperglycemia state.",
                severity: "medium" as const,
            },
            {
                title: "LDL Out of Range",
                description: "LDL at 155 mg/dL indicates elevated cardiovascular risk, particularly in presence of uncontrolled diabetes.",
                severity: "high" as const,
            },
        ]
        : [
            {
                title: "Neuropathy Indicator",
                description: "Bilateral tingling in toes is a classic presentation of diabetic peripheral neuropathy.",
                severity: "high" as const,
            },
            {
                title: "Retinopathy Risk",
                description: "Reported blurry vision alongside HbA1c spike warrants immediate assessment for diabetic retinopathy.",
                severity: "high" as const,
            },
            {
                title: "Immediate Action Required",
                description: "The rapid onset of these tandem symptoms flags this patient for immediate intervention prior to scheduled visit.",
                severity: "medium" as const,
            },
        ];

    const severityColor = {
        high: "#EB5757",
        medium: "#F2994A",
        low: "#4CB782",
    };

    return (
        <div className="insight-panel" style={{ padding: "20px" }}>
            <div className="flex items-center gap-1.5 mb-4">
                <Lightbulb size={14} strokeWidth={2} style={{ color: "var(--color-primary)" }} />
                <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-foreground)" }}>
                    AI Insights
                </h3>
            </div>

            <div className="flex flex-col gap-3">
                {insights.map((insight, i) => (
                    <div
                        key={i}
                        style={{
                            padding: "14px",
                            borderRadius: "10px",
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1.5">
                            <div
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: severityColor[insight.severity],
                                    flexShrink: 0,
                                }}
                            />
                            <span
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "var(--color-foreground)",
                                }}
                            >
                                {insight.title}
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: "12px",
                                lineHeight: 1.6,
                                color: "var(--color-muted-foreground)",
                                paddingLeft: "14px",
                            }}
                        >
                            {insight.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Connection hint */}
            <div
                style={{
                    marginTop: "16px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "var(--color-primary-soft)",
                    border: "1px solid rgba(94, 106, 210, 0.10)",
                }}
            >
                <div className="flex items-center gap-1.5 mb-1">
                    <Zap size={11} strokeWidth={2} style={{ color: "var(--color-primary)" }} />
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-primary)" }}>
                        Correlation
                    </span>
                </div>
                <p style={{ fontSize: "11px", lineHeight: 1.55, color: "var(--color-muted-foreground)" }}>
                    {type === "pdf"
                        ? "This lab result was cross-referenced with a Gmail thread where the patient reported numbness in toes — a known complication of sustained elevated HbA1c."
                        : "This email was cross-referenced with recent lab results showing HbA1c spiking to 8.6%, confirming the clinical significance of the neuropathic symptoms."
                    }
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   SourceInspector — Main Slide-over Component
   ───────────────────────────────────────────────────────────── */

export default function SourceInspector() {
    const { isOpen, source, closeInspector } = useInspector();
    const [closing, setClosing] = useState(false);

    // Handle escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) handleClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    });

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setClosing(false);
            closeInspector();
        }, 250);
    };

    if (!isOpen && !closing) return null;

    const type = source?.type ?? "pdf";

    return (
        <>
            {/* Overlay */}
            <div
                className={`inspector-overlay ${closing ? "closing" : ""}`}
                onClick={handleClose}
            />

            {/* Sheet */}
            <div
                id="source-inspector"
                className={`inspector-sheet ${closing ? "closing" : ""}`}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between"
                    style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid var(--color-border)",
                        flexShrink: 0,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: type === "gmail" ? "var(--color-primary-soft)" : "var(--color-danger-soft)",
                            }}
                        >
                            {type === "gmail" ? (
                                <Mail size={16} strokeWidth={1.5} style={{ color: "var(--color-primary)" }} />
                            ) : (
                                <FileText size={16} strokeWidth={1.5} style={{ color: "var(--color-danger)" }} />
                            )}
                        </div>
                        <div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-foreground)" }}>
                                {source?.fileName ?? "Document"}
                            </p>
                            <p style={{ fontSize: "11px", color: "var(--color-muted)" }}>
                                {type === "gmail" ? "Gmail Thread · 3 messages" : "Lab Report PDF · 2.4 MB"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Verified badge */}
                        <span
                            className="flex items-center gap-1"
                            style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                color: "var(--color-success)",
                                background: "var(--color-success-soft)",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                letterSpacing: "0.02em",
                            }}
                        >
                            <ShieldCheck size={11} strokeWidth={2.5} />
                            Verified by WellRead
                        </span>

                        {/* Close button */}
                        <button
                            id="close-inspector"
                            onClick={handleClose}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: "1px solid var(--color-border)",
                                background: "var(--color-surface)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "var(--color-muted)",
                                transition: "all 0.15s ease",
                            }}
                            aria-label="Close inspector"
                        >
                            <X size={16} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Body — Document Preview + Insight Sidebar */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Document Viewer */}
                    <div
                        className="flex-1 overflow-y-auto"
                        style={{ padding: "24px" }}
                    >
                        {type === "gmail" ? <GmailPreview /> : <PDFPreview />}

                        {/* Bottom action */}
                        <div className="flex items-center gap-2 mt-4">
                            <button
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "var(--color-primary)",
                                    background: "var(--color-primary-soft)",
                                    padding: "8px 14px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                View Original
                                <ArrowRight size={12} strokeWidth={2} />
                            </button>
                            <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>
                                Source verified · Last synced 2h ago
                            </span>
                        </div>
                    </div>

                    {/* Insight Sidebar */}
                    <InsightSidebar type={type} />
                </div>
            </div>
        </>
    );
}
