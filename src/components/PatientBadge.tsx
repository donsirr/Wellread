"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Heart, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "./StoreContext";
import initialState from "../state.json";

export default function PatientBadge() {
    const { state, switchPatient } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const profile = state.patientProfile;
    const initials = profile.name
        .split(" ")
        .map((n) => n[0])
        .join("");

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getAvatarSrc = (name: string) => {
        if (name === "Juan Dela Cruz") return "/patient-avatar.png";
        if (name === "Maria Dela Cruz") return "/maria.png";
        if (name === "John Doe") return "/john.png";
        if (name === "Jane Doe") return "/jane.png";
        return "";
    };

    return (
        <div style={{ position: "relative" }} ref={dropdownRef}>
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

                <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%" }}>
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
                                    src={getAvatarSrc(profile.name)}
                                    alt={profile.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                    onError={(e) => {
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
                            ID: #{initials}-{profile.dob ? new Date(profile.dob).getFullYear() : '2026'} · Age {profile.age}
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

                    {/* Right side Dropdown Trigger */}
                    <div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                border: isOpen ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                                background: isOpen ? "var(--color-primary-soft)" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                color: isOpen ? "var(--color-primary)" : "var(--color-muted)",
                            }}
                        >
                            <ChevronDown size={18} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                        </button>
                    </div>
                </div>

                <style>{`
                @keyframes accent-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            right: 0,
                            width: "280px",
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(12px)",
                            borderRadius: "12px",
                            border: "1px solid var(--color-border)",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            zIndex: 50,
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border)", background: "#F8F9FC" }}>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Patient</span>
                        </div>
                        <div style={{ padding: "6px" }}>
                            {initialState.patientDatabase.map(p => {
                                const isActive = p.patientProfile.name === profile.name;
                                return (
                                    <button
                                        key={p.patientProfile.name}
                                        onClick={() => {
                                            switchPatient(p.patientProfile.name);
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "8px 10px",
                                            borderRadius: "8px",
                                            background: isActive ? "var(--color-primary-soft)" : "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "background 0.15s ease",
                                            marginBottom: "2px"
                                        }}
                                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F8F9FC"; }}
                                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "50%",
                                                    overflow: "hidden",
                                                    border: isActive ? "2px solid var(--color-primary)" : "2px solid #E2E8F0",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: "var(--color-surface)",
                                                }}
                                            >
                                                <img
                                                    src={getAvatarSrc(p.patientProfile.name)}
                                                    alt={p.patientProfile.name}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={(e) => {
                                                        const target = e.currentTarget;
                                                        target.style.display = "none";
                                                        if (target.parentElement) {
                                                            target.parentElement.style.background = "var(--color-primary-soft)";
                                                            target.parentElement.style.color = "var(--color-primary)";
                                                            target.parentElement.style.fontSize = "12px";
                                                            target.parentElement.style.fontWeight = "700";
                                                            target.parentElement.innerHTML = p.patientProfile.name.split(" ").map(n => n[0]).join("");
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "13px", fontWeight: 600, color: isActive ? "var(--color-primary)" : "var(--color-foreground)" }}>
                                                    {p.patientProfile.name}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "var(--color-muted)", marginTop: "1px" }}>
                                                    {p.patientProfile.age} yrs · {p.patientProfile.conditions?.[0] || 'New Patient'}
                                                </div>
                                            </div>
                                        </div>
                                        {isActive && <Check size={16} color="var(--color-primary)" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
