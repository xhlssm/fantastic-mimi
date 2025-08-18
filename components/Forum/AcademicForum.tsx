'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Layout from './Layout';
import HomePage from './HomePage';
import PostDetailPage from './PostDetailPage';
import UserCard from './UserCard';
import { useStore } from '@/store';

// 模拟数据
const mockPosts = [
  {
    id: 1,
    title: '2024年全国大学生数学建模竞赛经验分享',
    content: '<p>刚刚参加完2024年全国大学生数学建模竞赛，想和大家分享一下我的经验。这次比赛的题目是关于城市交通流量优化的，我们团队选择了基于深度学习的解决方案。</p><p>在准备过程中，我们主要做了以下几个方面的工作：</p><ul><li>数据收集和预处理</li><li>模型选择和调优</li><li>结果可视化</li></ul><p>希望对即将参加比赛的同学们有所帮助！</p>',
    authorId: 1,
    timestamp: Date.now() - 86400000, // 1天前
    replies: 15,
    views: 234,
    tags: ['数学建模', '经验分享', '2024'],
    isPinned: true,
    likes: 42
  },
  {
    id: 2,
    title: 'ACM-ICPC区域赛备战策略讨论',
    content: '<p>距离ACM-ICPC区域赛还有两个月，想和大家讨论一下备战策略。我们团队目前的情况是：</p><ul><li>算法基础：基本掌握常用算法</li><li>团队配合：还在磨合中</li><li>题目练习：每天坚持刷题</li></ul><p>请问有经验的学长学姐们，最后两个月应该重点准备哪些方面？</p>',
    authorId: 2,
    timestamp: Date.now() - 172800000, // 2天前
    replies: 23,
    views: 456,
    tags: ['ACM', '算法', '备战'],
    isHighlighted: true,
    likes: 38
  },
  {
    id: 3,
    title: '机器学习竞赛特征工程技巧总结',
    content: '<p>参加了几个机器学习竞赛后，总结了一些特征工程的技巧，分享给大家：</p><ol><li>数值特征：标准化、归一化、分箱</li><li>类别特征：独热编码、标签编码、目标编码</li><li>时间特征：年月日、星期、季节等</li><li>文本特征：TF-IDF、Word2Vec、BERT等</li></ol><p>特征工程是机器学习竞赛中最重要的一环，好的特征能让模型效果大幅提升。</p>',
    authorId: 3,
    timestamp: Date.now() - 259200000, // 3天前
    replies: 8,
    views: 189,
    tags: ['机器学习', '特征工程', '竞赛'],
    likes: 56
  }
];

const mockUsers = [
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    title: '数学建模达人',
    reputation: 1250,
    joinDate: new Date('2023-01-15'),
    competitionExperiences: [
      {
        id: 1,
        name: '全国大学生数学建模竞赛',
        year: 2023,
        role: '队长',
        achievement: '全国二等奖'
      },
      {
        id: 2,
        name: '美国大学生数学建模竞赛',
        year: 2024,
        role: '队员',
        achievement: 'Honorable Mention'
      }
    ],
    followersCount: 156,
    followingCount: 89,
    postsCount: 12
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    title: 'ACM选手',
    reputation: 980,
    joinDate: new Date('2023-03-20'),
    competitionExperiences: [
      {
        id: 3,
        name: 'ACM-ICPC亚洲区域赛',
        year: 2023,
        role: '队员',
        achievement: '铜奖'
      }
    ],
    followersCount: 234,
    followingCount: 67,
    postsCount: 8
  },
  {
    id: 3,
    username: '王五',
    email: 'wangwu@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    title: '机器学习专家',
    reputation: 1580,
    joinDate: new Date('2022-11-10'),
    competitionExperiences: [
      {
        id: 4,
        name: 'Kaggle竞赛',
        year: 2023,
        role: '个人',
        achievement: 'Top 10%'
      },
      {
        id: 5,
        name: '天池大赛',
        year: 2024,
        role: '队长',
        achievement: '金牌'
      }
    ],
    followersCount: 345,
    followingCount: 123,
    postsCount: 15
  }
];

const mockReplies = [
  {
    id: 1,
    content: '<p>感谢分享！请问你们团队是如何分工的？我们团队在分工方面总是出现问题。</p>',
    authorId: 2,
    timestamp: Date.now() - 43200000, // 12小时前
    likes: 5,
    dislikes: 0,
    replies: [
      {
        id: 4,
        content: '<p>我们团队是一个负责算法，一个负责代码实现，一个负责论文写作。建议提前明确每个人的职责。</p>',
        authorId: 1,
        timestamp: Date.now() - 36000000, // 10小时前
        likes: 3,
        dislikes: 0
      }
    ]
  },
  {
    id: 2,
    content: '<p>请问数据预处理有什么特别的技巧吗？我们在这方面花了很多时间。</p>',
    authorId: 3,
    timestamp: Date.now() - 28800000, // 8小时前
    likes: 2,
    dislikes: 0
  },
  {
    id: 3,
    content: '<p>写得很好！特别是关于模型选择的部分，对我很有帮助。</p>',
    authorId: 2,
    timestamp: Date.now() - 14400000, // 4小时前
    likes: 1,
    dislikes: 0
  }
];

type View = 'home' | 'post' | 'profile';

export default function AcademicForum() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 从store中获取用户信息
  const { user, login, logout } = useStore();

  // 删除了自动登录逻辑，不再需要签到功能

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
    setCurrentView('post');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedPostId(null);
  };

  const handleUserClick = (username: string) => {
    setSelectedUsername(username);
    setCurrentView('profile');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // 实现搜索逻辑
    console.log('Searching for:', query);
  };

  const handleNavigate = (path: string) => {
    console.log('Navigating to:', path);
    // 实现路由导航逻辑
  };

  const handleNotification = () => {
    console.log('Opening notifications...');
    // 实现通知逻辑
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // 实现设置逻辑
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
  };

  const handleCreatePost = () => {
    console.log('Creating new post...');
    // 实现创建帖子逻辑
  };

  const handleLike = (postId: number) => {
    console.log('Liking post:', postId);
    // 实现点赞逻辑
  };

  const handleReply = (postId: number, content: string, parentReplyId?: number) => {
    console.log('Replying to post:', postId, content, parentReplyId);
    // 实现回复逻辑
  };

  const selectedPost = mockPosts.find(post => post.id === selectedPostId);
  const selectedUser = mockUsers.find(user => user.username === selectedUsername);

  return (
    <Layout
      user={user ? {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        notifications: 3
      } : undefined}
      onSearch={handleSearch}
      onNavigate={handleNavigate}
      onNotification={handleNotification}
      onSettings={handleSettings}
      onLogout={handleLogout}
    >
      {currentView === 'home' && (
        <HomePage
          posts={mockPosts}
          users={mockUsers}
          currentUser={user}
          onPostClick={handlePostClick}
          onCreatePost={handleCreatePost}
          onUserClick={handleUserClick}
        />
      )}

      {currentView === 'post' && selectedPost && (
        <PostDetailPage
          post={selectedPost}
          author={mockUsers.find(u => u.id === selectedPost.authorId)!}
          replies={mockReplies}
          currentUser={user}
          onBack={handleBack}
          onLike={handleLike}
          onReply={handleReply}
          onUserClick={handleUserClick}
          onTagClick={(tag) => {
            setSearchQuery(tag);
            setCurrentView('home');
          }}
        />
      )}

      {currentView === 'profile' && selectedUser && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </Button>
          </div>
          
          <UserCard
            user={selectedUser}
            isCurrentUser={user?.username === selectedUser.username}
            onFollow={() => console.log('Following user:', selectedUser.id)}
            onMessage={() => console.log('Messaging user:', selectedUser.id)}
            onEditProfile={() => console.log('Editing profile...')}
          />
        </div>
      )}
    </Layout>
  );
}

// 修复ArrowLeft组件引用
function ArrowLeft({ size, className }: { size: number; className?: string }) {
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
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
