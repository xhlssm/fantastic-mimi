// ================= 导入区 =================
import { create } from 'zustand';
import { instances, Instance } from './lib/instances';

// ================= 类型定义区 =================
// (类型定义保持不变，除了移除不再需要的 mock data)
export interface FactionBoardMessage {
    id: number;
    userId: number;
    content: string;
    timestamp: number;
    likes: number;
}
export type View = 'forum' | 'profile' | 'shop' | 'factions' | 'leaderboard' | 'achievements' | 'messages' | 'admin' | 'faction_page';
export type UserStatus = 'online' | 'away' | 'offline' | 'busy';
export type Faction = '开发组' | '剧情组' | '艺术组' | '自由人' | null;
export type ThreadType = 'post' | 'mission';

export interface User {
    id: number;
    username: string;
    email: string;
    phone?: string;
    avatarUrl: string;
    reputation: number;
    status: UserStatus;
    title: string;
    bio: string;
    faction: Faction;
    badges: string[];
    isAdmin: boolean;
    lastOnline: number;
    unlockedAchievements: number[];
    level: number;
    experience: number;
    equippedAchievement?: string;
    following: number[];
    followers: number[];
}

export interface Thread {
    id: number;
    title: string;
    content: string;
    tags?: string[];
    authorId: number;
    timestamp: number;
    likes: number;
    dislikes: number;
    replies: Reply[];
    type: ThreadType;
    isCompleted?: boolean;
    missionDetails?: MissionDetails;
    reposts: number;
    quotes: number;
}

export interface Reply {
    id: number;
    content: string;
    authorId: number;
    timestamp: number;
    likes: number;
    dislikes: number;
    replies: Reply[];
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: number;
    read: boolean;
}

export interface ShopItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    type: 'avatar_frame' | 'background' | 'theme';
    themeId?: 'cyberpunk' | 'high-contrast';
}

export interface Notification {
    id: number;
    type: 'reply' | 'message' | 'mission' | 'system' | 'achievement';
    content: string;
    timestamp: number;
    read: boolean;
    threadId?: number;
    senderId?: number;
}

export interface MissionDetails {
    reward: number;
    deadline: number;
    assigneeId?: number | null;
    submittedSolution?: string | null;
    isApproved?: boolean;
    subtasks: { id: number; description: string; completed: boolean }[];
}

export interface Achievement {
    id: number;
    name: string;
    description: string;
    reward: number;
    imageUrl: string;
}

export interface Plugin {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

interface State {
    users: User[];
    threads: Thread[];
    messages: Message[];
    notifications: Notification[];
    shopItems: ShopItem[];
    achievements: Achievement[];
    plugins: Plugin[];
    factions: { id: Faction; name: string; reputation: number; members: number[]; announcement?: string }[];
    factionBoards: { [factionId: string]: FactionBoardMessage[] };
    user: User | null;
    activeView: View;
    selectedUsername: string | number | null;
    activeTheme: 'dark' | 'high-contrast' | 'cyberpunk';
    lastCheckIn: string | null;
    // 新增：实例管理
    instances: Record<string, Instance>;
    currentInstanceId: string;
}

interface Actions {
    login: (identifier: string, password: string) => void;
    register: (userData: { username: string; email: string; phone?: string; password: string; avatarUrl: string; bio: string; faction: string }) => void;
    logout: () => void;
    setView: (view: View, data?: string | number) => void;
    addThread: (thread: Omit<Thread, 'id' | 'timestamp' | 'replies' | 'likes' | 'dislikes'>) => void;
    addReply: (threadId: number, reply: Omit<Reply, 'id' | 'timestamp' | 'replies' | 'likes' | 'dislikes'>, parentReplyId?: number) => void;
    toggleLike: (threadId: number, isReply: boolean, replyId?: number) => void;
    toggleDislike: (threadId: number, isReply: boolean, replyId?: number) => void;
    sendMessage: (receiverId: number, content: string) => void;
    markMessagesAsRead: (senderId: number) => void;
    markNotificationAsRead: (id: number) => void;
    buyShopItem: (itemId: number) => void;
    checkAchievements: () => void;
    toggleTheme: (theme: 'dark' | 'high-contrast' | 'cyberpunk') => void;
    updateUser: (updates: Partial<User>) => void;
    joinFaction: (factionId: Faction, userId: number) => void;
    addFactionBoardMessage: (factionId: Faction, userId: number, content: string) => void;
    likeFactionBoardMessage: (factionId: Faction, messageId: number, userId: number) => void;
    updateMissionSubtask: (threadId: number, subtaskId: number, completed: boolean) => void;
    submitMissionSolution: (threadId: number, solution: string) => void;
    approveMission: (threadId: number) => void;
    checkDailyTasks: () => void;
    checkIn: () => void;
    togglePlugin: (pluginId: string) => void;
    // 新增：切换实例
    switchInstance: (instanceId: string) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    toggleFollow: (userId: number) => void;
    repostThread: (threadId: number) => void;
}

let nextId = 1000;

// ================= Zustand全局状态实现区 =================
export const useStore = create<State & Actions>((set, get) => ({
    // State
    users: instances['local.shangwang'].data.users,
    threads: instances['local.shangwang'].data.threads,
    messages: [], // 简化：消息等不随实例切换
    notifications: [],
    shopItems: [], // 简化：商店等不随实例切换
    achievements: [], // 简化：成就等不随实例切换
    plugins: [
        { id: 'weather', name: '天气小组件', description: '在左上角显示天气信息', enabled: true },
        { id: 'countdown', name: '新年倒计时', description: '在左上角显示新年倒计时', enabled: false },
    ],
    factions: [],
    factionBoards: {},
    user: null,
    activeView: 'forum',
    selectedUsername: null,
    activeTheme: 'dark',
    lastCheckIn: null,
    instances: instances,
    currentInstanceId: 'local.shangwang',

    // Actions
    switchInstance: (instanceId: string) => {
        const newInstance = get().instances[instanceId];
        if (newInstance) {
            set({
                currentInstanceId: instanceId,
                users: newInstance.data.users,
                threads: newInstance.data.threads,
                user: null, // 切换实例后需要重新登录
                activeView: 'forum',
                selectedUsername: null,
            });
        }
    },

    login: (identifier: string, password: string) => {
        const user = get().users.find(u => 
            u.username.toLowerCase() === identifier.toLowerCase() || 
            u.email.toLowerCase() === identifier.toLowerCase()
        );
        if (user) {
            set({ user });
        }
    },
    
    // (其他 Actions 保持不变或进行相应简化)
    logout: () => set({ user: null }),
    setView: (view, data = null) => set({ activeView: view, selectedUsername: data }),
    addThread: (thread) => set(state => ({
        threads: [{ ...thread, id: nextId++, timestamp: Date.now(), replies: [], likes: 0, dislikes: 0, reposts: thread.reposts || 0, quotes: thread.quotes || 0 }, ...state.threads],
    })),
    addReply: (threadId, reply) => set(state => ({
        threads: state.threads.map(t => 
            t.id === threadId ? { ...t, replies: [...t.replies, { ...reply, id: nextId++, timestamp: Date.now(), likes: 0, dislikes: 0, replies: [] }] } : t
        )
    })),
    toggleLike: (threadId, isReply, replyId) => set(state => ({
        threads: state.threads.map(thread => {
            if (thread.id === threadId) {
                // 简化：仅处理帖子点赞
                return { ...thread, likes: thread.likes + 1 };
            }
            return thread;
        })
    })),
    toggleDislike: (threadId, isReply, replyId) => set(state => ({
        threads: state.threads.map(thread => {
            if (thread.id === threadId) {
                // 简化：仅处理帖子点踩
                return { ...thread, dislikes: thread.dislikes + 1 };
            }
            return thread;
        })
    })),
    // ... 其他 actions 的简化实现 ...
    register: () => {},
    sendMessage: () => {},
    markMessagesAsRead: () => {},
    markNotificationAsRead: () => {},
    buyShopItem: () => {},
    checkAchievements: () => {},
    toggleTheme: (theme) => set({ activeTheme: theme }),
    updateUser: () => {},
    joinFaction: () => {},
    addFactionBoardMessage: () => {},
    likeFactionBoardMessage: () => {},
    updateMissionSubtask: () => {},
    submitMissionSolution: () => {},
    approveMission: () => {},
    checkDailyTasks: () => {},
    checkIn: () => {},
    togglePlugin: (pluginId: string) => set(state => ({
        plugins: state.plugins.map(p =>
            p.id === pluginId ? { ...p, enabled: !p.enabled } : p
        )
    })),
    addNotification: (notification) => set(state => ({
        notifications: [{ ...notification, id: nextId++, timestamp: Date.now(), read: false }, ...state.notifications]
    })),
    toggleFollow: (userId: number) => set(state => {
        if (!state.user) return state;

        const isFollowing = state.user.following.includes(userId);
        const currentUser = state.users.find(u => u.id === state.user!.id);
        const targetUser = state.users.find(u => u.id === userId);

        if (!currentUser || !targetUser) return state;

        const updatedCurrentUser = {
            ...currentUser,
            following: isFollowing
                ? currentUser.following.filter(id => id !== userId)
                : [...currentUser.following, userId],
        };

        const updatedTargetUser = {
            ...targetUser,
            followers: isFollowing
                ? targetUser.followers.filter(id => id !== currentUser.id)
                : [...targetUser.followers, currentUser.id],
        };

        return {
            ...state,
            user: updatedCurrentUser,
            users: state.users.map(u => {
                if (u.id === currentUser.id) return updatedCurrentUser;
                if (u.id === targetUser.id) return updatedTargetUser;
                return u;
            }),
        };
    }),
    repostThread: (threadId: number) => set(state => ({
        threads: state.threads.map(t =>
            t.id === threadId ? { ...t, reposts: t.reposts + 1 } : t
        )
    })),
}));

// 模拟实时通知
setInterval(() => {
    const { user, addNotification } = useStore.getState();
    if (user) {
        const mockNotifs = [
            { type: 'reply', content: 'Nomad 回复了你的帖子' },
            { type: 'message', content: '收到来自 AlleyCat 的新消息' },
            { type: 'mission', content: '新任务已发布：设计Logo' },
        ];
        const randomNotif = mockNotifs[Math.floor(Math.random() * mockNotifs.length)];
        addNotification(randomNotif as any);
    }
}, 15000); // 每15秒模拟一条新通知
