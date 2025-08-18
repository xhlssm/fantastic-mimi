'use client';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Server, Users, Rss } from 'lucide-react';

export default function WidgetPanel() {
  const { user, users, threads, instances, currentInstanceId, switchInstance } = useStore();
  const currentInstance = instances[currentInstanceId];

  if (!user) return null;

  return (
    <aside className="h-screen sticky top-0 flex flex-col bg-[#1a1a2e]/50 backdrop-blur-xl border-l border-white/10 p-4 space-y-4">
      {/* 个人资料卡 */}
      <Card className="bg-white/5 border-none">
        <CardHeader className="p-4">
          <div className="flex items-center space-x-3">
            <Image src={user.avatarUrl} alt={user.username} width={48} height={48} className="rounded-full" />
            <div>
              <CardTitle className="text-base text-white">{user.username}</CardTitle>
              <p className="text-xs text-white/50">{user.title}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-xs text-white/70">
          <p>{user.bio}</p>
        </CardContent>
      </Card>

      {/* 实例信息卡 */}
      <Card className="bg-white/5 border-none">
        <CardHeader className="p-4">
          <CardTitle className="text-base text-white flex items-center"><Server className="w-4 h-4 mr-2" />实例信息</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-sm text-white/70 space-y-2">
          <div className="flex justify-between"><span>实例名:</span> <span className="font-bold">{currentInstance.name}</span></div>
          <div className="flex justify-between"><span>用户数:</span> <span className="font-bold">{users.length}</span></div>
          <div className="flex justify-between"><span>帖子数:</span> <span className="font-bold">{threads.length}</span></div>
        </CardContent>
      </Card>
      
      {/* 实例切换器 */}
       <Card className="bg-white/5 border-none">
        <CardHeader className="p-4">
          <CardTitle className="text-base text-white flex items-center"><Rss className="w-4 h-4 mr-2" />切换实例</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {Object.values(instances).map(instance => (
            <Button
              key={instance.id}
              variant="ghost"
              className={`w-full justify-start text-left h-auto p-2 ${currentInstanceId === instance.id ? 'bg-white/10' : 'hover:bg-white/10'}`}
              onClick={() => switchInstance(instance.id)}
            >
              <div className="text-white">{instance.name}</div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
