// @/components/AdminPanel.tsx
'use client';
import { useStore } from '@/store';
import { motion } from 'framer-motion';

export default function AdminPanel() {
    const { user } = useStore();
    if (!user || !user.isAdmin) return <div className="text-center text-red-400 p-8">权限不足</div>;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-red-400">管理员面板</h2>
            <p className="text-[#B0B0CC]">这里可以进行用户管理、公告发布、任务审核等操作。</p>
        </motion.div>
    );
}
