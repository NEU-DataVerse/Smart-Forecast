import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Login from './login/page';
export default function Layout() {
    return (
        <html lang="vi">
            <head>
                <title>My Next.js App</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    tailwind.config = {
                        theme: {
                        extend: {
                            colors: {
                            'background': '#111827',
                            'sidebar': '#1F2937',
                            'card': '#1F2937',
                            'primary': '#3B82F6',
                            'secondary': '#10B981',
                            'accent': '#F59E0B',
                            'text-primary': '#F9FAFB',
                            'text-secondary': '#D1D5DB',
                            'border': '#374151',
                            },
                        }
                        }
                    }
                    `}} />
            </head>
            <body>
                <div className="flex h-screen bg-background text-text-primary">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
                            <Login />
                        </main>
                    </div>
                </div>
            </body>
        </html>
    )
}

