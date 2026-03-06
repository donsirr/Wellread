"use client";

import { Droplets, Heart, Gauge, Wind } from "lucide-react";

/* ── SVG Sparkline ── */

interface SparklineProps {
    data: number[];
    gradientId: string;
    colorFrom?: string;
    colorTo?: string;
    alert?: boolean;
    width?: number;
    height?: number;
    showProjection?: boolean;
}

function Sparkline({
    data,
    gradientId,
    colorFrom = "#5E6AD2",
    colorTo = "#818CF8",
    alert = false,
    width = 200,
    height = 48,
    showProjection = false,
}: SparklineProps) {
    const padding = 4;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;
    const step = innerW / (data.length - 1);

    const points = data.map((v, i) => ({
        x: padding + i * step,
        y: padding + innerH - (v / 100) * innerH,
    }));

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];
        const tension = 0.3;
        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;
        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    const areaD = `${d} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;
    const from = alert ? "#EB5757" : colorFrom;
    const to = alert ? "#F2994A" : colorTo;

    // Projection data
    let projD = "";
    let projDot = null;
    if (showProjection) {
        // Extend line from last point downwards to a "target"
        const lastP = points[points.length - 1];
        const targetX = width - padding;
        const targetY = padding + innerH - (20 / 100) * innerH; // target is lower value (green zone)

        // simple bezier for projection
        const tension = 0.5;
        const cp1x = lastP.x + (targetX - lastP.x) * tension;
        const cp1y = lastP.y;
        const cp2x = targetX - (targetX - lastP.x) * tension;
        const cp2y = targetY;

        projD = `M ${lastP.x},${lastP.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${targetX},${targetY}`;
        projDot = { x: targetX, y: targetY };
    }

    return (
        <div style={{ position: "relative" }}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                height={height}
                preserveAspectRatio="none"
                style={{ display: "block", overflow: "visible" }}
            >
                <defs>
                    <linearGradient id={`${gradientId}-s`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={from} />
                        <stop offset="100%" stopColor={to} />
                    </linearGradient>
                    <linearGradient id={`${gradientId}-f`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={from} stopOpacity="0.08" />
                        <stop offset="100%" stopColor={to} stopOpacity="0.01" />
                    </linearGradient>
                </defs>
                <path d={areaD} fill={`url(#${gradientId}-f)`} />
                <path d={d} fill="none" stroke={`url(#${gradientId}-s)`} strokeWidth={1.5} strokeLinecap="round" />

                {showProjection && (
                    <>
                        {/* Target Zone Background */}
                        <rect x={width - 40} y={padding} width={40} height={height - padding * 2} fill="var(--color-success)" opacity={0.05} rx={4} />
                        <path
                            d={projD}
                            fill="none"
                            stroke="var(--color-success)"
                            strokeWidth={1.5}
                            strokeDasharray="3 3"
                            strokeLinecap="round"
                            style={{
                                animation: "dash-move 10s linear infinite"
                            }}
                        />
                        <circle cx={projDot?.x} cy={projDot?.y} r={3} fill="var(--color-success)" />
                    </>
                )}

                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2.5} fill={to} />
                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={5} fill={to} opacity={0.15} />
            </svg>

            {showProjection && (
                <div
                    style={{
                        position: "absolute",
                        right: -10,
                        top: -24,
                        background: "var(--color-success)",
                        color: "white",
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "4px 8px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(39, 174, 96, 0.2)",
                        whiteSpace: "nowrap",
                        animation: "spring-up 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                        opacity: 0,
                        transform: "translateY(10px)"
                    }}
                >
                    With Medication Adj: 6.5% Est.
                </div>
            )}
            <style>{`
                @keyframes dash-move {
                    to { stroke-dashoffset: -100; }
                }
                @keyframes spring-up {
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

/* ── Metric Config ── */

interface MetricConfig {
    id: string;
    icon: React.ElementType;
    label: string;
    value: string;
    unit: string;
    subLabel: string;
    sparkData: number[];
    isAlert?: boolean;
    alertBadge?: string;
}

import { useState } from "react";
import { useStore } from "./StoreContext";

/* ── Skeleton Card ── */

function SkeletonCard({ index, isPulsing }: { index: number; isPulsing: boolean }) {
    return (
        <div
            className="card"
            style={{
                padding: "16px",
                position: "relative",
                overflow: "hidden",
                animation: isPulsing ? `skel-pulse 1.5s ease-in-out infinite ${index * 0.15}s` : undefined,
            }}
        >
            {/* Icon skeleton */}
            <div
                style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--color-surface-secondary)",
                }}
            />
            {/* Label skeleton */}
            <div
                style={{
                    width: "60%",
                    height: "10px",
                    borderRadius: "4px",
                    background: "var(--color-surface-secondary)",
                    marginTop: "14px",
                }}
            />
            {/* Value skeleton */}
            <div
                style={{
                    width: "45%",
                    height: "22px",
                    borderRadius: "6px",
                    background: "var(--color-surface-secondary)",
                    marginTop: "8px",
                }}
            />
            {/* SubLabel skeleton */}
            <div
                style={{
                    width: "70%",
                    height: "8px",
                    borderRadius: "4px",
                    background: "var(--color-surface-secondary)",
                    marginTop: "6px",
                }}
            />
            {/* Chart skeleton */}
            <div
                className="chart-well mt-3"
                style={{
                    padding: "6px 4px 2px 4px",
                    height: "48px",
                    background: "var(--color-surface-secondary)",
                    borderRadius: "6px",
                }}
            />

            {/* Shimmer overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "skel-shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${index * 0.2}s`,
                }}
            />
        </div>
    );
}

export default function VitalityGrid() {
    const [showProjection, setShowProjection] = useState(false);
    const { state } = useStore();
    const step = state.currentStep;

    const iconMap: Record<string, React.ElementType> = {
        Droplets,
        Heart,
        Gauge,
        Wind
    };

    const vitals = state.clinicalMetrics.map((m: any) => ({
        ...m,
        icon: iconMap[m.iconType] || Heart
    }));

    const showData = step >= 2;
    const isPulsing = step === 1;

    return (
        <section id="vitality-grid" style={{ marginBottom: "24px" }}>
            {/* Section label */}
            {/* Section label & Controls */}
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: showData ? "var(--color-success)" : "var(--color-muted)",
                            transition: "background 0.4s ease",
                        }}
                    />
                    <span className="section-title">
                        {step === 0 ? "Vitals · Awaiting Sync" : step === 1 ? "Vitals · Processing..." : "Vitals · Live"}
                    </span>
                </div>

                {/* Projected Outcome Toggle — only show when data is visible */}
                {showData && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", animation: "stage-fade-in 0.5s ease forwards" }}>
                        <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-muted)" }}>Projected Outcome</span>
                        <button
                            onClick={() => setShowProjection(!showProjection)}
                            style={{
                                width: "36px",
                                height: "20px",
                                borderRadius: "10px",
                                background: showProjection ? "var(--color-success)" : "var(--color-border)",
                                position: "relative",
                                cursor: "pointer",
                                transition: "background 0.3s ease",
                                border: "none",
                                outline: "none",
                                padding: 0
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    left: showProjection ? "18px" : "2px",
                                    width: "16px",
                                    height: "16px",
                                    borderRadius: "50%",
                                    background: "white",
                                    transition: "left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                }}
                            />
                        </button>
                    </div>
                )}
            </div>

            {/* 4-Card Row */}
            <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            >
                {!showData ? (
                    /* Skeleton cards */
                    [0, 1, 2, 3].map((i) => (
                        <SkeletonCard key={i} index={i} isPulsing={isPulsing} />
                    ))
                ) : (
                    /* Real metric cards with staggered reveal */
                    vitals.map((m: any, i: number) => (
                        <div
                            key={m.id}
                            id={m.id}
                            className={`card card-glow ${m.isAlert ? "clinical-alert" : ""}`}
                            style={{
                                padding: "16px",
                                position: "relative",
                                animation: `stage-card-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s both`,
                            }}
                        >
                            <div style={{ position: "relative", zIndex: 1 }}>
                                {/* Top row */}
                                <div className="flex items-start justify-between">
                                    <div
                                        className="flex items-center justify-center"
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            background: m.isAlert
                                                ? "var(--color-danger-soft)"
                                                : "var(--color-primary-soft)",
                                        }}
                                    >
                                        <m.icon
                                            size={16}
                                            strokeWidth={1.5}
                                            style={{
                                                color: m.isAlert
                                                    ? "var(--color-danger)"
                                                    : "var(--color-primary)",
                                            }}
                                        />
                                    </div>
                                    {m.alertBadge && (
                                        <span className="badge badge-danger" style={{ fontSize: "10px" }}>
                                            {m.alertBadge}
                                        </span>
                                    )}
                                </div>

                                {/* Label */}
                                <p
                                    className="text-muted"
                                    style={{ fontSize: "11px", fontWeight: 500, marginTop: "12px" }}
                                >
                                    {m.label}
                                </p>

                                {/* Value */}
                                <div className="flex items-baseline gap-1 mt-0.5">
                                    <span
                                        className="text-foreground"
                                        style={{
                                            fontSize: m.isAlert ? "26px" : "24px",
                                            fontWeight: m.isAlert ? 400 : 600,
                                            lineHeight: 1,
                                            letterSpacing: "-0.03em",
                                        }}
                                    >
                                        {m.value}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: "11px" }}>
                                        {m.unit}
                                    </span>
                                </div>

                                <p className="text-muted" style={{ fontSize: "10px", marginTop: "2px" }}>
                                    {m.subLabel}
                                </p>

                                {/* Chart well */}
                                <div className="chart-well mt-3" style={{ padding: "6px 4px 2px 4px" }}>
                                    <Sparkline
                                        data={m.sparkData}
                                        gradientId={m.id}
                                        alert={m.isAlert}
                                        showProjection={m.id === "metric-hba1c" ? showProjection : false}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                @keyframes skel-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes skel-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                @keyframes stage-card-enter {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes stage-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </section>
    );
}

