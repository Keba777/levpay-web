"use client";

import { useState } from "react";
import { ArrowUpRight, Plus, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BalanceCardProps {
    balance: number;
    currency: string;
    onTopUp?: () => void;
    onSend?: () => void;
}

export function BalanceCard({ balance, currency, onTopUp, onSend }: BalanceCardProps) {
    const [showBalance, setShowBalance] = useState(true);

    return (
        <Card className="relative overflow-hidden bg-gradient-to-br from-deep-teal to-sage p-8 text-cream border-none shadow-xl group">
            {/* Decorative background elements */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-mint-green/20 rounded-full blur-2xl group-hover:bg-mint-green/30 transition-all duration-700"></div>

            <div className="relative flex justify-between items-start mb-8">
                <div>
                    <p className="text-sm font-medium text-mint-green/80 uppercase tracking-widest mb-1">Total Balance</p>
                    <div className="flex items-center gap-3">
                        <h2 className="text-4xl font-bold tracking-tight">
                            {showBalance ? `${currency} ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "••••••••"}
                        </h2>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {showBalance ? <EyeOff className="w-5 h-5 opacity-70" /> : <Eye className="w-5 h-5 opacity-70" />}
                        </button>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </div>

            <div className="relative flex flex-wrap gap-3">
                <Button
                    onClick={onTopUp}
                    className="bg-mint-green text-deep-teal hover:bg-white hover:scale-105 transition-all duration-300 font-semibold px-6 py-6 rounded-2xl flex items-center gap-2 border-none shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Top Up
                </Button>
                <Button
                    onClick={onSend}
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md text-cream border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold px-6 py-6 rounded-2xl flex items-center gap-2 shadow-lg"
                >
                    <ArrowUpRight className="w-5 h-5" />
                    Send Money
                </Button>
            </div>
        </Card>
    );
}
