import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Check, Tag, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Subtask {
  id: number;
  description: string;
  completed: boolean;
}

interface MissionDetails {
  reward: number;
  subtasks: Subtask[];
  submittedSolution?: string;
  isApproved?: boolean;
}

interface MissionCardProps {
  missionDetails: MissionDetails;
  user: any;
  thread: any;
  missionSolution: string;
  setMissionSolution: (v: string) => void;
  updateMissionSubtask: any;
  submitMissionSolution: any;
  approveMission: any;
}


const MissionCard = ({ missionDetails, user, thread, missionSolution, setMissionSolution, updateMissionSubtask, submitMissionSolution, approveMission }: MissionCardProps) => {
  return (
    <Card className="glass-effect-strong border-glow mt-4">
      <CardHeader className="p-4 border-b border-glow">
        <CardTitle className="text-xl flex items-center space-x-2 neon-text">
          <Tag className="text-[var(--neon-blue)]" /><span>任务详情</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Star className="text-[var(--neon-green)]" />
          </motion.div>
          <span className="font-bold neon-text-green">奖励：</span>
          <span className="neon-text-green text-lg">{missionDetails.reward} 声望</span>
        </div>
        <div className="space-y-2">
          <div className="font-bold neon-text">任务目标：</div>
          <ul className="list-disc list-inside text-[var(--light-gray)] space-y-1">
            {missionDetails.subtasks.map(subtask => (
              <li key={subtask.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => user?.id === thread.authorId && updateMissionSubtask(thread.id, subtask.id, !subtask.completed)}
                  className="accent-[var(--neon-blue)] cursor-pointer"
                  disabled={user?.id !== thread.authorId}
                />
                <span className={subtask.completed ? 'line-through text-[var(--light-gray)]/50' : ''}>{subtask.description}</span>
              </li>
            ))}
          </ul>
        </div>
        {user?.id !== thread.authorId && !missionDetails.submittedSolution && (
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="提交你的解决方案链接或文本"
              value={missionSolution}
              onChange={e => setMissionSolution(e.target.value)}
              className="glass-effect border-glow text-[var(--foreground)]"
            />
            <Button onClick={() => submitMissionSolution(thread.id, missionSolution)} className="btn-glow bg-[var(--neon-pink)] text-[var(--dark-blue)] hover:bg-[var(--neon-blue)] hover:text-[var(--foreground)]"><Play className="mr-2" /> 提交解决方案</Button>
          </div>
        )}
        {missionDetails.submittedSolution && (
          <div className="glass-effect border-glow p-4 rounded-md">
            <div className="font-bold neon-text-green">已提交的解决方案：</div>
            <div className="text-[var(--light-gray)] break-words">{missionDetails.submittedSolution}</div>
            {user?.id === thread.authorId && !missionDetails.isApproved && (
              <Button onClick={() => approveMission(thread.id)} className="mt-4 btn-glow bg-[var(--neon-blue)] text-[var(--dark-blue)] hover:bg-[var(--neon-pink)] hover:text-[var(--foreground)]"><Check className="mr-2" /> 批准并奖励</Button>
            )}
            {missionDetails.isApproved && (
              <div className="mt-4 neon-text-green font-bold">任务已批准，奖励已发放！</div>
            )}
          </div>
        )}
        {thread.isCompleted && <div className="neon-text-green font-bold mt-4">任务已完成！</div>}
      </CardContent>
    </Card>
  );
};

export default React.memo(MissionCard);
