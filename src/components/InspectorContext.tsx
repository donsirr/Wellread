"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

export type SourceType = "pdf" | "gmail" | "calendar" | "clinical_note";

export interface InspectorSource {
    id: string;
    fileName: string;
    type: SourceType | string;
    verified: boolean;
    evidenceSnippet?: string;
    contentSnippet?: string;
}

interface InspectorContextValue {
    isOpen: boolean;
    source: InspectorSource | null;
    openInspector: (source: InspectorSource) => void;
    closeInspector: () => void;
}

const InspectorContext = createContext<InspectorContextValue>({
    isOpen: false,
    source: null,
    openInspector: () => { },
    closeInspector: () => { },
});

export function InspectorProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [source, setSource] = useState<InspectorSource | null>(null);
    const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

    const openInspector = useCallback((src: InspectorSource) => {
        // Cancel any pending source-clear from a previous close
        if (clearTimerRef.current) {
            clearTimeout(clearTimerRef.current);
            clearTimerRef.current = null;
        }
        setSource(src);
        setIsOpen(true);
    }, []);

    const closeInspector = useCallback(() => {
        setIsOpen(false);
        // Delay clearing source so close animation can finish
        clearTimerRef.current = setTimeout(() => {
            setSource(null);
            clearTimerRef.current = null;
        }, 300);
    }, []);

    return (
        <InspectorContext.Provider value={{ isOpen, source, openInspector, closeInspector }}>
            {children}
        </InspectorContext.Provider>
    );
}

export function useInspector() {
    return useContext(InspectorContext);
}
