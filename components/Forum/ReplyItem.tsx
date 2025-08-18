// 解决 window.__likeReplyLock/__dislikeReplyLock TS 报错
declare global {
  interface Window {
    __likeReplyLock?: boolean;
    __dislikeReplyLock?: boolean;
  }
}
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'dompurify';
import { isImageUrl } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import React, { useCallback, useMemo } from 'react';

interface Reply {
  id: number;
  content: string;
  authorId: number;
  timestamp: number;
  likes: number;
  dislikes: number;
  replies: Reply[];
}

interface User {
  id: number;
  username: string;
  avatarUrl: string;
}

interface ReplyItemProps {
  reply: Reply;
  users: User[];
  setView: any;
  toggleLike: any;
  toggleDislike: any;
  user: any;
  setReplyToId: any;
  replyRef: any;
}

const ReplyItem = ({ reply, users, setView, toggleLike, toggleDislike, user, setReplyToId, replyRef }: ReplyItemProps) => {
  const replyAuthor = users.find(u => u.id === reply.authorId);
  const safeContent = DOMPurify.sanitize(reply.content, { USE_PROFILES: { html: true } });
  const isContentImage = isImageUrl(safeContent);

  const handleReply = useCallback(() => {
    setReplyToId(reply.id);
    replyRef.current?.focus();
  }, [reply.id, setReplyToId, replyRef]);

  // useMemo 排序递归 replies
  const sortedReplies = useMemo(() => reply.replies.slice().sort((a, b) => a.timestamp - b.timestamp), [reply.replies]);

  return (
    <motion.div
      key={reply.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
  className="glass-effect border-glow p-4 rounded-lg space-y-2"
    >
      <div className="flex items-center space-x-3">
        <Image src={replyAuthor?.avatarUrl || '/avatars/default.png'} alt={replyAuthor?.username || '未知'} width={32} height={32} className="rounded-full border-glow" />
        <div>
          <span className="font-bold neon-text cursor-pointer hover:underline" onClick={() => setView('profile', replyAuthor?.username)}>{replyAuthor?.username || '未知用户'}</span>
          <div className="text-xs text-[var(--light-gray)] flex items-center space-x-1">
            <Clock size={12} className="text-[var(--neon-blue)]" />
            <span>{formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true, locale: {
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
          </div>
        </div>
      </div>
      <div className="pl-10">
        <div className="markdown-content text-[var(--foreground)]">
          {isContentImage ? <img src={safeContent} alt="Reply image" className="glass-effect border-glow" /> : HTMLReactParser(safeContent)}
        </div>
      </div>
      <div className="flex items-center space-x-4 text-sm text-[var(--light-gray)] pl-10">
        <Button
          variant="ghost"
          className="btn-glow p-0 h-auto text-[var(--light-gray)] hover:text-[var(--neon-green)]"
          onClick={() => {
            if (!user) return alert('请先登录后再点赞');
            if (window.__likeReplyLock) return;
            window.__likeReplyLock = true;
            toggleLike(reply.id, true);
            setTimeout(() => { window.__likeReplyLock = false; }, 1000);
          }}
          disabled={!user}
        >
          <ThumbsUp size={16} className="mr-1" />
          <span>{reply.likes}</span>
        </Button>
        <Button
          variant="ghost"
          className="btn-glow p-0 h-auto text-[var(--light-gray)] hover:text-[var(--neon-pink)]"
          onClick={() => {
            if (!user) return alert('请先登录后再点踩');
            if (window.__dislikeReplyLock) return;
            window.__dislikeReplyLock = true;
            toggleDislike(reply.id, true);
            setTimeout(() => { window.__dislikeReplyLock = false; }, 1000);
          }}
          disabled={!user}
        >
          <ThumbsDown size={16} className="mr-1" />
          <span>{reply.dislikes}</span>
        </Button>
        {user && (
          <Button variant="ghost" className="btn-glow p-0 h-auto text-[var(--light-gray)] hover:text-[var(--neon-blue)]" onClick={handleReply}>
            回复
          </Button>
        )}
      </div>
      {sortedReplies.length > 0 && (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-[var(--neon-blue)]/30 pl-4 glass-effect">
          {sortedReplies.map(r => (
            <ReplyItem
              key={r.id}
              reply={r}
              users={users}
              setView={setView}
              toggleLike={toggleLike}
              toggleDislike={toggleDislike}
              user={user}
              setReplyToId={setReplyToId}
              replyRef={replyRef}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(ReplyItem);
