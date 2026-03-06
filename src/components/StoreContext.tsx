"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import initialState from "../state.json";

export type PatientProfile = typeof initialState.patientProfile;
export type McpSource = typeof initialState.mcpSources[0];
export type ClinicalMetric = typeof initialState.clinicalMetrics[0];
export type Correlation = typeof initialState.correlations[0];
export type Narrative = typeof initialState.narrative;
export type Consultation = typeof initialState.consultation;

export interface StoreState {
    patientProfile: PatientProfile;
    mcpSources: McpSource[];
    clinicalMetrics: ClinicalMetric[];
    correlations: Correlation[];
    narrative: Narrative;
    consultation: Consultation;
    activeCorrelationId: string | null;
    healthGaps: string[];
    isCorrelated: boolean;
}

interface StoreContextValue {
    state: StoreState;
    setActiveCorrelation: (id: string | null) => void;
    isCorrelationActive: (sourceId?: string, metricId?: string) => boolean;
    updateState: (updater: (prev: StoreState) => StoreState) => void;
    updateMetric: (id: string, newValue: string) => void;
    triggerCorrelation: (fromId: string, toId: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<StoreState>({
        ...initialState,
        activeCorrelationId: null,
        isCorrelated: false,
    });

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
        <StoreContext.Provider value={{ state, setActiveCorrelation, isCorrelationActive, updateState, updateMetric, triggerCorrelation }}>
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
