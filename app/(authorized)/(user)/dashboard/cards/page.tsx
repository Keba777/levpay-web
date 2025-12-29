"use client";

import { useState, useEffect } from "react";
import { Plus, CreditCard, Trash2, CheckCircle, ShieldCheck, Banknote, MoreVertical } from "lucide-react";
import { paymentMethodAPI, PaymentMethod } from "@/lib/api/endpoints/cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function CardsPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCard, setNewCard] = useState({
        number: "",
        expiry: "",
        cvv: "",
        holderName: "",
        is_default: false,
    });

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            const data = await paymentMethodAPI.list();
            setMethods(data);
        } catch (error) {
            console.error("Failed to fetch payment methods:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await paymentMethodAPI.add({
                type: "card",
                details: {
                    number: newCard.number,
                    expiry: newCard.expiry,
                    holder_name: newCard.holderName,
                },
                is_default: newCard.is_default,
            });
            setIsAddModalOpen(false);
            setNewCard({ number: "", expiry: "", cvv: "", holderName: "", is_default: false });
            fetchMethods();
        } catch (error) {
            console.error("Failed to add card:", error);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            await paymentMethodAPI.remove(id);
            fetchMethods();
        } catch (error) {
            console.error("Failed to remove payment method:", error);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await paymentMethodAPI.setDefault(id);
            fetchMethods();
        } catch (error) {
            console.error("Failed to set default:", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-deep-teal">My Cards</h1>
                    <p className="text-deep-teal/60">Securely manage your linked cards and bank accounts.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-mint-green text-deep-teal hover:bg-mint-green/90 shadow-lg shadow-mint-green/20"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Card
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(2).fill(0).map((_, i) => (
                        <Card key={i} className="bg-white/50 border-mint-green/10 animate-pulse">
                            <div className="h-48 rounded-xl bg-gray-200/50 m-4" />
                        </Card>
                    ))
                ) : methods.length === 0 ? (
                    <Card className="col-span-full py-12 border-dashed border-2 border-mint-green/20 bg-transparent flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-mint-green/10 flex items-center justify-center mb-4">
                            <CreditCard className="w-8 h-8 text-mint-green" />
                        </div>
                        <CardTitle className="text-deep-teal/80">No payment methods linked</CardTitle>
                        <CardDescription className="max-w-xs mx-auto mt-2">
                            Link a credit card or bank account to start making transfers and topping up your wallet.
                        </CardDescription>
                    </Card>
                ) : (
                    methods.map((method) => (
                        <Card key={method.id} className="relative overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
                                method.is_default ? "from-deep-teal to-deep-teal/80 opacity-100" : "from-mint-green to-mint-green/60 opacity-20 group-hover:opacity-30"
                            )} />

                            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    method.is_default ? "bg-white/10" : "bg-deep-teal/10"
                                )}>
                                    {method.type === 'card' ? <CreditCard className={cn("w-5 h-5", method.is_default ? "text-mint-green" : "text-deep-teal")} /> : <Banknote className={cn("w-5 h-5", method.is_default ? "text-mint-green" : "text-deep-teal")} />}
                                </div>
                                <div className="flex items-center gap-1">
                                    {method.is_default && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-mint-green text-deep-teal px-2 py-0.5 rounded-full">Primary</span>
                                    )}
                                    <Button variant="ghost" size="icon" className={cn(
                                        "w-8 h-8 rounded-full",
                                        method.is_default ? "hover:bg-white/10 text-white/60" : "hover:bg-deep-teal/10 text-deep-teal/40"
                                    )}>
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="relative z-10 pt-4 pb-8">
                                <div className={cn(
                                    "text-2xl font-mono tracking-[0.25em] mb-4",
                                    method.is_default ? "text-white" : "text-deep-teal"
                                )}>
                                    •••• •••• •••• {method.last_four_digits || "4242"}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className={cn("text-[10px] uppercase tracking-widest opacity-60 mb-1", method.is_default ? "text-white" : "text-deep-teal")}>Card Holder</p>
                                        <p className={cn("font-medium", method.is_default ? "text-white" : "text-deep-teal")}>KEVIN BASIL</p>
                                    </div>
                                    <div>
                                        <p className={cn("text-[10px] uppercase tracking-widest opacity-60 mb-1", method.is_default ? "text-white" : "text-deep-teal")}>Expires</p>
                                        <p className={cn("font-medium", method.is_default ? "text-white" : "text-deep-teal")}>12/28</p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="relative z-10 bg-black/5 flex justify-between py-3">
                                {!method.is_default ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSetDefault(method.id)}
                                        className="text-xs text-deep-teal hover:bg-deep-teal/5 font-semibold"
                                    >
                                        Set as Default
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-mint-green text-xs font-semibold">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Secure & Verified
                                    </div>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemove(method.id)}
                                    className="text-xs text-red-500 hover:bg-red-50 hover:text-red-600 h-8"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                    Remove
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Card Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-deep-teal/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader>
                            <CardTitle className="text-2xl text-deep-teal">Add Payment Method</CardTitle>
                            <CardDescription>Enter your card details to link it to your account.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleAddCard}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="holderName">Cardholder Name</Label>
                                    <Input
                                        id="holderName"
                                        placeholder="Kevin Basil"
                                        value={newCard.holderName}
                                        onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="number">Card Number</Label>
                                    <Input
                                        id="number"
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        value={newCard.number}
                                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            placeholder="MM/YY"
                                            value={newCard.expiry}
                                            onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            placeholder="***"
                                            type="password"
                                            value={newCard.cvv}
                                            onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={newCard.is_default}
                                        onChange={(e) => setNewCard({ ...newCard, is_default: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-mint-green focus:ring-mint-green"
                                    />
                                    <Label htmlFor="isDefault" className="text-sm cursor-pointer">Set as primary payment method</Label>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 border-mint-green/20 text-deep-teal hover:bg-mint-green/5"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-deep-teal text-white hover:bg-deep-teal/90"
                                >
                                    Link Card
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
