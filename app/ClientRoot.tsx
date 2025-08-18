// ================= 导入区 =================
'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import DonateAuthor from '@/components/DonateAuthor';
import SignInPanel from '@/components/ui/SignInPanel';
import WebGLParticles from '@/components/ui/WebGLParticles';
import AIAssistant from '@/components/ui/AIAssistant';
import PWAPrompt from '@/components/ui/PWAPrompt';
import AchievementSystem from '@/components/ui/AchievementSystem';
import PluginCenter from '@/components/ui/PluginCenter';
import WeatherWidget from '@/components/ui/WeatherWidget';
import CountdownWidget from '@/components/ui/CountdownWidget';

// ================= 组件实现 =================
export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const { user, plugins } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const weatherPlugin = plugins.find(p => p.id === 'weather');
  const countdownPlugin = plugins.find(p => p.id === 'countdown');

  return (
    <div
      className='min-h-screen text-white'
      style={{
        /* 绳网风格多层渐变+网格 */
        background: `
          radial-gradient(circle at 20% 80%, rgba(0, 228, 255, 0.10) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.10) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0a0a1a 100%)
        `,
        backgroundSize: '400% 400%, 300% 300%, 200% 200%, 400% 400%',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 背景和全局UI */}
      <WebGLParticles />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(0,228,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,228,255,0.02) 1px, transparent 1px),
            linear-gradient(rgba(255,0,255,0.01) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,0,255,0.01) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 200px 200px, 200px 200px',
        }}
      />
      
      {isClient && (
        <>
          <div className="fade-in slide-up scale-in" style={{ transition: 'opacity 0.8s' }}>{children}</div>
          <AIAssistant />
          <PluginCenter />
          {weatherPlugin?.enabled && <WeatherWidget />}
          {countdownPlugin?.enabled && <CountdownWidget />}
        </>
      )}

      <PWAPrompt />
    </div>
  );
}
