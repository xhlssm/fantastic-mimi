// 多语言切换组件，支持中英实时切换
'use client';
import { useState } from 'react';
import { Globe } from 'lucide-react';

const langs = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' }
];

export default function LangSwitcher() {
  const [lang, setLang] = useState('zh');
  const handleSwitch = (l: string) => {
    setLang(l);
    document.documentElement.lang = l;
    // 可扩展：全局i18n切换
  };
  return (
    <div className="fixed top-8 right-8 z-50">
      <button onClick={()=>{}} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
        <Globe className="w-6 h-6" />
      </button>
      <div className="mt-2 bg-[#181824] rounded-xl shadow-xl border border-[#00E4FF] p-3 flex gap-2">
        {langs.map(l=>(
          <button key={l.code} onClick={()=>handleSwitch(l.code)} className={`px-3 py-1 rounded ${lang===l.code?'bg-[var(--neon-blue)] text-white':'text-[#B0B0CC]'}`}>{l.label}</button>
        ))}
      </div>
    </div>
  );
}
