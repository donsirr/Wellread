"use client";

import { Activity, Heart } from "lucide-react";
import { useStore } from "./StoreContext";

export default function PatientBadge() {
    const { state } = useStore();
    const profile = state.patientProfile;
    const initials = profile.name
        .split(" ")
        .map((n) => n[0])
        .join("");

    return (
        <div
            style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle top accent */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #5170FF, #818CF8, #5170FF)",
                    backgroundSize: "200% 100%",
                    animation: "accent-shimmer 3s ease infinite",
                }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Avatar with status ring */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            padding: "2px",
                            background: "linear-gradient(135deg, #4CB782, #5170FF)",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "2px solid white",
                            }}
                        >
                            <img
                                src="/patient-avatar.png"
                                alt={profile.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                onError={(e) => {
                                    // Fallback to initials if image fails
                                    const target = e.currentTarget;
                                    target.style.display = "none";
                                    if (target.parentElement) {
                                        target.parentElement.style.display = "flex";
                                        target.parentElement.style.alignItems = "center";
                                        target.parentElement.style.justifyContent = "center";
                                        target.parentElement.style.background = "var(--color-primary-soft)";
                                        target.parentElement.style.fontSize = "16px";
                                        target.parentElement.style.fontWeight = "700";
                                        target.parentElement.style.color = "var(--color-primary)";
                                        target.parentElement.innerHTML = initials;
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* Online indicator */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "2px",
                            right: "2px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "#4CB782",
                            border: "2px solid white",
                        }}
                    />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "var(--color-foreground)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.2,
                        }}
                    >
                        {profile.name}
                    </p>
                    <p
                        style={{
                            fontSize: "11px",
                            color: "var(--color-muted)",
                            fontWeight: 500,
                            marginTop: "2px",
                        }}
                    >
                        ID: #JDC-2026 · Age {profile.age}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginTop: "8px",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "10px",
                                fontWeight: 600,
                                color: "#5170FF",
                                background: "rgba(81, 112, 255, 0.08)",
                                padding: "3px 8px",
                                borderRadius: "6px",
                            }}
                        >
                            <Heart size={9} strokeWidth={2.5} />
                            Chronic Care
                        </span>
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "10px",
                                fontWeight: 600,
                                color: "#F2994A",
                                background: "rgba(242, 153, 74, 0.08)",
                                padding: "3px 8px",
                                borderRadius: "6px",
                            }}
                        >
                            <Activity size={9} strokeWidth={2.5} />
                            Active
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes accent-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}
