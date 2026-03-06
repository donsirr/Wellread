"use client";

import { useState, useCallback } from 'react';
import { useStore } from './components/StoreContext';

/**
 * mcpOrchestrator
 * Simulates an MCP (Model Context Protocol) agent fetching and synthesizing data
 * from multiple siloed sources in a timed sequence to demonstrate the power of WellRead.
 */
export function useMcpOrchestrator() {
    const { updateState } = useStore();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // To display detailed reasoning logs in the UI if needed
    const [logs, setLogs] = useState<string[]>([]);

    const runSimulation = useCallback(() => {
        setIsRunning(true);
        setLoadingProgress(0);
        setLogs(["[0.0s] Initiating Model Context Protocol..."]);

        // Update all sources to 'pending' initially
        updateState(prev => ({
            ...prev,
            mcpSources: prev.mcpSources.map(s => ({ ...s, status: "pending" }))
        }));

        // 0s - 2s: Call list_gmail_messages
        setTimeout(() => setLogs(l => [...l, "[0.5s] -> call_tool: list_gmail_messages(query='medical')"]), 500);

        setTimeout(() => {
            setLoadingProgress(30);
            setLogs(l => [...l, "[1.5s] <- list_gmail_messages returned 1 relevant thread."]);
            updateState(prev => {
                const newSources = [...prev.mcpSources];
                const idx = newSources.findIndex(s => s.id === "src-gmail");
                if (idx > -1) {
                    newSources[idx] = {
                        ...newSources[idx],
                        status: "analyzed",
                        contentSnippet: "I have been experiencing extreme fatigue and persistent blurred vision..."
                    };
                }
                return { ...prev, mcpSources: newSources };
            });
        }, 2000);

        // 2s - 4s: Call read_drive_file
        setTimeout(() => setLogs(l => [...l, "[2.5s] -> call_tool: read_drive_file(fileType='PDF', recent=true)"]), 2500);

        setTimeout(() => {
            setLoadingProgress(60);
            setLogs(l => [...l, "[3.5s] <- read_drive_file returned Lab Report. Parsing metrics..."]);
            updateState(prev => {
                const newSources = [...prev.mcpSources];
                const idx = newSources.findIndex(s => s.id === "src-lab-pdf");
                if (idx > -1) {
                    newSources[idx] = {
                        ...newSources[idx],
                        status: "analyzed",
                        contentSnippet: "HbA1c: 8.2% (Flag: H)"
                    };
                }
                return { ...prev, mcpSources: newSources };
            });
        }, 4000);

        // 4s - 5s: Call Reasoning Engine
        setTimeout(() => setLogs(l => [...l, "[4.2s] -> call_tool: analyze_correlation(source_gmail, source_lab_pdf)"]), 4200);

        setTimeout(() => {
            setLoadingProgress(100);
            setLogs(l => [...l, "[5.0s] <- Correlation established: Symptom logically maps to biomarker spike."]);

            updateState(prev => ({
                ...prev,
                correlations: [
                    ...prev.correlations.filter(c => c.id !== "corr-sim"),
                    {
                        id: "corr-sim",
                        sourceID: "src-gmail",
                        metricID: "metric-hba1c",
                        description: "Patient reported fatigue and blurred vision strongly correlates with the flagged HbA1c spike in the recent metabolic panel.",
                        active: false
                    }
                ]
            }));

            // 5s - 6s: Call detectHealthGaps
            setTimeout(() => setLogs(l => [...l, "[5.5s] -> call_tool: detectHealthGaps()"]), 5500);

            setTimeout(() => {
                setLogs(l => [...l, "[6.0s] <- Health gap detected: Missing Ferritin."]);

                updateState(prev => {
                    // Logic: It should scan the patientProfile for symptoms (from Gmail) and cross-reference them with clinicalMetrics (from Drive).
                    const gmailSource = prev.mcpSources.find(s => s.id === "src-gmail");
                    const hasFatigue = gmailSource && gmailSource.contentSnippet.toLowerCase().includes("fatigue");

                    const hasFerritin = prev.clinicalMetrics.some(m => m.label.toLowerCase().includes("ferritin"));

                    const newGaps = [];
                    if (hasFatigue && !hasFerritin) {
                        newGaps.push("Potential Gap: Fatigue mentioned in Gmail, but no Ferritin labs found in last 180 days. Added to Physician Brief.");
                    }

                    return { ...prev, healthGaps: newGaps };
                });

                // Finish simulation
                setTimeout(() => {
                    setIsRunning(false);
                }, 600);
            }, 6000);

        }, 5000);

    }, [updateState]);

    return { runSimulation, loadingProgress, isRunning, logs };
}
