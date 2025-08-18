'use client';
import { useStore } from '@/store';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, markNotificationAsRead } = useStore();
  const unreadNotifications = notifications.filter(n => !n.read);

  useEffect(() => {
    if (unreadNotifications.length > 0) {
      const timer = setTimeout(() => {
        markNotificationAsRead(unreadNotifications[0].id);
      }, 5000); // 5秒后自动标记为已读
      return () => clearTimeout(timer);
    }
  }, [unreadNotifications, markNotificationAsRead]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {unreadNotifications.slice(0, 1).map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            layout
            className="bg-gradient-to-br from-[#00e4ff] to-[#ff00ff] text-white p-4 rounded-xl shadow-2xl flex items-center space-x-3"
          >
            <Bell className="w-6 h-6" />
            <p className="text-sm font-bold">{notification.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
