// 互动成就系统，支持签到、活跃、AI挑战、社区任务等
'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Trophy, CheckCircle, Sparkles, Calendar } from 'lucide-react';
import { Button } from './button';

export default function AchievementSystem() {
  const { achievements, lastCheckIn, checkIn, user } = useStore();
  const [show, setShow] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const today = new Date().toDateString();
  const canCheckIn = lastCheckIn !== today;

  const handleCheckIn = () => {
    if (canCheckIn) {
      checkIn();
    }
  };

  if (!isClient || !user) return null;

  return (
    <div className="fixed top-6 right-6 z-40">
      <button onClick={()=>setShow(s=>!s)} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white px-4 py-2 rounded-full shadow-xl hover:scale-105 transition">
        <Trophy className="w-5 h-5 inline-block mr-1" />成就
      </button>
      {show && (
        <div className="mt-3 bg-[#181824] rounded-2xl shadow-2xl border border-[#00E4FF] p-6 w-80 animate-fade-in">
          <div className="font-bold text-white mb-3 flex items-center gap-2"><Trophy className="w-5 h-5" />我的成就</div>
          <Button onClick={handleCheckIn} disabled={!canCheckIn} className="w-full mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            {canCheckIn ? '每日签到' : `今日已签到`}
          </Button>
          <ul className="space-y-2">
            {achievements.map(a => {
              const unlocked = user?.unlockedAchievements.includes(a.id);
              return (
                <li key={a.id} className={`flex items-center gap-2 text-white/90 ${unlocked ? '' : 'opacity-50'}`}>
                  <span>{unlocked ? <CheckCircle className="text-green-400" /> : <Trophy className="text-gray-500" />}</span>
                  <span className="font-bold">{a.name}</span>
                  <span className="text-xs text-[#B0B0CC]">{a.description}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
