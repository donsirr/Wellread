"use client";

import React, { createContext, useContext, useState, useRef, ReactNode } from "react";
import initialState from "../state.json";

type _PatientType = (typeof initialState.patientDatabase)[0];
export type PatientProfile = _PatientType["patientProfile"];
export type McpSource = NonNullable<_PatientType["mcpSources"]>[0];
export type ClinicalMetric = NonNullable<_PatientType["clinicalMetrics"]>[0];
export type Correlation = NonNullable<_PatientType["correlations"]>[0];
export type Narrative = NonNullable<_PatientType["narrative"]>;
export type Consultation = NonNullable<_PatientType["consultation"]>;

export interface StoreState {
    patientProfile: PatientProfile;
    mcpSources: McpSource[];
    clinicalMetrics: ClinicalMetric[];
    correlations: Correlation[];
    narrative: Narrative | null;
    consultation: Consultation | null;
    activeCorrelationId: string | null;
    healthGaps: string[];
    isCorrelated: boolean;
    showBrief: boolean;
    currentStep: number;
    activeHighlightCard: string | null;
    activeTab: string;
}

interface StoreContextValue {
    state: StoreState;
    setActiveCorrelation: (id: string | null) => void;
    isCorrelationActive: (sourceId?: string, metricId?: string) => boolean;
    updateState: (updater: (prev: StoreState) => StoreState) => void;
    updateMetric: (id: string, newValue: string) => void;
    triggerCorrelation: (fromId: string, toId: string) => void;
    startAutoDemo: () => void;
    jumpToStep: (step: number) => void;
    resetDemo: () => void;
    switchPatient: (name: string) => void;
    setHighlightCard: (id: string | null) => void;
    setActiveTab: (tabId: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const firstPatient = initialState.patientDatabase[0];

    const [state, setState] = useState<StoreState>({
        patientProfile: firstPatient.patientProfile,
        mcpSources: firstPatient.mcpSources,
        clinicalMetrics: firstPatient.clinicalMetrics,
        correlations: firstPatient.correlations,
        narrative: firstPatient.narrative,
        consultation: firstPatient.consultation,
        healthGaps: firstPatient.healthGaps,
        activeCorrelationId: null,
        isCorrelated: false,
        showBrief: false, // Hidden by default for the demo flow
        currentStep: 0,
        activeHighlightCard: null,
        activeTab: "vitals",
    });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const stopAutoDemo = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const _applyStep = (step: number) => {
        setState(prev => {
            let nextState = { ...prev, currentStep: step };

            // Step 0: Reset
            if (step >= 0) {
                nextState.mcpSources = nextState.mcpSources.map(s => ({ ...s, status: s.type === "clinical_note" ? "analyzed" : "pending" }));
                nextState.clinicalMetrics = nextState.clinicalMetrics.map(m =>
                    m.id === "metric-hba1c" ? { ...m, value: "?" } : m
                );
                nextState.activeCorrelationId = null;
                nextState.isCorrelated = false;
                nextState.showBrief = false;
            }

            // Step 1: Fetch Gmail
            if (step >= 1) {
                nextState.mcpSources = nextState.mcpSources.map(s =>
                    s.id === "src-gmail" ? { ...s, status: "analyzed" } : s
                );
            }

            // Step 2: Parse PDF
            if (step >= 2) {
                nextState.mcpSources = nextState.mcpSources.map(s =>
                    s.id === "src-lab-pdf" || s.id === "src-calendar" ? { ...s, status: "analyzed" } : s
                );

                // Get base metrics for the active patient
                const patientBase = initialState.patientDatabase.find(p => p.patientProfile.name === prev.patientProfile.name);

                nextState.clinicalMetrics = nextState.clinicalMetrics.map(m =>
                    m.id === "metric-hba1c" ? { ...m, value: patientBase?.clinicalMetrics.find(x => x.id === "metric-hba1c")?.value || "8.6" } : m
                );
            }

            // Step 3: Analyze (no correlation lines)
            if (step >= 3) {
                // Insights become visible but no SVG lines
            }

            // Step 4: Final Brief
            if (step >= 4) {
                nextState.showBrief = true;
            }

            return nextState;
        });
    };

    const jumpToStep = (step: number) => {
        stopAutoDemo(); // Safety Check: Hand control to manual operator
        _applyStep(step);
    };

    const resetDemo = () => {
        stopAutoDemo();
        _applyStep(0);
    };

    const startAutoDemo = () => {
        stopAutoDemo();
        _applyStep(0);

        let step = 1;
        const advance = () => {
            _applyStep(step);
            if (step < 4) {
                step++;
                timeoutRef.current = setTimeout(advance, 2500);
            }
        };
        timeoutRef.current = setTimeout(advance, 2500);
    };

    const setActiveCorrelation = (id: string | null) => {
        setState((prev) => ({ ...prev, activeCorrelationId: id }));
    };

    const isCorrelationActive = (sourceId?: string, metricId?: string) => {
        if (!state.activeCorrelationId) return false;
        const activeCorr = state.correlations.find(c => c.id === state.activeCorrelationId);
        if (!activeCorr) return false;

        if (sourceId && activeCorr.sourceID === sourceId) return true;
        if (metricId && activeCorr.metricID === metricId) return true;

        return false;
    };

    const updateState = (updater: (prev: StoreState) => StoreState) => {
        setState(updater);
    };

    const switchPatient = (name: string) => {
        const patient = initialState.patientDatabase.find(p => p.patientProfile.name.toLowerCase().includes(name.toLowerCase()));
        if (patient) {
            setState(prev => ({
                ...prev,
                patientProfile: patient.patientProfile,
                mcpSources: patient.mcpSources,
                clinicalMetrics: patient.clinicalMetrics,
                correlations: patient.correlations,
                narrative: patient.narrative,
                consultation: patient.consultation,
                healthGaps: patient.healthGaps,
                activeCorrelationId: null,
                isCorrelated: false,
                showBrief: false,
                currentStep: 0,
                activeHighlightCard: null,
            }));
        }
    };

    const setHighlightCard = (id: string | null) => {
        setState(prev => ({ ...prev, activeHighlightCard: id }));
    };

    const setActiveTab = (tabId: string) => {
        setState(prev => ({ ...prev, activeTab: tabId }));
    };

    const updateMetric = (id: string, newValue: string) => {
        setState(prev => ({
            ...prev,
            clinicalMetrics: prev.clinicalMetrics.map(metric =>
                metric.id === id ? { ...metric, value: newValue } : metric
            )
        }));
    };

    const triggerCorrelation = (fromId: string, toId: string) => {
        setState(prev => {
            // Find existing correlation or just set state
            const corr = prev.correlations.find(c => c.sourceID === fromId && c.metricID === toId);
            return {
                ...prev,
                isCorrelated: true,
                activeCorrelationId: corr ? corr.id : `${fromId}-${toId}`
            };
        });
    };

    return (
        <StoreContext.Provider value={{
            state, setActiveCorrelation, isCorrelationActive, updateState, updateMetric, triggerCorrelation,
            startAutoDemo, jumpToStep, resetDemo, switchPatient, setHighlightCard, setActiveTab
        }}>
            {children}
        </StoreContext.Provider>
    );
}

// Alias for WellReadProvider as requested
export const WellReadProvider = StoreProvider;

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
