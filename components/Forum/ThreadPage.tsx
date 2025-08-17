// 解决 window.__likeLock/__dislikeLock TS 报错
declare global {
    interface Window {
        __likeLock?: boolean;
        __dislikeLock?: boolean;
    }
}


'use client';
import { useStore } from '@/store';
import { useState, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import MissionCard from './MissionCard';
import ReplyItem from './ReplyItem';
import { MessageCircle, ThumbsUp, ThumbsDown, Tag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'dompurify';
import { isImageUrl } from '@/lib/utils';



export default function ThreadPage() {
    const { threads, users, user, setView, activeView, selectedUsername, addReply, toggleLike, toggleDislike, updateMissionSubtask, submitMissionSolution, approveMission } = useStore();
        const [replyContent, setReplyContent] = useState('');
        const [showEmoji, setShowEmoji] = useState(false);
    // 丰富表情、颜文字、表情包（仅安全字符）
    const emojiList: string[] = [
        '😀','😂','😍','🥰','😎','😭','😡','👍','👏','🎉','🔥','💡','🤔','🥳','😏','😅','😱','🤖','🧋','🍕','🌈','⭐','💯',
        '(๑•̀ㅂ•́)و✧','(｡･ω･｡)ﾉ♡','(╯°□°）╯︵ ┻━┻','(￣▽￣)ノ','(ಥ_ಥ)','( •̀ ω •́ )✧','(≧∇≦)ﾉ','(づ｡◕‿‿◕｡)づ','(ง •_•)ง','(｡•́︿•̀｡)','(￣3￣)a','(๑>؂<๑)','( ˘ ³˘)♥','(๑•́ ₃ •̀๑)','(ง •̀_•́)ง','(｡•̀ᴗ-)✧','(｡･∀･)ﾉﾞ','(｡•ω•｡)ﾉ♡','(｡♥‿♥｡)','(๑˃̵ᴗ˂̵)و','(๑´ڡ`๑)','(๑•̀o•́๑)۶ FIGHT!','(๑>◡<๑)','(๑¯∀¯๑)','(๑´ㅂ`๑)','(๑´ㅂ`๑)♡*.+゜'
    ];
    // 插入表情到光标处
    const insertEmoji = (emoji: string) => {
        if (!replyRef.current) return;
        const textarea = replyRef.current as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = replyContent.slice(0, start);
        const after = replyContent.slice(end);
        setReplyContent(before + emoji + after);
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        }, 0);
    };
    const [replyToId, setReplyToId] = useState<number | null>(null);
    const [missionSolution, setMissionSolution] = useState('');
    const [preview, setPreview] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const replyRef = useRef<HTMLTextAreaElement>(null);

    // 评论提交逻辑优化，支持loading和快捷键
    function handleReply() {
        if (!user || !replyContent.trim()) return;
        setIsReplying(true);
        setTimeout(() => {
            addReply(thread.id, { content: replyContent, authorId: user.id }, replyToId || undefined);
            setReplyContent('');
            setReplyToId(null);
            setIsReplying(false);
        }, 600);
    }

    if (activeView !== 'forum' || typeof selectedUsername !== 'number') return null;
    const thread = threads.find(t => t.id === selectedUsername);
    if (!thread) {
        return <div className="text-center p-8 text-[var(--light-gray)] neon-text glass-effect border-glow">帖子未找到。</div>;
    }
    const author = users.find(u => u.id === thread.authorId);
    const safeContent = DOMPurify.sanitize(thread.content, { USE_PROFILES: { html: true } });
    const isContentImage = isImageUrl(safeContent);
    const sortedReplies = useMemo(() => thread.replies.slice().sort((a, b) => a.timestamp - b.timestamp), [thread.replies]);

    // ...existing code...
    // 帖子详情底部打赏作者
    const DonateAuthor = require('../DonateAuthor').default;
    return (
    <main className="max-w-2xl mx-auto py-8 space-y-8 px-2 md:px-0" tabIndex={-1} aria-label="帖子详情主内容区">
            {/* 面包屑导航 */}
            <nav aria-label="breadcrumb" className="mb-4 flex items-center text-sm text-[var(--light-gray)] space-x-2">
                <Button
                    onClick={() => setView('forum')}
                    className="btn-glow bg-[var(--dark-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-[var(--dark-blue)] border-glow px-3 py-1 h-auto text-xs md:text-sm"
                    aria-label="返回论坛"
                >
                    论坛
                </Button>
                <span className="mx-1">/</span>
                <span className="truncate max-w-[120px] md:max-w-xs" title={thread.title}>{thread.title}</span>
            </nav>
            <article className="glass-effect-strong border-glow card-hover rounded-2xl overflow-hidden" itemScope itemType="https://schema.org/DiscussionForumPosting">
                <header className="p-6 border-b border-glow bg-[#181824]/80">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 space-y-2 md:space-y-0">
                        {thread.type === 'mission' && thread.missionDetails && (
                            <MissionCard
                                missionDetails={thread.missionDetails}
                                user={user}
                                thread={thread}
                                missionSolution={missionSolution}
                                setMissionSolution={setMissionSolution}
                                updateMissionSubtask={updateMissionSubtask}
                                submitMissionSolution={submitMissionSolution}
                                approveMission={approveMission}
                            />
                        )}
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold neon-text flex items-center space-x-2" itemProp="headline">
                                {thread.type === 'mission' && <Tag className="mr-2" />}<span>{thread.title}</span>
                            </h1>
                            <p className="text-[var(--light-gray)] text-xs md:text-sm">
                                由 <span className="text-[var(--neon-blue)] font-bold cursor-pointer hover:underline" onClick={() => setView('profile', author?.username)} itemProp="author">{author?.username || '未知用户'}</span> 发布于 <time dateTime={new Date(thread.timestamp).toISOString()} itemProp="datePublished">{formatDistanceToNow(new Date(thread.timestamp), { addSuffix: true })}</time>
                            </p>
                        </div>
                    </div>
                    {thread.type === 'mission' && (
                        <Badge className="border-glow neon-text-pink w-fit">任务</Badge>
                    )}
                </header>
                <section className="p-4 md:p-6 markdown-content glass-effect border-glow custom-scrollbar bg-[#232946]/60" itemProp="articleBody">
                    {isContentImage ? (
                        <img
                            src={safeContent}
                            alt={thread.title ? `${thread.title} - 论坛图片` : '帖子图片'}
                            title={thread.title || '帖子图片'}
                            loading="lazy"
                            className="rounded-md max-w-full h-auto"
                        />
                    ) : HTMLReactParser(safeContent)}
                </section>
                <footer className="flex flex-wrap items-center gap-2 md:space-x-4 p-4 md:p-6 border-t border-glow bg-[#181824]/80 rounded-b-2xl">
                                <Button
                                    variant="ghost"
                                    className="btn-glow text-[var(--light-gray)] hover:text-[var(--neon-green)]"
                                    onClick={() => {
                                        if (!user) return alert('请先登录后再点赞');
                                        if (window.__likeLock) return;
                                        window.__likeLock = true;
                                        toggleLike(thread.id, false);
                                        setTimeout(() => { window.__likeLock = false; }, 1000);
                                    }}
                                    disabled={!user}
                                >
                                    <ThumbsUp size={20} className="mr-2" />
                                    <span>{thread.likes}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="btn-glow text-[var(--light-gray)] hover:text-[var(--neon-pink)]"
                                    onClick={() => {
                                        if (!user) return alert('请先登录后再点踩');
                                        if (window.__dislikeLock) return;
                                        window.__dislikeLock = true;
                                        toggleDislike(thread.id, false);
                                        setTimeout(() => { window.__dislikeLock = false; }, 1000);
                                    }}
                                    disabled={!user}
                                >
                                    <ThumbsDown size={20} className="mr-2" />
                                    <span>{thread.dislikes}</span>
                                </Button>
                    <span className="flex items-center space-x-2 text-[var(--light-gray)]">
                        <MessageCircle size={20} />
                        <span>{thread.replies.length}</span>
                    </span>
                </footer>
            </article>

            <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold neon-text" id="replies-heading">回复 ({thread.replies.length})</h2>
                {sortedReplies.length === 0 ? (
                    <div className="text-center text-[var(--light-gray)] py-8 opacity-70">暂无回复，快来抢沙发吧！</div>
                ) : (
                    sortedReplies.map(reply => (
                        <ReplyItem
                            key={reply.id}
                            reply={reply}
                            users={users}
                            setView={setView}
                            toggleLike={(id: number) => toggleLike(thread.id, true, id)}
                            toggleDislike={(id: number) => toggleDislike(thread.id, true, id)}
                            user={user}
                            setReplyToId={setReplyToId}
                            replyRef={replyRef}
                        />
                    ))
                )}
            </div>
                {/* 已用上方 div 包裹，无需重复结构，去除多余标签 */}

            {user && (
                <div className="mt-8 space-y-4 bg-[#181824]/70 rounded-xl p-4 shadow-lg">
                    <h3 className="text-xl md:text-2xl font-bold neon-text-pink">发表回复</h3>
                    {replyToId && (
                        <div className="p-2 glass-effect border-glow rounded-md flex items-center justify-between text-[var(--light-gray)]">
                            <span>正在回复 ID 为 {replyToId} 的评论...</span>
                            <button className="p-0 h-auto bg-transparent border-none text-[var(--light-gray)] hover:text-[var(--neon-pink)]" onClick={() => setReplyToId(null)}>取消</button>
                        </div>
                    )}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <button type="button" className="ml-2 text-[var(--neon-blue)] text-sm px-2 py-1 rounded hover:bg-[#232946] border border-[var(--neon-blue)]/40" onClick={()=>setShowEmoji(v=>!v)}>
                                {showEmoji ? '关闭表情' : '😀 表情'}
                            </button>
                        </div>
                        {showEmoji && (
                            <div className="flex flex-wrap gap-1 p-2 bg-[#232946] border border-[var(--neon-blue)] rounded mb-2 max-w-xs animate-fade-in">
                                {emojiList.map(e=>(
                                    <button key={e} type="button" className="text-2xl hover:scale-125 transition-all" onClick={()=>insertEmoji(e)}>{e}</button>
                                ))}
                            </div>
                        )}
                        <Textarea
                            ref={replyRef}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="输入你的回复... 支持图片/视频URL，支持Markdown/表情/颜文字格式。"
                            className="glass-effect border-glow text-[var(--foreground)] h-24 md:h-32 custom-scrollbar"
                            aria-label="回复内容"
                            maxLength={500}
                            disabled={!user || isReplying}
                            onKeyDown={e => { if(e.ctrlKey && e.key==='Enter'){ handleReply(); }}}
                        />
                        <div className="flex items-center justify-between text-xs text-[var(--light-gray)]">
                            <span>{replyContent.length}/500 字符</span>
                            <div className="space-x-2">
                                <button type="button" className="text-[var(--neon-blue)] hover:underline" onClick={() => setPreview(v => !v)}>{preview ? '关闭预览' : '实时预览'}</button>
                                {!user && <span className="text-red-400">请登录后才能回复</span>}
                            </div>
                        </div>
                        {preview && (
                            <div className="mt-2 p-2 rounded bg-[#232946] border border-[var(--neon-blue)] text-white text-sm">
                                {/* 简单图片/视频/Markdown预览 */}
                                {/^(https?:\/\/).+\.(jpg|jpeg|png|gif|webp)$/i.test(replyContent.trim()) ? (
                                    <img src={replyContent.trim()} alt="预览图片" className="max-w-full rounded" />
                                ) : /^(https?:\/\/).+\.(mp4|webm|ogg)$/i.test(replyContent.trim()) ? (
                                    <video src={replyContent.trim()} controls className="max-w-full rounded" />
                                ) : (
                                    <span style={{whiteSpace:'pre-wrap'}}>{replyContent}</span>
                                )}
                            </div>
                        )}
                        <button
                            onClick={handleReply}
                            className="btn-glow bg-[var(--neon-blue)] text-[var(--dark-blue)] hover:bg-[var(--neon-pink)] hover:text-[var(--foreground)] w-full md:w-auto py-2 px-4 rounded border-glow disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="提交回复"
                            disabled={!user || !replyContent.trim() || isReplying}
                        >
                            {isReplying ? '提交中...' : '提交回复'}
                        </button>
                    </div>
                </div>
            )}
            {/* 打赏作者区块 */}
            <div className="mt-8 flex justify-center">
                <div className="w-full max-w-xs">
                    <DonateAuthor />
                </div>
            </div>
    </main>
    );
}
