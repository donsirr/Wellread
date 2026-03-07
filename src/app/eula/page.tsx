import { ShieldCheck } from "lucide-react";

export default function EULAPage() {
    return (
        <div style={{ padding: "60px 20px", maxWidth: "800px", margin: "0 auto", color: "var(--color-foreground)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #0066FF 0%, #3385FF 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck size={24} color="white" />
                </div>
                <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em" }}>WellRead End User License Agreement</h1>
            </div>

            <div style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--color-muted-foreground)", display: "flex", flexDirection: "column", gap: "24px" }}>
                <p><strong>Last Updated: [Current Date]</strong></p>
                <p>
                    By clicking "Terms of Service" or by accessing or using the WellRead platform, you agree to be bound by this End User License Agreement (EULA). If you do not agree to the terms of this EULA, do not access or use the software.
                </p>

                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "16px" }}>1. License Grant</h2>
                <p>
                    Subject to the terms of this Agreement, WellRead grants you a limited, non-exclusive, non-transferable, revocable license to use the WellRead software solely for your personal, non-commercial use in analyzing and managing your personal health data.
                </p>

                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "16px" }}>2. Medical Disclaimer</h2>
                <p>
                    <strong>WellRead is not a medical device.</strong> The information provided by the software, including intelligence feeds, timelines, and physician briefs, is for informational purposes only and is not intended to substitute professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>

                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "16px" }}>3. Data Privacy and Security</h2>
                <p>
                    Your data privacy is our highest priority. The Model Context Protocol (MCP) ensures that your clinical history, emails, and lab reports are synthesized strictly within isolated environments. For more detailed information on how we process your medical data, please refer to our Medical Data Processing Policy.
                </p>

                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-foreground)", marginTop: "16px" }}>4. Prohibited Uses</h2>
                <ul style={{ listStyleType: "disc", paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li>You may not use the software for any illegal or unauthorized purpose.</li>
                    <li>You may not attempt to reverse engineer, decompile, or disassemble the software.</li>
                    <li>You may not use the software to process the health data of individuals other than yourself without explicit, legal authorization.</li>
                </ul>

                <p style={{ marginTop: "32px", fontSize: "13px" }}>
                    If you have any questions regarding this EULA, please contact legal@wellread.app.
                </p>
            </div>
        </div>
    );
}
