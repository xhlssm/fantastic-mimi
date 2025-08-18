'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Tag } from './Tag';

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
}

interface User {
  id: number;
  username: string;
  avatarUrl: string;
  title?: string;
}

interface PostCardProps {
  post: Post;
  author: User;
  onClick?: () => void;
}

export default function PostCard({ post, author, onClick }: PostCardProps) {
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    // TODO: 实现标签搜索功能
    console.log('Tag clicked:', tag);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="h-full border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={author.avatarUrl} alt={author.username} />
                <AvatarFallback>{author.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                  {post.title}
                  {post.isPinned && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      置顶
                    </Badge>
                  )}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {author.username}
                  </span>
                  {author.title && (
                    <Badge variant="outline" className="text-xs">
                      {author.title}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map((tag, index) => (
                <Tag
                  key={index}
                  text={tag}
                  variant={post.isHighlighted ? "highlight" : "normal"}
                  onClick={(e) => handleTagClick(e, tag)}
                />
              ))}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
            {post.content}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={14} />
                <span>{post.replies}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
