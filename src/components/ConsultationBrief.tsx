"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
    TrendingUp,
    Check,
    FileOutput,
    Plus,
    ChevronRight,
    Monitor,
} from "lucide-react";
import { useConsultation } from "./ConsultationContext";
import { useStore } from "./StoreContext";
import { usePhysicianReport, ProcessingOverlay, ReportModal } from "./PhysicianReport";

/* ── Medical Cross Icon ── */

function MedicalCross({ size = 12, color = "#5170FF" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <rect x="5.5" y="1" width="5" height="14" rx="1.5" fill={color} />
            <rect x="1" y="5.5" width="14" height="5" rx="1.5" fill={color} />
        </svg>
    );
}

/* ── Divider ── */

function Divider() {
    return (
        <div
            style={{
                height: "1px",
                background: "var(--color-border)",
                margin: "16px 0",
            }}
        />
    );
}

/* ── Toggle Question ── */

function ToggleQuestion({ text, checked, onToggle }: { text: string; checked: boolean; onToggle: () => void }) {
    return (
        <div className="toggle-item" onClick={onToggle} role="button" tabIndex={0}>
            <div className={`toggle-check ${checked ? "checked" : ""}`}>
                {checked && <Check size={11} strokeWidth={3} color="white" />}
            </div>
            <span
                className="text-foreground"
                style={{
                    fontSize: "12.5px",
                    lineHeight: 1.5,
                    opacity: checked ? 0.4 : 1,
                    textDecoration: checked ? "line-through" : "none",
                    transition: "all 0.15s ease",
                }}
            >
                {text}
            </span>
        </div>
    );
}

/* ── ConsultationBrief Component ── */

export default function ConsultationBrief() {
    const { isConsultationMode, toggleConsultationMode } = useConsultation();
    const { state } = useStore();

    const observations = state.consultation?.observations?.map(obs => obs.text) || [];
    const questions = state.consultation?.questions || [];

    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
    const toggleItem = (i: number) => setCheckedItems((p) => ({ ...p, [i]: !p[i] }));
    const report = usePhysicianReport();

    return (
        <section
            id="consultation-brief"
            style={{
                opacity: state.showBrief ? 1 : 0.05,
                pointerEvents: state.showBrief ? "auto" : "none",
                transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: state.showBrief ? "none" : "blur(2px)",
            }}
        >
            {/* Panel header */}
            <div
                className="flex items-center justify-between"
                style={{ padding: "0 4px", marginBottom: "16px" }}
            >
                <h2
                    style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--color-foreground)",
                        letterSpacing: "-0.01em",
                    }}
                >
                    Consultation Brief
                </h2>
                <span
                    style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "var(--color-primary)",
                        background: "var(--color-primary-soft)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                    }}
                >
                    Draft
                </span>
            </div>

            {/* Consultation Mode Toggle */}
            <div
                className="flex items-center justify-between"
                style={{
                    padding: "12px 16px",
                    marginBottom: "12px",
                    borderRadius: "12px",
                    background: isConsultationMode ? "var(--color-primary-soft)" : "var(--color-surface-secondary)",
                    border: `1px solid ${isConsultationMode ? "rgba(81, 112, 255, 0.15)" : "var(--color-border-subtle)"}`,
                    transition: "all 0.25s ease",
                }}
            >
                <div className="flex items-center gap-2">
                    <Monitor size={14} strokeWidth={1.5} style={{ color: isConsultationMode ? "var(--color-primary)" : "var(--color-muted)" }} />
                    <div>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-foreground)" }}>
                            Consultation Mode
                        </p>
                        <p style={{ fontSize: "10px", color: "var(--color-muted)" }}>
                            Full-screen physician view
                        </p>
                    </div>
                </div>
                <button
                    id="toggle-consultation"
                    onClick={toggleConsultationMode}
                    aria-label="Toggle Consultation Mode"
                    style={{
                        position: "relative",
                        width: "44px",
                        height: "24px",
                        borderRadius: "12px",
                        background: isConsultationMode ? "#5170FF" : "#E6E6E6",
                        cursor: "pointer",
                        transition: "background 0.25s ease",
                        border: "none",
                        flexShrink: 0,
                        padding: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "2px",
                            left: "2px",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "#FFFFFF",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
                            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: isConsultationMode ? "translateX(20px)" : "translateX(0)",
                        }}
                    />
                </button>
            </div>

            {/* Paper card */}
            <div className="paper-card" style={{ padding: "20px" }}>
                {/* Header */}
                <div style={{ marginBottom: "4px" }}>
                    <h3
                        style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            letterSpacing: "-0.02em",
                            color: "#1E3A5F",
                        }}
                    >
                        Physician Consultation
                    </h3>
                    <p className="text-muted" style={{ fontSize: "12px", marginTop: "2px" }}>
                        {state.patientProfile.name} · {state.patientProfile.dob}
                    </p>
                </div>

                <Divider />

                {/* Trajectory */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                background: "var(--color-success-soft)",
                            }}
                        >
                            <TrendingUp size={12} strokeWidth={2} style={{ color: "var(--color-success)" }} />
                        </div>
                        <h4
                            style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                color: "#1E3A5F",
                            }}
                        >
                            Trajectory
                        </h4>
                    </div>
                    <p
                        className="text-foreground"
                        style={{ fontSize: "13px", lineHeight: 1.65, paddingLeft: "36px" }}
                    >
                        {state.consultation?.trajectory}
                    </p>
                </div>

                <Divider />

                {/* Critical Observations */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                background: "var(--color-danger-soft)",
                            }}
                        >
                            <Plus size={12} strokeWidth={2.5} style={{ color: "var(--color-danger)" }} />
                        </div>
                        <h4
                            style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                color: "#1E3A5F",
                            }}
                        >
                            Critical Observations
                        </h4>
                    </div>

                    <div className="flex flex-col gap-2.5" style={{ paddingLeft: "4px" }}>
                        {observations.map((obs, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <div style={{ marginTop: "5px" }}>
                                    <MedicalCross size={10} color={i === 0 ? "#EB5757" : "#C4C4C4"} />
                                </div>
                                <p className="text-foreground" style={{ fontSize: "12.5px", lineHeight: 1.6 }}>
                                    {obs}
                                </p>
                            </div>
                        ))}

                        {/* Dynamic Health Gaps */}
                        {state.healthGaps && state.healthGaps.map((gap, i) => (
                            <div key={`gap-${i}`} className="flex items-start gap-2.5 mt-2 p-3 rounded-lg" style={{ background: "var(--color-danger-soft)", border: "1px solid rgba(235, 87, 87, 0.2)" }}>
                                <div style={{ marginTop: "2px" }}>
                                    <Plus size={14} strokeWidth={2.5} style={{ color: "var(--color-danger)" }} />
                                </div>
                                <p style={{ fontSize: "12px", lineHeight: 1.5, color: "var(--color-danger)", fontWeight: 500 }}>
                                    <span style={{ fontWeight: 700 }}>AI FLAG:</span> {gap}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <Divider />

                {/* Recommended Questions */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "6px",
                                    background: "var(--color-primary-soft)",
                                }}
                            >
                                <ChevronRight size={12} strokeWidth={2.5} style={{ color: "var(--color-primary)" }} />
                            </div>
                            <h4
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                    color: "#1E3A5F",
                                }}
                            >
                                Questions
                            </h4>
                        </div>
                        <span className="text-muted" style={{ fontSize: "11px" }}>
                            {Object.values(checkedItems).filter(Boolean).length}/{questions.length}
                        </span>
                    </div>

                    <div className="flex flex-col" style={{ marginLeft: "-12px", marginRight: "-12px" }}>
                        {questions.map((q, i) => (
                            <ToggleQuestion key={i} text={q} checked={!!checkedItems[i]} onToggle={() => toggleItem(i)} />
                        ))}
                    </div>
                </div>

                <Divider />

                {/* Generate Report Button */}
                <button
                    id="generate-report-btn"
                    onClick={report.generate}
                    className="btn-gloss w-full flex items-center justify-center gap-2"
                    style={{
                        background: "linear-gradient(135deg, #5170FF 0%, #818CF8 100%)",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        cursor: "pointer",
                        border: "none",
                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(81, 112, 255, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <FileOutput size={16} strokeWidth={1.5} />
                    Generate Physician Report
                </button>

                <p className="text-muted text-center mt-2" style={{ fontSize: "10px" }}>
                    Export as PDF · HIPAA-compliant formatting
                </p>
            </div>

            {/* Report Processing + Modal — portaled to body to escape parent transforms */}
            {typeof document !== "undefined" && report.phase === "processing" && createPortal(
                <ProcessingOverlay progress={report.progress} label={report.label} />,
                document.body
            )}
            {typeof document !== "undefined" && report.phase === "ready" && createPortal(
                <ReportModal onClose={report.close} />,
                document.body
            )}
        </section>
    );
}
