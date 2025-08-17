// 互动成就系统，支持签到、活跃、AI挑战、社区任务等
'use client';
import { useState } from 'react';
import { Trophy, CheckCircle, Sparkles } from 'lucide-react';

const mockAchievements = [
  { title: '连续签到7天', desc: '坚持就是胜利', icon: <CheckCircle className="text-green-400" /> },
  { title: 'AI体验官', desc: '体验AI助手功能', icon: <Sparkles className="text-pink-400" /> },
  { title: '社区达人', desc: '累计发帖20次', icon: <Trophy className="text-yellow-400" /> },
];

export default function AchievementSystem() {
  const [show, setShow] = useState(false);
  return (
    <div className="fixed top-6 right-6 z-40">
      <button onClick={()=>setShow(s=>!s)} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white px-4 py-2 rounded-full shadow-xl hover:scale-105 transition">
        <Trophy className="w-5 h-5 inline-block mr-1" />成就
      </button>
      {show && (
        <div className="mt-3 bg-[#181824] rounded-2xl shadow-2xl border border-[#00E4FF] p-6 w-80 animate-fade-in">
          <div className="font-bold text-white mb-3 flex items-center gap-2"><Trophy className="w-5 h-5" />我的成就</div>
          <ul className="space-y-2">
            {mockAchievements.map(a=>(<li key={a.title} className="flex items-center gap-2 text-white/90"><span>{a.icon}</span><span className="font-bold">{a.title}</span><span className="text-xs text-[#B0B0CC]">{a.desc}</span></li>))}
          </ul>
        </div>
      )}
    </div>
  );
}
