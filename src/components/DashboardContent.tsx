"use client";

import VitalityGrid from "./VitalityGrid";
import NarrativeIntelligence from "./NarrativeIntelligence";
import SourceArchive from "./SourceArchive";
import ConsultationBrief from "./ConsultationBrief";
import PrivacyGuard from "./PrivacyGuard";
import SemanticSearch from "./SemanticSearch";
import DemoController from "./DemoController";
import CorrelationLines from "./CorrelationLines";
import { useStore } from "./StoreContext";

export default function DashboardContent() {
    const { state } = useStore();
    return (
        <div className="app-shell">
            {/* ── Left Panel — Source Archive ── */}
            <aside className="panel panel-left">
                <div style={{ padding: "20px 16px" }}>
                    {/* Panel header */}
                    <div
                        className="flex items-center justify-between"
                        style={{ padding: "0 4px", marginBottom: "20px" }}
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
            <section className="panel panel-center relative z-20">
                <div style={{ padding: "28px 32px", maxWidth: "960px" }}>
                    {/* Semantic Search Bar */}
                    <SemanticSearch />

                    {/* Page header */}
                    <header className="flex items-start justify-between" style={{ marginBottom: "28px" }}>
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

                    {/* Vitality Grid */}
                    <VitalityGrid />

                    {/* Narrative Intelligence */}
                    <NarrativeIntelligence />
                </div>
            </section>

            {/* ── Right Panel — Consultation Brief ── */}
            <aside className="panel panel-right">
                <div style={{ padding: "20px 16px" }}>
                    <ConsultationBrief />
                </div>
            </aside>

            {/* Glowing magic correlation lines */}
            <CorrelationLines />

            {/* Hidden Demo Controller (Ctrl+D to toggle) */}
            <DemoController />
        </div>
    );
}
