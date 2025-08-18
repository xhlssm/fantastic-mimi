import { instances } from './instances';
import type { User, Thread, Reply } from '@/store';

// 定义创建回复时所需的数据类型
type ReplyData = Omit<Reply, 'id' | 'timestamp' | 'likes' | 'dislikes' | 'replies'>;

// 深拷贝初始数据，以创建一个可变的内存数据库
let db = JSON.parse(JSON.stringify(instances));

let nextId = 2000;

export const dbService = {
  // --- User Management ---
  findUserByUsername: (instanceId: string, username: string): User | undefined => {
    return db[instanceId]?.data.users.find((user: User) => user.username.toLowerCase() === username.toLowerCase());
  },

  getUsers: (instanceId: string): User[] => {
    return db[instanceId]?.data.users || [];
  },

  // --- Thread (Note) Management ---
  getThreads: (instanceId: string): Thread[] => {
    return db[instanceId]?.data.threads.sort((a: Thread, b: Thread) => b.timestamp - a.timestamp) || [];
  },

  createThread: (instanceId: string, { title, content, authorId }: { title: string; content: string; authorId: number }): Thread => {
    const newThread: Thread = {
      id: nextId++,
      title,
      content,
      authorId,
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      replies: [],
      reposts: 0,
      quotes: 0,
      type: 'post',
    };
    db[instanceId].data.threads.unshift(newThread);
    return newThread;
  },

  toggleLike: (instanceId: string, threadId: number): Thread | null => {
    const thread = db[instanceId]?.data.threads.find((t: Thread) => t.id === threadId);
    if (thread) {
      thread.likes++; // 简化：仅增加，不处理取消点赞
      return thread;
    }
    return null;
  },

  createReply: (instanceId: string, threadId: number, data: ReplyData): Reply | null => {
    const thread = db[instanceId]?.data.threads.find((t: Thread) => t.id === threadId);
    if (thread) {
      const newReply: Reply = {
        ...data,
        id: nextId++,
        timestamp: Date.now(),
        likes: 0,
        dislikes: 0,
        replies: [],
      };
      thread.replies.push(newReply);
      return newReply;
    }
    return null;
  },
};
