"use client";

import { useState } from "react";
import { Mail, FileText, Zap, ArrowRight, Loader2 } from "lucide-react";
import { useInspector } from "./InspectorContext";
import { useStore } from "./StoreContext";

/* ── Confidence Ring ── */

function ConfidenceRing({ score, size = 80, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const target = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div style={{ position: "relative", width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <defs>
                        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5E6AD2" />
                            <stop offset="100%" stopColor="#818CF8" />
                        </linearGradient>
                    </defs>
                    <circle className="confidence-ring-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
                    <circle
                        className="confidence-ring-bar"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke="url(#ring-grad)"
                        strokeDasharray={circumference}
                        style={{ "--ring-circumference": circumference, "--ring-target": target } as React.CSSProperties}
                    />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="text-foreground" style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>{score}%</span>
                </div>
            </div>
            <span className="text-muted" style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Confidence
            </span>
        </div>
    );
}

/* ── Source Bubble ── */

function SourceBubble({ icon: Icon, label, color, bgColor }: { icon: React.ElementType; label: string; color: string; bgColor: string }) {
    return (
        <div className="source-bubble flex flex-col items-center gap-1.5">
            <div
                className="flex items-center justify-center"
                style={{ width: "44px", height: "44px", borderRadius: "10px", background: bgColor, border: "1px solid var(--color-border)" }}
            >
                <Icon size={20} strokeWidth={1.5} style={{ color }} />
            </div>
            <span className="text-muted" style={{ fontSize: "10px", fontWeight: 500 }}>{label}</span>
        </div>
    );
}

/* ── Flow Connectors ── */

function FlowConnectors() {
    return (
        <svg viewBox="0 0 100 160" fill="none" style={{ width: "100px", height: "160px", overflow: "visible", flexShrink: 0 }}>
            <defs>
                <linearGradient id="fc1" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#5E6AD2" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="fc2" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#EB5757" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#5E6AD2" stopOpacity="0.6" />
                </linearGradient>
            </defs>
            <path d="M 0,40 C 35,40 65,70 100,80" stroke="url(#fc1)" strokeWidth="1" strokeDasharray="4 4" style={{ animation: "flow-dash 1.5s linear infinite" }} />
            <circle r="2.5" fill="#5E6AD2">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 0,40 C 35,40 65,70 100,80" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3s" repeatCount="indefinite" />
            </circle>
            <path d="M 0,120 C 35,120 65,90 100,80" stroke="url(#fc2)" strokeWidth="1" strokeDasharray="4 4" style={{ animation: "flow-dash 1.5s linear infinite", animationDelay: "-0.75s" }} />
            <circle r="2.5" fill="#EB5757">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M 0,120 C 35,120 65,90 100,80" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.5s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}

/* ── Narrative Skeleton ── */

function NarrativeSkeleton({ isPulsing }: { isPulsing: boolean }) {
    return (
        <section id="narrative-intelligence">
            <div className="section-header">
                <Zap size={12} strokeWidth={2} style={{ color: "var(--color-muted)" }} />
                <span className="section-title" style={{ color: "var(--color-muted)" }}>
                    Narrative Intelligence · {isPulsing ? "Processing..." : "Awaiting Data"}
                </span>
            </div>

            <div
                className="card"
                style={{
                    padding: "28px",
                    overflow: "hidden",
                    position: "relative",
                    animation: isPulsing ? "narr-skel-pulse 1.5s ease-in-out infinite" : undefined,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    {/* Source Bubble skeletons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px", flexShrink: 0 }}>
                        {[0, 1].map((i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                                <div style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "10px",
                                    background: "var(--color-surface-secondary)",
                                }} />
                                <div style={{
                                    width: "32px",
                                    height: "8px",
                                    borderRadius: "4px",
                                    background: "var(--color-surface-secondary)",
                                }} />
                            </div>
                        ))}
                    </div>

                    {/* Connector skeleton */}
                    <div style={{
                        width: "100px",
                        height: "80px",
                        flexShrink: 0,
                    }} />

                    {/* Text area skeleton */}
                    <div style={{ flex: 1 }}>
                        <div style={{ width: "140px", height: "12px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "14px" }} />
                        <div style={{ width: "100%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "8px" }} />
                        <div style={{ width: "90%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "8px" }} />
                        <div style={{ width: "75%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
                        <div style={{ width: "100px", height: "28px", borderRadius: "6px", background: "var(--color-surface-secondary)", marginTop: "16px" }} />
                    </div>

                    {/* Ring skeleton */}
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        border: "6px solid var(--color-surface-secondary)",
                        flexShrink: 0,
                    }} />
                </div>

                {/* Shimmer overlay */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "narr-skel-shimmer 1.5s ease-in-out infinite",
                }} />
            </div>

            <style>{`
                @keyframes narr-skel-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.55; }
                }
                @keyframes narr-skel-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </section>
    );
}

/* ── NarrativeIntelligence ── */

export default function NarrativeIntelligence() {
    const { openInspector } = useInspector();
    const { state } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const step = state.currentStep;

    if (!state.narrative) {
        return null;
    }

    // Steps 0–2: show skeleton
    if (step < 3) {
        return <NarrativeSkeleton isPulsing={step >= 1} />;
    }

    // Step 3+: show real content with entrance animation
    return (
        <section
            id="narrative-intelligence"
            style={{
                animation: "narr-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
        >
            <div className="section-header">
                <Zap size={12} strokeWidth={2} style={{ color: "var(--color-primary)" }} />
                <span className="section-title">Narrative Intelligence</span>
            </div>

            <div className="card" style={{ padding: "28px", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                    {/* Source Bubbles */}
                    <div className="flex flex-col items-center" style={{ gap: "24px", flexShrink: 0 }}>
                        <SourceBubble icon={Mail} label="Gmail" color="#5E6AD2" bgColor="var(--color-primary-soft)" />
                        <SourceBubble icon={FileText} label="Lab PDF" color="#EB5757" bgColor="var(--color-danger-soft)" />
                    </div>

                    {/* Flow Lines */}
                    <FlowConnectors />

                    {/* Story */}
                    <div
                        className="flex-1"
                        style={{
                            padding: "20px 24px",
                            background: "var(--color-surface-secondary)",
                            borderRadius: "10px",
                            border: "1px solid var(--color-border-subtle)",
                        }}
                    >
                        <div className="flex items-center gap-1.5 mb-2">
                            <Zap size={12} strokeWidth={2} style={{ color: "var(--color-primary)" }} />
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-primary)" }}>
                                {state.narrative.title}
                            </span>
                        </div>

                        <p className="text-foreground" style={{ fontSize: "14px", lineHeight: 1.65, letterSpacing: "-0.01em" }}>
                            {state.narrative.sourceText1}
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={() => openInspector({ id: "src-gmail", fileName: state.mcpSources[0]?.name || "Email", type: "gmail", verified: true, evidenceSnippet: "numbness and tingling in my toes" })}
                                style={{ fontWeight: 600, color: "var(--color-primary)", cursor: "pointer", borderBottom: "1px dashed var(--color-primary)" }}
                            >{state.narrative.highlight1}</span>{" "}
                            <span className="text-muted" style={{ fontSize: "12px" }}>{state.narrative.sourceText2}</span>
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={() => openInspector({ id: "src-lab-pdf", fileName: state.mcpSources[1]?.name || "Lab Report", type: "pdf", verified: true, evidenceSnippet: "HbA1c" })}
                                style={{ fontWeight: 600, color: "#EB5757", cursor: "pointer", borderBottom: "1px dashed #EB5757" }}
                            >{state.narrative.highlight2}</span>{" "}
                            <span className="text-muted" style={{ fontSize: "12px" }}>{state.narrative.sourceText3}</span>
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                            <button
                                id="view-full-correlation"
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setIsLoading(false);
                                        openInspector({
                                            id: "src-lab-pdf",
                                            fileName: state.mcpSources.find(s => s.id === "src-lab-pdf")?.name || "Lab Report",
                                            type: "pdf",
                                            verified: true,
                                            evidenceSnippet: "HbA1c"
                                        });
                                    }, 500);
                                }}
                                className="flex items-center gap-1 text-primary"
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    background: "var(--color-primary-soft)",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: isLoading ? "default" : "pointer",
                                    transition: "all 0.15s ease",
                                    color: "var(--color-primary)",
                                    opacity: isLoading ? 0.8 : 1,
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={12} strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} />
                                        Retrieving Data...
                                    </>
                                ) : (
                                    <>
                                        View Analysis
                                        <ArrowRight size={12} strokeWidth={2} />
                                    </>
                                )}
                            </button>
                            <span className="text-muted" style={{ fontSize: "11px" }}>
                                {state.narrative.insightSources}
                            </span>
                        </div>
                    </div>

                    {/* Confidence Ring */}
                    <div style={{ flexShrink: 0, paddingLeft: "24px" }}>
                        <ConfidenceRing score={state.narrative.confidence} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes narr-enter {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}

