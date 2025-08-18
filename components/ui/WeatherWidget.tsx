// 天气小组件插件
'use client';
import { Sun } from 'lucide-react';

export default function WeatherWidget() {
  return (
    <div className="fixed top-24 left-6 z-30 bg-[#181824]/50 backdrop-blur-md border border-[#00E4FF] rounded-xl p-3 text-white animate-fade-in">
      <div className="flex items-center gap-2">
        <Sun className="w-5 h-5 text-yellow-400" />
        <div>
          <div className="font-bold">晴天</div>
          <div className="text-xs">28°C</div>
        </div>
      </div>
    </div>
  );
}
