"use client";

import { useEffect, useState } from "react";
import { adminAPI, AdminDashboardResponse } from "@/lib/api/endpoints/admin";
import {
    Users,
    Wallet,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Shield
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminAPI.getDashboard();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
        <Card className="p-6 border-0 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-black text-slate-900">{value}</p>
        </Card>
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
                </div>
                <Skeleton className="h-96 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm">Welcome back, Administrator.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.system.total_users.toLocaleString()}
                    icon={Users}
                    color="bg-blue-500 text-blue-500"
                    trend={12}
                />
                <StatCard
                    title="Total Wallets"
                    value={stats?.system.total_wallets.toLocaleString()}
                    icon={Wallet}
                    color="bg-purple-500 text-purple-500"
                    trend={8}
                />
                <StatCard
                    title="Pending KYC"
                    value={stats?.system.kyc_pending.toString()}
                    icon={Shield}
                    color="bg-amber-500 text-amber-500"
                    trend={-2}
                />
                <StatCard
                    title="Tx Volume"
                    value={`$${stats?.transaction.total_volume.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-emerald-500 text-emerald-500"
                    trend={24}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder for future charts */}
                <Card className="p-6 border-0 shadow-sm bg-white h-80 flex items-center justify-center text-slate-400">
                    Coming Soon: Transaction Analytics Chart
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white h-80 flex items-center justify-center text-slate-400">
                    Coming Soon: User Growth Chart
                </Card>
            </div>
        </div>
    );
}
