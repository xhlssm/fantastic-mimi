// @/components/Achievements.tsx
'use client';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import Image from 'next/image';

export default function Achievements() {
    const { achievements, user } = useStore();
    const unlockedAchievements = user?.unlockedAchievements || [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-[#00E4FF]">成就</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {achievements.map(achievement => (
                    <Card key={achievement.id} className="bg-transparent backdrop-blur-md border-[#2B2B4A] transition-transform duration-200 hover:scale-105">
                        <CardHeader>
                            <CardTitle className="text-white text-xl flex items-center space-x-2">
                                <Trophy size={24} /> <span>{achievement.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Image src={achievement.imageUrl} alt={achievement.name} width={100} height={100} className="rounded-lg mx-auto" />
                                {!unlockedAchievements.includes(achievement.id) && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                                        <span className="text-white text-lg font-bold">未解锁</span>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-[#B0B0CC] text-center">{achievement.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
