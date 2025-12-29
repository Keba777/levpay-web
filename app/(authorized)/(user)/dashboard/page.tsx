"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { useWalletStore } from "@/lib/store/wallet-store";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, History, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const { data: session } = useSession();
  const { balance, currency, transactions, loading, fetchDashboardData } = useWalletStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-deep-teal tracking-tight">
              Hello, {session?.user?.name?.split(' ')[0] || "there"} 👋
            </h1>
            <p className="text-deep-teal/60 mt-1">Here's what's happening with your money today.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-mint-green uppercase tracking-widest bg-deep-teal/5 px-3 py-1.5 rounded-full border border-mint-green/20">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            System Operational
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Balance & Quick Stats */}
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <Skeleton className="h-[240px] w-full rounded-3xl" />
            ) : (
              <BalanceCard
                balance={balance}
                currency={currency}
                onTopUp={() => console.log("Top up clicked")}
                onSend={() => console.log("Send clicked")}
              />
            )}

            {/* Insight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-6 bg-white/50 border-mint-green/10 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-deep-teal/50 uppercase tracking-wider">Income (Monthly)</p>
                  <p className="text-xl font-bold text-deep-teal">${(balance * 0.15).toFixed(2)}</p>
                </div>
              </Card>
              <Card className="p-6 bg-white/50 border-mint-green/10 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-600">
                  <TrendingUp className="w-6 h-6 rotate-180" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-deep-teal/50 uppercase tracking-wider">Expenses (Monthly)</p>
                  <p className="text-xl font-bold text-deep-teal">${(balance * 0.08).toFixed(2)}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-deep-teal flex items-center gap-2">
                <History className="w-5 h-5 opacity-50" />
                Recent History
              </h3>
              <Link
                href="/dashboard/transactions"
                className="text-xs font-bold text-mint-green hover:text-deep-teal transition-colors flex items-center gap-1 group"
              >
                View All
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <TransactionList transactions={transactions} />
            )}

            <Card className="p-6 bg-mint-green/10 border-mint-green/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <Wallet className="w-24 h-24 text-deep-teal" />
              </div>
              <h4 className="font-bold text-deep-teal relative z-10">Save more with LevPay</h4>
              <p className="text-xs text-deep-teal/60 mt-1 relative z-10">Get up to 5% cashback on all international transfers this month.</p>
              <Button className="mt-4 bg-deep-teal text-white hover:bg-deep-teal/90 w-full text-xs h-9 rounded-xl">
                Learn More
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
