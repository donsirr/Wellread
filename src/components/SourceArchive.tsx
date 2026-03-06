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
                    className="flex items-center gap-1"
                    style={{ fontSize: "10px", fontWeight: 500, color }}
                >
                    <Sparkles size={9} strokeWidth={2} />
                    Processing
                </span>
                <span className="text-muted" style={{ fontSize: "10px" }}>
                    {progress}%
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
            {/* Run Button (for simulation demo) */}
            <button
                onClick={() => {
                    if (state.currentStep === 0 || isFinished) startAutoDemo();
                }}
                disabled={isRunning}
                style={{
                    marginBottom: "8px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    background: isRunning ? "var(--color-surface-secondary)" : "var(--color-primary)",
                    color: isRunning ? "var(--color-muted)" : "white",
                    cursor: isRunning ? "default" : "pointer",
                    border: "none"
                }}
            >
                {isRunning ? "Intelligence Syncing..." : isFinished ? "Restart Sync" : "Simulate MCP Sync"}
            </button>

            {isRunning && (
                <div style={{ padding: "8px", fontSize: "11px", color: "var(--color-primary)", background: "var(--color-primary-soft)", borderRadius: "6px", marginBottom: "8px" }}>
                    Analyzing secure data siloes...
                </div>
            )}

            {state.mcpSources.map((src, index) => {
                const isPending = src.status === "pending";
                const IconComponent = iconMap[src.iconType] || FileText;

                // Color defaults mapping based on iconType
                const colorMap: Record<string, { iconColor: string, iconBg: string, inspectorType: SourceType }> = {
                    "Mail": { iconColor: "#5E6AD2", iconBg: "rgba(94, 106, 210, 0.08)", inspectorType: "gmail" },
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
                            if (src.id === "src-gmail") evidenceSnippet = "numbness in your toes";
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

                            {/* Info and Action Container */}
                            <div className="flex-1 min-w-0 flex flex-col">
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

                                {/* Verified or Processing / Action Button */}
                                <div className="mt-3 flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        {!isPending && <VerifiedBadge />}
                                    </div>
                                    {!isPending && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                let evidenceSnippet: string | undefined;
                                                if (src.id === "src-gmail") evidenceSnippet = "numbness in your toes";
                                                if (src.id === "src-lab-pdf") evidenceSnippet = "HbA1c";
                                                if (src.id === "src-calendar") evidenceSnippet = "persistent neuropathy";

                                                openInspector({ id: src.id, fileName: src.name, type: styleConfig.inspectorType, verified: true, evidenceSnippet });
                                            }}
                                            style={{
                                                fontSize: "10px",
                                                fontWeight: 600,
                                                color: styleConfig.iconColor,
                                                background: "var(--color-surface)",
                                                border: `1px solid ${styleConfig.iconColor}33`,
                                                padding: "4px 10px",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-1.5px)";
                                                e.currentTarget.style.boxShadow = `0 6px 12px ${styleConfig.iconColor}33`; // 20% opacity hex
                                                e.currentTarget.style.background = styleConfig.iconColor;
                                                e.currentTarget.style.color = "white";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "none";
                                                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                                                e.currentTarget.style.background = "var(--color-surface)";
                                                e.currentTarget.style.color = styleConfig.iconColor;
                                            }}
                                        >
                                            View Original
                                        </button>
                                    )}
                                </div>

                                {isPending && isRunning && (
                                    <ProcessingBar progress={100} color={styleConfig.iconColor} />
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
