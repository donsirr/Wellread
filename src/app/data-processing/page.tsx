import { ShieldCheck, HardDrive, FileText, Lock } from "lucide-react";

export default function DataProcessingPage() {
    return (
        <div style={{ height: "100vh", overflowY: "auto", overflowX: "hidden", backgroundColor: "var(--color-background)" }}>
            <div style={{ padding: "40px 20px", maxWidth: "720px", margin: "0 auto", color: "var(--color-foreground)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShieldCheck size={20} color="white" />
                    </div>
                    <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>Medical Data Processing Policy</h1>
                </div>

                <div style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--color-muted-foreground)", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <p>
                        WellRead takes the processing of your highly sensitive medical data extremely seriously. This document outlines exactly how our AI engines, relying on the Model Context Protocol (MCP), access, synthesize, and discard your clinical information.
                    </p>

                    <div style={{ padding: "20px", background: "var(--color-surface-secondary)", borderRadius: "12px", border: "1px solid var(--color-border)", margin: "12px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", color: "var(--color-foreground)", fontWeight: 600 }}>
                            <Lock size={16} color="#10B981" />
                            Zero-Retention Architecture
                        </div>
                        <p style={{ margin: 0 }}>
                            WellRead operates on a strict zero-retention policy for your actual data files. The software acts as an ephemeral processing layer. Your original lab PDFs, Gmail contents, and Calendar events never leave your local device storage or secure enterprise environment permanently.
                        </p>
                    </div>

                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <HardDrive size={16} /> Model Context Protocol (MCP)
                    </h2>
                    <p>
                        By checking the Medical Data Processing consent box, you are granting the temporary creation of an isolated, encrypted context window. When the "Simulate MCP Sync" is executed:
                    </p>
                    <ul style={{ listStyleType: "disc", paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <li>The system establishes read-only, ephemeral connections to your authorized sources.</li>
                        <li>Clinical entities (such as symptoms, vitals like HbA1c, and follow-up directives) are extracted via advanced language models.</li>
                        <li>These entities are correlated in memory to generate the visual Intelligence Feed and Physician Brief.</li>
                        <li>Once the session is terminated or the browser tab closes, the context window is entirely purged.</li>
                    </ul>

                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={16} /> Automated Analysis Consent
                    </h2>
                    <p>
                        The extraction and synthesis process is automated by AI. You understand that while our systems achieve high accuracy, they do not replace human clinical judgment. You agree to let the AI process terms like "numbness and tingling" and correlate them with historical metrics like your "HbA1c of 8.6%" to provide insights.
                    </p>

                    <p style={{ marginTop: "24px", fontSize: "12px" }}>
                        Questions about data security and HIPAA compliance? Reach out to privacy@wellread.app.
                    </p>
                </div>
            </div>
        </div>
    );
}
