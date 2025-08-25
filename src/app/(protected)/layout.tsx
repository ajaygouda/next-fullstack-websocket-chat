'use client';

import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { ReactNode } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1">
                {/* <Navbar /> */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
