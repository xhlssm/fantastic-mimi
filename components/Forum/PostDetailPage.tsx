'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ReplyCard from './ReplyCard';
import { Tag } from './Tag';
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Share2, 
  Bookmark,
  Clock,
  Eye,
  Edit,
  Trash2,
  Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'dompurify';

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
  likes?: number;
}

interface User {
  id: number;
  username: string;
  avatarUrl: string;
  title?: string;
  reputation?: number;
}

interface Reply {
  id: number;
  content: string;
  authorId: number;
  timestamp: number;
  likes: number;
  dislikes: number;
  replies?: Reply[];
}

interface PostDetailPageProps {
  post: Post;
  author: User;
  replies: Reply[];
  currentUser?: User | null;
  onBack?: () => void;
  onLike?: (postId: number) => void;
  onReply?: (postId: number, content: string, parentReplyId?: number) => void;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onUserClick?: (username: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function PostDetailPage({
  post,
  author,
  replies,
  currentUser,
  onBack,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onUserClick,
  onTagClick
}: PostDetailPageProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const safeContent = DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } });

  const handleReply = async () => {
    if (!replyContent.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await onReply?.(post.id, replyContent, replyToId || undefined);
      setReplyContent('');
      setReplyToId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyToReply = (replyId: number) => {
    setReplyToId(replyId);
    // Focus on reply textarea
    document.getElementById('reply-textarea')?.focus();
  };

  const sortedReplies = replies.sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 返回按钮 */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft size={20} />
        <span>返回列表</span>
      </Button>

      {/* 帖子内容 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
                {post.isPinned && (
                  <Badge variant="secondary" className="ml-2">
                    置顶
                  </Badge>
                )}
                {post.isHighlighted && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    精华
                  </Badge>
                )}
              </h1>
              
              {/* 作者信息 */}
              <div className="flex items-center space-x-3 mb-4">
                <button
                  onClick={() => onUserClick?.(author.username)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={author.avatarUrl} alt={author.username} />
                    <AvatarFallback>{author.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {author.username}
                    </p>
                    {author.title && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {author.title}
                      </p>
                    )}
                  </div>
                </button>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={14} />
                  <span>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</span>
                </div>
              </div>

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Tag
                      key={index}
                      text={tag}
                      variant="normal"
                      onClick={() => onTagClick?.(tag)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-2">
              {currentUser && currentUser.id === author.id && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(post.id)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(post.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <Bookmark size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <Share2 size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 帖子内容 */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            {HTMLReactParser(safeContent)}
          </div>

          {/* 统计信息和互动按钮 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{post.views} 浏览</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={16} />
                <span>{post.replies} 回复</span>
              </div>
              {post.likes !== undefined && (
                <div className="flex items-center space-x-1">
                  <Heart size={16} />
                  <span>{post.likes} 点赞</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLike?.(post.id)}
                className="flex items-center space-x-1"
              >
                <Heart size={16} />
                <span>点赞</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 回复区域 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            回复 ({replies.length})
          </h2>
        </CardHeader>
        <CardContent>
          {/* 回复列表 */}
          <div className="space-y-4 mb-6">
            {sortedReplies.length > 0 ? (
              sortedReplies.map((reply) => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  author={author} // 在实际应用中，这里应该根据reply.authorId查找对应的用户
                  currentUser={currentUser}
                  onLike={(replyId) => {
                    // TODO: 实现回复点赞功能
                    console.log('Like reply:', replyId);
                  }}
                  onDislike={(replyId) => {
                    // TODO: 实现回复点踩功能
                    console.log('Dislike reply:', replyId);
                  }}
                  onReply={handleReplyToReply}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无回复，来发表第一个回复吧！
              </div>
            )}
          </div>

          {/* 回复输入框 */}
          {currentUser ? (
            <div className="space-y-4">
              {replyToId && (
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    正在回复 ID 为 {replyToId} 的评论
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyToId(null)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    取消
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                <Textarea
                  id="reply-textarea"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="写下你的回复..."
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {replyContent.length}/1000 字符
                  </span>
                  <Button
                    onClick={handleReply}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="flex items-center space-x-1"
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? '发送中...' : '发送回复'}</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              请登录后参与讨论
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
