# WellRead: Bridging the Medical Data Silo

WellRead is a local-first health intelligence dashboard developed during **Developer Camp Manila 2026**. It solves the problem of medical data fragmentation by correlating unstructured personal data (Gmail, notes) with clinical metrics (PDF lab results) using the **Model Context Protocol (MCP)**.

---

## 🚀 The Mission
The average doctor visit lasts only 15 minutes. WellRead automates the "prep work" by synthesizing a patient's symptoms and history into a clinical-grade narrative, allowing doctors to focus on treatment rather than data hunting.

## 🛠️ Technical Architecture

### 1. Model Context Protocol (MCP) Integration
WellRead functions as an MCP client that securely "bridges" local data silos.
* **Local-First Privacy**: Sensitive medical context is processed directly on the user's device. Raw records are never uploaded to a centralized cloud.
* **Tooling**: The system utilizes MCP tools to fetch messages from Gmail and documents from Google Drive for on-device analysis.

### 2. The Intelligence Engine
* **Correlation Logic**: The system identifies links between unstructured symptoms (e.g., "blurred vision" in an email) and structured metrics (e.g., 8.2% HbA1c in a lab report).
* **Source Inspector**: A trust layer that deep-links every AI insight to the original source text with yellow highlights to prevent hallucinations.

### 3. Data Schema (`state.json`)
The application is driven by a single Source of Truth:
* **`session`**: Patient identity and MCP status.
* **`sources`**: Metadata and evidence snippets for retrieved files.
* **`metrics`**: Object containing clinical values and status labels (e.g., Blood Sugar, HbA1c).
* **`activeCorrelations`**: Logical mapping between specific sources and metrics.
* **`physicianBrief`**: Final S.O.A.P. note content and follow-up questions.

---

## ✨ Key Features

* **Intelligence Grid**: A real-time reactive dashboard mapping life context against clinical markers.
* **Medical Time-Machine**: A visualization layer that maps historical metric arrays to show health trajectories and future potential.
* **Physician Brief**: A medical-grade summary designed for 30-second clinical review.
* **Demo Controller**: A built-in state machine for seamless orchestration of the data lifecycle (Discovery → Analysis → Correlation → Synthesis).

---

## 👥 The Team
* **Donsir Arcilla** — Lead Developer
* **Klyde Apostol** — Strategy & Product
* **Atsushi Vengco** — Technical Design
* **Galvin Venturina** — Implementation & QA

---

## ⚖️ License & Disclosure
Built for **Developer Camp Manila 2026**. This is a decision-support tool, not a diagnostic one. All medical decisions should be verified by a licensed professional using the provided **Source Inspector** evidence.
