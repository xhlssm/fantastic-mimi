'use client';
import { useStore } from '@/store';
import type { View } from '@/store';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, MessageCircle, ShoppingCart, Users, Trophy, ChevronDown, User, Sparkles, Server, Settings, Home } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from 'next/image';

const navItems: { view: View; icon: any; label: string }[] = [
  { view: 'forum', icon: Home, label: '时间轴' },
  { view: 'messages', icon: MessageCircle, label: '私信' },
  { view: 'factions', icon: Users, label: '派系' },
  { view: 'leaderboard', icon: Trophy, label: '排行榜' },
  { view: 'achievements', icon: Sparkles, label: '成就' },
];

export default function NavigationPanel() {
  const { user, logout, activeView, setView, instances, currentInstanceId, switchInstance } = useStore();
  const currentInstance = instances[currentInstanceId];

  if (!user) return null;

  return (
    <aside className="h-screen sticky top-0 flex flex-col bg-[#1a1a2e]/50 backdrop-blur-xl border-r border-white/10 p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Image src="/logo.png" alt="Logo" width={40} height={40} className="drop-shadow-glow" />
        <h1 className="text-xl font-bold text-white">绳网终端</h1>
      </div>

      <div className="flex-1 flex flex-col space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.view}
            variant="ghost"
            onClick={() => setView(item.view)}
            className={`justify-start text-lg py-6 rounded-xl ${activeView === item.view ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <item.icon className="w-6 h-6 mr-4" />
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-left h-auto py-3 rounded-xl hover:bg-white/10">
              <div className="flex items-center space-x-3">
                <Image src={user.avatarUrl} alt={user.username} width={40} height={40} className="rounded-full" />
                <div>
                  <p className="font-bold text-white">{user.username}</p>
                  <p className="text-sm text-white/50">@{currentInstance.id}</p>
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 mb-2 glass-effect text-white border-white/10 backdrop-blur-xl rounded-xl shadow-2xl">
            <div className="space-y-2">
               <Button variant="ghost" className="w-full justify-start" onClick={() => setView('profile', user.username)}>
                  <User className="mr-2 h-4 w-4" /> 我的资料
                </Button>
               <Button variant="ghost" className="w-full justify-start" onClick={() => alert('设置功能待实现')}>
                  <Settings className="mr-2 h-4 w-4" /> 设置
                </Button>
              <div className="h-px bg-white/10 my-1" />
              <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> 注销
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}
