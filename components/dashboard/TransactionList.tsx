"use client";

import {
    ArrowUpRight,
    ArrowDownLeft,
    ShoppingBag,
    Wallet,
    MoreVertical,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionResponse } from "@/lib/api/endpoints/transaction";

interface TransactionListProps {
    transactions: TransactionResponse[];
}

const statusConfig = {
    completed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    reversed: { icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
};

const typeConfig = {
    transfer: { icon: ArrowUpRight, color: "text-deep-teal", bg: "bg-deep-teal/10" },
    topup: { icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    payment: { icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    withdrawal: { icon: ArrowDownLeft, color: "text-rose-500", bg: "bg-rose-500/10" },
};

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-deep-teal/40">
                <Clock className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">No transactions yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((tx) => {
                const type = typeConfig[tx.type as keyof typeof typeConfig] || typeConfig.transfer;
                const status = statusConfig[tx.status as keyof typeof statusConfig] || statusConfig.pending;

                return (
                    <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 bg-white/50 border border-mint-green/10 rounded-2xl hover:bg-white hover:shadow-md hover:scale-[1.01] transition-all duration-300 group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn("p-3 rounded-xl transition-colors group-hover:bg-white", type.bg)}>
                                <type.icon className={cn("w-5 h-5", type.color)} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-deep-teal">
                                    {tx.type === 'transfer' ? `Transfer to ${tx.description?.split(' ')[0] || 'User'}` :
                                        tx.type === 'topup' ? 'Wallet Top Up' :
                                            tx.type === 'payment' ? 'Service Payment' : 'Withdrawal'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-medium text-deep-teal/40 bg-mint-green/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </span>
                                    <div className={cn("flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider", status.bg, status.color)}>
                                        <status.icon className="w-3 h-3" />
                                        {tx.status}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className={cn(
                                "text-lg font-bold tracking-tight",
                                tx.type === 'topup' ? "text-emerald-600" : "text-deep-teal"
                            )}>
                                {tx.type === 'topup' ? "+" : "-"}{tx.currency} {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-mint-green/10 rounded-lg transition-all">
                                <MoreVertical className="w-4 h-4 text-deep-teal/40" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
