"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck, FileText, Mail, Zap, Lightbulb, ArrowRight } from "lucide-react";
import { useInspector } from "./InspectorContext";
import { useStore } from "./StoreContext";

/* ─────────────────────────────────────────────────────────────
   Mock PDF Document Preview
   ───────────────────────────────────────────────────────────── */

function PDFPreview() {
    const rows = [
        { test: "Glucose, Fasting", value: "126", range: "70–100 mg/dL", flag: "H" },
        { test: "BUN", value: "18", range: "7–20 mg/dL", flag: "" },
        { test: "Creatinine", value: "1.0", range: "0.7–1.3 mg/dL", flag: "" },
        { test: "eGFR", value: "78", range: ">60 mL/min", flag: "" },
        { test: "HbA1c", value: "8.2%", range: "<7.0%", flag: "H", highlight: true },
        { test: "Sodium", value: "140", range: "136–145 mEq/L", flag: "" },
        { test: "Potassium", value: "4.2", range: "3.5–5.0 mEq/L", flag: "" },
        { test: "Calcium", value: "9.5", range: "8.5–10.5 mg/dL", flag: "" },
        { test: "Total Protein", value: "7.0", range: "6.0–8.3 g/dL", flag: "" },
        { test: "Albumin", value: "4.1", range: "3.5–5.5 g/dL", flag: "" },
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
                                <span className="highlight-glow">{row.test}</span>
                            ) : (
                                row.test
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
                            <span style={{ fontSize: "11px", color: "var(--color-muted)", marginLeft: "8px" }}>Mar 5, 2026 9:14 AM</span>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "40px", fontSize: "13.5px", lineHeight: 1.7, color: "var(--color-foreground)" }}>
                        <p>Hi Dr. Chen,</p>
                        <p style={{ marginTop: "8px" }}>
                            I wanted to reach out about some concerns. Over the past two weeks, <span className="highlight-glow" style={{ fontWeight: 500 }}>I have been experiencing persistent blurred vision</span>, particularly in the mornings and after meals. It usually lasts about 30–45 minutes before clearing up.
                        </p>
                        <p style={{ marginTop: "8px" }}>
                            I&apos;ve also noticed increased thirst and more frequent urination, especially at night. I&apos;m not sure if these are related to my current medications.
                        </p>
                        <p style={{ marginTop: "8px" }}>
                            Should I schedule an earlier appointment, or is this something we can address at my next visit?
                        </p>
                        <p style={{ marginTop: "12px" }}>Best regards,<br />{state.patientProfile.name.split(" ")[0]}</p>
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
                            <span style={{ fontSize: "11px", color: "var(--color-muted)", marginLeft: "8px" }}>Mar 5, 2026 11:32 AM</span>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "40px", fontSize: "13.5px", lineHeight: 1.7, color: "var(--color-foreground)" }}>
                        <p>{state.patientProfile.name.split(" ")[0]},</p>
                        <p style={{ marginTop: "8px" }}>
                            Thank you for letting me know. The blurred vision and increased thirst are important symptoms that we should investigate promptly. I&apos;m going to order a comprehensive metabolic panel and HbA1c test.
                        </p>
                        <p style={{ marginTop: "8px" }}>
                            Please try to schedule your lab work within the next 48 hours if possible.
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
                title: "HbA1c Flagged",
                description: "Value 8.2% exceeds ADA target of <7.0%. This represents a 0.6% increase from the previous reading of 7.6% taken 3 months ago.",
                severity: "high" as const,
            },
            {
                title: "Fasting Glucose Elevated",
                description: "Fasting glucose of 126 mg/dL confirms hyperglycemia and correlates with the upward HbA1c trend.",
                severity: "medium" as const,
            },
            {
                title: "Renal Function Stable",
                description: "eGFR of 78 remains above threshold for SGLT2 inhibitor candidacy, which may be considered for glycemic management.",
                severity: "low" as const,
            },
        ]
        : [
            {
                title: "Symptom Detected",
                description: "\"Blurred vision\" is a known clinical sign of hyperglycemia. WellRead cross-referenced this against the patient's lab results.",
                severity: "high" as const,
            },
            {
                title: "Temporal Correlation",
                description: "Symptoms reported as occurring \"after meals\" strongly suggests post-prandial glucose spikes, consistent with 120/160 mg/dL readings.",
                severity: "medium" as const,
            },
            {
                title: "Additional Symptoms",
                description: "Polydipsia (increased thirst) and polyuria (frequent urination) are supporting indicators of suboptimal glucose control.",
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
                        ? "This lab result was cross-referenced with a Gmail thread where the patient reported blurred vision — a known symptom of elevated HbA1c."
                        : "This email was cross-referenced with lab results showing HbA1c at 8.2%, confirming the clinical significance of the reported symptoms."
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
