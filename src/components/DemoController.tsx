"use client";

import { useEffect, useState } from "react";
import { useStore } from "./StoreContext";
import initialState from "../state.json";

export default function DemoController() {
    const [isVisible, setIsVisible] = useState(
        process.env.NODE_ENV === "development"
    );
    const { updateState, triggerCorrelation, updateMetric } = useStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "d") {
                e.preventDefault();
                setIsVisible((v) => !v);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!isVisible) return null;

    const resetDemo = () => {
        updateState((prev) => ({
            ...prev,
            mcpSources: prev.mcpSources.map(s => ({ ...s, status: s.type === "Appointment" ? "analyzed" : "pending" })),
            clinicalMetrics: prev.clinicalMetrics.map(m =>
                m.id === "metric-hba1c" ? { ...m, value: "?" } : m
            ),
            activeCorrelationId: null,
            isCorrelated: false,
            showBrief: false,
        }));
    };

    const step1 = () => {
        updateState((prev) => ({
            ...prev,
            mcpSources: prev.mcpSources.map(s =>
                s.id === "src-gmail" ? { ...s, status: "analyzed" } : s
            ),
        }));
    };

    const step2 = () => {
        updateState((prev) => ({
            ...prev,
            mcpSources: prev.mcpSources.map(s =>
                s.id === "src-lab-pdf" ? { ...s, status: "analyzed" } : s
            ),
        }));
        // Populate Blood Sugar metric with its actual initial value
        updateMetric("metric-hba1c", initialState.clinicalMetrics.find(m => m.id === "metric-hba1c")?.value || "8.6");
    };

    const step3 = () => {
        triggerCorrelation("src-gmail", "metric-hba1c");
    };

    const step4 = () => {
        updateState((prev) => ({ ...prev, showBrief: true }));
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                padding: "20px",
                background: "rgba(20, 20, 23, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                zIndex: 9999,
                color: "white",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "260px"
            }}
        >
            <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8A8F98" }}>
                    Demo Controller
                </span>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{ background: "none", border: "none", color: "#8A8F98", cursor: "pointer", fontSize: "16px" }}
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>

            <button onClick={resetDemo} style={btnStyle}>Reset Demo</button>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <button onClick={step1} style={btnStyle}>Step 1: Fetch Gmail</button>
            <button onClick={step2} style={btnStyle}>Step 2: Parse PDF</button>
            <button onClick={step3} style={btnStyle}>Step 3: Analyze & Correlate</button>
            <button onClick={step4} style={btnStyle}>Step 4: Final Brief</button>
        </div>
    );
}

const btnStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#E2E8F0",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "all 0.2s ease",
};
