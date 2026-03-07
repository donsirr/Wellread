"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Check } from "lucide-react";
import { useStore } from "./StoreContext";

export default function AppHero({ onDismiss }: { onDismiss: () => void }) {
    const [agreeTos, setAgreeTos] = useState(false);
    const [agreeHipaa, setAgreeHipaa] = useState(false);

    const isReady = agreeTos && agreeHipaa;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.4)",
                padding: "20px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    background: "white",
                    borderRadius: "24px",
                    padding: "48px 40px",
                    width: "100%",
                    maxWidth: "460px",
                    boxShadow: "0 24px 48px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                {/* Logo / Icon */}
                <div
                    style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "18px",
                        background: "linear-gradient(135deg, #5170FF 0%, #7E95FF 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "24px",
                        boxShadow: "0 8px 24px rgba(81, 112, 255, 0.3)",
                    }}
                >
                    <ShieldCheck size={32} color="white" strokeWidth={2.5} />
                </div>

                {/* Typography */}
                <h1
                    style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "var(--color-foreground)",
                        letterSpacing: "-0.03em",
                        marginBottom: "12px",
                    }}
                >
                    Welcome to WellRead
                </h1>

                <p
                    style={{
                        fontSize: "15px",
                        color: "var(--color-muted-foreground)",
                        lineHeight: 1.6,
                        marginBottom: "32px",
                    }}
                >
                    WellRead uses the Model Context Protocol (MCP) to securely synthesize your clinical history, emails, and lab reports into a comprehensive physician brief.
                </p>

                {/* Consent Checkboxes */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
                    {/* ToS Checkbox */}
                    <label
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            padding: "16px",
                            borderRadius: "16px",
                            background: agreeTos ? "rgba(81, 112, 255, 0.04)" : "var(--color-surface-secondary)",
                            border: agreeTos ? "1px solid rgba(81, 112, 255, 0.2)" : "1px solid transparent",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            textAlign: "left",
                        }}
                        onClick={() => setAgreeTos(!agreeTos)}
                    >
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "6px",
                                border: agreeTos ? "none" : "2px solid var(--color-border)",
                                background: agreeTos ? "#5170FF" : "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: "2px",
                            }}
                        >
                            {agreeTos && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-foreground)", marginBottom: "2px" }}>
                                Terms of Service
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--color-muted)" }}>
                                I agree to the <a href="/eula" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "#5170FF", textDecoration: "underline" }}>WellRead End User License Agreement</a>.
                            </div>
                        </div>
                    </label>

                    {/* HIPAA/Data Checkbox */}
                    <label
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            padding: "16px",
                            borderRadius: "16px",
                            background: agreeHipaa ? "rgba(81, 112, 255, 0.04)" : "var(--color-surface-secondary)",
                            border: agreeHipaa ? "1px solid rgba(81, 112, 255, 0.2)" : "1px solid transparent",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            textAlign: "left",
                        }}
                        onClick={() => setAgreeHipaa(!agreeHipaa)}
                    >
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "6px",
                                border: agreeHipaa ? "none" : "2px solid var(--color-border)",
                                background: agreeHipaa ? "#5170FF" : "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: "2px",
                            }}
                        >
                            {agreeHipaa && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-foreground)", marginBottom: "2px" }}>
                                Medical Data Processing
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--color-muted)" }}>
                                I consent to <a href="/data-processing" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "#5170FF", textDecoration: "underline" }}>automated analysis of my personal health records</a> via isolated MCP instances.
                            </div>
                        </div>
                    </label>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => {
                        if (isReady) onDismiss();
                    }}
                    disabled={!isReady}
                    style={{
                        width: "100%",
                        padding: "16px",
                        fontSize: "15px",
                        fontWeight: 600,
                        borderRadius: "14px",
                        background: isReady ? "linear-gradient(135deg, #5170FF 0%, #7E95FF 100%)" : "var(--color-surface-secondary)",
                        color: isReady ? "white" : "var(--color-muted)",
                        cursor: isReady ? "pointer" : "not-allowed",
                        border: "none",
                        outline: "none",
                        boxShadow: isReady ? "0 8px 24px rgba(81, 112, 255, 0.3)" : "none",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        letterSpacing: "-0.01em",
                    }}
                    onMouseEnter={(e) => {
                        if (isReady) {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(81, 112, 255, 0.4)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (isReady) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(81, 112, 255, 0.3)";
                        }
                    }}
                >
                    Continue to Dashboard
                </button>
            </motion.div>
        </motion.div>
    );
}
