"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { userAPI, UpdateUserRequest, UpdateSettingsRequest } from "@/lib/api/endpoints/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import {
    User,
    Settings,
    Lock,
    Bell,
    Globe,
    CreditCard,
    Camera,
    CheckCircle2,
    AlertCircle,
    Save,
    Shield,
    Coins
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Tab = 'profile' | 'security' | 'preferences' | 'notifications';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [u, s] = await Promise.all([
                userAPI.getMe(),
                userAPI.getSettings()
            ]);
            setUser(u);
            setSettings(s.preferences ? JSON.parse(s.preferences) : {});
            if (u.avatar_url) setAvatarPreview(u.avatar_url);
        } catch (err) {
            console.error("Failed to fetch settings data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);
        const formData = new FormData(e.currentTarget);
        const data: UpdateUserRequest = {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            username: formData.get('username') as string,
            phone: formData.get('phone') as string,
            avatar: selectedFile || undefined,
        };

        try {
            await userAPI.updateProfile(data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            fetchData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateSettings = async (prefsUpdates: any) => {
        setUpdating(true);
        setMessage(null);
        try {
            const newSettings = { ...settings, ...prefsUpdates };
            await userAPI.updateSettings(newSettings);
            setSettings(newSettings);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
        } finally {
            setUpdating(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs: { id: Tab, label: string, icon: any }[] = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-24 rounded-lg" />)}
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-black text-deep-teal tracking-tight mb-8">Settings</h1>

                {/* Tab Navigation */}
                <div className="flex gap-2 p-1 bg-mint-green/10 rounded-2xl mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300",
                                activeTab === tab.id
                                    ? "bg-white text-deep-teal shadow-md"
                                    : "text-deep-teal/40 hover:text-deep-teal/60 hover:bg-white/50"
                            )}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-4 rounded-2xl mb-8 flex items-center gap-3 font-medium",
                            message.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'profile' && (
                            <Card className="p-8 bg-white border-mint-green/10 rounded-[2.5rem] shadow-xl shadow-mint-green/5 overflow-hidden">
                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-mint-green/20 p-1 group-hover:border-mint-green/50 transition-colors">
                                                <img
                                                    src={avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <label className="absolute bottom-0 right-0 p-2 bg-deep-teal text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                                <Camera className="w-5 h-5" />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                        <div className="space-y-1 text-center md:text-left">
                                            <h3 className="text-xl font-bold text-deep-teal">Profile Picture</h3>
                                            <p className="text-sm text-deep-teal/50">PNG, JPG or GIF. Max size 2MB.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-black text-deep-teal/40 uppercase tracking-widest ml-1">First Name</Label>
                                            <Input name="first_name" defaultValue={user?.first_name} className="h-14 rounded-2xl border-mint-green/20 focus:border-mint-green bg-mint-green/[0.02] font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-black text-deep-teal/40 uppercase tracking-widest ml-1">Last Name</Label>
                                            <Input name="last_name" defaultValue={user?.last_name} className="h-14 rounded-2xl border-mint-green/20 focus:border-mint-green bg-mint-green/[0.02] font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-black text-deep-teal/40 uppercase tracking-widest ml-1">Username</Label>
                                            <Input name="username" defaultValue={user?.username} className="h-14 rounded-2xl border-mint-green/20 focus:border-mint-green bg-mint-green/[0.02] font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-black text-deep-teal/40 uppercase tracking-widest ml-1">Phone Number</Label>
                                            <Input name="phone" defaultValue={user?.phone} className="h-14 rounded-2xl border-mint-green/20 focus:border-mint-green bg-mint-green/[0.02] font-bold" />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-mint-green/5 flex justify-end">
                                        <Button type="submit" disabled={updating} className="h-14 px-8 rounded-2xl bg-deep-teal hover:bg-deep-teal/90 text-white font-bold group">
                                            {updating ? <span className="animate-spin mr-2">◌</span> : <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card className="p-8 bg-white border-mint-green/10 rounded-[2.5rem] shadow-xl shadow-mint-green/5 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-deep-teal">Change Password</h3>
                                            <p className="text-sm text-deep-teal/40 font-medium">Keep your account secure with a strong password.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-w-md">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black text-deep-teal/40 uppercase tracking-widest">Current Password</Label>
                                            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-mint-green/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black text-deep-teal/40 uppercase tracking-widest">New Password</Label>
                                            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-mint-green/20" />
                                        </div>
                                        <Button className="h-14 w-full rounded-2xl border-mint-green/20 text-deep-teal font-bold" variant="outline">Update Password</Button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-mint-green/5 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-mint-green/10 rounded-2xl flex items-center justify-center">
                                                <Shield className="w-6 h-6 text-mint-green" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-deep-teal">Two-Factor Authentication</h3>
                                                <p className="text-sm text-deep-teal/40 font-medium">Add an extra layer of security to your account.</p>
                                            </div>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={user?.is_2fa_enabled} readOnly />
                                            <div className="w-14 h-8 bg-mint-green/20 rounded-full peer peer-checked:bg-mint-green peer-focus:ring-2 peer-focus:ring-mint-green/20 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6 shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'preferences' && (
                            <Card className="p-8 bg-white border-mint-green/10 rounded-[2.5rem] shadow-xl shadow-mint-green/5 space-y-8">
                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                                            <Coins className="w-6 h-6 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-deep-teal">Primary Currency</h3>
                                            <p className="text-sm text-deep-teal/40 font-medium">Default currency for your dashboard and transfers.</p>
                                        </div>
                                    </div>
                                    <select
                                        value={settings?.currency || 'USD'}
                                        onChange={(e) => handleUpdateSettings({ currency: e.target.value })}
                                        className="h-12 px-4 rounded-xl border border-mint-green/20 font-bold text-deep-teal bg-mint-green/[0.02] outline-none focus:ring-2 focus:ring-mint-green/20"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="NGN">NGN (₦)</option>
                                    </select>
                                </div>

                                <div className="pt-8 border-t border-mint-green/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-mint-green/10 rounded-2xl flex items-center justify-center">
                                            <Globe className="w-6 h-6 text-mint-green" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-deep-teal">Language</h3>
                                            <p className="text-sm text-deep-teal/40 font-medium">Choose your preferred display language.</p>
                                        </div>
                                    </div>
                                    <select
                                        value={settings?.language || 'en'}
                                        onChange={(e) => handleUpdateSettings({ language: e.target.value })}
                                        className="h-12 px-4 rounded-xl border border-mint-green/20 font-bold text-deep-teal bg-mint-green/[0.02] outline-none"
                                    >
                                        <option value="en">English</option>
                                        <option value="fr">French</option>
                                        <option value="es">Spanish</option>
                                    </select>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card className="p-8 bg-white border-mint-green/10 rounded-[2.5rem] shadow-xl shadow-mint-green/5 space-y-4">
                                {[
                                    { id: 'email_transfers', title: 'Transfer Notifications', desc: 'Get notified via email when you send or receive money.' },
                                    { id: 'email_security', title: 'Security Alerts', desc: 'Critical alerts about login attempts and profile changes.' },
                                    { id: 'email_marketing', title: 'Marketing Emails', desc: 'News, offers and updates from the LevPay team.' },
                                ].map((notif, idx) => (
                                    <div key={notif.id} className={cn("flex items-center justify-between py-6", idx !== 0 && "border-t border-mint-green/5")}>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-deep-teal">{notif.title}</h3>
                                            <p className="text-sm text-deep-teal/40 font-medium max-w-sm">{notif.desc}</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={settings?.[notif.id] ?? true}
                                                onChange={(e) => handleUpdateSettings({ [notif.id]: e.target.checked })}
                                            />
                                            <div className="w-14 h-8 bg-mint-green/20 rounded-full peer peer-checked:bg-mint-green transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6"></div>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
