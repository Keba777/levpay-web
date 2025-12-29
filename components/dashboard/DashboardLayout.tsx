"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cream selection:bg-mint-green selection:text-deep-teal">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-deep-teal/40 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Hidden on mobile unless menu is open */}
            <div className={cn(
                "fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 z-50",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Sidebar />
            </div>

            <div className="md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <Header onMobileMenuClick={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </main>

                <footer className="py-6 px-10 border-t border-mint-green/10 text-center">
                    <p className="text-xs font-medium text-deep-teal/30">© 2025 LevPay. High-performance financial infrastructure.</p>
                </footer>
            </div>
        </div>
    );
}
