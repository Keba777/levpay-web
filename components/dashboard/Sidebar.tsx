"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    CreditCard,
    Settings,
    Users,
    ShieldCheck,
    Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: ArrowUpRight, label: "Send Money", href: "/dashboard/send" },
    { icon: ArrowDownLeft, label: "Top Up", href: "/dashboard/topup" },
    { icon: History, label: "Transactions", href: "/dashboard/transactions" },
    { icon: CreditCard, label: "My Cards", href: "/dashboard/cards" },
    { icon: Users, label: "Recipients", href: "/dashboard/recipients" },
];

const bottomItems = [
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: ShieldCheck, label: "Security", href: "/dashboard/security" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-deep-teal text-cream flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight text-mint-green">LevPay</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <p className="text-xs font-semibold text-mint-green/50 uppercase tracking-wider px-2 mb-2">Main Menu</p>
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                            pathname === item.href
                                ? "bg-mint-green text-deep-teal font-medium"
                                : "hover:bg-mint-green/10 text-cream/80 hover:text-cream"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5",
                            pathname === item.href ? "text-deep-teal" : "text-mint-green group-hover:scale-110 transition-transform"
                        )} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="px-4 py-6 space-y-2 border-t border-mint-green/10">
                {bottomItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                            pathname === item.href
                                ? "bg-mint-green text-deep-teal font-medium"
                                : "hover:bg-mint-green/10 text-cream/80 hover:text-cream"
                        )}
                    >
                        <item.icon className="w-5 h-5 text-mint-green/70 group-hover:rotate-12 transition-transform" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
