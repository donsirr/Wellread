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
import { useMcpOrchestrator } from "../mcpOrchestrator";

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
    const { state } = useStore();
    const { runSimulation, loadingProgress, isRunning, logs } = useMcpOrchestrator();

    return (
        <div id="source-archive" className="flex flex-col gap-2">
            {/* Run Button (for simulation demo) */}
            <button
                onClick={() => {
                    if (!isRunning) runSimulation();
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
                {isRunning ? "Intelligence Syncing..." : "Simulate MCP Sync"}
            </button>

            {isRunning && (
                <div style={{ padding: "8px", fontSize: "11px", color: "var(--color-primary)", background: "var(--color-primary-soft)", borderRadius: "6px", marginBottom: "8px" }}>
                    {logs[logs.length - 1]}
                </div>
            )}

            {state.mcpSources.map((src, index) => {
                const isPending = src.status === "pending";
                const IconComponent = iconMap[src.iconType] || FileText;

                // Color defaults mapping based on iconType
                const colorMap: Record<string, { iconColor: string, iconBg: string, inspectorType: SourceType }> = {
                    "Mail": { iconColor: "#5E6AD2", iconBg: "rgba(94, 106, 210, 0.08)", inspectorType: "gmail" },
                    "FileText": { iconColor: "#EB5757", iconBg: "rgba(235, 87, 87, 0.06)", inspectorType: "pdf" },
                    "Calendar": { iconColor: "#F2994A", iconBg: "rgba(242, 153, 74, 0.08)", inspectorType: "calendar" }
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
                            openInspector({ id: src.id, fileName: src.name, type: styleConfig.inspectorType, verified: true })
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
                                <ProcessingBar progress={loadingProgress} color={styleConfig.iconColor} />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
