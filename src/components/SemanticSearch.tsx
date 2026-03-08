"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, User, Activity, Mail, FileText, Database, HeartPulse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInspector } from "./InspectorContext";
import { useStore } from "./StoreContext";
import initialState from "../state.json";

/* ─────────────────────────────────────────────────────────────
   SemanticSearch — AI gateway with Connection Lines
   ───────────────────────────────────────────────────────────── */

interface LineData {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label: string;
    rect: { left: number; top: number; width: number; height: number; borderRadius: number };
}

export default function SemanticSearch() {
    const { setActiveCorrelation, switchPatient, setHighlightCard } = useStore();
    const { openInspector } = useInspector();

    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [lines, setLines] = useState<LineData[]>([]);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cleanupRefs = useRef<(() => void)[]>([]);

    // When user types, trigger the "thinking" effect and draw lines after a delay
    useEffect(() => {
        // Clean up previous event listeners whenever we recalculate
        cleanupRefs.current.forEach(cleanup => cleanup());
        cleanupRefs.current = [];
        setHoveredCard(null);

        const lowerQ = query.trim().toLowerCase();

        if (lowerQ) {
            const patient = initialState.patientDatabase.find(p => p.patientProfile.name.toLowerCase().includes(lowerQ));
            if (patient && lowerQ.length > 3) {
                switchPatient(patient.patientProfile.name);
            }

            let matchedMetricId = null;
            for (const [metricId, kws] of Object.entries(initialState.searchKeywords)) {
                if (kws.some(k => lowerQ.includes(k.toLowerCase()))) {
                    matchedMetricId = metricId;
                    break;
                }
            }
            setHighlightCard(matchedMetricId);
        } else {
            setHighlightCard(null);
        }

        const isRelevant = lowerQ.includes("neuropathy") || lowerQ.includes("symptom") || lowerQ.includes("tingling") || lowerQ.includes("vision") || lowerQ.includes("sugar");

        if (lowerQ.length > 5 && isRelevant) {
            setIsThinking(true);

            const timer = setTimeout(() => {
                setIsThinking(false);
            }, 1500);

            return () => {
                clearTimeout(timer);
                cleanupRefs.current.forEach(cleanup => cleanup());
                cleanupRefs.current = [];
            };
        } else {
            setIsThinking(false);
        }
    }, [query]);

    // Read DOM to find targets and calculate line coordinates
    const getPrefixIcon = () => {
        if (isThinking) {
            return (
                <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <Sparkles size={10} className="text-primary animate-pulse" />
                </div>
            );
        }
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('juan') || lowerQuery.includes('name')) return <User size={18} className="text-muted-foreground" />;
        if (lowerQuery.includes('metric') || lowerQuery.includes('blood') || lowerQuery.includes('hba1c') || lowerQuery.includes('trajectory') || lowerQuery.includes('pulse')) return <Activity size={18} className="text-muted-foreground" />;
        return <Search size={18} className="text-muted-foreground" />;
    };

    const handleSelectOption = (option: string) => {
        setQuery(option);
        setIsFocused(false);
        if (option.toLowerCase().includes("neuropathy") || option.toLowerCase().includes("symptoms")) {
            // Logic Integration: Link the search results to the activeCorrelationId in the state.json.
            setActiveCorrelation("corr-juan");
            // If a user searches 'Neuropathy', the UI should automatically open the Source Inspector and highlight the 'tingling in toes' Gmail snippet.
            openInspector({
                id: "src-gmail",
                fileName: "Symptom Update",
                type: "gmail",
                verified: true,
                evidenceSnippet: "tingling in my toes"
            });
        }
    };

    return (
        <>
            <div
                ref={containerRef}
                className="relative w-full mb-8 z-20"
            >
                <div
                    className={`flex items-center gap-3 px-4 py-3 border transition-all duration-300 ${isThinking ? "border-primary/50 shadow-[0_0_15px_rgba(81, 112, 255,0.2)]" : "border-white/20 shadow-inner rounded-xl"} bg-white/10 backdrop-blur-md`}
                >
                    {getPrefixIcon()}

                    <input
                        type="text"
                        placeholder="Ask WellRead anything... (e.g., When did my tingling start?)"
                        className="flex-1 bg-transparent border-none outline-none text-[14px] text-foreground placeholder:text-muted-foreground/70"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSelectOption(query);
                            }
                        }}
                    />

                    {isThinking && (
                        <span className="text-[11px] font-medium text-primary animate-pulse mr-2">
                            AI is thinking...
                        </span>
                    )}
                </div>

                {/* Smart Autocomplete Dropdown */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50 p-2"
                        >
                            <div className="mb-2 px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Institutional
                            </div>
                            {initialState.patientDatabase.map(p => (
                                <div
                                    key={p.id}
                                    className="px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                    onClick={() => handleSelectOption(p.patientProfile.name)}
                                >
                                    <User size={14} className="text-muted-foreground" /> {p.patientProfile.name}
                                </div>
                            ))}
                            <div
                                className="px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                onClick={() => handleSelectOption('Clinical Records')}
                            >
                                <Database size={14} className="text-muted-foreground" /> Clinical Records
                            </div>

                            <div className="mt-2 mb-2 px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Contextual (MCP)
                            </div>
                            <div
                                className="px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                onClick={() => handleSelectOption('Search Symptoms in Gmail')}
                            >
                                <Mail size={14} className="text-muted-foreground" /> Search Symptoms in Gmail
                            </div>
                            <div
                                className="px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                onClick={() => handleSelectOption('Search Labs in Drive')}
                            >
                                <FileText size={14} className="text-muted-foreground" /> Search Labs in Drive
                            </div>
                            <div
                                className="px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                onClick={() => handleSelectOption('Neuropathy')}
                            >
                                <Sparkles size={14} className="text-primary" /> Neuropathy (Highlight Evidence)
                            </div>

                            <div className="mt-2 mb-2 px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Clinical Metrics
                            </div>
                            <div
                                className="px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                onClick={() => handleSelectOption('HbA1c Trajectory')}
                            >
                                <Activity size={14} className="text-muted-foreground" /> HbA1c Trajectory
                            </div>
                            <div
                                className="px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                onClick={() => handleSelectOption('Blood Pressure Trends')}
                            >
                                <HeartPulse size={14} className="text-muted-foreground" /> Blood Pressure Trends
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Connections Code Removed as requested */}
        </>
    );
}
