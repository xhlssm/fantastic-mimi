'use client';
import { useStore, Thread } from '@/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageCircle, ThumbsUp, ThumbsDown, Clock, Tag, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { isImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '../ui/button';

interface ThreadCardProps {
    thread: Thread;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
    const { users, setView, toggleLike, toggleDislike, repostThread } = useStore();
    const author = users.find(u => u.id === thread.authorId);

    const hasImage = isImageUrl(thread.content);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleLike(thread.id, false);
    };

    const handleDislike = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleDislike(thread.id, false);
    };

    const handleRepost = (e: React.MouseEvent) => {
        e.stopPropagation();
        repostThread(thread.id);
    };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <Card
                    className="glass-effect border-glow card-hover cursor-pointer transition-all duration-300 rounded-2xl hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_64px_#00e4ffcc,0_4px_32px_#ff00cc33] hover:border-[var(--neon-blue)]/80 hover:bg-gradient-to-br hover:from-[var(--neon-blue)]/10 hover:to-[var(--neon-pink)]/10"
                    style={{backdropFilter:'blur(10px)', border:'1.5px solid #00e4ff44', boxShadow:'0 2px 32px 0 #00e4ff22'}}
                    onClick={() => setView('forum', thread.id)}
                >
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-glow">
                        <div className="flex items-center space-x-3">
                            <Image src={author?.avatarUrl || '/avatars/default.png'} alt={author?.username || '未知'} width={40} height={40} className="rounded-full border-glow" />
                            <div>
                                <h4 className="font-bold neon-text text-lg flex items-center gap-2">{thread.title}
                                    {thread.tags && thread.tags.length > 0 && (
                                        <span className="flex flex-wrap gap-1 ml-2">
                                            {thread.tags.map((tag, idx) => (
                                                <span
                                                    key={tag+idx}
                                                    className="relative border border-transparent bg-gradient-to-r from-[var(--neon-blue)]/30 to-[var(--neon-pink)]/30 text-[var(--neon-blue)] px-2 py-0.5 rounded-full text-xs font-extrabold shadow-[0_0_16px_#00e4ff77] transition-all duration-200 hover:bg-gradient-to-r hover:from-[var(--neon-pink)]/40 hover:to-[var(--neon-blue)]/40 hover:text-white hover:shadow-[0_0_40px_#00e4ffcc] hover:scale-110 before:content-[''] before:absolute before:inset-0 before:rounded-full before:blur-[6px] before:bg-[conic-gradient(from_0deg_at_50%_50%,#00e4ff_0%,#ff00cc_50%,#00e4ff_100%)] before:animate-spin-slow before:opacity-60 before:-z-10"
                                                    style={{
                                                        letterSpacing:'0.5px',
                                                        boxShadow:'0 0 0 2px #00e4ff55, 0 0 16px 2px #00e4ff44, inset 0 0 12px 0 #1a1a2e',
                                                        background: 'linear-gradient(90deg, #00e4ff33 0%, #ff00cc33 100%)',
                                                        transition: 'box-shadow 0.2s, background 0.2s, transform 0.2s'
                                                    }}
                                                >
                                                    <span className="animate-pulse text-[var(--neon-blue)] drop-shadow-[0_0_4px_#00e4ff] font-bold">#</span>{tag}
                                                </span>
                                            ))}
                                        </span>
                                    )}
                                </h4>
                                <p className="text-sm text-[var(--light-gray)] flex items-center space-x-2">
                                    <span>{author?.username || '未知用户'}</span>
                                    <Badge className="border-glow bg-transparent text-[var(--neon-blue)]">{author?.title}</Badge>
                                    {thread.type === 'mission' && <Badge className="border-glow neon-text-pink">任务</Badge>}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center text-[var(--light-gray)] text-sm space-x-4">
                            <span className="flex items-center space-x-1">
                                <Clock size={16} className="text-[var(--neon-blue)]" />
                                <span>{formatDistanceToNow(new Date(thread.timestamp), { addSuffix: true, locale: {
                                    formatDistance: (token, count) => {
                                        if (token === 'xSeconds') return '几秒前';
                                        if (token === 'xMinutes') return `${count}分钟前`;
                                        if (token === 'xHours') return `${count}小时前`;
                                        if (token === 'xDays') return `${count}天前`;
                                        if (token === 'xWeeks') return `${count}周前`;
                                        if (token === 'xMonths') return `${count}月前`;
                                        if (token === 'xYears') return `${count}年前`;
                                        return '';
                                    }
                                } })}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <MessageCircle size={16} className="text-[var(--neon-blue)]" />
                                <span>{thread.replies.length}</span>
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4 rounded-xl border border-[var(--neon-blue)]/30 bg-[rgba(20,30,60,0.60)] shadow-[0_0_32px_#00e4ff33]">
                        <p className="text-[var(--light-gray)] line-clamp-2">
                            {thread.content.length > 200 ? `${thread.content.substring(0, 200)}...` : thread.content}
                        </p>
                        {hasImage && (
                            <div className="relative w-full h-48 rounded-md overflow-hidden glass-effect border-glow">
                                <Image src={thread.content} alt="Thread image" layout="fill" objectFit="cover" />
                            </div>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-[var(--light-gray)]">
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-green-500/10" onClick={handleLike}>
                                <ThumbsUp size={16} className="text-[var(--neon-green)]" />
                                <span>{thread.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-pink-500/10" onClick={handleDislike}>
                                <ThumbsDown size={16} className="text-[var(--neon-pink)]" />
                                <span>{thread.dislikes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-blue-500/10" onClick={handleRepost}>
                                <Repeat size={16} className="text-[var(--neon-blue)]" />
                                <span>{thread.reposts}</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
}
