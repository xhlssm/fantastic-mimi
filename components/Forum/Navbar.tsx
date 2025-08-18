'use client';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  BookOpen,
  Trophy,
  Users,
  MessageCircle,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  logo?: string;
  user?: {
    id: number;
    username: string;
    avatarUrl: string;
    notifications?: number;
  };
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
  onNotification?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

export default function Navbar({
  logo = "学术竞赛论坛",
  user,
  onSearch,
  onNavigate,
  onNotification,
  onSettings,
  onLogout
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const navigationItems = [
    { icon: Home, label: '首页', path: '/' },
    { icon: BookOpen, label: '竞赛', path: '/competitions' },
    { icon: Trophy, label: '排行榜', path: '/leaderboard' },
    { icon: Users, label: '社区', path: '/community' },
    { icon: MessageCircle, label: '消息', path: '/messages' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate?.('/')}
              className="flex items-center space-x-2 text-xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block">{logo}</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate?.(item.path)}
                className="flex items-center space-x-1 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="搜索帖子、用户或标签..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-10 pr-4 w-full transition-all duration-200 ${
                    isSearchFocused 
                      ? 'ring-2 ring-blue-500 border-blue-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              </div>
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button
                  onClick={onNotification}
                  className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <Bell size={20} />
                  {user.notifications && user.notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                      {user.notifications > 99 ? '99+' : user.notifications}
                    </Badge>
                  )}
                </button>

                {/* User Avatar */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-gray-300">
                      {user.username}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-1 z-50"
                      >
                        <button
                          onClick={() => {
                            onNavigate?.(`/profile/${user.username}`);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors"
                        >
                          <User size={16} />
                          <span>个人主页</span>
                        </button>
                        <button
                          onClick={() => {
                            onSettings?.();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors"
                        >
                          <Settings size={16} />
                          <span>设置</span>
                        </button>
                        <hr className="my-1 border-gray-600" />
                        <button
                          onClick={() => {
                            onLogout?.();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={16} />
                          <span>退出登录</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => onNavigate?.('/login')}
                className="text-sm"
              >
                登录
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="搜索帖子、用户或标签..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pb-4"
            >
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate?.(item.path);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-white hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
