// @/components/Forum/Forum.tsx
'use client';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import ThreadCard from '@/components/Forum/ThreadCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateThreadDialog from '@/components/Forum/CreateThreadDialog';
import { useState } from 'react';
import ThreadPage from './ThreadPage';

export default function Forum() {
    const { threads, activeView, selectedUsername, setView } = useStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (activeView === 'forum' && typeof selectedUsername === 'number') {
      return <ThreadPage />;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-[#00E4FF]">绳网论坛</h2>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-[#00E4FF] text-[#1A1A2E] hover:bg-[#00BFFF]"><Plus className="mr-2" /> 发布内容</Button>
            </div>
            <div className="space-y-4">
                {threads.slice().sort((a,b) => b.timestamp - a.timestamp).map(thread => (
                    <ThreadCard key={thread.id} thread={thread} />
                ))}
            </div>
            <CreateThreadDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        </motion.div>
    );
}
