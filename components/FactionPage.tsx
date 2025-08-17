// @/components/FactionPage.tsx
'use client';
import { useStore, Faction } from '@/store';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users } from 'lucide-react';

export default function FactionPage({ factionId }: { factionId: Faction | null }) {
    const { factions, users, user, factionBoards, addFactionBoardMessage, likeFactionBoardMessage } = useStore();
    const [boardInput, setBoardInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const faction = factions.find(f => f.id === factionId);
    const members = faction ? users.filter(u => faction.members.includes(u.id)) : [];
    const board = faction && factionBoards ? (factionBoards[faction.id] || []) : [];
    const handleSend = useCallback(() => {
        if (!user || !boardInput.trim()) return;
        setIsSending(true);
        setTimeout(() => {
            addFactionBoardMessage(faction.id, user.id, boardInput.trim());
            setBoardInput('');
            setIsSending(false);
        }, 500);
    }, [user, boardInput, addFactionBoardMessage, faction]);
    if (!faction) return <div className="text-center text-[#B0B0CC] p-8">派系不存在。</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-[#00E4FF] flex items-center space-x-2">
                <Users size={32} /> <span>{faction.name}</span>
            </h2>

            {/* 派系公告/宣言 */}
            <Card className="bg-gradient-to-r from-[var(--neon-blue)]/10 to-[var(--neon-pink)]/10 border-[var(--neon-blue)] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white text-xl">派系公告</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-[var(--light-gray)] text-base">
                        {faction.announcement || '欢迎加入本派系！团结协作，共创辉煌。'}
                    </div>
                </CardContent>
            </Card>

            {/* 派系任务（示例） */}
            <Card className="bg-gradient-to-r from-[var(--neon-green)]/10 to-[var(--neon-blue)]/10 border-[var(--neon-green)] shadow-md">
                <CardHeader>
                    <CardTitle className="text-white text-xl">派系任务</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                            <span>本周活跃签到满 5 天</span>
                            <span className="text-[var(--neon-green)] font-bold">+100 声望</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span>邀请新成员加入</span>
                            <span className="text-[var(--neon-green)] font-bold">+50 声望/人</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span>完成一次派系协作任务</span>
                            <span className="text-[var(--neon-green)] font-bold">专属勋章</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* 派系排行榜（按声望排序） */}
            <Card className="bg-gradient-to-r from-[var(--neon-blue)]/10 to-[var(--neon-green)]/10 border-[var(--neon-blue)] shadow-md">
                <CardHeader>
                    <CardTitle className="text-white text-xl">派系排行榜</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-1">
                        {members
                            .slice()
                            .sort((a, b) => b.reputation - a.reputation)
                            .map((member, idx) => (
                                <li key={member.id} className="flex items-center space-x-2">
                                    <span className={`font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-white'}`}>{idx + 1}.</span>
                                    <img src={member.avatarUrl} alt={member.username} className="w-8 h-8 rounded-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Img'; }} />
                                    <span className="text-white">{member.username}</span>
                                    <span className="ml-auto text-[var(--neon-blue)]">{member.reputation} 声望</span>
                                </li>
                            ))}
                    </ol>
                </CardContent>
            </Card>

            {/* 派系专属勋章/称号 */}
            <Card className="bg-gradient-to-r from-[var(--neon-pink)]/10 to-[var(--neon-blue)]/10 border-[var(--neon-pink)] shadow-md">
                <CardHeader>
                    <CardTitle className="text-white text-xl">派系专属勋章</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl">🏅</span>
                            <span className="text-white text-sm mt-1">协作之星</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl">🎖️</span>
                            <span className="text-white text-sm mt-1">活跃先锋</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl">👑</span>
                            <span className="text-white text-sm mt-1">派系领袖</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 派系成员互动区（留言板） */}
            <Card className="bg-gradient-to-r from-[var(--neon-blue)]/10 to-[var(--neon-green)]/10 border-[var(--neon-blue)] shadow-md">
                <CardHeader>
                    <CardTitle className="text-white text-xl">派系留言板</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                        {board.length === 0 && <div className="text-[var(--light-gray)] text-center py-4">暂无留言，快来互动吧！</div>}
                        {board.slice().sort((a,b)=>b.timestamp-a.timestamp).map(msg => {
                            const u = users.find(x => x.id === msg.userId);
                            return (
                                <div key={msg.id} className="flex items-start gap-3">
                                    <img src={u?.avatarUrl} alt={u?.username} className="w-8 h-8 rounded-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Img'; }} />
                                    <div className="flex-1">
                                        <div className="bg-[#232946] rounded-lg px-3 py-2 text-white text-sm">{msg.content}</div>
                                        <div className="text-xs text-[var(--light-gray)] mt-1 flex items-center gap-2">
                                            {u?.username} · {Math.floor((Date.now()-msg.timestamp)/60000) < 1 ? '刚刚' : Math.floor((Date.now()-msg.timestamp)/60000) + '分钟前'}
                                            <button className="ml-2 text-[var(--neon-blue)] hover:underline" onClick={()=>likeFactionBoardMessage(faction.id, msg.id, user?.id)} disabled={!user}>点赞{msg.likes>0 && <span>({msg.likes})</span>}</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 rounded-lg px-3 py-2 bg-[#232946] text-white border border-[var(--neon-blue)] focus:outline-none"
                            placeholder={user ? '说点什么...' : '请先登录'}
                            value={boardInput}
                            onChange={e => setBoardInput(e.target.value)}
                            disabled={!user || isSending}
                            maxLength={200}
                            onKeyDown={e => { if(e.ctrlKey && e.key==='Enter'){ handleSend(); }}}
                        />
                        <button
                            className={`bg-[var(--neon-blue)] text-white px-4 py-2 rounded-lg font-bold ${(!user || !boardInput.trim() || isSending) ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={handleSend}
                            disabled={!user || !boardInput.trim() || isSending}
                        >{isSending ? '发送中...' : '发送'}</button>
                    </div>
                    <div className="text-xs text-[var(--light-gray)] mt-1">Ctrl+Enter 快捷发送，最多200字</div>
                </CardContent>
            </Card>
            <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
                <CardHeader>
                    <CardTitle className="text-white text-xl">派系成员</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map(member => (
                            <div key={member.id} className="p-4 bg-[#24243D] rounded-md flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                                <img src={member.avatarUrl} alt={member.username} className="w-12 h-12 rounded-full" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/96?text=No+Img'; }} />
                                <div className="flex-1 min-w-0">
                                    <span className="text-white font-bold text-base">{member.username}</span>
                                    <div className="text-xs text-[var(--light-gray)] mt-1">贡献度：{member.reputation} | 活跃度：{Math.floor((member.level || 1) * 10 + (member.experience || 0) / 100)}</div>
                                    <div className="text-xs text-[var(--neon-green)] mt-1">派系任务完成度：{Math.min(100, Math.floor((member.level || 1) * 8 + (member.experience || 0) / 120))}%</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    {member.badges && member.badges.length > 0 && member.badges.map(badge => (
                                        <span key={badge} className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-pink)] text-white text-xs px-2 py-0.5 rounded-full shadow">{badge}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
