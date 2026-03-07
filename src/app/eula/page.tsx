import { ShieldCheck } from "lucide-react";

export default function EULAPage() {
    return (
        <div style={{ height: "100vh", overflowY: "auto", overflowX: "hidden", backgroundColor: "var(--color-background)" }}>
            <div style={{ padding: "40px 20px", maxWidth: "720px", margin: "0 auto", color: "var(--color-foreground)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #0066FF 0%, #3385FF 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShieldCheck size={20} color="white" />
                    </div>
                    <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>WellRead End User License Agreement</h1>
                </div>

                <div style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--color-muted-foreground)", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <p><strong>Last Updated: 03/07/2026</strong></p>
                    <p>
                        By clicking "Terms of Service" or by accessing or using the WellRead platform, you agree to be bound by this End User License Agreement (EULA). If you do not agree to the terms of this EULA, do not access or use the software.
                    </p>

                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "12px" }}>1. License Grant</h2>
                    <p>
                        Subject to the terms of this Agreement, WellRead grants you a limited, non-exclusive, non-transferable, revocable license to use the WellRead software solely for your personal, non-commercial use in analyzing and managing your personal health data.
                    </p>

                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "12px" }}>2. Medical Disclaimer</h2>
                    <p>
                        <strong>WellRead is not a medical device.</strong> The information provided by the software, including intelligence feeds, timelines, and physician briefs, is for informational purposes only and is not intended to substitute professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                    </p>

                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "12px" }}>3. Data Privacy and Security</h2>
                    <p>
                        Your data privacy is our highest priority. The Model Context Protocol (MCP) ensures that your clinical history, emails, and lab reports are synthesized strictly within isolated environments. For more detailed information on how we process your medical data, please refer to our Medical Data Processing Policy.
                    </p>

                    <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "12px" }}>4. Prohibited Uses</h2>
                    <ul style={{ listStyleType: "disc", paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <li>You may not use the software for any illegal or unauthorized purpose.</li>
                        <li>You may not attempt to reverse engineer, decompile, or disassemble the software.</li>
                        <li>You may not use the software to process the health data of individuals other than yourself without explicit, legal authorization.</li>
                    </ul>

                    <p style={{ marginTop: "24px", fontSize: "12px" }}>
                        If you have any questions regarding this EULA, please contact legal@wellread.app.
                    </p>
                </div>
            </div>
        </div>
    );
}
