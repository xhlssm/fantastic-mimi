// 倒计时小组件插件
'use client';
import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

export default function CountdownWidget() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2026-01-01") - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="fixed top-40 left-6 z-30 bg-[#181824]/50 backdrop-blur-md border border-[#FF00FF] rounded-xl p-3 text-white animate-fade-in">
      <div className="flex items-center gap-2">
        <Timer className="w-5 h-5 text-pink-400" />
        <div>
          <div className="font-bold">新年倒计时</div>
          <div className="text-xs">
            {timeLeft.days}天 {timeLeft.hours}小时 {timeLeft.minutes}分钟
          </div>
        </div>
      </div>
    </div>
  );
}
