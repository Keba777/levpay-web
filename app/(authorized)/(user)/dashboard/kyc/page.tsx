"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { kycAPI, KYCDocument, KYCStatus } from "@/lib/api/endpoints/kyc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ShieldCheck,
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock,
    ArrowRight,
    Camera,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 'intro' | 'type-selection' | 'upload' | 'verifying' | 'completed';

export default function KYCPage() {
    const [step, setStep] = useState<Step>('intro');
    const [overallStatus, setOverallStatus] = useState<KYCStatus>('not_started');
    const [documents, setDocuments] = useState<KYCDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchKYCStatus();
    }, []);

    const fetchKYCStatus = async () => {
        setLoading(true);
        try {
            const res = await kycAPI.getStatus();
            setOverallStatus(res.overall_status);
            setDocuments(res.documents);

            if (res.overall_status === 'pending') {
                setStep('verifying');
            } else if (res.overall_status === 'approved') {
                setStep('completed');
            }
        } catch (err) {
            console.error("Failed to fetch KYC status:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedType || !file) return;
        setUploading(true);
        setError(null);
        try {
            await kycAPI.uploadDocument(selectedType, file);
            setStep('verifying');
            setOverallStatus('pending');
        } catch (err: any) {
            setError(err.message || "Failed to upload document. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const renderStep = () => {
        if (loading) return <Skeleton className="h-[400px] w-full rounded-3xl" />;

        switch (step) {
            case 'intro':
                return (
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-mint-green/20 blur-2xl rounded-full scale-150"></div>
                            <ShieldCheck className="w-24 h-24 text-mint-green relative" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-deep-teal tracking-tight">Identity Verification</h2>
                            <p className="text-lg text-deep-teal/60 max-w-md mx-auto leading-relaxed">
                                To double your limits and unlock all features, we need to verify who you are. It only takes a minute.
                            </p>
                        </div>
                        <Card className="p-6 bg-mint-green/5 border-mint-green/10 flex items-start gap-4 text-left max-w-md mx-auto">
                            <Info className="w-6 h-6 text-mint-green shrink-0 mt-0.5" />
                            <p className="text-sm text-deep-teal/70 font-medium">
                                We'll need a clear photo of your National ID, Passport, or Driver's License.
                            </p>
                        </Card>
                        <Button
                            onClick={() => setStep('type-selection')}
                            className="h-14 px-12 rounded-2xl bg-deep-teal hover:bg-deep-teal/90 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all group"
                        >
                            Start Verification
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                );

            case 'type-selection':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-deep-teal">Select Document Type</h2>
                            <p className="text-deep-teal/60">Choose the document you'd like to use for verification.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'passport', name: 'Passport', icon: FileText },
                                { id: 'national_id', name: 'National ID', icon: ShieldCheck },
                                { id: 'drivers_license', name: 'Driver\'s License', icon: Camera },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setSelectedType(type.id);
                                        setStep('upload');
                                    }}
                                    className="p-6 bg-white border border-mint-green/10 rounded-3xl hover:border-mint-green transition-all group hover:shadow-lg hover:scale-[1.02] flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-14 h-14 bg-mint-green/10 rounded-2xl flex items-center justify-center group-hover:bg-mint-green group-hover:text-white transition-colors duration-300">
                                        <type.icon className="w-7 h-7 text-mint-green group-hover:text-white" />
                                    </div>
                                    <span className="font-bold text-deep-teal">{type.name}</span>
                                </button>
                            ))}
                        </div>
                        <Button variant="ghost" className="text-deep-teal/40 font-bold" onClick={() => setStep('intro')}>Back</Button>
                    </div>
                );

            case 'upload':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-deep-teal uppercase tracking-tighter">Upload {selectedType?.replace('_', ' ')}</h2>
                            <p className="text-deep-teal/60">Ensure all details are clearly visible and legible.</p>
                        </div>

                        <div
                            className={cn(
                                "relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all overflow-hidden",
                                file ? "border-mint-green bg-mint-green/5" : "border-mint-green/20 bg-white"
                            )}
                        >
                            {file ? (
                                <div className="text-center p-6">
                                    <FileText className="w-12 h-12 text-mint-green mx-auto mb-2" />
                                    <p className="font-bold text-deep-teal truncate max-w-[200px]">{file.name}</p>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="text-xs font-bold text-red-500 hover:underline mt-2"
                                    >
                                        Remove File
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-mint-green opacity-40" />
                                    <p className="text-sm font-bold text-deep-teal/40">Drag or click to upload</p>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        accept="image/*,application/pdf"
                                    />
                                </>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                className="flex-1 h-14 rounded-2xl text-deep-teal/40 font-bold"
                                onClick={() => setStep('type-selection')}
                            >
                                Change Type
                            </Button>
                            <Button
                                disabled={!file || uploading}
                                onClick={handleUpload}
                                className="flex-[2] h-14 rounded-2xl bg-deep-teal hover:bg-deep-teal/90 text-white font-bold text-lg shadow-lg group"
                            >
                                {uploading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Submit for Review <CheckCircle2 className="w-5 h-5 ml-2" /></>
                                )}
                            </Button>
                        </div>
                    </div>
                );

            case 'verifying':
                return (
                    <div className="text-center space-y-8 animate-in zoom-in-95 duration-700">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center">
                                <Clock className="w-16 h-16 text-amber-500 animate-[spin_8s_linear_infinite]" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-deep-teal tracking-tight">Verification Pending</h2>
                            <p className="text-lg text-deep-teal/60 max-w-md mx-auto font-medium">
                                We've received your documents! Our team is reviewing them now. This usually takes less than 24 hours.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-mint-green/10 inline-block shadow-sm">
                            <p className="text-xs font-bold text-deep-teal/40 uppercase tracking-widest mb-1">Status Tracking</p>
                            <div className="flex items-center gap-2 text-amber-500 font-bold">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                Pending Review
                            </div>
                        </div>
                        <div className="pt-8">
                            <Button
                                variant="outline"
                                className="h-14 px-12 rounded-2xl border-mint-green/20 text-deep-teal font-bold"
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                );

            case 'completed':
                return (
                    <div className="text-center space-y-8 animate-in zoom-in-95 duration-700">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                                <ShieldCheck className="w-16 h-16 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-emerald-600 tracking-tight tracking-tight uppercase">Verified!</h2>
                            <p className="text-lg text-deep-teal/60 max-w-md mx-auto font-medium">
                                Identity verification success! You now have unrestricted access to all LevPay features.
                            </p>
                        </div>
                        <div className="pt-8">
                            <Button
                                className="h-14 px-12 rounded-2xl bg-deep-teal hover:bg-deep-teal/90 text-white font-bold"
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto py-12">
                {renderStep()}
            </div>
        </DashboardLayout>
    );
}
