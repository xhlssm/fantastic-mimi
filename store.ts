// ================= 导入区 =================
import { create } from 'zustand';

// ================= 类型定义区 =================
// 定义基础数据类型
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
    equippedAchievement?: string; // 当前佩戴成就
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

interface State {
    users: User[];
    threads: Thread[];
    messages: Message[];
    notifications: Notification[];
    shopItems: ShopItem[];
    achievements: Achievement[];
    factions: { id: Faction; name: string; reputation: number; members: number[]; announcement?: string }[];
    factionBoards: { [factionId: string]: FactionBoardMessage[] };
    user: User | null;
    activeView: View;
    selectedUsername: string | number | null;
    activeTheme: 'dark' | 'high-contrast' | 'cyberpunk';
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
}

// ================= Mock数据区 =================
const mockUsers: User[] = [
    { id: 1, username: 'Cypher', email: 'cypher@shangwang.com', phone: '13800138001', avatarUrl: 'https://cdn.pixabay.com/photo/2023/04/23/12/37/cyborg-7945532_1280.png', reputation: 1500, status: 'online', title: '绳网大师', bio: 'AI核心研究员。', faction: '开发组', badges: ['leader', 'coder'], isAdmin: true, lastOnline: Date.now(), unlockedAchievements: [], level: 15, experience: 15000, equippedAchievement: '未来先锋' },
    { id: 2, username: 'Nomad', email: 'nomad@shangwang.com', phone: '13800138002', avatarUrl: 'https://cdn.pixabay.com/photo/2023/06/15/09/20/cyberpunk-8064560_1280.jpg', reputation: 850, status: 'away', title: '流浪黑客', bio: '自由的灵魂，穿梭于数据洪流。', faction: '剧情组', badges: ['writer'], isAdmin: false, lastOnline: Date.now() - 3600000, unlockedAchievements: [], level: 8, experience: 8000, equippedAchievement: '社区达人' },
    { id: 3, username: 'Ghost', email: 'ghost@shangwang.com', phone: '13800138003', avatarUrl: 'https://cdn.pixabay.com/photo/2023/11/04/16/32/cyborg-8364805_1280.png', reputation: 250, status: 'offline', title: '新手探员', bio: '潜水学习中...', faction: null, badges: [], isAdmin: false, lastOnline: Date.now() - 86400000, unlockedAchievements: [], level: 3, experience: 3000, equippedAchievement: '打赏之星' }
];

const mockThreads: Thread[] = [
    {
        id: 1, title: '欢迎来到绳网！', content: '在这里，代码就是力量，创意就是武器。', authorId: 1, timestamp: Date.now() - 5000000, likes: 10, dislikes: 1, type: 'post',
        replies: [
            { id: 101, content: '酷毙了！等不及要开始了。', authorId: 2, timestamp: Date.now() - 4000000, likes: 5, dislikes: 0, replies: [] },
            { id: 102, content: '这个界面太有感觉了！', authorId: 3, timestamp: Date.now() - 3000000, likes: 2, dislikes: 0, replies: [] }
        ]
    },
    {
        id: 2, title: '【任务】绘制新的派系徽标', content: '我们需要一个代表“自由人”派系精神的徽标。', authorId: 1, timestamp: Date.now() - 2000000, likes: 2, dislikes: 0, type: 'mission', isCompleted: false,
        missionDetails: {
            reward: 500, deadline: Date.now() + 86400000 * 7, subtasks: [
                { id: 1, description: '提交3个初稿设计', completed: false },
                { id: 2, description: '完成最终设计稿', completed: false }
            ]
        },
        replies: []
    }
];

const mockMessages: Message[] = [
    { id: 1, senderId: 2, receiverId: 1, content: '嘿，Cypher，关于新任务的灵感...', timestamp: Date.now() - 100000, read: false },
    { id: 2, senderId: 1, receiverId: 2, content: '嗨，Nomad，我已经看到了。有什么具体想法吗？', timestamp: Date.now() - 90000, read: true }
];

const mockShopItems: ShopItem[] = [
    { id: 1, name: '赛博朋克主题', description: '将你的终端染上霓虹色彩。', price: 1000, imageUrl: 'https://cdn.pixabay.com/photo/2020/05/29/18/43/neon-5236592_1280.jpg', type: 'theme', themeId: 'cyberpunk' },
    { id: 2, name: '高对比度主题', description: '在任何光照下都能清晰显示。', price: 500, imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg', type: 'theme', themeId: 'high-contrast' },
    { id: 3, name: 'AI核心头像框', description: '一个闪烁着AI光芒的头像框。', price: 200, imageUrl: 'https://cdn.pixabay.com/photo/2017/04/06/17/57/frame-2208696_1280.png', type: 'avatar_frame' }
];

const mockAchievements: Achievement[] = [
    { id: 1, name: '第一步', description: '完成你的第一条回复', reward: 10, imageUrl: 'https://cdn.pixabay.com/photo/2023/11/25/11/56/achievement-8395561_1280.png' },
    { id: 2, name: '社交达人', description: '发送10条私信', reward: 50, imageUrl: 'https://cdn.pixabay.com/photo/2022/10/26/17/23/achievements-7549423_1280.png' },
    { id: 3, name: '任务猎人', description: '完成3个任务', reward: 100, imageUrl: 'https://cdn.pixabay.com/photo/2022/10/26/17/23/trophy-7549424_1280.png' }
];

const mockFactions = [
    { id: '开发组' as Faction, name: '开发组', reputation: 5000, members: [1], announcement: '开发组：用代码改变世界！' },
    { id: '剧情组' as Faction, name: '剧情组', reputation: 3000, members: [2], announcement: '剧情组：用故事点亮灵魂！' },
    { id: '艺术组' as Faction, name: '艺术组', reputation: 2000, members: [], announcement: '艺术组：用创意装点终端！' },
    { id: '自由人' as Faction, name: '自由人', reputation: 1000, members: [3], announcement: '自由人：无拘无束，畅游绳网！' }
];

let nextId = 1000;

// ================= Zustand全局状态实现区 =================
export const useStore = create<State & Actions>((set, get) => ({
    // State
    users: mockUsers,
    threads: mockThreads,
    messages: mockMessages,
    notifications: [],
    shopItems: mockShopItems,
    achievements: mockAchievements,
    factions: mockFactions,
    factionBoards: {
        '开发组': [
            { id: 1, userId: 1, content: '大家加油，争取本周声望第一！', timestamp: Date.now() - 60000, likes: 2 },
            { id: 2, userId: 2, content: '欢迎新成员加入！', timestamp: Date.now() - 300000, likes: 1 }
        ],
        '剧情组': [
            { id: 3, userId: 2, content: '剧情组团结协作！', timestamp: Date.now() - 120000, likes: 1 }
        ],
        '艺术组': [],
        '自由人': []
    },
    user: null,
    activeView: 'forum',
    selectedUsername: null,
    activeTheme: 'dark',

    // Actions
    login: (identifier: string, password: string) => {
        // 简单的模拟登录，实际应该验证密码
        const user = get().users.find(u => 
            u.username.toLowerCase() === identifier.toLowerCase() || 
            u.email.toLowerCase() === identifier.toLowerCase() ||
            u.phone === identifier
        );
        if (user) {
            const notif: Notification = { id: nextId++, type: 'system', content: `欢迎回来，${user.username}！`, timestamp: Date.now(), read: false };
            set({ user, notifications: [notif] });
            get().checkDailyTasks();
        }
    },
    
    register: (userData) => {
        const newUser: User = {
            id: nextId++,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            avatarUrl: userData.avatarUrl,
            reputation: 100,
            status: 'online',
            title: '新手探员',
            bio: userData.bio || '这个人很懒，什么都没写...',
            faction: (userData.faction as Faction) || null,
            badges: [],
            isAdmin: false,
            lastOnline: Date.now(),
            unlockedAchievements: [],
            level: 1,
            experience: 100
        };
        
        set(state => ({
            users: [...state.users, newUser],
            user: newUser,
            notifications: [...state.notifications, {
                id: nextId++,
                type: 'system',
                content: `欢迎加入绳网，${newUser.username}！`,
                timestamp: Date.now(),
                read: false
            } as Notification]
        }));
    },
    logout: () => set({ user: null, activeView: 'forum', selectedUsername: null }),
    setView: (view, data = null) => set({ activeView: view, selectedUsername: data }),
    addThread: (thread) => set(state => ({
        threads: [{ ...thread, id: nextId++, timestamp: Date.now(), replies: [], likes: 0, dislikes: 0 }, ...state.threads],
        notifications: state.user ? [...state.notifications, { id: nextId++, type: 'system', content: `新帖子 "${thread.title}" 已发布！`, timestamp: Date.now(), read: false } as Notification] : state.notifications
    })),
    addFactionBoardMessage: (factionId, userId, content) => set(state => {
        const board = state.factionBoards[factionId] || [];
        const newMsg: FactionBoardMessage = {
            id: Date.now() + Math.floor(Math.random()*1000),
            userId,
            content,
            timestamp: Date.now(),
            likes: 0
        };
        return {
            factionBoards: {
                ...state.factionBoards,
                [factionId]: [...board, newMsg]
            }
        };
    }),
    likeFactionBoardMessage: (factionId, messageId, userId) => set(state => {
        const board = state.factionBoards[factionId] || [];
        return {
            factionBoards: {
                ...state.factionBoards,
                [factionId]: board.map(msg =>
                    msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
                )
            }
        };
    }),
    addReply: (threadId, reply, parentReplyId = undefined) => set(state => {
        const newThreads = state.threads.map(thread => {
            if (thread.id === threadId) {
                const newReply: Reply = { ...reply, id: nextId++, timestamp: Date.now(), likes: 0, dislikes: 0, replies: [] };
                if (parentReplyId) {
                    const findAndAddReply = (replies: Reply[]): Reply[] => {
                        return replies.map(r => {
                            if (r.id === parentReplyId) {
                                return { ...r, replies: [...r.replies, newReply] };
                            }
                            if (r.replies.length > 0) {
                                return { ...r, replies: findAndAddReply(r.replies) };
                            }
                            return r;
                        });
                    };
                    return { ...thread, replies: findAndAddReply(thread.replies) };
                }
                return { ...thread, replies: [...thread.replies, newReply] };
            }
            return thread;
        });
        get().checkAchievements();
        const repliedThread = newThreads.find(t => t.id === threadId);
        const replyAuthor = state.users.find(u => u.id === reply.authorId);
        const threadAuthor = state.users.find(u => u.id === repliedThread?.authorId);
        const newNotifications = (state.user && threadAuthor && repliedThread && replyAuthor?.id !== threadAuthor.id)
            ? [...state.notifications, {
                id: nextId++,
                type: 'reply',
                content: `${replyAuthor?.username} 回复了你的帖子 "${repliedThread.title}"`,
                timestamp: Date.now(),
                read: false,
                threadId: repliedThread.id
            } as Notification]
            : state.notifications;
        return { threads: newThreads, notifications: newNotifications };
    }),
    toggleLike: (threadId, isReply, replyId) => set(state => {
        if (!state.user) return state; // 未登录禁止
        // 可扩展：同一用户只能点赞一次（可用本地Storage或user结构记录）
        return {
            threads: state.threads.map(thread => {
                if (thread.id === threadId) {
                    if (isReply && replyId) {
                        const toggleLikeReply = (replies: Reply[]): Reply[] => replies.map(r => {
                            if (r.id === replyId) {
                                return { ...r, likes: r.likes + 1 };
                            }
                            if (r.replies.length > 0) {
                                return { ...r, replies: toggleLikeReply(r.replies) };
                            }
                            return r;
                        });
                        return { ...thread, replies: toggleLikeReply(thread.replies) };
                    }
                    return { ...thread, likes: thread.likes + 1 };
                }
                return thread;
            })
        };
    }),
    toggleDislike: (threadId, isReply, replyId) => set(state => {
        if (!state.user) return state; // 未登录禁止
        // 可扩展：同一用户只能点踩一次（可用本地Storage或user结构记录）
        return {
            threads: state.threads.map(thread => {
                if (thread.id === threadId) {
                    if (isReply && replyId) {
                        const toggleDislikeReply = (replies: Reply[]): Reply[] => replies.map(r => {
                            if (r.id === replyId) {
                                return { ...r, dislikes: r.dislikes + 1 };
                            }
                            if (r.replies.length > 0) {
                                return { ...r, replies: toggleDislikeReply(r.replies) };
                            }
                            return r;
                        });
                        return { ...thread, replies: toggleDislikeReply(thread.replies) };
                    }
                    return { ...thread, dislikes: thread.dislikes + 1 };
                }
                return thread;
            })
        };
    }),
    sendMessage: (receiverId, content) => set(state => {
        const newMsg: Message = { id: nextId++, senderId: state.user!.id, receiverId, content, timestamp: Date.now(), read: false };
        const receiverUser = state.users.find(u => u.id === receiverId);
        const newNotifications = receiverUser ? [...state.notifications, {
            id: nextId++,
            type: 'message',
            content: `来自 ${state.user!.username} 的新消息: "${content.substring(0, 20)}..."`,
            timestamp: Date.now(),
            read: false,
            senderId: state.user!.id
        } as Notification] : state.notifications;
        get().checkAchievements();
        return { messages: [...state.messages, newMsg], notifications: newNotifications };
    }),
    markMessagesAsRead: (senderId) => set(state => ({
        messages: state.messages.map(msg =>
            (msg.senderId === senderId && msg.receiverId === state.user!.id && !msg.read)
                ? { ...msg, read: true }
                : msg
        )
    })),
    markNotificationAsRead: (id) => set(state => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
    })),
    buyShopItem: (itemId) => set(state => {
        const item = state.shopItems.find(i => i.id === itemId);
        if (!item || !state.user || state.user.reputation < item.price) return state;

        const updatedUser: User = { ...state.user, reputation: state.user.reputation - item.price };
        const updatedUsers = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
        const newNotifications = [...state.notifications, { id: nextId++, type: 'system', content: `成功购买 "${item.name}"！`, timestamp: Date.now(), read: false } as Notification];

        if (item.type === 'theme' && item.themeId) {
            return {
                ...state,
                user: updatedUser,
                users: updatedUsers,
                notifications: newNotifications,
                activeTheme: item.themeId
            };
        }
        return { ...state, user: updatedUser, users: updatedUsers, notifications: newNotifications };
    }),
    checkAchievements: () => set(state => {
        if (!state.user) return state;
        const updatedUser = { ...state.user };
        const newNotifications: Notification[] = [];

        // 成就1: 完成第一条回复
        const repliedThreads = state.threads.filter(t => t.replies.some(r => r.authorId === updatedUser.id));
        if (repliedThreads.length >= 1 && !updatedUser.unlockedAchievements.includes(1)) {
            updatedUser.unlockedAchievements.push(1);
            const achievement = state.achievements.find(a => a.id === 1)!;
            updatedUser.reputation += achievement.reward;
            newNotifications.push({ id: nextId++, type: 'achievement', content: `成就解锁: "${achievement.name}"，获得声望 ${achievement.reward}！`, timestamp: Date.now(), read: false });
        }

        // 成就2: 发送10条私信
        const sentMessages = state.messages.filter(m => m.senderId === updatedUser.id);
        if (sentMessages.length >= 10 && !updatedUser.unlockedAchievements.includes(2)) {
            updatedUser.unlockedAchievements.push(2);
            const achievement = state.achievements.find(a => a.id === 2)!;
            updatedUser.reputation += achievement.reward;
            newNotifications.push({ id: nextId++, type: 'achievement', content: `成就解锁: "${achievement.name}"，获得声望 ${achievement.reward}！`, timestamp: Date.now(), read: false });
        }
        
        // 自动升级头衔
        if (updatedUser.reputation >= 1000 && updatedUser.title === '流浪黑客') {
            updatedUser.title = '绳网精英';
        } else if (updatedUser.reputation >= 500 && updatedUser.title === '新手探员') {
            updatedUser.title = '流浪黑客';
        }
        
        return {
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
            user: updatedUser,
            notifications: [...state.notifications, ...newNotifications]
        };
    }),
    toggleTheme: (theme) => set({ activeTheme: theme }),
    updateUser: (updates) => set(state => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...updates };
        const updatedUsers = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
        return { users: updatedUsers, user: updatedUser };
    }),
    joinFaction: (factionId, userId) => set(state => {
        const user = state.users.find(u => u.id === userId);
        if (!user || user.faction) return state;
        
        const newUsers = state.users.map(u => u.id === userId ? { ...u, faction: factionId } : u);
        const newFactions = state.factions.map(f => {
            if (f.id === factionId) {
                return { ...f, members: [...f.members, userId] };
            }
            return f;
        });

        const newNotifications = [...state.notifications, { id: nextId++, type: 'system', content: `${user.username} 加入了 ${factionId} 派系！`, timestamp: Date.now(), read: false } as Notification];
        
        return { users: newUsers, user: { ...user, faction: factionId }, factions: newFactions, notifications: newNotifications };
    }),
    updateMissionSubtask: (threadId, subtaskId, completed) => set(state => ({
        threads: state.threads.map(thread => {
            if (thread.id === threadId && thread.missionDetails) {
                const newSubtasks = thread.missionDetails.subtasks.map(subtask =>
                    subtask.id === subtaskId ? { ...subtask, completed } : subtask
                );
                return { ...thread, missionDetails: { ...thread.missionDetails, subtasks: newSubtasks } };
            }
            return thread;
        })
    })),
    submitMissionSolution: (threadId, solution) => set(state => ({
        threads: state.threads.map(thread => {
            if (thread.id === threadId && thread.missionDetails) {
                return { ...thread, missionDetails: { ...thread.missionDetails, submittedSolution: solution } };
            }
            return thread;
        })
    })),
    approveMission: (threadId) => set(state => {
        const thread = state.threads.find(t => t.id === threadId);
        if (!thread || !thread.missionDetails) return state;
        
        const updatedThreads = state.threads.map(t =>
            t.id === threadId ? { ...t, isCompleted: true, missionDetails: { ...t.missionDetails!, isApproved: true } } : t
        );
        
        const userToReward = state.users.find(u => u.id === thread.authorId);
        if (userToReward) {
            const updatedUser = { ...userToReward, reputation: userToReward.reputation + thread.missionDetails.reward };
            const updatedUsers = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
            return { users: updatedUsers, threads: updatedThreads };
        }
        
        return { threads: updatedThreads };
    }),
    checkDailyTasks: () => set(state => {
        // 简化版每日任务：每天第一次登录时获得声望
        if (!state.user) return state;
        const now = Date.now();
        const lastOnlineDate = new Date(state.user.lastOnline).toDateString();
        const nowOnlineDate = new Date(now).toDateString();
        
        if (lastOnlineDate !== nowOnlineDate) {
            const reward = 50;
            const updatedUser = { ...state.user, reputation: state.user.reputation + reward, lastOnline: now };
            const updatedUsers = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
            const notification: Notification = { id: nextId++, type: 'system', content: `每日任务完成，获得声望 ${reward}！`, timestamp: now, read: false };
            return {
                users: updatedUsers,
                user: updatedUser,
                notifications: [...state.notifications, notification]
            };
        }
        return {
            users: state.users.map(u => u.id === state.user!.id ? { ...u, lastOnline: now } : u),
            user: { ...state.user!, lastOnline: now }
        };
    })
}));
