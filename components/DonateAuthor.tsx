'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DonateAuthor() {
  const [amount, setAmount] = useState(10);
  const [isPaying, setIsPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDonate = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="glass-effect border-glow p-4 rounded-xl max-w-xs mx-auto text-center space-y-3 animate-fade-in">
      <h3 className="text-lg font-bold neon-text">请作者喝一杯奶茶 🧋</h3>
      <p className="text-[var(--light-gray)] text-xs">如果你觉得本站有趣或有用，可以请作者喝一杯奶茶（10元），让本站持续运营和创新！</p>
      <Button
        onClick={handleDonate}
        className="w-full bg-[var(--neon-blue)] text-[var(--dark-blue)] hover:bg-[var(--neon-pink)] hover:text-white border-glow mt-2"
        disabled={isPaying || success}
      >
        {isPaying ? '奶茶正在冲泡...' : success ? '感谢你的奶茶！' : `打赏 10 元`}
      </Button>
      {success && <div className="text-[var(--neon-green)] mt-2">已收到你的奶茶 ❤</div>}
    </div>
  );
}
