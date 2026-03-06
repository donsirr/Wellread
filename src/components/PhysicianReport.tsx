"use client";

import { useState, useEffect, useRef } from "react";
import {
    X,
    FileOutput,
    Download,
    Send,
    ShieldCheck,
    Printer,
    QrCode,
} from "lucide-react";
import { useStore } from "./StoreContext";

/* ── Processing Overlay ── */

function ProcessingOverlay({ progress, label }: { progress: number; label: string }) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "48px 56px",
                    textAlign: "center",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
                    maxWidth: "380px",
                    width: "100%",
                }}
            >
                {/* Animated icon */}
                <div
                    style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #5E6AD2, #818CF8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        animation: "pulse-icon 1.5s ease-in-out infinite",
                    }}
                >
                    <FileOutput size={24} strokeWidth={1.5} color="white" />
                </div>

                <p style={{ fontSize: "15px", fontWeight: 600, color: "#1B1B1B", marginBottom: "4px" }}>
                    {label}
                </p>
                <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>
                    Formatting S.O.A.P. clinical structure
                </p>

                {/* Progress bar */}
                <div
                    style={{
                        width: "100%",
                        height: "4px",
                        borderRadius: "2px",
                        background: "#F0F0F0",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: "100%",
                            borderRadius: "2px",
                            background: "linear-gradient(90deg, #5E6AD2, #818CF8)",
                            transition: "width 0.3s ease-out",
                        }}
                    />
                </div>
                <p style={{ fontSize: "11px", color: "#C4C4C4", marginTop: "10px" }}>
                    {progress}% complete
                </p>
            </div>

            <style>{`
                @keyframes pulse-icon {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(94, 106, 210, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 20px 6px rgba(94, 106, 210, 0.15); }
                }
            `}</style>
        </div>
    );
}

/* ── QR Code (decorative SVG) ── */

function MockQRCode() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div
                style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "6px",
                    border: "1px solid #E0E0E0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FAFAFA",
                }}
            >
                <QrCode size={28} strokeWidth={1} color="#C4C4C4" />
            </div>
            <span style={{ fontSize: "8px", color: "#C4C4C4", textAlign: "center" }}>
                Scan to view<br />Evidence Feed
            </span>
        </div>
    );
}

/* ── S.O.A.P. Section ── */

function SOAPSection({
    label,
    letterColor,
    children,
}: {
    label: string;
    letterColor: string;
    children: React.ReactNode;
}) {
    const letter = label[0];
    return (
        <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div
                    style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: letterColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "white",
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                        flexShrink: 0,
                    }}
                >
                    {letter}
                </div>
                <h4
                    style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#1E3A5F",
                    }}
                >
                    {label}
                </h4>
            </div>
            <div style={{ paddingLeft: "38px", fontSize: "13px", lineHeight: 1.7, color: "#333" }}>
                {children}
            </div>
        </div>
    );
}

/* ── Report Modal ── */

function ReportModal({ onClose }: { onClose: () => void }) {
    const { state } = useStore();
    const [closing, setClosing] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 300);
    };

    const handlePrint = () => {
        window.print();
    };

    // Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    });

    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            {/* Overlay */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9998,
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(6px)",
                    opacity: closing ? 0 : 1,
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Sheet */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: closing
                        ? "translate(-50%, -50%) scale(0.95)"
                        : "translate(-50%, -50%) scale(1)",
                    zIndex: 9999,
                    width: "680px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: "white",
                    borderRadius: "20px",
                    boxShadow: "0 32px 100px rgba(0,0,0,0.3)",
                    opacity: closing ? 0 : 1,
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    animation: "report-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
            >
                {/* Top bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 24px",
                        borderBottom: "1px solid #F0F0F0",
                        position: "sticky",
                        top: 0,
                        background: "white",
                        borderRadius: "20px 20px 0 0",
                        zIndex: 2,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileOutput size={16} strokeWidth={1.5} color="#5E6AD2" />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1B1B1B" }}>
                            Physician Report
                        </span>
                        <span
                            style={{
                                fontSize: "10px",
                                fontWeight: 500,
                                color: "#4CB782",
                                background: "rgba(76, 183, 130, 0.08)",
                                padding: "2px 8px",
                                borderRadius: "4px",
                            }}
                        >
                            Ready
                        </span>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            border: "1px solid #F0F0F0",
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#999",
                            transition: "all 0.15s ease",
                        }}
                    >
                        <X size={14} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Printable Content */}
                <div ref={printRef} style={{ padding: "32px 40px" }} id="physician-report-content">
                    {/* Document Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                        <div>
                            <h2
                                style={{
                                    fontSize: "22px",
                                    fontWeight: 700,
                                    color: "#1E3A5F",
                                    fontFamily: "'Georgia', 'Times New Roman', serif",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                WellRead Clinical Summary
                            </h2>
                            <p style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                                AI-Synthesized S.O.A.P. Note · Confidential
                            </p>
                        </div>
                        <MockQRCode />
                    </div>

                    {/* Patient Info Bar */}
                    <div
                        style={{
                            display: "flex",
                            gap: "24px",
                            padding: "14px 20px",
                            borderRadius: "12px",
                            background: "#F8F9FC",
                            border: "1px solid #EDEDF0",
                            marginBottom: "28px",
                            fontSize: "12px",
                        }}
                    >
                        <div>
                            <span style={{ color: "#999", fontWeight: 500 }}>Patient</span>
                            <p style={{ fontWeight: 600, color: "#1B1B1B", marginTop: "2px" }}>
                                {state.patientProfile.name}
                            </p>
                        </div>
                        <div style={{ width: "1px", background: "#EDEDF0" }} />
                        <div>
                            <span style={{ color: "#999", fontWeight: 500 }}>DOB</span>
                            <p style={{ fontWeight: 600, color: "#1B1B1B", marginTop: "2px" }}>
                                {state.patientProfile.dob}
                            </p>
                        </div>
                        <div style={{ width: "1px", background: "#EDEDF0" }} />
                        <div>
                            <span style={{ color: "#999", fontWeight: 500 }}>Report Date</span>
                            <p style={{ fontWeight: 600, color: "#1B1B1B", marginTop: "2px" }}>
                                {today}
                            </p>
                        </div>
                        <div style={{ width: "1px", background: "#EDEDF0" }} />
                        <div>
                            <span style={{ color: "#999", fontWeight: 500 }}>Conditions</span>
                            <p style={{ fontWeight: 600, color: "#1B1B1B", marginTop: "2px" }}>
                                {state.patientProfile.conditions?.join(", ")}
                            </p>
                        </div>
                    </div>

                    {/* Separator */}
                    <div style={{ height: "1px", background: "#EDEDF0", margin: "0 0 28px" }} />

                    {/* S.O.A.P. Sections */}
                    <SOAPSection label="Subjective" letterColor="#5E6AD2">
                        <p>
                            Patient reports persistent blurred vision and foot tingling,
                            specifically bilateral numbness and tingling in the toes. Symptoms
                            worsen at night and have been consistently bothering the patient.
                            Patient expresses concern regarding recent lab results.
                        </p>
                        <p style={{ marginTop: "8px", fontSize: "11px", color: "#999", fontStyle: "italic" }}>
                            Source: Gmail thread · Juan Dela Cruz → Dr. Chen · Mar 6, 2026
                        </p>
                    </SOAPSection>

                    <SOAPSection label="Objective" letterColor="#4CB782">
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {[
                                { label: "HbA1c", value: state.clinicalMetrics.find(m => m.id === "metric-hba1c")?.value || "8.6", unit: "%", flag: "H" },
                                { label: "Blood Pressure", value: state.clinicalMetrics.find(m => m.id === "metric-bp")?.value || "135/85", unit: "mmHg", flag: null },
                            ].map((lab, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        background: lab.flag ? "rgba(235, 87, 87, 0.04)" : "#F8F9FC",
                                        border: lab.flag ? "1px solid rgba(235, 87, 87, 0.1)" : "1px solid #EDEDF0",
                                    }}
                                >
                                    <span style={{ fontWeight: 500, color: "#555" }}>{lab.label}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ fontWeight: 700, color: lab.flag ? "#EB5757" : "#1B1B1B" }}>
                                            {lab.value} {lab.unit}
                                        </span>
                                        {lab.flag && (
                                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#EB5757", background: "rgba(235,87,87,0.08)", padding: "2px 6px", borderRadius: "4px" }}>
                                                {lab.flag}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: "8px", fontSize: "11px", color: "#999", fontStyle: "italic" }}>
                            Source: Lab Report PDF (Metabolic Panel) · Mar 4, 2026
                        </p>
                    </SOAPSection>

                    <SOAPSection label="Assessment" letterColor="#F2994A">
                        <p>
                            Symptomatic neuropathy and vision changes correlate with poorly controlled
                            glycemic markers. HbA1c spike from 7.9% to 8.6% over 6 months indicates
                            sub-optimal glycemic control with emerging microvascular complications.
                            Endocrinologist confirms persistent neuropathy in lower extremities and
                            recommends glycemic volatility screening.
                        </p>
                        <p style={{ marginTop: "8px", fontSize: "11px", color: "#999", fontStyle: "italic" }}>
                            AI Confidence: {state.narrative.confidence}% · Cross-referenced 2 sources · 14 data points
                        </p>
                    </SOAPSection>

                    <SOAPSection label="Plan" letterColor="#EB5757">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {(state.consultation?.questions || []).map((q, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <span
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            background: "#EB5757",
                                            color: "white",
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            marginTop: "1px",
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <p>{q}</p>
                                </div>
                            ))}
                        </div>
                    </SOAPSection>

                    {/* Separator */}
                    <div style={{ height: "1px", background: "#EDEDF0", margin: "8px 0 20px" }} />

                    {/* Footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <ShieldCheck size={12} strokeWidth={2} color="#4CB782" />
                            <span style={{ fontSize: "10px", color: "#999" }}>
                                HIPAA-compliant · AI-assisted draft · Requires physician review
                            </span>
                        </div>
                        <span style={{ fontSize: "10px", color: "#C4C4C4" }}>
                            WellRead v1.0 · {today}
                        </span>
                    </div>
                </div>

                {/* Action Bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "10px",
                        padding: "16px 24px",
                        borderTop: "1px solid #F0F0F0",
                        position: "sticky",
                        bottom: 0,
                        background: "white",
                        borderRadius: "0 0 20px 20px",
                    }}
                >
                    <button
                        onClick={handlePrint}
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#555",
                            background: "#F8F9FC",
                            border: "1px solid #EDEDF0",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#EDEDF0"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#F8F9FC"; }}
                    >
                        <Printer size={13} strokeWidth={1.5} />
                        Print
                    </button>
                    <button
                        onClick={handlePrint}
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#555",
                            background: "#F8F9FC",
                            border: "1px solid #EDEDF0",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#EDEDF0"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#F8F9FC"; }}
                    >
                        <Download size={13} strokeWidth={1.5} />
                        Download as PDF
                    </button>
                    <button
                        style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "white",
                            background: "linear-gradient(135deg, #5E6AD2 0%, #818CF8 100%)",
                            border: "none",
                            padding: "8px 20px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                            boxShadow: "0 2px 8px rgba(94, 106, 210, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(94, 106, 210, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(94, 106, 210, 0.3)";
                        }}
                    >
                        <Send size={13} strokeWidth={1.5} />
                        Send to Patient Portal
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes report-enter {
                    from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @media print {
                    body * { visibility: hidden !important; }
                    #physician-report-content, #physician-report-content * { visibility: visible !important; }
                    #physician-report-content { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>
        </>
    );
}

/* ── Exported Hook ── */

export function usePhysicianReport() {
    const [phase, setPhase] = useState<"idle" | "processing" | "ready">("idle");
    const [progress, setProgress] = useState(0);
    const [label, setLabel] = useState("");

    const generate = () => {
        setPhase("processing");
        setProgress(0);
        setLabel("Gathering source data...");

        const steps = [
            { pct: 25, text: "Parsing Gmail symptoms..." },
            { pct: 50, text: "Extracting lab values..." },
            { pct: 75, text: "Synthesizing clinical narrative..." },
            { pct: 100, text: "Formatting S.O.A.P. structure..." },
        ];

        steps.forEach((s, i) => {
            setTimeout(() => {
                setProgress(s.pct);
                setLabel(s.text);
                if (i === steps.length - 1) {
                    setTimeout(() => setPhase("ready"), 600);
                }
            }, (i + 1) * 800);
        });
    };

    const close = () => {
        setPhase("idle");
        setProgress(0);
    };

    return { phase, progress, label, generate, close };
}

export { ProcessingOverlay, ReportModal };
