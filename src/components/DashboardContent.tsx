"use client";
import { useState } from "react";
import { FileText, Stethoscope, FileOutput, FlaskConical, Calendar, Video, MapPin, Search } from "lucide-react";

import VitalityGrid from "./VitalityGrid";
import NarrativeIntelligence from "./NarrativeIntelligence";
import SourceArchive from "./SourceArchive";
import ConsultationBrief from "./ConsultationBrief";
import PrivacyGuard from "./PrivacyGuard";
import SemanticSearch from "./SemanticSearch";
import DemoController from "./DemoController";
import CorrelationLines from "./CorrelationLines";
import PatientBadge from "./PatientBadge";
import TimeMachine from "./TimeMachine";
import AppHero from "./AppHero";
import { useStore } from "./StoreContext";
import { AnimatePresence, motion } from "framer-motion";

/* ── Right Panel Skeleton ── */

function BriefSkeleton() {
    return (
        <div style={{ padding: "20px 16px" }}>
            {/* Header skeleton */}
            <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
                <div style={{ width: "120px", height: "14px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
                <div style={{ width: "40px", height: "14px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
            </div>

            {/* Toggle bar skeleton */}
            <div style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "var(--color-surface-secondary)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <div style={{ width: "100px", height: "10px", borderRadius: "4px", background: "var(--color-border)" }} />
                <div style={{ width: "36px", height: "18px", borderRadius: "9px", background: "var(--color-border)" }} />
            </div>

            {/* Card skeleton */}
            <div className="card" style={{ padding: "20px", marginBottom: "12px", position: "relative", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "10px" }} />
                <div style={{ width: "80%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "10px" }} />
                <div style={{ width: "65%", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />

                {/* shimmer */}
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "brief-skel-shimmer 1.8s ease-in-out infinite",
                }} />
            </div>

            {/* Section heading */}
            <div style={{ width: "130px", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", margin: "20px 0 12px" }} />

            {/* Observation list skeleton */}
            {[0, 1, 2].map(i => (
                <div key={i} className="card" style={{ padding: "14px 16px", marginBottom: "8px", position: "relative", overflow: "hidden" }}>
                    <div className="flex items-start gap-2">
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "var(--color-surface-secondary)", flexShrink: 0, marginTop: "2px" }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ width: `${85 - i * 15}%`, height: "9px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "6px" }} />
                            <div style={{ width: `${60 - i * 10}%`, height: "9px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
                        </div>
                    </div>
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        backgroundSize: "200% 100%",
                        animation: `brief-skel-shimmer 1.8s ease-in-out infinite ${i * 0.15}s`,
                    }} />
                </div>
            ))}

            {/* AI flag skeleton */}
            <div style={{
                padding: "14px 16px",
                borderRadius: "10px",
                border: "1px dashed var(--color-border)",
                marginTop: "12px",
            }}>
                <div style={{ width: "90%", height: "9px", borderRadius: "4px", background: "var(--color-surface-secondary)", marginBottom: "8px" }} />
                <div style={{ width: "70%", height: "9px", borderRadius: "4px", background: "var(--color-surface-secondary)" }} />
            </div>

            {/* Questions skeleton */}
            <div style={{ width: "80px", height: "10px", borderRadius: "4px", background: "var(--color-surface-secondary)", margin: "20px 0 12px" }} />
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--color-surface-secondary)",
                    marginBottom: "8px",
                    height: "36px",
                }} />
            ))}

            {/* CTA button skeleton */}
            <div style={{
                width: "100%",
                height: "44px",
                borderRadius: "10px",
                background: "var(--color-surface-secondary)",
                marginTop: "16px",
            }} />

            <style>{`
                @keyframes brief-skel-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}

export default function DashboardContent() {
    const { state } = useStore();
    const [showLanding, setShowLanding] = useState(true);

    const activeTab = state.activeTab || "dashboard";

    return (
        <>
            <AnimatePresence>
                {showLanding && <AppHero onDismiss={() => setShowLanding(false)} />}
            </AnimatePresence>

            <div
                className="app-shell"
                style={{
                    filter: showLanding ? "blur(8px)" : "none",
                    opacity: showLanding ? 0.6 : 1,
                    pointerEvents: showLanding ? "none" : "auto",
                    transition: "filter 0.5s ease, opacity 0.5s ease"
                }}
            >
                {/* ── Left Panel — Source Archive ── */}
                <aside className="panel panel-left">
                    <div style={{ padding: "20px 16px" }}>
                        {/* Patient Identity Badge */}
                        <PatientBadge />

                        {/* Panel header — Sources */}
                        <div
                            className="flex items-center justify-between"
                            style={{ padding: "0 4px", margin: "24px 0 16px" }}
                        >
                            <h2
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "var(--color-foreground)",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Sources
                            </h2>
                            <span
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                            >
                                {state.mcpSources.length} files
                            </span>
                        </div>

                        <SourceArchive />
                    </div>
                </aside>

                {/* ── Center Panel — Intelligence Feed ── */}
                <section className="panel panel-center relative z-20" style={{ overflowX: "hidden" }}>
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Semantic Search Bar */}
                        <SemanticSearch />

                        {/* Page header */}
                        <header className="flex items-start justify-between" style={{ marginBottom: "20px" }}>
                            <div>
                                <h1
                                    className="text-foreground"
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: 600,
                                        letterSpacing: "-0.025em",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    Intelligence Feed
                                </h1>
                                <p
                                    className="text-muted-foreground"
                                    style={{ fontSize: "13px", marginTop: "4px" }}
                                >
                                    Real-time clinical data synthesis for {state.patientProfile.name}
                                </p>
                            </div>
                            <PrivacyGuard />
                        </header>

                        {/* Tab Content */}
                        {(activeTab === "dashboard" || activeTab === "vitals") && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                {/* Vitality Grid */}
                                <VitalityGrid />

                                {/* Narrative Intelligence */}
                                <NarrativeIntelligence />

                                {/* Medical Time-Machine — show after metrics are visible */}
                                {state.currentStep >= 2 && <TimeMachine />}
                            </motion.div>
                        )}

                        {activeTab === "records" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-foreground)" }}>Institutional Records</h3>
                                    <div className="flex bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 items-center gap-2">
                                        <Search size={14} className="text-muted" />
                                        <input type="text" placeholder="Search records..." className="bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-muted w-48" />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    {[
                                        { title: "PCP Annual Wellness Visit", date: "Jan 12, 2026", doctor: "Dr. Sarah Mitchell", type: "Clinical Note", icon: Stethoscope },
                                        { title: "Cardiology Consult", date: "Nov 04, 2025", doctor: "Dr. James Wilson", type: "Consultation", icon: FileText },
                                        { title: "Chest X-Ray Report", date: "Nov 02, 2025", doctor: "City Imaging Center", type: "Imaging", icon: FileOutput },
                                        { title: "Discharge Summary (ER)", date: "Aug 15, 2025", doctor: "General Hospital", type: "Discharge", icon: FileText },
                                    ].map((rec, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <rec.icon size={18} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-foreground)" }}>{rec.title}</h4>
                                                    <p style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "2px" }}>{rec.doctor} · {rec.type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-foreground)" }}>{rec.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "labs" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-foreground)" }}>Recent Laboratory Results</h3>
                                    <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>Last updated: Mar 10, 2026</span>
                                </div>
                                <div className="overflow-hidden border border-white/10 rounded-xl bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-muted font-semibold bg-white/5">
                                                <th className="p-4">Test Name</th>
                                                <th className="p-4">Result</th>
                                                <th className="p-4">Reference Range</th>
                                                <th className="p-4">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[13px]">
                                            {[
                                                { test: "Complete Blood Count (CBC)", result: "Normal", range: "Standard", date: "Feb 22, 2026", status: "normal" },
                                                { test: "Comprehensive Metabolic Panel", result: "Reviewed", range: "Standard", date: "Feb 22, 2026", status: "normal" },
                                                { test: "Lipid Panel", result: "Elevated LDL", range: "< 100 mg/dL", date: "Jan 12, 2026", status: "flag" },
                                                { test: "Hemoglobin A1c", result: "Review Needed", range: "< 5.7%", date: "Jan 12, 2026", status: "flag" },
                                                { test: "Thyroid Stimulating Hormone (TSH)", result: "2.1 mIU/L", range: "0.4 - 4.0 mIU/L", date: "Oct 15, 2025", status: "normal" },
                                            ].map((lab, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                                    <td className="p-4 font-medium text-foreground flex items-center gap-2">
                                                        <FlaskConical size={14} className="text-primary opacity-70" /> {lab.test}
                                                    </td>
                                                    <td className={`p-4 font-semibold ${lab.status === 'flag' ? 'text-danger' : 'text-foreground'}`}>{lab.result}</td>
                                                    <td className="p-4 text-muted">{lab.range}</td>
                                                    <td className="p-4 text-muted">{lab.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "schedule" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-foreground)" }}>Upcoming Appointments</h3>
                                    <button className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-[13px] font-semibold hover:bg-primary/20 transition-colors">
                                        Book New
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { type: "Video Visit", title: "Endocrinology Follow-up", doctor: "Dr. Chen", date: "Tomorrow, 10:00 AM", location: "Telehealth Link", icon: Video },
                                        { type: "In-Person", title: "Annual Physical Exam", doctor: "Dr. Mitchell", date: "Apr 15, 2026, 2:30 PM", location: "Main Clinic, Room 4B", icon: MapPin },
                                        { type: "Lab Visit", title: "Routine Blood Draw", doctor: "Quest Diagnostics", date: "May 01, 2026, 8:00 AM", location: "Downtown Lab Center", icon: FlaskConical },
                                    ].map((appt, i) => (
                                        <div key={i} className="flex items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary/30 transition-colors relative overflow-hidden group">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                                                <appt.icon size={20} className="text-foreground opacity-80" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-foreground)" }}>{appt.title}</h4>
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-muted">{appt.type}</span>
                                                </div>
                                                <p style={{ fontSize: "13px", color: "var(--color-muted)", marginTop: "2px" }}>{appt.doctor}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1.5 justify-end text-foreground font-medium text-[13px] flex items-center">
                                                    <Calendar size={14} className="opacity-70" /> {appt.date}
                                                </div>
                                                <div className="flex items-center gap-1.5 justify-end text-muted text-[12px] mt-1 flex items-center">
                                                    {appt.location}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* ── Right Panel — Consultation Brief ── */}
                <aside
                    className="panel panel-right lg:w-96"
                    style={{
                        width: "clamp(280px, 25vw, 400px)",
                        borderLeft: "1px solid var(--color-border)",
                    }}
                >
                    {state.showBrief ? (
                        <div
                            style={{
                                padding: "20px 16px",
                                animation: "brief-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
                            }}
                        >
                            <ConsultationBrief />
                        </div>
                    ) : (
                        <BriefSkeleton />
                    )}
                </aside>

                {/* Glowing magic correlation lines */}
                <CorrelationLines />

                {/* Hidden Demo Controller (Ctrl+D to toggle) */}
                <DemoController />

                <style>{`
                @keyframes brief-reveal {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            </div>
        </>
    );
}
