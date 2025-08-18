'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostCard from './PostCard';
import { Tag } from './Tag';
import { 
  Search, 
  Plus, 
  Filter, 
  TrendingUp, 
  Clock, 
  Star,
  BookOpen,
  Trophy,
  Users,
  Calendar,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  timestamp: number;
  replies: number;
  views: number;
  tags?: string[];
  isPinned?: boolean;
  isHighlighted?: boolean;
}

interface User {
  id: number;
  username: string;
  avatarUrl: string;
  title?: string;
}

interface HomePageProps {
  posts: Post[];
  users: User[];
  currentUser?: User | null;
  onPostClick?: (postId: number) => void;
  onCreatePost?: () => void;
  onUserClick?: (username: string) => void;
}

export default function HomePage({
  posts,
  users,
  currentUser,
  onPostClick,
  onCreatePost,
  onUserClick
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  // 获取所有标签
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  // 筛选和排序帖子
  useEffect(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
      return matchesSearch && matchesTag;
    });

    // 排序
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return (b.replies + b.views) - (a.replies + a.views);
        default:
          return b.timestamp - a.timestamp;
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedTag, sortBy]);

  const getUserById = (userId: number) => {
    return users.find(user => user.id === userId);
  };

  const popularTags = allTags.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white"
      >
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">欢迎来到学术竞赛论坛</h1>
          <p className="text-xl mb-6 opacity-90">
            分享知识，交流经验，与优秀的伙伴一起成长
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="secondary" 
              onClick={onCreatePost}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus className="mr-2" />
              发布帖子
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <BookOpen className="mr-2" />
              浏览竞赛
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主要内容区 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 搜索和筛选栏 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="搜索帖子内容、标题..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  >
                    <option value="latest">最新发布</option>
                    <option value="popular">最多浏览</option>
                    <option value="trending">热门帖子</option>
                  </select>
                  <Button variant="outline" size="icon">
                    <Filter size={20} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 标签筛选 */}
          {selectedTag && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">当前筛选:</span>
                    <Tag text={selectedTag} variant="highlight" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTag(null)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    清除筛选
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 帖子列表 */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const author = getUserById(post.authorId);
                return author ? (
                  <PostCard
                    key={post.id}
                    post={post}
                    author={author}
                    onClick={() => onPostClick?.(post.id)}
                  />
                ) : null;
              })
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      没有找到相关帖子
                    </h3>
                    <p className="text-gray-400">
                      试试调整搜索条件或创建新的帖子
                    </p>
                    <Button onClick={onCreatePost}>
                      <Plus className="mr-2" />
                      发布帖子
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 热门标签 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp size={20} />
                <span>热门标签</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Tag
                    key={tag}
                    text={tag}
                    variant={selectedTag === tag ? "highlight" : "normal"}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 统计信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 size={20} />
                <span>社区统计</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-300">注册用户</span>
                </div>
                <span className="font-semibold">{users.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-300">帖子总数</span>
                </div>
                <span className="font-semibold">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-300">总回复数</span>
                </div>
                <span className="font-semibold text-purple-400">
                  {posts.reduce((sum, post) => sum + post.replies, 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 即将开始的竞赛 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy size={20} />
                <span>即将开始</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">ACM程序设计竞赛</h4>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <Calendar size={12} className="mr-1" />
                  <span>2024年3月15日</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">数学建模竞赛</h4>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <Calendar size={12} className="mr-1" />
                  <span>2024年4月1日</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                查看全部竞赛
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* 活跃用户 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star size={20} />
                <span>活跃用户</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => onUserClick?.(user.username)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.username.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.username}
                    </p>
                    {user.title && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.title}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// 修复BarChart3组件引用
function BarChart3({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
