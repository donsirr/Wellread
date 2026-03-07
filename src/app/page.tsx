"use client";

import { AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import DashboardContent from "@/components/DashboardContent";
import SourceInspector from "@/components/SourceInspector";
import ConsultationView from "@/components/ConsultationView";
import { InspectorProvider } from "@/components/InspectorContext";
import { ConsultationProvider, useConsultation } from "@/components/ConsultationContext";
import { StoreProvider } from "@/components/StoreContext";

function AppContent() {
  const { isConsultationMode } = useConsultation();

  return (
    <>
      <AnimatePresence mode="wait">
        {isConsultationMode ? (
          <ConsultationView key="consultation" />
        ) : (
          <div key="dashboard" style={{ display: "flex", height: "100vh", overflow: "hidden", width: "100%" }}>
            <Sidebar />
            <DashboardContent />
          </div>
        )}
      </AnimatePresence>
      {!isConsultationMode && <SourceInspector />}
    </>
  );
}

export default function Home() {
  return (
    <StoreProvider>
      <ConsultationProvider>
        <InspectorProvider>
          <AppContent />
        </InspectorProvider>
      </ConsultationProvider>
    </StoreProvider>
  );
}
