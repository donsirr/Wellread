"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface ConsultationContextValue {
    isConsultationMode: boolean;
    toggleConsultationMode: () => void;
}

const ConsultationContext = createContext<ConsultationContextValue>({
    isConsultationMode: false,
    toggleConsultationMode: () => { },
});

export function ConsultationProvider({ children }: { children: ReactNode }) {
    const [isConsultationMode, setIsConsultationMode] = useState(false);

    const toggleConsultationMode = useCallback(() => {
        setIsConsultationMode((prev) => !prev);
    }, []);

    return (
        <ConsultationContext.Provider value={{ isConsultationMode, toggleConsultationMode }}>
            {children}
        </ConsultationContext.Provider>
    );
}

export function useConsultation() {
    return useContext(ConsultationContext);
}
