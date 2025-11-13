// src/app/layout-client.tsx
"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export default function LayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={setCurrentPage}
            />
            <div className="flex pt-14">
                <Sidebar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isOpen={sidebarOpen}
                />
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-56" : "ml-0"
                        }`}
                >
                    <div className="p-4">{children}</div>
                </main>
            </div>
        </div>
    );
}
