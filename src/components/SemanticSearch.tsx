"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   SemanticSearch — AI gateway with Connection Lines
   ───────────────────────────────────────────────────────────── */

interface LineData {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label: string;
    rect: { left: number; top: number; width: number; height: number; borderRadius: number };
}

export default function SemanticSearch() {
    const [query, setQuery] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [lines, setLines] = useState<LineData[]>([]);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cleanupRefs = useRef<(() => void)[]>([]);

    // When user types, trigger the "thinking" effect and draw lines after a delay
    useEffect(() => {
        // Clean up previous event listeners whenever we recalculate
        cleanupRefs.current.forEach(cleanup => cleanup());
        cleanupRefs.current = [];
        setHoveredCard(null);

        if (query.trim().length > 5) {
            setIsThinking(true);
            setLines([]);

            const timer = setTimeout(() => {
                setIsThinking(false);
                drawConnections();
            }, 1500);

            return () => {
                clearTimeout(timer);
                cleanupRefs.current.forEach(cleanup => cleanup());
                cleanupRefs.current = [];
            };
        } else {
            setIsThinking(false);
            setLines([]);
        }
    }, [query]);

    // Read DOM to find targets and calculate line coordinates
    const drawConnections = () => {
        if (!containerRef.current) return;

        const searchRect = containerRef.current.getBoundingClientRect();

        const newLines: LineData[] = [];

        [
            { element: document.querySelector('#src-gmail') || document.querySelectorAll('.source-file-card')[0], label: "Symptom Log" },
            { element: document.querySelector('#src-lab-pdf') || document.querySelectorAll('.source-file-card')[1], label: "Lab Match" },
            { element: document.querySelector('#narrative-intelligence .flex-1'), label: "Clinical Correlation" }
        ].forEach((target, index) => {
            if (target.element) {
                const rect = target.element.getBoundingClientRect();

                let x1, y1, x2, y2;

                // All lines originate from the left side of the search bar
                x1 = searchRect.left + 24;
                y1 = searchRect.top + (searchRect.height / 2);

                if (target.label === "Clinical Correlation") {
                    // Connect to the left edge of the Narrative text box
                    x2 = rect.left;
                    y2 = rect.top + (rect.height / 2);
                } else {
                    // Start from left side of search bar, go to right edge of Left Rail cards
                    x2 = rect.right;
                    y2 = rect.top + (rect.height / 2);
                }

                // Attach hover listeners to the actual DOM elements
                const el = target.element as HTMLElement;
                const handleEnter = () => setHoveredCard(target.label);
                const handleLeave = () => setHoveredCard(null);

                el.addEventListener("mouseenter", handleEnter);
                el.addEventListener("mouseleave", handleLeave);

                cleanupRefs.current.push(() => {
                    el.removeEventListener("mouseenter", handleEnter);
                    el.removeEventListener("mouseleave", handleLeave);
                });

                newLines.push({
                    id: `line-${index}`,
                    x1, y1, x2, y2,
                    label: target.label,
                    rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: 16 }
                });
            }
        });

        setLines(newLines);
    };

    // Recalculate lines on resize
    useEffect(() => {
        const handleResize = () => {
            if (lines.length > 0) drawConnections();
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [lines.length]);

    return (
        <>
            <div
                ref={containerRef}
                className="relative w-full mb-8 z-20"
            >
                <div
                    className={`flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-md border rounded-2xl transition-all duration-300 ${isThinking ? "border-primary/50 shadow-[0_0_15px_rgba(94,106,210,0.2)]" : "border-white/40 shadow-xl shadow-slate-200/50"
                        }`}
                >
                    {isThinking ? (
                        <div className="relative flex items-center justify-center w-5 h-5">
                            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            <Sparkles size={10} className="text-primary animate-pulse" />
                        </div>
                    ) : (
                        <Search size={18} className="text-muted-foreground" />
                    )}

                    <input
                        type="text"
                        placeholder="Ask WellRead anything... (e.g., When did my tingling start?)"
                        className="flex-1 bg-transparent border-none outline-none text-[14px] text-foreground placeholder:text-muted-foreground/70"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {isThinking && (
                        <span className="text-[11px] font-medium text-primary animate-pulse mr-2">
                            AI is thinking...
                        </span>
                    )}
                </div>
            </div>

            {/* Highlight Overlays (Glowing Border around targeted cards) */}
            <AnimatePresence>
                {lines.map((line) => (
                    <motion.div
                        key={`highlight-${line.id}`}
                        style={{
                            position: "fixed",
                            left: line.rect.left,
                            top: line.rect.top,
                            width: line.rect.width,
                            height: line.rect.height,
                            borderRadius: `${line.rect.borderRadius}px`,
                            pointerEvents: "none",
                            zIndex: 10,
                            boxShadow: "0 0 0 2px var(--color-primary), 0 4px 20px rgba(94,106,210,0.15)"
                        }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1, duration: 0.4 }}
                    />
                ))}
            </AnimatePresence>

            {/* Custom Tooltips for Connections */}
            <AnimatePresence>
                {lines.map((line) => {
                    if (hoveredCard !== line.label) return null;

                    const isNarrative = line.label === "Clinical Correlation";

                    return (
                        <motion.div
                            key={`tooltip-${line.id}`}
                            initial={{ opacity: 0, y: isNarrative ? 10 : 0, x: isNarrative ? 0 : -10 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                            style={{
                                position: "fixed",
                                // For left rail items, put tooltip to the right of the dot.
                                // For Narrative, put it to the left of the dot.
                                left: isNarrative ? line.x2 - 190 : line.x2 + 16,
                                top: isNarrative ? line.y2 - 16 : line.y2 - 16,
                                zIndex: 50,
                                background: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(12px)",
                                border: "1px solid rgba(94, 106, 210, 0.2)",
                                boxShadow: "0 8px 30px rgba(94, 106, 210, 0.15)",
                                padding: "6px 12px",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                pointerEvents: "none",
                            }}
                        >
                            <Sparkles size={12} className="text-primary" />
                            <span
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "var(--color-primary)",
                                    letterSpacing: "0.02em",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {line.label}
                            </span>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* SVG Overlay for Connection Lines */}
            {/* Must be fixed full screen, pointer-events-none so it doesn't block clicks */}
            <svg
                className="fixed inset-0 w-full h-full pointer-events-none z-10"
                style={{ opacity: lines.length > 0 ? 1 : 0, transition: "opacity 0.5s ease" }}
            >
                <AnimatePresence>
                    {lines.map((line) => {
                        // Horizontal S-curve for all lines
                        const cxMid = line.x1 - (line.x1 - line.x2) / 2;
                        let path = `M ${line.x1} ${line.y1} C ${cxMid} ${line.y1}, ${cxMid} ${line.y2}, ${line.x2} ${line.y2}`;

                        return (
                            <motion.g key={line.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Glow behind the line */}
                                <motion.path
                                    d={path}
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="6"
                                    strokeOpacity="0.15"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                />
                                {/* Actual line */}
                                <motion.path
                                    d={path}
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                />
                                {/* Target node dot */}
                                <motion.circle
                                    cx={line.x2}
                                    cy={line.y2}
                                    r="4"
                                    fill="var(--color-surface)"
                                    stroke="var(--color-primary)"
                                    strokeWidth="2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8, type: "spring" }}
                                />

                            </motion.g>
                        );
                    })}
                </AnimatePresence>
            </svg>
        </>
    );
}
