import { User, Thread } from '@/store';

export interface InstanceData {
  users: User[];
  threads: Thread[];
}

export interface Instance {
  id: string;
  name: string;
  description: string;
  data: InstanceData;
}

const localUsers: User[] = [
    { id: 1, username: 'Cypher', email: 'cypher@shangwang.com', phone: '13800138001', avatarUrl: 'https://cdn.pixabay.com/photo/2023/04/23/12/37/cyborg-7945532_1280.png', reputation: 1500, status: 'online', title: '绳网大师', bio: 'AI核心研究员。', faction: '开发组', badges: ['leader', 'coder'], isAdmin: true, lastOnline: Date.now(), unlockedAchievements: [], level: 15, experience: 15000, equippedAchievement: '未来先锋', following: [2], followers: [] },
    { id: 2, username: 'Nomad', email: 'nomad@shangwang.com', phone: '13800138002', avatarUrl: 'https://cdn.pixabay.com/photo/2023/06/15/09/20/cyberpunk-8064560_1280.jpg', reputation: 850, status: 'away', title: '流浪黑客', bio: '自由的灵魂，穿梭于数据洪流。', faction: '剧情组', badges: ['writer'], isAdmin: false, lastOnline: Date.now() - 3600000, unlockedAchievements: [], level: 8, experience: 8000, equippedAchievement: '社区达人', following: [], followers: [1] },
];

const localThreads: Thread[] = [
    {
        id: 1, title: '欢迎来到本地绳网！', content: '这是本地实例的第一个帖子。', authorId: 1, timestamp: Date.now() - 5000000, likes: 10, dislikes: 1, type: 'post',
        replies: [
            { id: 101, content: '本地实例好耶！', authorId: 2, timestamp: Date.now() - 4000000, likes: 5, dislikes: 0, replies: [] },
        ],
        reposts: 2,
        quotes: 0,
    },
];

const alleyUsers: User[] = [
    { id: 101, username: 'AlleyCat', email: 'cat@alley.com', avatarUrl: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg', reputation: 999, status: 'online', title: '小巷之王', bio: '游走在赛博小巷的猫。', faction: '自由人', badges: ['explorer'], isAdmin: false, lastOnline: Date.now(), unlockedAchievements: [], level: 10, experience: 10000, equippedAchievement: '小巷游侠', following: [], followers: [] },
];

const alleyThreads: Thread[] = [
    {
        id: 201, title: '【赛博小巷】见闻分享', content: '今天在小巷深处发现了一个隐藏的数据节点...', authorId: 101, timestamp: Date.now() - 1000000, likes: 25, dislikes: 0, type: 'post',
        replies: [],
        reposts: 5,
        quotes: 1,
    },
];

export const instances: Record<string, Instance> = {
  'local.shangwang': {
    id: 'local.shangwang',
    name: '本地绳网 (默认)',
    description: '您的个人本地实例，数据存储在浏览器中。',
    data: {
      users: localUsers,
      threads: localThreads,
    }
  },
  'cyber.alley': {
    id: 'cyber.alley',
    name: '赛博小巷',
    description: '一个公开的、专注于探索和情报分享的实例。',
    data: {
      users: alleyUsers,
      threads: alleyThreads,
    }
  }
};
