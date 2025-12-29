"use client";

import { useState, useEffect } from "react";
import {
    Receipt,
    Search,
    Filter,
    Download,
    CreditCard,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    TrendingUp,
    Wallet
} from "lucide-react";
import { billingAPI, Invoice, BillingStats } from "@/lib/api/endpoints/billing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function BillingPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [stats, setStats] = useState<BillingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [invoiceData, statsData] = await Promise.all([
                billingAPI.listInvoices(),
                billingAPI.getStats()
            ]);
            setInvoices(invoiceData);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to fetch billing data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (id: string) => {
        try {
            await billingAPI.payInvoice(id);
            fetchData(); // Refresh
        } catch (error) {
            console.error("Payment failed:", error);
        }
    };

    const handleCancel = async (id: string) => {
        try {
            await billingAPI.cancelInvoice(id);
            fetchData(); // Refresh
        } catch (error) {
            console.error("Cancellation failed:", error);
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || inv.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'overdue': return <AlertCircle className="w-4 h-4 text-rose-500" />;
            case 'canceled': return <XCircle className="w-4 h-4 text-slate-400" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case 'pending': return "bg-amber-50 text-amber-700 border-amber-100";
            case 'overdue': return "bg-rose-50 text-rose-700 border-rose-100";
            case 'canceled': return "bg-slate-50 text-slate-700 border-slate-100";
            default: return "";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-deep-teal">Billing & Invoices</h1>
                    <p className="text-deep-teal/60">Manage your payments, view invoices, and track your spending.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-white border-none shadow-lg shadow-mint-green/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-mint-green/10">
                                <TrendingUp className="w-5 h-5 text-mint-green" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-deep-teal">${stats?.total_invoiced?.toFixed(2) || "0.00"}</div>
                        <p className="text-xs text-deep-teal/40 font-medium">Total Invoiced</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-lg shadow-emerald-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-deep-teal">${stats?.total_paid?.toFixed(2) || "0.00"}</div>
                        <p className="text-xs text-deep-teal/40 font-medium">Total Paid</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-lg shadow-amber-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-amber-500/10">
                                <Clock className="w-5 h-5 text-amber-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-deep-teal">${stats?.total_pending?.toFixed(2) || "0.00"}</div>
                        <p className="text-xs text-deep-teal/40 font-medium">Pending Amount</p>
                    </CardContent>
                </Card>
                <Card className="bg-deep-teal text-white border-none shadow-lg shadow-deep-teal/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-white/10">
                                <Receipt className="w-5 h-5 text-mint-green" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold">{stats?.invoice_count || "0"}</div>
                        <p className="text-xs text-white/60 font-medium">Total Invoices</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-deep-teal/5 border border-mint-green/10 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-teal/30" />
                        <Input
                            placeholder="Search by description or ID..."
                            className="pl-10 bg-gray-50 border-none focus-visible:ring-mint-green"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {["all", "pending", "paid", "canceled"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                                        filterStatus === status ? "bg-white text-deep-teal shadow-sm" : "text-deep-teal/40 hover:text-deep-teal/60"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-deep-teal/40 uppercase tracking-widest">Invoice</th>
                                <th className="px-6 py-4 text-xs font-bold text-deep-teal/40 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-deep-teal/40 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-deep-teal/40 uppercase tracking-widest">Due Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-deep-teal/40 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-200 rounded ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-deep-teal/40">
                                        No invoices found.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-deep-teal">{invoice.description}</span>
                                                <span className="text-[10px] text-deep-teal/30 font-mono mt-0.5">{invoice.id.split('-')[0].toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-deep-teal">
                                            ${invoice.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border",
                                                getStatusColor(invoice.status)
                                            )}>
                                                {getStatusIcon(invoice.status)}
                                                {invoice.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-deep-teal/60">
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {invoice.status === 'pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCancel(invoice.id)}
                                                        className="h-8 text-[10px] font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handlePay(invoice.id)}
                                                        className="h-8 text-[10px] font-bold bg-mint-green text-deep-teal hover:bg-mint-green/90 shadow-lg shadow-mint-green/20"
                                                    >
                                                        Pay Now
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-mint-green/10 text-deep-teal/40">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
