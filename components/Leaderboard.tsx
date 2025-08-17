// @/components/Leaderboard.tsx
'use client';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { FactionBadge } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Leaderboard() {
    const { users, factions, setView } = useStore();
    const sortedUsers = users.slice().sort((a, b) => b.reputation - a.reputation);
    const sortedFactions = factions.slice().sort((a, b) => b.reputation - a.reputation);

    const handleViewUser = (username) => {
        setView('profile', username);
    };
    
    const handleViewFaction = (factionId) => {
        setView('faction_page', factionId);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-[#00E4FF]">排行榜</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
                    <CardHeader>
                        <CardTitle className="text-white text-xl flex items-center"><Trophy className="mr-2" /> 个人声望</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {sortedUsers.map((user, index) => (
                                <li key={user.id} className="flex items-center space-x-4 p-2 hover:bg-[#2B2B4A] rounded-md transition-colors">
                                    <span className="text-xl font-bold w-6 text-center text-[#B0B0CC]">{index + 1}</span>
                                    <Image src={user.avatarUrl} alt={user.username} width={40} height={40} className="rounded-full" />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-white cursor-pointer hover:underline" onClick={() => handleViewUser(user.username)}>{user.username}</span>
                                            {user.faction && <FactionBadge faction={user.faction} />}
                                        </div>
                                        <p className="text-sm text-[#B0B0CC]">{user.title}</p>
                                    </div>
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={16} className="mr-1" /> {user.reputation}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
                    <CardHeader>
                        <CardTitle className="text-white text-xl flex items-center"><Users className="mr-2" /> 派系声望</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {sortedFactions.map((faction, index) => (
                                <li key={faction.id} className="flex items-center space-x-4 p-2 hover:bg-[#2B2B4A] rounded-md transition-colors">
                                    <span className="text-xl font-bold w-6 text-center text-[#B0B0CC]">{index + 1}</span>
                                    <FactionBadge faction={faction.id} />
                                    <div className="flex-1">
                                        <span className="font-bold text-white cursor-pointer hover:underline" onClick={() => handleViewFaction(faction.id)}>{faction.name}</span>
                                    </div>
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={16} className="mr-1" /> {faction.reputation}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
