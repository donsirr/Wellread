"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "./StoreContext";

export default function CorrelationLines() {
    const { state } = useStore();
    const [lineProps, setLineProps] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);

    useEffect(() => {
        const calculatePoints = () => {
            // Check either isCorrelated or activeCorrelationId
            if (!state.isCorrelated && !state.activeCorrelationId) {
                setLineProps(null);
                return;
            }

            // Prefer strictly finding the object or fallback to simple active string check
            let fromId = "";
            let toId = "";

            if (state.activeCorrelationId) {
                const activeCorr = state.correlations.find(c => c.id === state.activeCorrelationId);
                if (activeCorr) {
                    fromId = activeCorr.sourceID;
                    toId = activeCorr.metricID;
                }
            }

            if (!fromId || !toId) {
                setLineProps(null);
                return;
            }

            const sourceEl = document.getElementById(fromId);
            const metricEl = document.getElementById(toId);

            if (sourceEl && metricEl) {
                const sRect = sourceEl.getBoundingClientRect();
                const mRect = metricEl.getBoundingClientRect();

                // Compute start and end points
                // Source card is typically on the left, so we connect from its right edge
                const x1 = sRect.right;
                const y1 = sRect.top + sRect.height / 2;

                // Metric card is center, connect to its left top/bottom or center
                const x2 = mRect.left;
                const y2 = mRect.top + mRect.height / 2;

                setLineProps({ x1, y1, x2, y2 });
            } else {
                setLineProps(null);
            }
        };

        // Calculate initially
        calculatePoints();

        // Recalculate on window resize
        window.addEventListener("resize", calculatePoints);

        // Recalculate slightly after render and state updates to ensure DOM is settled
        const id = setTimeout(calculatePoints, 300);

        return () => {
            window.removeEventListener("resize", calculatePoints);
            clearTimeout(id);
        };
    }, [state.activeCorrelationId, state.isCorrelated, state.correlations]);

    if (!lineProps) return null;

    // Create a smooth bezier curve between the two points
    const { x1, y1, x2, y2 } = lineProps;

    // Add tension delta based on distance
    const dist = Math.abs(x2 - x1);
    const cp1x = x1 + dist * 0.4;
    const cp2x = x2 - dist * 0.4;

    const pathD = `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;

    return (
        <svg
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 50,
            }}
        >
            {/* Base glowing line */}
            <motion.path
                d={pathD}
                fill="none"
                stroke="#5170FF"
                strokeWidth={2.5}
                style={{
                    filter: "drop-shadow(0 0 6px rgba(81, 112, 255, 0.6))"
                }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
            />

            {/* Animated dashes overlaid */}
            <motion.path
                d={pathD}
                fill="none"
                stroke="#818CF8" // Lighter blue for the moving bits
                strokeWidth={2.5}
                strokeDasharray="6 12"
                initial={{ strokeDashoffset: 100, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: 1 }}
                transition={{
                    strokeDashoffset: { repeat: Infinity, duration: 2, ease: "linear" },
                    opacity: { duration: 1.0, delay: 0.5 }
                }}
                style={{
                    filter: "drop-shadow(0 0 10px rgba(81, 112, 255, 0.9))"
                }}
            />

            {/* Origin Dot */}
            <motion.circle
                cx={x1} cy={y1} r={5} fill="#5170FF"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
            />
            <motion.circle
                cx={x1} cy={y1} r={10} fill="rgba(81, 112, 255, 0.3)"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ delay: 0.1, duration: 2, repeat: Infinity }}
            />

            {/* Target Dot */}
            <motion.circle
                cx={x2} cy={y2} r={5} fill="#5170FF"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 }} // Waits for line to trace
            />
            <motion.circle
                cx={x2} cy={y2} r={10} fill="rgba(81, 112, 255, 0.3)"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ delay: 0.9, duration: 2, repeat: Infinity }}
            />
        </svg>
    );
}
