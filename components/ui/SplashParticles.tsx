
import React, { useEffect, useRef, useState } from 'react';

/**
 * SplashParticles 开屏动画组件
 * - 赛博粒子动画，支持主动跳过、首次新手引导、右下角反馈按钮
 * - 动画细节美化：粒子渐变、缓动、主题色自适应
 * - 交互优化：ESC键可跳过，主题切换时自动适配色彩
 */

// ================= 常量与工具函数 =================
const PARTICLE_COUNT = 100; // 粒子数量
const PARTICLE_COLORS = ['#00e4ff', '#ff00ff', '#00ff88', '#fff']; // 多色渐变
const PARTICLE_SIZE = 2;
const FADE_DURATION = 1200;
function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// ================= 组件实现 =================
const SplashParticles: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  // ---------- ref/状态区 ----------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const fadeRef = useRef(0);
  const [canSkip, setCanSkip] = useState(true); // 是否可主动跳过动画
  const [fading, setFading] = useState(false); // 是否正在淡出
  const [showGuide, setShowGuide] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('wang_guide_hidden');
    }
    return true;
  }); // 是否显示新手引导
  const [theme, setTheme] = useState('dark'); // 主题色自适应

  // ---------- 副作用/生命周期区 ----------
  useEffect(() => {
    // --- 画布与粒子初始化 ---
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // --- 主题切换监听 ---
    const updateTheme = () => {
      if (typeof document !== 'undefined') {
        if (document.body.classList.contains('cyberpunk')) setTheme('cyberpunk');
        else if (document.body.classList.contains('high-contrast')) setTheme('high-contrast');
        else setTheme('dark');
      }
    };
    updateTheme();
    window.addEventListener('themechange', updateTheme);

    // --- 粒子数据 ---
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.7, 0.7),
      vy: randomBetween(-0.7, 0.7),
      alpha: randomBetween(0.7, 1),
      size: randomBetween(PARTICLE_SIZE, PARTICLE_SIZE * 2.5),
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));

    let start: number | null = null;
    let fadeOut = false;
    let finished = false;

    // --- 动画安全结束 ---
    function safeFinish() {
      if (finished) return;
      finished = true;
      if (onFinish) onFinish();
    }

    // --- 动画主循环 ---
    function draw(ts: number) {
      if (!start) start = ts;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx * 1.2;
        p.y += p.vy * 1.2;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.save();
        ctx.shadowColor = theme === 'cyberpunk' ? '#ff00ff' : theme === 'high-contrast' ? '#fff' : '#00e4ff';
        ctx.shadowBlur = 16;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, theme === 'cyberpunk' ? '#ff00ff' : theme === 'high-contrast' ? '#fff' : '#00e4ff');
        ctx.globalAlpha = fadeOut ? p.alpha * (1 - fadeRef.current) : p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
      if (fadeOut) {
        fadeRef.current += 16 / FADE_DURATION;
        if (fadeRef.current >= 1) {
          safeFinish();
          return;
        }
      }
      animationRef.current = requestAnimationFrame(draw);
    }
    animationRef.current = requestAnimationFrame(draw);

    // --- 窗口自适应 ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // --- ESC键跳过动画 ---
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canSkip && !fading) handleJoin();
    };
    window.addEventListener('keydown', handleEsc);

    // --- 动画自动淡出 ---
    const timer = setTimeout(() => {
      setFading(true);
      fadeOut = true;
    }, 1200);
    // --- 强制兜底 ---
    const forceFinishTimer = setTimeout(() => {
      safeFinish();
    }, 2500);

    // --- 清理副作用 ---
    return () => {
      clearTimeout(timer);
      clearTimeout(forceFinishTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('themechange', updateTheme);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line
  }, [onFinish, canSkip, fading, theme]);

  // ---------- 事件处理区 ----------
  // ...已在上方声明 handleJoin/handleHideGuide，无需重复...
  // ---------- 渲染区 ----------


  // 主动跳过动画
  const handleJoin = () => {
    setFading(true);
    setCanSkip(false);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 400);
  };


  // 隐藏新手引导
  const handleHideGuide = () => {
    setShowGuide(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wang_guide_hidden', '1');
    }
  };


  // 动画主渲染
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        inset: 0,
        background: theme === 'cyberpunk'
          ? 'radial-gradient(ellipse at center, #1a0024 60%, #232946 100%)'
          : theme === 'high-contrast'
          ? 'radial-gradient(ellipse at center, #000 60%, #fff 100%)'
          : 'radial-gradient(ellipse at center, #181824 60%, #232946 100%)',
        transition: 'opacity 0.8s',
        pointerEvents: 'auto',
        opacity: fading ? 0 : 1,
      }}
      aria-label="开屏动画"
    >
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          color: '#fff',
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: 2,
          textShadow: theme === 'cyberpunk' ? '0 0 32px #ff00ff' : '0 0 24px #00e4ff',
          userSelect: 'none',
          textAlign: 'center',
        }}
      >
        欢迎来到 WANG 绳网终端<br />
        <span style={{ fontSize: 18, fontWeight: 400, letterSpacing: 1, opacity: 0.85 }}>赛博空间 · 创新社区 · 无限可能</span>
        <br />
        {canSkip && (
          <button
            onClick={handleJoin}
            style={{
              marginTop: 32,
              padding: '12px 36px',
              fontSize: 22,
              borderRadius: 24,
              border: 'none',
              background: theme === 'cyberpunk'
                ? 'linear-gradient(90deg,#ff00ff,#00e4ff)'
                : theme === 'high-contrast'
                ? 'linear-gradient(90deg,#fff,#000)'
                : 'linear-gradient(90deg,#00e4ff,#ff00ff)',
              color: theme === 'high-contrast' ? '#000' : '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 16px #00e4ff44',
              cursor: 'pointer',
              transition: 'background 0.2s,opacity 0.3s',
              outline: 'none',
              opacity: fading ? 0.5 : 1,
            }}
            disabled={fading}
            aria-label="立即进入社区"
            tabIndex={0}
          >
            立即进入社区 (ESC)
          </button>
        )}
        {showGuide && (
          <div
            style={{
              marginTop: 36,
              fontSize: 16,
              color: '#e0eaff',
              background: 'rgba(24,24,36,0.7)',
              borderRadius: 12,
              padding: '18px 28px',
              maxWidth: 420,
              marginLeft: 'auto',
              marginRight: 'auto',
              boxShadow: '0 2px 16px #00e4ff22',
              lineHeight: 1.7,
              textAlign: 'left',
              position: 'relative',
            }}
            aria-label="新手引导"
          >
            <button
              onClick={handleHideGuide}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                color: '#00e4ff',
                fontSize: 16,
                cursor: 'pointer',
                fontWeight: 600,
                opacity: 0.7,
              }}
              title="不再显示新手引导"
              aria-label="关闭新手引导"
            >
              ×
            </button>
            <b>新手引导：</b><br />
            1. 注册/登录后可自定义你的专属终端身份，参与社区互动。<br />
            2. 通过发帖、评论、签到、参与成就任务，解锁更多功能与荣誉。<br />
            3. 体验 AI 助手、插件扩展、排行榜、派系系统等创新玩法。<br />
            4. 请遵守社区规范，尊重他人，安全文明交流。<br />
            <br />
            <b>关于 WANG 绳网终端：</b><br />
            这是一个融合赛博朋克美学与创新交互的开放社区。<br />
            你可以在这里结识同好、探索新知、共创未来。<br />
            立即加入，开启你的数字冒险之旅！
          </div>
        )}
      </div>
      {/* 问题反馈悬浮按钮 */}
      <a
        href="https://github.com/wang-community/wang/issues"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          right: 32,
          bottom: 32,
          zIndex: 10000,
          background: theme === 'cyberpunk'
            ? 'linear-gradient(90deg,#ff00ff,#00e4ff)'
            : theme === 'high-contrast'
            ? 'linear-gradient(90deg,#fff,#000)'
            : 'linear-gradient(90deg,#00e4ff,#ff00ff)',
          color: theme === 'high-contrast' ? '#000' : '#fff',
          borderRadius: 24,
          padding: '12px 28px',
          fontSize: 18,
          fontWeight: 600,
          boxShadow: '0 2px 16px #00e4ff44',
          textDecoration: 'none',
          letterSpacing: 1,
          transition: 'background 0.2s,opacity 0.3s',
          opacity: fading ? 0.5 : 1,
        }}
        aria-label="问题反馈"
      >
        问题反馈
      </a>
    </div>
  );
};

export default SplashParticles;
