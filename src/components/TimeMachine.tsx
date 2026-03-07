"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, TrendingDown, Zap, Mail, AlertTriangle, Target } from "lucide-react";
import { useStore } from "./StoreContext";

/* ── Types ── */

interface TimelineEvent {
    month: string;
    hba1c: number;
    label?: string;
    source?: string;
    type: "past" | "present" | "future";
}

/* ── Data ── */

const TIMELINE_DATA: TimelineEvent[] = [
    { month: "Sep 2025", hba1c: 7.2, label: "Routine checkup – stable", source: "Lab Report", type: "past" },
    { month: "Oct 2025", hba1c: 7.4, label: "Started new diet plan", source: "Gmail", type: "past" },
    { month: "Nov 2025", hba1c: 7.6, label: "Missed medication 3 days", source: "Calendar", type: "past" },
    { month: "Dec 2025", hba1c: 7.9, label: "Holiday diet inconsistency", source: "Gmail", type: "past" },
    { month: "Jan 2026", hba1c: 8.1, label: "Weight gain reported", source: "Gmail", type: "past" },
    { month: "Feb 2026", hba1c: 8.4, label: "Neuropathy symptoms onset", source: "Gmail", type: "past" },
    { month: "Mar 2026", hba1c: 8.6, label: "Current reading – ALERT", source: "Lab PDF", type: "present" },
    // Projection
    { month: "Apr 2026", hba1c: 8.2, label: "Projected with intervention", type: "future" },
    { month: "May 2026", hba1c: 7.6, label: "Lifestyle + medication adj.", type: "future" },
    { month: "Jun 2026", hba1c: 7.1, label: "Target trajectory", type: "future" },
    { month: "Jul 2026", hba1c: 6.8, label: "🎯 Target: 6.8%", type: "future" },
];

/* ── Tooltip ── */

function EventTooltip({ event, x, y }: { event: TimelineEvent; x: number; y: number }) {
    const sourceIcon = event.source === "Gmail" ? "📧" : event.source === "Calendar" ? "📅" : "📄";

    // Convert SVG viewBox coordinates (700x200) to percentages for responsive HTML overlay positioning
    const leftPct = (x / 700) * 100;
    const topPct = (y / 200) * 100;

    const isLeftEdge = x < 120;
    const isRightEdge = x > 580;

    return (
        <div
            style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: `translate(${isLeftEdge ? "10px" : isRightEdge ? "calc(-100% - 10px)" : "-50%"}, -100%)`,
                marginTop: "-14px", // Default state, animated by tooltip-in
                background: "rgba(30, 30, 35, 0.95)",
                backdropFilter: "blur(12px)",
                color: "white",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "11px",
                lineHeight: 1.5,
                whiteSpace: "nowrap",
                zIndex: 10,
                pointerEvents: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.08)",
                animation: "tooltip-in 0.15s ease forwards",
            }}
        >
            <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                {event.month} · HbA1c {event.hba1c}%
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)" }}>
                {event.source && <span>{sourceIcon} Found in {event.source}: </span>}
                {event.label}
            </div>
        </div>
    );
}

/* ── Chart ── */

function TimelineChart({
    showProjection,
    sliderValue,
    onHover,
    onLeave,
}: {
    showProjection: boolean;
    sliderValue: number;
    onHover: (ev: TimelineEvent, x: number, y: number) => void;
    onLeave: () => void;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const W = 700;
    const H = 200;
    const padX = 40;
    const padTop = 20;
    const padBot = 32;

    const pastData = TIMELINE_DATA.filter(d => d.type !== "future");
    const futureData = TIMELINE_DATA.filter(d => d.type === "future");
    const allData = showProjection ? TIMELINE_DATA : pastData;

    const minVal = 6.0;
    const maxVal = 9.0;
    const scaleY = (v: number) => padTop + ((maxVal - v) / (maxVal - minVal)) * (H - padTop - padBot);
    const scaleX = (i: number) => padX + (i / (allData.length - 1)) * (W - padX * 2);

    // Build past path
    const pastPoints = pastData.map((d, i) => ({ x: scaleX(i), y: scaleY(d.hba1c), data: d }));
    let pastD = `M ${pastPoints[0].x},${pastPoints[0].y}`;
    for (let i = 1; i < pastPoints.length; i++) {
        const cx = (pastPoints[i - 1].x + pastPoints[i].x) / 2;
        pastD += ` C ${cx},${pastPoints[i - 1].y} ${cx},${pastPoints[i].y} ${pastPoints[i].x},${pastPoints[i].y}`;
    }

    // Build future path
    let futureD = "";
    if (showProjection && futureData.length > 0) {
        const lastPast = pastPoints[pastPoints.length - 1];
        const futurePoints = futureData.map((d, i) => ({
            x: scaleX(pastData.length + i),
            y: scaleY(d.hba1c),
            data: d,
        }));
        futureD = `M ${lastPast.x},${lastPast.y}`;
        for (let i = 0; i < futurePoints.length; i++) {
            const prev = i === 0 ? lastPast : futurePoints[i - 1];
            const cx = (prev.x + futurePoints[i].x) / 2;
            futureD += ` C ${cx},${prev.y} ${cx},${futurePoints[i].y} ${futurePoints[i].x},${futurePoints[i].y}`;
        }
    }

    // Slider vertical line
    const sliderX = padX + (sliderValue / 100) * (W - padX * 2);

    // Target line at 6.8%
    const targetY = scaleY(6.8);

    // Y-axis grid
    const yTicks = [7.0, 7.5, 8.0, 8.5];

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: "100%", height: "auto" }}
        >
            <defs>
                <linearGradient id="tm-past-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5E6AD2" />
                    <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
                <linearGradient id="tm-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5E6AD2" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#5E6AD2" stopOpacity="0" />
                </linearGradient>
                <filter id="glow-red">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="tm-future-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4CB782" />
                    <stop offset="100%" stopColor="#27AE60" />
                </linearGradient>
            </defs>

            {/* Y-axis grid lines */}
            {yTicks.map(v => (
                <g key={v}>
                    <line
                        x1={padX} y1={scaleY(v)} x2={W - padX} y2={scaleY(v)}
                        stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4"
                    />
                    <text x={padX - 6} y={scaleY(v) + 3} textAnchor="end" fontSize="9" fill="var(--color-muted)" fontFamily="Inter, sans-serif">
                        {v}%
                    </text>
                </g>
            ))}

            {/* Target line */}
            {showProjection && (
                <g>
                    <line
                        x1={padX} y1={targetY} x2={W - padX} y2={targetY}
                        stroke="#27AE60" strokeWidth="1" strokeDasharray="6 3" opacity="0.5"
                    />
                    <text x={W - padX} y={targetY - 5} textAnchor="end" fontSize="9" fill="#27AE60" fontWeight="600" fontFamily="Inter, sans-serif">
                        6.8% Target
                    </text>
                </g>
            )}

            {/* Area fill under past line */}
            <path
                d={`${pastD} L ${pastPoints[pastPoints.length - 1].x},${H - padBot} L ${pastPoints[0].x},${H - padBot} Z`}
                fill="url(#tm-area-grad)"
            />

            {/* Past line */}
            <path
                d={pastD}
                fill="none"
                stroke="url(#tm-past-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ animation: "tm-draw 1s ease forwards" }}
            />

            {/* Future projection line */}
            {showProjection && futureD && (
                <path
                    d={futureD}
                    fill="none"
                    stroke="url(#tm-future-grad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                    style={{ animation: "tm-draw-future 0.8s ease 0.3s forwards", opacity: 0 }}
                />
            )}

            {/* Slider scrubber line */}
            <line
                x1={sliderX} y1={padTop} x2={sliderX} y2={H - padBot}
                stroke="var(--color-primary)" strokeWidth="1" opacity="0.3"
                strokeDasharray="3 3"
            />

            {/* Past event dots */}
            {pastPoints.map((p, i) => (
                <g key={i}>
                    {/* Invisible hit area */}
                    <circle
                        cx={p.x} cy={p.y} r={12}
                        fill="transparent"
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => onHover(p.data, p.x, p.y)}
                        onMouseLeave={onLeave}
                    />
                    {/* Visible dot */}
                    {p.data.type === "present" ? (
                        <g filter="url(#glow-red)">
                            <circle cx={p.x} cy={p.y} r={6} fill="#EB5757" opacity="0.3">
                                <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={p.x} cy={p.y} r={4} fill="#EB5757" stroke="white" strokeWidth="1.5" />
                        </g>
                    ) : (
                        <circle
                            cx={p.x} cy={p.y} r={3.5}
                            fill="white"
                            stroke="#5E6AD2"
                            strokeWidth="2"
                            style={{
                                transition: "r 0.15s ease",
                                cursor: "pointer",
                            }}
                        />
                    )}
                </g>
            ))}

            {/* Future dots */}
            {showProjection && futureData.map((d, i) => {
                const x = scaleX(pastData.length + i);
                const y = scaleY(d.hba1c);
                const isTarget = i === futureData.length - 1;
                return (
                    <g key={`f-${i}`} style={{ animation: `tm-dot-in 0.3s ease ${0.4 + i * 0.1}s both` }}>
                        <circle
                            cx={x} cy={y} r={12}
                            fill="transparent"
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => onHover(d, x, y)}
                            onMouseLeave={onLeave}
                        />
                        {isTarget ? (
                            <g>
                                <circle cx={x} cy={y} r={5} fill="#27AE60" stroke="white" strokeWidth="1.5" />
                                <circle cx={x} cy={y} r={8} fill="none" stroke="#27AE60" strokeWidth="1" opacity="0.3">
                                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2s" repeatCount="indefinite" />
                                </circle>
                            </g>
                        ) : (
                            <circle cx={x} cy={y} r={3} fill="white" stroke="#4CB782" strokeWidth="1.5" />
                        )}
                    </g>
                );
            })}

            {/* X-axis month labels — show for key months */}
            {allData.filter((_, i) => i % 2 === 0 || i === allData.length - 1).map((d, _, arr) => {
                const idx = allData.indexOf(d);
                return (
                    <text
                        key={d.month}
                        x={scaleX(idx)}
                        y={H - 8}
                        textAnchor="middle"
                        fontSize="8.5"
                        fill={d.type === "future" ? "#4CB782" : "var(--color-muted)"}
                        fontFamily="Inter, sans-serif"
                        fontWeight={d.type === "present" ? 600 : 400}
                    >
                        {d.month.split(" ")[0]}
                    </text>
                );
            })}
        </svg>
    );
}

/* ── Main Component ── */

export default function TimeMachine() {
    const { state } = useStore();
    const [showProjection, setShowProjection] = useState(false);
    const [sliderValue, setSliderValue] = useState(85); // Current month
    const [tooltip, setTooltip] = useState<{ event: TimelineEvent; x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Determine narrative text based on slider position
    const getNarrative = () => {
        const pastCount = TIMELINE_DATA.filter(d => d.type !== "future").length;
        const totalCount = showProjection ? TIMELINE_DATA.length : pastCount;
        const idx = Math.round((sliderValue / 100) * (totalCount - 1));
        const event = (showProjection ? TIMELINE_DATA : TIMELINE_DATA.filter(d => d.type !== "future"))[idx];
        if (!event) return { text: "", period: "" };

        if (event.type === "present") {
            return {
                text: `Current alert: HbA1c at ${event.hba1c}% — elevated above normal range. Peripheral neuropathy symptoms correlating with glycemic spike.`,
                period: "Present",
            };
        } else if (event.type === "future") {
            return {
                text: `Projected: With medication adjustment and lifestyle intervention, HbA1c could reach ${event.hba1c}% by ${event.month}.`,
                period: "Projected Future",
            };
        } else {
            return {
                text: `${event.month}: ${event.label || "No events recorded"} — HbA1c at ${event.hba1c}%.`,
                period: "Historical Trace",
            };
        }
    };

    const narrative = getNarrative();

    const handleHover = (ev: TimelineEvent, x: number, y: number) => {
        setTooltip({ event: ev, x, y });
    };

    return (
        <section
            id="time-machine"
            style={{
                marginTop: "24px",
                animation: "tm-section-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
        >
            <div className="section-header" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={12} strokeWidth={2} style={{ color: "var(--color-primary)" }} />
                    <span className="section-title">Medical Time-Machine</span>
                </div>

                {/* Projection Toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-muted)" }}>
                        {showProjection ? "Projection Active" : "Show Projection"}
                    </span>
                    <button
                        onClick={() => setShowProjection(!showProjection)}
                        style={{
                            width: "36px",
                            height: "20px",
                            borderRadius: "10px",
                            backgroundColor: showProjection ? "#4CB782" : "var(--color-border)",
                            position: "relative",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                            border: "none",
                            outline: "none",
                            padding: 0,
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
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        />
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="card"
                style={{
                    padding: "24px",
                    position: "relative",
                    overflow: "visible",
                }}
            >
                {/* Legend */}
                <div className="flex items-center gap-4" style={{ marginBottom: "16px" }}>
                    <div className="flex items-center gap-1.5">
                        <div style={{ width: "16px", height: "2px", borderRadius: "1px", background: "linear-gradient(90deg, #5E6AD2, #818CF8)" }} />
                        <span style={{ fontSize: "10px", color: "var(--color-muted)", fontWeight: 500 }}>Historical</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EB5757", boxShadow: "0 0 6px rgba(235,87,87,0.4)" }} />
                        <span style={{ fontSize: "10px", color: "var(--color-muted)", fontWeight: 500 }}>Current Alert</span>
                    </div>
                    {showProjection && (
                        <div className="flex items-center gap-1.5" style={{ animation: "tm-fade-in 0.3s ease forwards" }}>
                            <div style={{ width: "16px", height: "0", borderTop: "2px dashed #4CB782" }} />
                            <span style={{ fontSize: "10px", color: "#4CB782", fontWeight: 500 }}>Projection</span>
                        </div>
                    )}
                </div>

                {/* Chart with hover tooltips */}
                <div style={{ position: "relative" }}>
                    <TimelineChart
                        showProjection={showProjection}
                        sliderValue={sliderValue}
                        onHover={handleHover}
                        onLeave={() => setTooltip(null)}
                    />
                    {tooltip && <EventTooltip {...tooltip} />}
                </div>

                {/* Timeline Scrubber Slider — Apple-style */}
                <div style={{ padding: "8px 40px 0" }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                        style={{
                            width: "100%",
                            height: "4px",
                            appearance: "none",
                            WebkitAppearance: "none",
                            borderRadius: "2px",
                            outline: "none",
                            cursor: "pointer",
                            background: `linear-gradient(90deg, #5E6AD2 0%, #5E6AD2 ${sliderValue}%, var(--color-border) ${sliderValue}%, var(--color-border) 100%)`,
                        }}
                    />
                </div>

                {/* Dynamic narrative */}
                <div
                    style={{
                        marginTop: "16px",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background: "var(--color-surface-secondary)",
                        border: "1px solid var(--color-border-subtle)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        transition: "all 0.3s ease",
                    }}
                >
                    {narrative.period === "Present" ? (
                        <AlertTriangle size={14} strokeWidth={2} style={{ color: "#EB5757", flexShrink: 0, marginTop: "1px" }} />
                    ) : narrative.period === "Projected Future" ? (
                        <Target size={14} strokeWidth={2} style={{ color: "#4CB782", flexShrink: 0, marginTop: "1px" }} />
                    ) : (
                        <Mail size={14} strokeWidth={2} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "1px" }} />
                    )}
                    <div>
                        <span
                            style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: narrative.period === "Present" ? "#EB5757" : narrative.period === "Projected Future" ? "#4CB782" : "var(--color-primary)",
                                display: "block",
                                marginBottom: "4px",
                            }}
                        >
                            {narrative.period}
                        </span>
                        <p style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--color-foreground)" }}>
                            {narrative.text}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes tm-section-enter {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes tm-draw {
                    from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
                    to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
                }
                @keyframes tm-draw-future {
                    from { opacity: 0; stroke-dashoffset: 100; }
                    to { opacity: 1; stroke-dashoffset: 0; }
                }
                @keyframes tm-dot-in {
                    from { opacity: 0; transform: scale(0); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes tm-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes tooltip-in {
                    from { opacity: 0; margin-top: -6px; }
                    to { opacity: 1; margin-top: -14px; }
                }
                /* Apple-style range slider thumb */
                #time-machine input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #5E6AD2;
                    box-shadow: 0 2px 6px rgba(94, 106, 210, 0.3);
                    cursor: pointer;
                    transition: box-shadow 0.2s ease, transform 0.2s ease;
                }
                #time-machine input[type="range"]::-webkit-slider-thumb:hover {
                    box-shadow: 0 4px 12px rgba(94, 106, 210, 0.45);
                    transform: scale(1.15);
                }
                #time-machine input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #5E6AD2;
                    box-shadow: 0 2px 6px rgba(94, 106, 210, 0.3);
                    cursor: pointer;
                }
            `}</style>
        </section>
    );
}
