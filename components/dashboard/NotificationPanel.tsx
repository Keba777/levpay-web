"use client";

import { useState, useEffect } from "react";
import {
    Bell,
    CheckCheck,
    Info,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    X
} from "lucide-react";
import { notificationAPI, Notification } from "@/lib/api/endpoints/notifications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

export function NotificationPanel() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const [list, countData] = await Promise.all([
                notificationAPI.list(),
                notificationAPI.getUnreadCount()
            ]);
            setNotifications(list);
            setUnreadCount(countData.count);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Refresh every 30 seconds for demo purposes
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationAPI.markAsRead(id);
            fetchNotifications(); // Refresh
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-rose-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <Sheet onOpenChange={(open) => open && fetchNotifications()}>
            <SheetTrigger asChild>
                <button className="relative p-2 rounded-xl text-deep-teal/40 hover:text-deep-teal hover:bg-mint-green/10 transition-all outline-none">
                    <Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-white p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-gray-100 flex-row items-center justify-between space-y-0">
                    <SheetTitle className="text-xl font-bold text-deep-teal flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold">
                                {unreadCount} New
                            </span>
                        )}
                    </SheetTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-deep-teal/40 hover:text-deep-teal">
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark all read
                    </Button>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {Array(4).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse flex gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0" />
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-3 w-1/2 bg-gray-100 rounded" />
                                        <div className="h-2 w-full bg-gray-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="p-4 rounded-full bg-mint-green/10 mb-4 text-mint-green">
                                <Bell className="w-12 h-12" />
                            </div>
                            <h3 className="text-lg font-bold text-deep-teal">No notifications</h3>
                            <p className="text-sm text-deep-teal/40 mt-1">We'll notify you when something important happens.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-6 hover:bg-gray-50/50 transition-colors group relative",
                                        !notification.read && "bg-mint-green/5"
                                    )}
                                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                                >
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                            notification.read ? "bg-gray-100" : "bg-white shadow-md shadow-deep-teal/5"
                                        )}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-1">
                                                <h4 className={cn(
                                                    "text-sm font-bold text-deep-teal",
                                                    !notification.read && "pr-4"
                                                )}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-[10px] text-deep-teal/30 whitespace-nowrap">
                                                    {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-deep-teal/60 line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            {!notification.read && (
                                                <div className="absolute top-6 right-6 w-2 h-2 bg-mint-green rounded-full shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full border-mint-green/20 text-deep-teal/60 hover:bg-mint-green/10 hover:border-mint-green/40 font-bold text-xs uppercase tracking-widest h-12">
                        View All Notifications
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
