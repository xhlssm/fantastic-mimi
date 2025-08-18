// PWA 安装提示组件，支持自动检测与手动触发
'use client';
import { useEffect, useState } from 'react';

// ================= 导入区 =================
// PWA 安装提示组件，支持自动检测与手动触发
export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

// ================= 组件实现 =================
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
    }
  };

  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-4 animate-fade-in">
      <span>体验更流畅？一键安装为App！</span>
      <button onClick={handleInstall} className="bg-white/20 px-3 py-1 rounded hover:bg-white/40 transition">立即安装</button>
      <button onClick={()=>setShow(false)} className="ml-2 text-white/70 hover:text-white">×</button>
    </div>
  );
}
