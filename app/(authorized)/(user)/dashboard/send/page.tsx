"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useWalletStore } from "@/lib/store/wallet-store";
import { userAPI, PublicUser } from "@/lib/api/endpoints/user";
import { transactionAPI } from "@/lib/api/endpoints/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import {
    ArrowLeft,
    Search,
    Send,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Info
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Step = 'search' | 'amount' | 'review' | 'success';

export default function SendMoneyPage() {
    const { balance, currency, fetchDashboardData } = useWalletStore();
    const [step, setStep] = useState<Step>('search');
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<PublicUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Search Logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                try {
                    const res = await userAPI.search(query);
                    setResults(res.records);
                } catch (err) {
                    console.error("Search error:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleTransfer = async () => {
        if (!selectedUser) return;
        setProcessing(true);
        setError(null);
        try {
            await transactionAPI.transfer(selectedUser.email, parseFloat(amount), description);
            setStep('success');
            fetchDashboardData();
        } catch (err: any) {
            setError(err.message || "Transfer failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'search':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-deep-teal">Who are you sending to?</h2>
                            <p className="text-deep-teal/60">Enter an email, username, or name to find the recipient.</p>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-teal/40" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search people..."
                                className="pl-12 h-14 bg-white border-mint-green/20 rounded-2xl shadow-sm focus:ring-mint-green text-lg"
                            />
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
                            ) : results.length > 0 ? (
                                results.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setStep('amount');
                                        }}
                                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-mint-green/5 border border-mint-green/10 rounded-2xl transition-all group shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar
                                                src={user.avatar_url}
                                                fallback={`${user.first_name} ${user.last_name}`}
                                                className="w-12 h-12"
                                            />
                                            <div className="text-left">
                                                <p className="font-bold text-deep-teal">{user.first_name} {user.last_name}</p>
                                                <p className="text-xs text-deep-teal/40">@{user.username || 'user'}</p>
                                            </div>
                                        </div>
                                        <ArrowLeft className="w-5 h-5 text-mint-green rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))
                            ) : query.length > 2 && !loading ? (
                                <div className="py-12 text-center text-deep-teal/40">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No users found matching "{query}"</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                );

            case 'amount':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <button
                            onClick={() => setStep('search')}
                            className="flex items-center gap-2 text-sm font-bold text-mint-green hover:text-deep-teal transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Search
                        </button>

                        <div className="flex items-center gap-4 p-4 bg-mint-green/10 rounded-3xl border border-mint-green/20">
                            <Avatar
                                src={selectedUser?.avatar_url}
                                fallback={`${selectedUser?.first_name} ${selectedUser?.last_name}`}
                                className="w-16 h-16 border-white shadow-md"
                            />
                            <div>
                                <p className="text-xs font-bold text-mint-green uppercase tracking-widest">Recipient</p>
                                <h3 className="text-xl font-bold text-deep-teal">{selectedUser?.first_name} {selectedUser?.last_name}</h3>
                                <p className="text-sm text-deep-teal/40">{selectedUser?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-deep-teal ml-1 uppercase tracking-widest opacity-60">Amount to Send</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-2/3 text-4xl font-bold text-deep-teal/20">{currency}</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-white border-mint-green/20 rounded-3xl p-10 pl-24 text-6xl font-black text-deep-teal focus:outline-none focus:ring-4 focus:ring-mint-green/20 shadow-inner"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-between px-2">
                                <p className="text-sm font-medium text-deep-teal/60">
                                    Current Balance: <span className="font-bold text-deep-teal">{currency} {balance.toLocaleString()}</span>
                                </p>
                                {parseFloat(amount) > balance && (
                                    <p className="text-sm font-bold text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> Insufficient funds
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-deep-teal ml-1 uppercase tracking-widest opacity-60">What's it for? (Optional)</label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Dinner, rent, gift..."
                                className="h-16 rounded-2xl border-mint-green/10 bg-white"
                            />
                        </div>

                        <Button
                            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                            onClick={() => setStep('review')}
                            className="w-full h-16 rounded-2xl bg-deep-teal hover:bg-deep-teal/90 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            Review Transfer
                        </Button>
                    </div>
                );

            case 'review':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <button
                            onClick={() => setStep('amount')}
                            className="flex items-center gap-2 text-sm font-bold text-mint-green hover:text-deep-teal transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Change Amount
                        </button>

                        <h2 className="text-2xl font-bold text-deep-teal">Transfer Review</h2>

                        <Card className="p-8 space-y-6 border-mint-green/20 bg-white/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Send className="w-32 h-32 text-deep-teal" />
                            </div>

                            <div className="flex justify-between items-center text-sm border-b border-mint-green/10 pb-4">
                                <span className="text-deep-teal/40 font-bold uppercase tracking-wider">Recipient</span>
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        src={selectedUser?.avatar_url}
                                        fallback={`${selectedUser?.first_name}`}
                                        className="w-8 h-8"
                                    />
                                    <span className="font-bold text-deep-teal">{selectedUser?.first_name} {selectedUser?.last_name}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-deep-teal/40 font-bold uppercase tracking-wider">Sending Amount</span>
                                <span className="text-2xl font-black text-deep-teal">{currency} {parseFloat(amount).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-mint-green/10 pb-4">
                                <span className="text-deep-teal/40 font-bold uppercase tracking-wider">Transaction Fee</span>
                                <span className="font-bold text-emerald-500">FREE</span>
                            </div>

                            <div className="pt-2">
                                <span className="text-deep-teal/40 font-bold uppercase tracking-wider text-sm block mb-2">Description</span>
                                <p className="text-deep-teal p-3 bg-white rounded-xl text-sm italic border border-mint-green/5">
                                    "{description || 'No description provided'}"
                                </p>
                            </div>
                        </Card>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            disabled={processing}
                            onClick={handleTransfer}
                            className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                            {processing ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-6 h-6" />
                            )}
                            {processing ? "Sending Money..." : "Confirm & Send"}
                        </Button>

                        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                Funds will be transferred instantly to the recipient's wallet. This action cannot be undone once confirmed.
                            </p>
                        </div>
                    </div>
                );

            case 'success':
                return (
                    <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-in zoom-in-95 duration-700">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20 translate-y-0 animate-bounce">
                                <CheckCircle2 className="w-16 h-16 text-white" />
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                            <h2 className="text-4xl font-black text-deep-teal tracking-tight">Money Sent!</h2>
                            <p className="text-xl text-deep-teal/60 font-medium">
                                {currency} {parseFloat(amount).toFixed(2)} has been successfully sent to<br />
                                <span className="font-bold text-deep-teal">{selectedUser?.first_name} {selectedUser?.last_name}</span>
                            </p>
                        </div>

                        <Link href="/dashboard" className="w-full max-w-sm">
                            <Button className="w-full h-14 rounded-2xl bg-deep-teal hover:bg-deep-teal/90 text-white font-bold shadow-lg">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-xl mx-auto py-4">
                {renderStep()}
            </div>
        </DashboardLayout>
    );
}
