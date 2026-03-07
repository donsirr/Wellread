"use client";

import {
    Mail,
    FileText,
    CalendarDays,
    ShieldCheck,
    Clock,
    Sparkles,
} from "lucide-react";
import { useInspector, type SourceType } from "./InspectorContext";
import { useStore } from "./StoreContext";

/* ── Processing Bar ── */

function ProcessingBar({
    progress,
    color,
}: {
    progress: number;
    color: string;
}) {
    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <span
                    className="flex items-center gap-1.5"
                    style={{ fontSize: "10px", fontWeight: 500, color }}
                >
                    <Sparkles size={9} strokeWidth={2} />
                    Processing
                </span>
                <span className="text-muted" style={{ fontSize: "10px" }}>
                    {progress} %
                </span>
            </div>
            <div className="processing-bar-track">
                <div
                    className="processing-bar-fill"
                    style={{
                        width: `${progress}%`,
                        background: color,
                    }}
                />
                <div className="processing-bar-shimmer" />
            </div>
        </div>
    );
}

/* ── Verified Badge ── */

function VerifiedBadge() {
    return (
        <span
            className="inline-flex items-center gap-1"
            style={{
                fontSize: "10px",
                fontWeight: 500,
                color: "var(--color-success)",
                background: "var(--color-success-soft)",
                padding: "2px 6px",
                borderRadius: "4px",
            }}
        >
            <ShieldCheck size={9} strokeWidth={2.5} />
            Verified
        </span>
    );
}

/* ── Source Data ── */

interface SourceFile {
    id: string;
    icon: React.ElementType;
    name: string;
    type: string;
    date: string;
    size: string;
    iconColor: string;
    iconBg: string;
    verified: boolean;
    processing?: number;
    recentlyAdded?: boolean;
    inspectorType: SourceType;
    fileName: string;
}

const iconMap: Record<string, React.ElementType> = {
    Mail,
    FileText,
    Calendar: CalendarDays
};

/* ── SourceArchive Component ── */

export default function SourceArchive() {
    const { openInspector } = useInspector();
    const { state, startAutoDemo } = useStore();

    // Simulate some logic from the currentStep
    const isRunning = state.currentStep > 0 && state.currentStep < 4;
    const isFinished = state.currentStep >= 4;

    return (
        <div id="source-archive" className="flex flex-col gap-2">
            {/* Sync Button — High-Gloss Primary */}
            <button
                onClick={() => {
                    if (state.currentStep === 0 || isFinished) startAutoDemo();
                }}
                disabled={isRunning}
                style={{
                    marginBottom: isRunning ? "0" : "8px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "12px",
                    backgroundColor: isRunning ? "var(--color-surface-secondary)" : undefined,
                    backgroundImage: isRunning
                        ? "none"
                        : "linear-gradient(135deg, #5170FF 0%, #7E95FF 50%, #5170FF 100%)",
                    backgroundSize: "200% 100%",
                    color: isRunning ? "var(--color-muted)" : "white",
                    cursor: isRunning ? "default" : "pointer",
                    border: isRunning ? "1px solid var(--color-border)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isRunning ? "none" : "0 4px 16px rgba(81, 112, 255, 0.35)",
                    letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                    if (!isRunning) {
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(81, 112, 255, 0.45)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.filter = "brightness(1.08)";
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isRunning) {
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(81, 112, 255, 0.35)";
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.filter = "none";
                    }
                }}
            >
                {/* Gloss overlay */}
                {!isRunning && (
                    <span
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
                            borderRadius: "12px",
                            pointerEvents: "none",
                        }}
                    />
                )}

                {isRunning ? (
                    <>
                        {/* Spinner */}
                        <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: "spin-sync 1s linear infinite" }}>
                            <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="20 12" strokeLinecap="round" />
                        </svg>
                        <span style={{ position: "relative" }}>Analyzing Local Context...</span>
                    </>
                ) : (
                    <>
                        {/* Play icon */}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: "relative" }}>
                            <path d="M3.5 2.5L11.5 7L3.5 11.5V2.5Z" fill="white" strokeLinejoin="round" />
                        </svg>
                        <span style={{ position: "relative" }}>{isFinished ? "Restart Sync" : "Simulate MCP Sync"}</span>
                    </>
                )}
            </button>

            {isRunning && (
                <div
                    style={{
                        padding: "8px 12px",
                        fontSize: "11px",
                        color: "var(--color-primary)",
                        background: "var(--color-primary-soft)",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid rgba(81, 112, 255, 0.1)",
                    }}
                >
                    <Sparkles size={10} strokeWidth={2} />
                    Analyzing secure data siloes...
                </div>
            )}

            <style>{`
                @keyframes spin-sync {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {state.mcpSources.map((src, index) => {
                const isPending = src.status === "pending";
                const IconComponent = iconMap[src.iconType] || FileText;

                // Color defaults mapping based on iconType
                const colorMap: Record<string, { iconColor: string, iconBg: string, inspectorType: SourceType }> = {
                    "Mail": { iconColor: "#5170FF", iconBg: "rgba(81, 112, 255, 0.08)", inspectorType: "gmail" },
                    "FileText": { iconColor: "#EB5757", iconBg: "rgba(235, 87, 87, 0.06)", inspectorType: "pdf" },
                    "Calendar": { iconColor: "#F2994A", iconBg: "rgba(242, 153, 74, 0.08)", inspectorType: "clinical_note" }
                };

                const styleConfig = colorMap[src.iconType] || colorMap["FileText"];

                return (
                    <div
                        key={src.id}
                        id={src.id}
                        className={`source-file-card ${isPending ? 'opacity-60' : ''}`}
                        style={{ padding: "14px 16px" }}
                        onClick={() => {
                            if (isPending) return;

                            let evidenceSnippet: string | undefined;
                            if (src.id === "src-gmail") evidenceSnippet = "numbness and tingling in my toes";
                            if (src.id === "src-lab-pdf") evidenceSnippet = "HbA1c";
                            if (src.id === "src-calendar") evidenceSnippet = "persistent neuropathy";

                            openInspector({ id: src.id, fileName: src.name, type: styleConfig.inspectorType, verified: true, evidenceSnippet })
                        }}
                    >
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "8px",
                                    background: styleConfig.iconBg,
                                    flexShrink: 0,
                                }}
                            >
                                <IconComponent
                                    size={18}
                                    strokeWidth={1.5}
                                    style={{ color: styleConfig.iconColor }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col gap-0.5 mt-1">
                                    <p
                                        className="text-foreground"
                                        style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.3 }}
                                    >
                                        {src.name}
                                    </p>
                                    {isPending && (
                                        <span
                                            style={{
                                                fontSize: "10px",
                                                fontWeight: 500,
                                                color: styleConfig.iconColor,
                                                background: styleConfig.iconBg,
                                                padding: "2px 6px",
                                                borderRadius: "4px",
                                                whiteSpace: "nowrap",
                                                flexShrink: 0,
                                            }}
                                        >
                                            Pending
                                        </span>
                                    )}
                                </div>

                                <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", lineHeight: 1.4, marginTop: "2px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {src.contentSnippet}
                                </p>
                            </div>

                            {/* Verified or Processing */}
                            <div className="mt-2 flex items-center gap-2">
                                {!isPending && <VerifiedBadge />}
                            </div>

                            {isPending && isRunning && (
                                <ProcessingBar progress={100} color={styleConfig.iconColor} />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
