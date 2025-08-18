// @/components/NotificationPopup.tsx
'use client';
import { useStore, Notification } from '@/store';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationPopup() {
    const { notifications, markNotificationAsRead, setView } = useStore();
    const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const unread = notifications.filter(n => !n.read).reverse();
        if (unread.length > 0) {
            const latest = unread[0];
            const isAlreadyVisible = visibleNotifications.some(n => n.id === latest.id);
            if (!isAlreadyVisible) {
                setVisibleNotifications(prev => [latest, ...prev].slice(0, 3));
            }
        }
    }, [notifications]);

    const handleDismiss = (id: number) => {
        markNotificationAsRead(id);
        setVisibleNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    const handleNotificationClick = (notification: Notification) => {
        if (notification.type === 'reply' && notification.threadId) {
            setView('forum', notification.threadId);
        } else if (notification.type === 'message') {
            setView('messages');
        }
        handleDismiss(notification.id);
    };

    return (
        <div className="fixed top-20 right-4 z-50 space-y-2 w-full max-w-sm">
            <AnimatePresence>
                {visibleNotifications.map(notification => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#1A1A2E] text-white border-l-4 border-[#00E4FF] rounded-lg shadow-lg p-4 relative cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <p className="font-bold text-[#00E4FF]">{notification.type === 'reply' ? '新回复' : notification.type === 'message' ? '新消息' : '系统通知'}</p>
                        <p className="mt-1 text-sm text-[#B0B0CC] pr-8">{notification.content}</p>
                        <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); handleDismiss(notification.id); }}
                            className="absolute top-2 right-2 p-1 h-auto text-[#B0B0CC] hover:text-white"
                        >
                            <X size={16} />
                        </Button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
