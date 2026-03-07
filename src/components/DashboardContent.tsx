"use client";

import VitalityGrid from "./VitalityGrid";
import NarrativeIntelligence from "./NarrativeIntelligence";
import SourceArchive from "./SourceArchive";
import ConsultationBrief from "./ConsultationBrief";
import PrivacyGuard from "./PrivacyGuard";
import SemanticSearch from "./SemanticSearch";
import DemoController from "./DemoController";
import CorrelationLines from "./CorrelationLines";
import PatientBadge from "./PatientBadge";
import TimeMachine from "./TimeMachine";
import AppHero from "./AppHero";
import { useStore } from "./StoreContext";
import { AnimatePresence } from "framer-motion";

/* ── Right Panel Skeleton ── */

function BriefSkeleton() {
    return (
        <div style={{ padding: "20px 16px" }}>
            {/* Header skeleton */}
            <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
                <div style={{ width: "120px", height: "14px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
                <div style={{ width: "40px", height: "14px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
            </div>

            {/* Toggle bar skeleton */}
            <div style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "var(--color-surface-secondary)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <div style={{ width: "100px", height: "10px", borderRadius: "4px", background: "var(--color-border)" }} />
                <div style={{ width: "36px", height: "18px", borderRadius: "9px", background: "var(--color-border)" }} />
            </div>

            {/* Card skeleton */}
            <div className="card" style={{ padding: "20px", marginBottom: "12px", position: "relative", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "10px" }} />
                <div style={{ width: "80%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "10px" }} />
                <div style={{ width: "65%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />

                {/* shimmer */}
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "brief-skel-shimmer 1.8s ease-in-out infinite",
                }} />
            </div>

            {/* Section heading */}
            <div style={{ width: "130px", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", margin: "20px 0 12px" }} />

            {/* Observation list skeleton */}
            {[0, 1, 2].map(i => (
                <div key={i} className="card" style={{ padding: "14px 16px", marginBottom: "8px", position: "relative", overflow: "hidden" }}>
                    <div className="flex items-start gap-2">
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "var(--color-surface-secondary)", flexShrink: 0, marginTop: "2px" }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ width: `${85 - i * 15}%`, height: "9px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "6px" }} />
                            <div style={{ width: `${60 - i * 10}%`, height: "9px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
                        </div>
                    </div>
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        backgroundSize: "200% 100%",
                        animation: `brief-skel-shimmer 1.8s ease-in-out infinite ${i * 0.15}s`,
                    }} />
                </div>
            ))}

            {/* AI flag skeleton */}
            <div style={{
                padding: "14px 16px",
                borderRadius: "10px",
                border: "1px dashed var(--color-border)",
                marginTop: "12px",
            }}>
                <div style={{ width: "90%", height: "9px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "8px" }} />
                <div style={{ width: "70%", height: "9px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
            </div>

            {/* Questions skeleton */}
            <div style={{ width: "80px", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", margin: "20px 0 12px" }} />
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--color-surface-secondary)",
                    marginBottom: "8px",
                    height: "36px",
                }} />
            ))}

            {/* CTA button skeleton */}
            <div style={{
                width: "100%",
                height: "44px",
                borderRadius: "10px",
                background: "var(--color-surface-secondary)",
                marginTop: "16px",
            }} />

            <style>{`
                @keyframes brief-skel-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}

export default function DashboardContent() {
    const { state } = useStore();
    return (
        <>
            <AnimatePresence>
                {state.currentStep === 0 && <AppHero />}
            </AnimatePresence>

            <div
                className="app-shell"
                style={{
                    filter: state.currentStep === 0 ? "blur(8px)" : "none",
                    opacity: state.currentStep === 0 ? 0.6 : 1,
                    pointerEvents: state.currentStep === 0 ? "none" : "auto",
                    transition: "filter 0.5s ease, opacity 0.5s ease"
                }}
            >
                {/* ── Left Panel — Source Archive ── */}
                <aside className="panel panel-left">
                    <div style={{ padding: "20px 16px" }}>
                        {/* Patient Identity Badge */}
                        <PatientBadge />

                        {/* Panel header — Sources */}
                        <div
                            className="flex items-center justify-between"
                            style={{ padding: "0 4px", margin: "24px 0 16px" }}
                        >
                            <h2
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "var(--color-foreground)",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Sources
                            </h2>
                            <span
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                            >
                                {state.mcpSources.length} files
                            </span>
                        </div>

                        <SourceArchive />
                    </div>
                </aside>

                {/* ── Center Panel — Intelligence Feed ── */}
                <section className="panel panel-center relative z-20" style={{ overflow: "hidden" }}>
                    <div style={{ padding: "28px 32px" }}>
                        {/* Semantic Search Bar */}
                        <SemanticSearch />

                        {/* Page header */}
                        <header className="flex items-start justify-between" style={{ marginBottom: "28px" }}>
                            <div>
                                <h1
                                    className="text-foreground"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: 600,
                                        letterSpacing: "-0.025em",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    Intelligence Feed
                                </h1>
                                <p
                                    className="text-muted-foreground"
                                    style={{ fontSize: "13px", marginTop: "4px" }}
                                >
                                    Real-time clinical data synthesis for {state.patientProfile.name}
                                </p>
                            </div>
                            <PrivacyGuard />
                        </header>

                        {/* Vitality Grid */}
                        <VitalityGrid />

                        {/* Narrative Intelligence */}
                        <NarrativeIntelligence />

                        {/* Medical Time-Machine — show after metrics are visible */}
                        {state.currentStep >= 2 && <TimeMachine />}
                    </div>
                </section>

                {/* ── Right Panel — Consultation Brief ── */}
                <aside
                    className="panel panel-right"
                    style={{
                        width: "400px",
                        minWidth: "400px",
                        borderLeft: "1px solid var(--color-border)",
                    }}
                >
                    {state.showBrief ? (
                        <div
                            style={{
                                padding: "20px 16px",
                                animation: "brief-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
                            }}
                        >
                            <ConsultationBrief />
                        </div>
                    ) : (
                        <BriefSkeleton />
                    )}
                </aside>

                {/* Glowing magic correlation lines */}
                <CorrelationLines />

                {/* Hidden Demo Controller (Ctrl+D to toggle) */}
                <DemoController />

                <style>{`
                @keyframes brief-reveal {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            </div>
        </>
    );
}
