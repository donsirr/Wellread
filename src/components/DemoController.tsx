"use client";

import { useEffect, useState } from "react";
import { useStore } from "./StoreContext";

export default function DemoController() {
    const [isVisible, setIsVisible] = useState(
        process.env.NODE_ENV === "development"
    );
    const { state, jumpToStep, resetDemo } = useStore();

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
                    Demo Controller (Step {state.currentStep})
                </span>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{ background: "none", border: "none", color: "#8A8F98", cursor: "pointer", fontSize: "16px" }}
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>

            <button onClick={() => resetDemo()} style={btnStyle(state.currentStep === 0)}>Reset Demo</button>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <button onClick={() => jumpToStep(1)} style={btnStyle(state.currentStep === 1)}>Step 1: Fetch Gmail</button>
            <button onClick={() => jumpToStep(2)} style={btnStyle(state.currentStep === 2)}>Step 2: Parse PDF</button>
            <button onClick={() => jumpToStep(3)} style={btnStyle(state.currentStep === 3)}>Step 3: Analyze & Correlate</button>
            <button onClick={() => jumpToStep(4)} style={btnStyle(state.currentStep === 4)}>Step 4: Final Brief</button>
        </div>
    );
}

const btnStyle = (isActive: boolean) => ({
    background: isActive ? "rgba(94, 106, 210, 0.2)" : "rgba(255, 255, 255, 0.05)",
    border: isActive ? "1px solid rgba(94, 106, 210, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: isActive ? "#818CF8" : "#E2E8F0",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "all 0.2s ease",
});
