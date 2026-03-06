"use client";

import { motion } from "framer-motion";
import { Share2, FileText, Calendar, User, AlertTriangle, Plus, TrendingUp, X } from "lucide-react";
import { useConsultation } from "./ConsultationContext";
import data from "../data.json";

/* ─────────────────────────────────────────────────────────────
   Mock QR Code (clean SVG pattern)
   ───────────────────────────────────────────────────────────── */

function QRCode({ size = 140 }: { size?: number }) {
    // Deterministic QR-like pattern
    const grid = 11;
    const cell = size / grid;
    const pattern = [
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    ];

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill="white" rx={4} />
            {pattern.map((row, y) =>
                row.map((val, x) =>
                    val ? (
                        <rect
                            key={`${x}-${y}`}
                            x={x * cell + 1}
                            y={y * cell + 1}
                            width={cell - 2}
                            height={cell - 2}
                            rx={1}
                            fill="#1B1B1B"
                        />
                    ) : null
                )
            )}
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────
   Medical Cross Bullet
   ───────────────────────────────────────────────────────────── */

function MedCross({ color = "#EB5757" }: { color?: string }) {
    return (
        <svg width={14} height={14} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "4px" }}>
            <rect x="5.5" y="1" width="5" height="14" rx="1.5" fill={color} />
            <rect x="1" y="5.5" width="14" height="5" rx="1.5" fill={color} />
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────
   Framer Motion Variants
   ───────────────────────────────────────────────────────────── */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.25 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

/* ─────────────────────────────────────────────────────────────
   Data
   ───────────────────────────────────────────────────────────── */

const observations = data.consultation.observations;
const questions = data.consultation.questions;

const sevColor: Record<string, string> = { high: "#EB5757", medium: "#F2994A", low: "#4CB782" };

/* ─────────────────────────────────────────────────────────────
   ConsultationView
   ───────────────────────────────────────────────────────────── */

export default function ConsultationView() {
    const { toggleConsultationMode } = useConsultation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                overflowY: "auto",
                background: "var(--color-background)",
                minHeight: "100vh"
            }}
        >
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">

                    {/* ── Close / Exit Bar ── */}
                    <motion.div variants={cardVariants} className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div
                                style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "#4CB782",
                                    boxShadow: "0 0 6px rgba(76, 183, 130, 0.4)",
                                }}
                            />
                            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8A8F98" }}>Consultation Mode Active</span>
                        </div>
                        <button
                            id="exit-consultation"
                            onClick={toggleConsultationMode}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 16px",
                                borderRadius: "10px",
                                border: "1px solid #E8E8E8",
                                background: "#FFFFFF",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#6B6F76",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <X size={14} strokeWidth={2} />
                            Exit
                        </button>
                    </motion.div>

                    {/* ── Patient Header (Dark) ── */}
                    <motion.div variants={cardVariants} className="card card-glow" style={{ padding: "32px", marginBottom: "20px" }}>
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    borderRadius: "16px",
                                    background: "var(--color-surface-secondary)",
                                    border: "1px solid var(--color-border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <User size={28} strokeWidth={1.2} style={{ color: "var(--color-primary)" }} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--color-foreground)" }}>
                                    Physician Consultation
                                </h1>
                                <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", marginTop: "4px" }}>
                                    {data.patient.name} · DOB: {data.patient.dob}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4" style={{ fontSize: "13px", opacity: 0.65 }}>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} strokeWidth={1.5} />
                                Mar 7, 2026
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FileText size={13} strokeWidth={1.5} />
                                2 sources · 14 data points
                            </span>
                            <span style={{
                                background: "rgba(76, 183, 130, 0.2)",
                                color: "#4CB782",
                                padding: "3px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                            }}>
                                92% Confidence
                            </span>
                        </div>
                    </motion.div>

                    {/* ── Trajectory ── */}
                    <motion.div variants={cardVariants} className="card" style={{ padding: "24px", marginBottom: "16px" }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "var(--color-success-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <TrendingUp size={16} strokeWidth={2} style={{ color: "var(--color-success)" }} />
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>Trajectory</span>
                        </div>
                        <p style={{ fontSize: "18px", fontWeight: 500, lineHeight: 1.6, color: "var(--color-foreground)", letterSpacing: "-0.01em" }}>
                            {data.consultation.trajectory}
                        </p>
                    </motion.div>

                    {/* ── Critical Observations ── */}
                    <motion.div variants={cardVariants} className="card" style={{ padding: "24px", marginBottom: "16px" }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "var(--color-danger-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <AlertTriangle size={16} strokeWidth={2} style={{ color: "var(--color-danger)" }} />
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>Critical Observations</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            {observations.map((obs, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <MedCross color={sevColor[obs.severity]} />
                                    <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--color-foreground)" }}>
                                        {obs.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Recommended Questions ── */}
                    <motion.div variants={cardVariants} className="card" style={{ padding: "24px", marginBottom: "16px" }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "var(--color-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-primary)" }}>?</span>
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>Ask the Patient</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {questions.map((q, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: "14px 16px",
                                        borderRadius: "10px",
                                        background: "var(--color-surface-secondary)",
                                        border: "1px solid var(--color-border)",
                                    }}
                                >
                                    <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--color-foreground)" }}>
                                        <span style={{ fontWeight: 600, color: "var(--color-primary)", marginRight: "8px" }}>
                                            {i + 1}.
                                        </span>
                                        {q}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Share with Doctor QR Code ── */}
                    <motion.div variants={cardVariants} className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "24px", marginBottom: "24px" }}>
                        <div className="flex items-center gap-2 mb-1">
                            <Share2 size={14} strokeWidth={2} style={{ color: "var(--color-primary)" }} />
                            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-primary)" }}>
                                Share with Doctor
                            </span>
                        </div>
                        <QRCode size={140} />
                        <p style={{ fontSize: "12px", color: "#8A8F98", textAlign: "center", maxWidth: "280px" }}>
                            Scan to access this consultation brief on any device.
                            HIPAA-compliant · End-to-end encrypted.
                        </p>
                    </motion.div>

                    {/* ── Footer ── */}
                    <motion.div variants={cardVariants} style={{ textAlign: "center", paddingBottom: "24px" }}>
                        <p style={{ fontSize: "11px", color: "#C4C4C4" }}>
                            Generated by WellRead · Analyzed via Model Context Protocol · Data never leaves device
                        </p>
                    </motion.div>

                </motion.div>
            </div>
        </motion.div>
    );
}
