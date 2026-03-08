"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Mail, HardDrive, Lock, Cloud } from "lucide-react";
import { useStore } from "./StoreContext";

/* ─────────────────────────────────────────────────────────────
   Privacy Guard — MCP Security Indicator
   ─────────────────────────────────────────────────────────────
   On load:
     1. Gmail & Drive icons converge toward the shield (1.8s)
     2. Shield glows green (at ~1.8s)
     3. Converge icons fade out, shield settles into subtle pulse

   On hover: Expands a "Security Toast" with status text.
   ───────────────────────────────────────────────────────────── */

type Phase = "idle" | "handshake" | "glow" | "ready";

export default function PrivacyGuard() {
    const [phase, setPhase] = useState<Phase>("idle");
    const [hovered, setHovered] = useState(false);
    const { state } = useStore();

    const isLocalOnly = state.mcpSources.some(s => s.privacyStatus === 'local_only');

    /* ── Boot sequence ── */
    useEffect(() => {
        // Start handshake after a brief delay so the page settles
        const t1 = setTimeout(() => setPhase("handshake"), 400);
        // Shield glow starts when converge icons reach center (~1.6s)
        const t2 = setTimeout(() => setPhase("glow"), 2000);
        // Settle into ready (pulse) state
        const t3 = setTimeout(() => setPhase("ready"), 3000);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    const isHandshaking = phase === "handshake";
    const isGlowing = phase === "glow";
    const isReady = phase === "ready";
    const showPulse = isReady;

    return (
        <div
            id="privacy-guard"
            className="flex items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ position: "relative", cursor: "pointer" }}
        >
            {/* Security Toast (expands on hover) */}
            <div className={`privacy-toast flex items-center gap-2 ${hovered ? "expanded" : ""}`}>
                <div className="flex items-center gap-1.5">
                    {isLocalOnly ? (
                        <Lock size={11} strokeWidth={2} style={{ color: "var(--color-success)" }} />
                    ) : (
                        <Cloud size={11} strokeWidth={2} style={{ color: "var(--color-primary)" }} />
                    )}
                    <span
                        style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: "var(--color-foreground)",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {isLocalOnly ? "Local-First Processing Active" : "Cloud Processing Active"}
                    </span>
                </div>
                <span
                    style={{
                        fontSize: "10px",
                        color: "var(--color-muted)",
                        borderLeft: "1px solid var(--color-border)",
                        paddingLeft: "8px",
                    }}
                >
                    {isLocalOnly ? "via MCP · data stays on-device" : "via Secure Cloud · E2E Encrypted"}
                </span>
            </div>

            {/* Handshake convergence icons */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                }}
            >
                {/* Gmail icon — converges from left */}
                {isHandshaking && (
                    <div
                        className="handshake-icon-left"
                        style={{
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Mail size={12} strokeWidth={1.5} style={{ color: "var(--color-primary)" }} />
                    </div>
                )}

                {/* Drive icon — converges from right */}
                {isHandshaking && (
                    <div
                        className="handshake-icon-right"
                        style={{
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <HardDrive size={12} strokeWidth={1.5} style={{ color: "var(--color-warning)" }} />
                    </div>
                )}

                {/* Shield icon */}
                <div
                    className={`privacy-guard-shield ${isGlowing ? "glowing" : ""}`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        border: `1.5px solid ${isGlowing || isReady
                            ? "var(--color-success)"
                            : "var(--color-border)"
                            }`,
                        background:
                            isGlowing || isReady
                                ? "var(--color-success-soft)"
                                : "var(--color-surface)",
                        transition: "background 0.5s ease, border-color 0.5s ease",
                        position: "relative",
                        zIndex: 2,
                        animationPlayState: showPulse ? "running" : "paused",
                    }}
                >
                    <ShieldCheck
                        size={16}
                        strokeWidth={1.5}
                        style={{
                            color:
                                isGlowing || isReady
                                    ? "var(--color-success)"
                                    : "var(--color-muted)",
                            transition: "color 0.5s ease",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
