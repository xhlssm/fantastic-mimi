'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Trophy, Users, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompetitionExperience {
  id: number;
  name: string;
  year: number;
  role: string;
  achievement?: string;
}

interface UserCardProps {
  user: {
    id: number;
    username: string;
    email?: string;
    avatarUrl: string;
    bio?: string;
    title?: string;
    reputation?: number;
    joinDate?: Date;
    competitionExperiences?: CompetitionExperience[];
    followersCount?: number;
    followingCount?: number;
    postsCount?: number;
  };
  isCurrentUser?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onEditProfile?: () => void;
}

export default function UserCard({ 
  user, 
  isCurrentUser = false, 
  onFollow, 
  onMessage, 
  onEditProfile 
}: UserCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <Card className="border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback className="text-2xl">{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h2>
              {user.title && (
                <Badge variant="secondary" className="text-sm">
                  {user.title}
                </Badge>
              )}
              {user.reputation !== undefined && (
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                  <Trophy size={16} className="text-yellow-500" />
                  <span>声望: {user.reputation}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 个人简介 */}
          {user.bio && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <User size={16} className="mr-2" />
                个人简介
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}
          
          {/* 联系信息 */}
          {user.email && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Mail size={16} className="mr-2" />
                联系方式
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          )}
          
          {/* 加入时间 */}
          {user.joinDate && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Calendar size={16} className="mr-2" />
                加入时间
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(user.joinDate)}
              </p>
            </div>
          )}
          
          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.postsCount || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">帖子</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.followersCount || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">粉丝</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.followingCount || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">关注</div>
            </div>
          </div>
          
          {/* 参赛经历 */}
          {user.competitionExperiences && user.competitionExperiences.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Trophy size={16} className="mr-2" />
                参赛经历
              </h3>
              <div className="space-y-2">
                {user.competitionExperiences.map((experience) => (
                  <div
                    key={experience.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {experience.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {experience.year}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {experience.role}
                    </p>
                    {experience.achievement && (
                      <Badge variant="secondary" className="text-xs">
                        {experience.achievement}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex space-x-2 pt-2">
            {isCurrentUser ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onEditProfile}
                className="flex-1"
              >
                编辑资料
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onFollow}
                  className="flex-1"
                >
                  <Users size={16} className="mr-2" />
                  关注
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onMessage}
                  className="flex-1"
                >
                  <MessageSquare size={16} className="mr-2" />
                  私信
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
