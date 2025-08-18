// 主题色自定义组件，支持主色、渐变、暗色、霓虹等实时预览
// ================= 导入区 =================
'use client';
import { useState } from 'react';
import { Palette } from 'lucide-react';
// ================= 组件实现 =================

const themes = [
  { name: '默认', class: 'default', color: '#3ECFFF' },
  { name: '暗色', class: 'dark', color: '#232946' },
  { name: '霓虹', class: 'cyberpunk', color: '#FF00FF' },
  { name: '高对比', class: 'high-contrast', color: '#FFD700' },
];

export default function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('default');
  const handleTheme = (t: string) => {
    setCurrent(t);
    document.body.className = t;
  };
  return (
    <div className="fixed bottom-8 left-8 z-50">
      <button onClick={()=>setOpen(o=>!o)} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
        <Palette className="w-6 h-6" />
      </button>
      {open && (
        <div className="mt-3 bg-[#181824] rounded-2xl shadow-2xl border border-[#00E4FF] p-6 w-64 animate-fade-in">
          <div className="font-bold text-white mb-3 flex items-center gap-2"><Palette className="w-5 h-5" />主题自定义</div>
          <div className="flex gap-3 flex-wrap">
            {themes.map(t=>(
              <button key={t.class} onClick={()=>handleTheme(t.class)} className={`w-10 h-10 rounded-full border-2 ${current===t.class?'border-[#00E4FF]':'border-transparent'}`} style={{background:t.color}} title={t.name}></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
