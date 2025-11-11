"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
const Sidebar: React.FC = () => {
    const router = useRouter();

    const handleClick = (text: string) => {
        router.push(text);
    };
    return (
        <aside className={`flex-shrink-0 bg-sidebar text-white transition-all duration-300 'w-64' }`}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-center h-16 border-b border-border">
                    <span className="ml-2 text-xl font-bold">Smart-Forecast</span>
                </div>
                <nav className="flex-1 mt-6">
                    <button
                        onClick={() => handleClick("/dashboard")}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors 
                        duration-200 text-text-secondary hover:bg-gray-700 hover:text-white`}>
                        <span className="ml-4">DashBoard</span>
                    </button>
                    <button
                        onClick={() => handleClick("/incidents")}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors 
                        duration-200 text-text-secondary hover:bg-gray-700 hover:text-white`}>
                        <span className="ml-4">Báo cáo</span>
                    </button>
                    <button
                        onClick={() => handleClick("/sendreport")}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors 
                        duration-200 text-text-secondary hover:bg-gray-700 hover:text-white`}>
                        <span className="ml-4">Gửi thông báo</span>
                    </button>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;