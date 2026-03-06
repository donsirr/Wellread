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

import data from "../data.json";

const iconMap: Record<string, React.ElementType> = {
    Mail,
    FileText,
    Calendar: CalendarDays
};

const sources: SourceFile[] = data.sources.map(src => ({
    ...src,
    icon: iconMap[src.iconType] || FileText,
    inspectorType: src.inspectorType as SourceType
}));

/* ── SourceArchive Component ── */

export default function SourceArchive() {
    const { openInspector } = useInspector();

    return (
        <div id="source-archive" className="flex flex-col gap-2">
            {sources.map((src) => (
                <div
                    key={src.id}
                    id={src.id}
                    className="source-file-card"
                    style={{ padding: "14px 16px" }}
                    onClick={() => openInspector({ id: src.id, fileName: src.fileName, type: src.inspectorType, verified: src.verified })}
                >
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "8px",
                                background: src.iconBg,
                                flexShrink: 0,
                            }}
                        >
                            <src.icon
                                size={18}
                                strokeWidth={1.5}
                                style={{ color: src.iconColor }}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <p
                                    className="text-foreground"
                                    style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.3 }}
                                >
                                    {src.name}
                                </p>
                                {src.recentlyAdded && (
                                    <span
                                        style={{
                                            fontSize: "10px",
                                            fontWeight: 500,
                                            color: src.iconColor,
                                            background: src.iconBg,
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                            whiteSpace: "nowrap",
                                            flexShrink: 0,
                                        }}
                                    >
                                        New
                                    </span>
                                )}
                            </div>

                            <div
                                className="flex items-center gap-2 mt-0.5"
                                style={{ fontSize: "11px", color: "var(--color-muted)" }}
                            >
                                <span className="flex items-center gap-1">
                                    <Clock size={9} strokeWidth={2} />
                                    {src.date}
                                </span>
                                <span>·</span>
                                <span>{src.size}</span>
                            </div>

                            {/* Verified or Processing */}
                            <div className="mt-2 flex items-center gap-2">
                                {src.verified && <VerifiedBadge />}
                            </div>

                            {src.processing !== undefined && (
                                <ProcessingBar progress={src.processing} color={src.iconColor} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
