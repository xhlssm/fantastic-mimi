'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'dompurify';

interface Reply {
  id: number;
  content: string;
  authorId: number;
  timestamp: number;
  likes: number;
  dislikes: number;
  replies?: Reply[];
}

interface User {
  id: number;
  username: string;
  avatarUrl: string;
  title?: string;
  reputation?: number;
}

interface ReplyCardProps {
  reply: Reply;
  author: User;
  currentUser?: User | null;
  onLike?: (replyId: number) => void;
  onDislike?: (replyId: number) => void;
  onReply?: (replyId: number) => void;
  onUserClick?: (username: string) => void;
  level?: number;
}

export default function ReplyCard({ 
  reply, 
  author, 
  currentUser, 
  onLike, 
  onDislike, 
  onReply, 
  onUserClick,
  level = 0 
}: ReplyCardProps) {
  const safeContent = DOMPurify.sanitize(reply.content, { USE_PROFILES: { html: true } });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(reply.id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDislike?.(reply.id);
  };

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReply?.(reply.id);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUserClick?.(author.username);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: level * 0.1 }}
      className="w-full"
    >
      <Card className={`border-l-4 ${level === 0 ? 'border-l-blue-500' : 'border-l-gray-300'} hover:shadow-md transition-shadow`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={author.avatarUrl} alt={author.username} />
              <AvatarFallback>{author.username.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleUserClick}
                    className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {author.username}
                  </button>
                  {author.title && (
                    <Badge variant="outline" className="text-xs">
                      {author.title}
                    </Badge>
                  )}
                  {author.reputation !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      声望: {author.reputation}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={14} />
                  <span>{formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
                {HTMLReactParser(safeContent)}
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={!currentUser}
                  className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                >
                  <ThumbsUp size={16} className="mr-1" />
                  <span>{reply.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDislike}
                  disabled={!currentUser}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <ThumbsDown size={16} className="mr-1" />
                  <span>{reply.dislikes}</span>
                </Button>
                
                {currentUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReply}
                    className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <MessageCircle size={16} className="mr-1" />
                    回复
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* 嵌套回复 */}
          {reply.replies && reply.replies.length > 0 && (
            <div className="ml-12 mt-4 space-y-3">
              {reply.replies.map((nestedReply) => {
                const nestedAuthor = author; // 在实际应用中，这里应该根据authorId查找对应的用户
                return (
                  <ReplyCard
                    key={nestedReply.id}
                    reply={nestedReply}
                    author={nestedAuthor}
                    currentUser={currentUser}
                    onLike={onLike}
                    onDislike={onDislike}
                    onReply={onReply}
                    onUserClick={onUserClick}
                    level={level + 1}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
