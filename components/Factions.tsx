// @/components/Factions.tsx
'use client';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function Factions() {
    const { factions, setView, joinFaction, user } = useStore();
    const handleJoinFaction = (factionId) => {
        if (user && confirm(`你确定要加入 ${factionId} 吗？`)) {
            joinFaction(factionId, user.id);
        }
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-[#00E4FF]">派系</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {factions.map(faction => (
                    <Card key={faction.id} className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
                        <CardHeader>
                            <CardTitle className="text-white text-xl flex items-center space-x-2">
                                <Users size={24} /> <span>{faction.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[#B0B0CC]">声望值: {faction.reputation}</p>
                            <p className="text-[#B0B0CC]">成员数: {faction.members.length}</p>
                            <Button onClick={() => setView('faction_page', faction.id)} className="mt-4 bg-[#00E4FF] text-[#1A1A2E] hover:bg-[#00BFFF]">查看详情</Button>
                            {user && user.faction !== faction.id && (
                                <Button onClick={() => handleJoinFaction(faction.id)} className="mt-4 ml-2 bg-[#FF00FF] text-[#1A1A2E] hover:bg-[#FF88FF]">加入派系</Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
