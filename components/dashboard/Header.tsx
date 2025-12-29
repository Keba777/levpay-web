"use client";

import { useSession } from "next-auth/react";
import { Search, Menu, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "./NotificationPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header({ onMobileMenuClick }: { onMobileMenuClick: () => void }) {
    const { data: session } = useSession();

    return (
        <header className="h-16 bg-cream/80 backdrop-blur-md border-b border-mint-green/20 sticky top-0 z-40 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMobileMenuClick}
                    className="md:hidden p-2 hover:bg-mint-green/10 rounded-lg text-deep-teal"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative max-w-md w-full hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-teal/40" />
                    <input
                        type="text"
                        placeholder="Search transactions, people..."
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-mint-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent text-sm transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <NotificationPanel />

                <div className="flex items-center gap-3 pl-4 border-l border-mint-green/20">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-deep-teal line-clamp-1">
                            {session?.user?.name || "Loading..."}
                        </p>
                        <p className="text-[10px] font-bold text-mint-green uppercase tracking-widest">
                            {session?.user?.role || "User"}
                        </p>
                    </div>
                    <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback>
                            <UserCircle className="w-6 h-6 text-deep-teal/50" />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
