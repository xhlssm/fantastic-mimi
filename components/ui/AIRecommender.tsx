// AI个性化推荐区块，智能推送帖子/派系/好友
'use client';
import { useStore } from '@/store';
import { useMemo } from 'react';
import { Sparkles, Users, Star } from 'lucide-react';

export default function AIRecommender() {
  const { threads, factions, users, user } = useStore();
  // 假设根据用户兴趣/活跃度/标签推荐
  const recommendedThreads = useMemo(() => threads.slice(0, 3), [threads]);
  const recommendedFactions = useMemo(() => factions.slice(0, 2), [factions]);
  const recommendedFriends = useMemo(() => users.filter(u => u.id !== user?.id).slice(0, 2), [users, user]);
  return (
    <div className="fixed top-24 left-8 z-40 w-80 bg-[#181824] rounded-2xl shadow-2xl border border-[#00E4FF] p-6 animate-fade-in space-y-6">
      <div className="font-bold text-white mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5" />AI推荐</div>
      <div>
        <div className="text-xs text-[#B0B0CC] mb-1">推荐帖子</div>
        <ul className="space-y-1">
          {recommendedThreads.map(t=>(<li key={t.id} className="text-white/90 hover:underline cursor-pointer">{t.title}</li>))}
        </ul>
      </div>
      <div>
        <div className="text-xs text-[#B0B0CC] mb-1">推荐派系</div>
        <ul className="space-y-1">
          {recommendedFactions.map(f=>(<li key={f.id} className="text-white/90 hover:underline cursor-pointer flex items-center gap-1"><Users className="w-4 h-4" />{f.name}</li>))}
        </ul>
      </div>
      <div>
        <div className="text-xs text-[#B0B0CC] mb-1">可能认识的人</div>
        <ul className="space-y-1">
          {recommendedFriends.map(u=>(<li key={u.id} className="text-white/90 hover:underline cursor-pointer flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" />{u.username}</li>))}
        </ul>
      </div>
    </div>
  );
}
