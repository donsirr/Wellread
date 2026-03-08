"use client";

import Image from "next/image";
import {
    LayoutDashboard,
    Activity,
    FileText,
    FlaskConical,
    CalendarDays,
    Bell,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";
import { useStore } from "./StoreContext";

interface NavItem {
    icon: React.ElementType;
    label: string;
    id: string;
}

const topNav: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    { icon: FileText, label: "Records", id: "records" },
    { icon: FlaskConical, label: "Labs", id: "labs" },
    { icon: CalendarDays, label: "Schedule", id: "schedule" },
];

const bottomNav: NavItem[] = [
    { icon: Bell, label: "Notifications", id: "notifications" },
    { icon: Settings, label: "Settings", id: "settings" },
    { icon: HelpCircle, label: "Help", id: "help" },
];

export default function Sidebar() {
    const { state, setActiveTab } = useStore();
    const active = state.activeTab || "dashboard";

    return (
        <nav className="nav-rail">
            {/* Logo */}
            <div
                className="flex items-center justify-center mb-4"
                style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--color-primary-soft)",
                }}
            >
                <Image src="/favicon/favicon.svg" alt="WellRead" width={20} height={20} />
            </div>

            {/* Main nav */}
            <div className="flex flex-1 flex-col items-center gap-1">
                {topNav.map((item) => (
                    <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        className={`nav-item ${active === item.id ? "active" : ""}`}
                        onClick={() => setActiveTab(item.id)}
                        aria-label={item.label}
                        title={item.label}
                    >
                        <item.icon size={18} strokeWidth={1.5} />
                    </button>
                ))}
            </div>

            {/* Bottom nav */}
            <div className="flex flex-col items-center gap-1">
                {bottomNav.map((item) => (
                    <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        className={`nav-item ${active === item.id ? "active" : ""}`}
                        onClick={() => setActiveTab(item.id)}
                        aria-label={item.label}
                        title={item.label}
                    >
                        <item.icon size={18} strokeWidth={1.5} />
                    </button>
                ))}

                <div
                    style={{
                        width: "24px",
                        height: "1px",
                        background: "var(--color-border)",
                        margin: "4px 0",
                    }}
                />

                <button
                    id="nav-logout"
                    className="nav-item"
                    aria-label="Log out"
                    title="Log out"
                >
                    <LogOut size={18} strokeWidth={1.5} />
                </button>
            </div>
        </nav>
    );
}
