// 用户插件中心，支持自定义小组件/主题/脚本
'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import { Puzzle } from 'lucide-react';

export default function PluginCenter() {
  const [open, setOpen] = useState(false);
  const { plugins, togglePlugin } = useStore();

  return (
    <div className="fixed bottom-20 right-8 z-50 md:bottom-24 md:right-12">
      <button onClick={() => setOpen(o => !o)} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
        <Puzzle className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 bg-[#181824] rounded-2xl shadow-2xl border border-[#00E4FF] p-6 w-[90vw] max-w-md animate-fade-in">
          <div className="font-bold text-white mb-3 flex items-center gap-2"><Puzzle className="w-5 h-5" />插件中心</div>
          <ul className="space-y-2">
            {plugins.map(p => (
              <li key={p.id} className="flex items-center justify-between text-white/90">
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-[#B0B0CC]">{p.description}</div>
                </div>
                <button onClick={() => togglePlugin(p.id)} className={`ml-2 px-3 py-1 rounded-full text-xs ${p.enabled ? 'bg-[var(--neon-blue)] text-white' : 'bg-white/10 text-[#B0B0CC]'}`}>{p.enabled ? '已启用' : '启用'}</button>
              </li>
            ))}
          </ul>
          <div className="text-xs text-center mt-4 text-[#B0B0CC]">更多插件正在开发中...</div>
        </div>
      )}
    </div>
  );
}
