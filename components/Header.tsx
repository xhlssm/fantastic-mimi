'use client';

import { useStore } from '@/store';
import type { View } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, MessageCircle, ShoppingCart, Users, Trophy, ChevronDown, User, Sparkles, UserPlus, CircleUser, List, Bell, Shield, Book, Paintbrush, Code } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge';
import { FactionBadge } from '@/lib/utils';
import Image from 'next/image';

const navItems: { view: View; icon: any; label: string }[] = [
  { view: 'forum', icon: LayoutDashboard, label: '论坛' },
  { view: 'messages', icon: MessageCircle, label: '私信' },
  { view: 'shop', icon: ShoppingCart, label: '商店' },
  { view: 'factions', icon: Users, label: '派系' },
  { view: 'leaderboard', icon: Trophy, label: '排行榜' },
  { view: 'achievements', icon: Sparkles, label: '成就' },
];

export default function Header() {
  const { user, logout, activeView, setView, activeTheme, toggleTheme, notifications } = useStore();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    if (confirm('你确定要注销吗？')) {
      logout();
    }
  };

  const renderFactionIcon = (faction: string) => {
    switch (faction) {
      case '开发组': return <Code className="w-4 h-4 text-blue-400" />;
      case '剧情组': return <Book className="w-4 h-4 text-purple-400" />;
      case '艺术组': return <Paintbrush className="w-4 h-4 text-pink-400" />;
      case '自由人': return <UserPlus className="w-4 h-4 text-green-400" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto bg-gradient-to-br from-[#181824ee] via-[#232946cc] to-[#1A1A2Ecc] border-b-2 border-[#00E4FF]/40 shadow-[0_8px_32px_#00e4ff33] rounded-b-3xl flex flex-col md:flex-row items-center justify-between p-4 backdrop-blur-2xl ring-2 ring-[#00E4FF]/30 ring-inset"
      style={{ boxShadow: '0 8px 32px #00e4ff33, 0 0 0 2px #00e4ff44 inset' }}
    >
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <Image src="/logo.png" alt="绳网" width={40} height={40} className="w-12 h-12 drop-shadow-glow" />
        <h1 className="text-3xl font-extrabold text-[#00E4FF] neon-text drop-shadow-glow tracking-widest">绳网终端</h1>
      </div>

  <nav className="flex flex-wrap justify-center md:justify-start gap-2">
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.view}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setView(item.view)}
                  className={`relative flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 rounded-2xl px-5 py-2 text-lg font-bold tracking-wide
                    ${activeView === item.view 
                      ? 'bg-gradient-to-r from-[#00E4FF]/30 to-[#FF00FF]/20 text-[#00E4FF] border-2 border-[#00E4FF]/60 shadow-lg shadow-[#00E4FF]/25 animate-glow' 
                      : 'hover:bg-white/10 hover:scale-105'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                  {item.view === 'messages' && unreadNotifications > 0 && (
                    <Badge className="absolute top-0 right-0 h-4 min-w-4 p-1 flex items-center justify-center text-xs bg-red-500 text-white animate-pulse">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        {user && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative flex items-center space-x-2 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-xl px-3 py-2">
                <div className="relative w-8 h-8 rounded-full">
                  <Image src={user.avatarUrl} alt={user.username} fill className="rounded-full object-cover" sizes="32px" />
                  <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                </div>
                <span className="font-bold hidden md:inline">{user.username}</span>
                <ChevronDown className="w-4 h-4 hidden md:inline" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 glass-effect text-white border-[#00E4FF]/30 backdrop-blur-xl rounded-xl shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <Image src={user.avatarUrl} alt={user.username} width={40} height={40} className="rounded-full" />
                <div>
                  <p className="font-bold">{user.username}</p>
                  <p className="text-sm text-[#B0B0CC]">{user.title}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg" onClick={() => setView('profile', user.username)}>
                  <CircleUser className="mr-2 h-4 w-4" /> <span>我的资料</span>
                </Button>
                {user.faction && (
                  <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg" onClick={() => setView('faction_page', user.faction)}>
                    {renderFactionIcon(user.faction)} <span className="ml-2">我的派系 ({user.faction})</span>
                  </Button>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg">
                      <List className="mr-2 h-4 w-4" /> <span>主题设置</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 glass-effect text-white border-[#00E4FF]/30 backdrop-blur-xl rounded-xl shadow-2xl">
                    <div className="space-y-2">
                                              <Button variant="ghost" onClick={() => toggleTheme('dark')} className={`w-full justify-start transition-all duration-200 rounded-lg ${activeTheme === 'dark' ? 'bg-gradient-to-r from-[#00E4FF]/20 to-[#FF00FF]/20 text-[#00E4FF] border border-[#00E4FF]/30' : 'hover:bg-white/10'}`}>深色主题</Button>
                        <Button variant="ghost" onClick={() => toggleTheme('high-contrast')} className={`w-full justify-start transition-all duration-200 rounded-lg ${activeTheme === 'high-contrast' ? 'bg-gradient-to-r from-[#00E4FF]/20 to-[#FF00FF]/20 text-[#00E4FF] border border-[#00E4FF]/30' : 'hover:bg-white/10'}`}>高对比度</Button>
                        <Button variant="ghost" onClick={() => toggleTheme('cyberpunk')} className={`w-full justify-start transition-all duration-200 rounded-lg ${activeTheme === 'cyberpunk' ? 'bg-gradient-to-r from-[#00E4FF]/20 to-[#FF00FF]/20 text-[#00E4FF] border border-[#00E4FF]/30' : 'hover:bg-white/10'}`}>赛博朋克</Button>
                    </div>
                  </PopoverContent>
                </Popover>
                {user.isAdmin && (
                  <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg" onClick={() => setView('admin')}>
                    <Shield className="mr-2 h-4 w-4" /> <span>管理员</span>
                  </Button>
                )}
                <div className="h-px bg-gradient-to-r from-transparent via-[#00E4FF]/30 to-transparent my-2" />
                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200 rounded-lg" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> <span>注销</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </motion.header>
  );
}
