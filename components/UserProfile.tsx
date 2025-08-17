
import { useStore, User } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageCircle, Edit2, Wand2, SunMoon, Monitor, Sparkles, Zap, Book, Paintbrush, UserPlus, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Card3D from './ui/Card3D';

export default function UserProfile({ username }: { username: string }) {
  // ================= 状态与store区 =================
  const { users, user: currentUser, setView, updateUser, threads } = useStore();
  const [editMode, setEditMode] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [theme, setTheme] = useState('default');
  const [activeStep, setActiveStep] = useState(0);
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const [activity] = useState(Math.floor(Math.random()*100));
  // ====== 个人成就/打赏等静态数据 ======
  const [donateHistory] = useState([
    { date: '2025-08-01', amount: 20 },
    { date: '2025-07-20', amount: 10 },
    { date: '2025-07-01', amount: 5 },
  ]);
  const [achievements] = useState([
    '未来先锋', '社区达人', '打赏之星', 'AI体验官'
  ]);
  const [equippedAchievement, setEquippedAchievement] = useState('未来先锋');
  const allAchievements = [
    '未来先锋', '社区达人', '打赏之星', 'AI体验官', '签到王', '任务达人', '派系领袖', '热心解答', '内容创作者', 'BUG猎人'
  ];

  // ================= 生命周期/副作用区 =================
  useEffect(() => { setIsClient(true); }, []);
  const profileUser = users.find(u => u.username === username);
  useEffect(() => {
    if (profileUser) {
      setEditedBio(profileUser.bio);
      setEditedAvatar(profileUser.avatarUrl);
    }
  }, [profileUser]);
  useEffect(() => {
    if (profileUser && profileUser.equippedAchievement) {
      setEquippedAchievement(profileUser.equippedAchievement);
    }
  }, [profileUser]);
  useEffect(()=>{
    if(editMode) {
      const timer = setTimeout(()=>{
        if(currentUser?.id===profileUser?.id) {
          updateUser({ bio: editedBio, avatarUrl: editedAvatar });
          setAutoSaveMsg('已自动保存');
          setTimeout(()=>setAutoSaveMsg(''), 1200);
        }
      }, 1200);
      return ()=>clearTimeout(timer);
    }
  },[editedBio,editedAvatar]);

  // ================= 空状态处理 =================
  if (!isClient || !profileUser) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 text-[#B0B0CC]">用户未找到。</motion.div>;
  }

  // ================= 事件处理区 =================
  const handleSave = () => {
    if (currentUser?.id === profileUser.id) {
      updateUser({ bio: editedBio, avatarUrl: editedAvatar });
      setEditMode(false);
    }
  };
  const isCurrentUserProfile = currentUser?.id === profileUser.id;
  const userThreads = threads.filter(t => t.authorId === profileUser.id).sort((a,b) => b.timestamp - a.timestamp);
  const renderFactionIcon = (faction: string) => {
    switch (faction) {
      case '开发组': return <Code className="w-4 h-4 text-blue-400" />;
      case '剧情组': return <Book className="w-4 h-4 text-purple-400" />;
      case '艺术组': return <Paintbrush className="w-4 h-4 text-pink-400" />;
      case '自由人': return <UserPlus className="w-4 h-4 text-green-400" />;
      default: return null;
    }
  };
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setEditedAvatar(reader.result as string);
        setUploading(false);
        setAutoSaveMsg('头像已自动保存');
        setTimeout(()=>setAutoSaveMsg(''), 1500);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAIGenerate = async () => {
    setAiLoading(true);
    setTimeout(() => {
      setEditedAvatar('https://api.dicebear.com/7.x/bottts/svg?seed='+profileUser.username);
      setAiLoading(false);
      setAutoSaveMsg('AI头像已生成并自动保存');
      setTimeout(()=>setAutoSaveMsg(''), 1500);
    }, 1800);
  };
  const handleTheme = (t: string) => {
    setTheme(t);
    document.body.className = t;
  };
  const steps = [
    { label: '编辑简介', render: <Textarea value={editedBio} onChange={e=>setEditedBio(e.target.value)} className="bg-[#2B2B4A] border-[#00E4FF]" maxLength={100} /> },
    { label: '编辑头像', render: <div className="flex gap-2 items-center"><Input type="file" accept="image/*" onChange={handleAvatarUpload} className="bg-[#2B2B4A] border-[#00E4FF]" /><Button onClick={handleAIGenerate} disabled={aiLoading} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white ml-2"><Wand2 className="w-4 h-4 mr-1" />{aiLoading?'生成中...':'AI生成'}</Button></div> },
  ];

  // ================= 渲染区 =================
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <Card3D className="w-full">
        <Card className={`bg-transparent backdrop-blur-md border-[#2B2B4A] shadow-lg transition-all duration-700 ${theme==='cyberpunk'?'neon-glow':' '} ${theme==='dark'?'bg-[#181824]/80':''} ${theme==='high-contrast'?'border-yellow-400':''}`}>
          <CardContent className="flex flex-col md:flex-row items-center md:items-start p-8 space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0 relative w-32 h-32 group">
              <Image src={editedAvatar||profileUser.avatarUrl||'https://via.placeholder.com/150?text=Avatar'} alt={profileUser.username} width={128} height={128} className="rounded-full border-4 border-[#00E4FF] group-hover:scale-105 transition-all duration-300" onError={e=>{e.currentTarget.src='https://via.placeholder.com/150?text=No+Image';}} />
              {isCurrentUserProfile && editMode && (
                <>
                  <Input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" title="上传头像" />
                  <Button size="sm" className="absolute bottom-0 right-0 bg-[var(--neon-blue)] hover:bg-[var(--neon-pink)] text-white rounded-full shadow" onClick={handleAIGenerate} disabled={aiLoading}><Wand2 className="w-4 h-4" /></Button>
                </>
              )}
              {uploading && <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 text-white text-xs animate-pulse">上传中...</span>}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <h2 className="text-3xl font-bold text-white animate-gradient-text bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] bg-clip-text text-transparent">{profileUser.username}</h2>
                <span className="text-xs text-[#B0B0CC] bg-[#2B2B4A] px-2 py-1 rounded-full">{profileUser.title}</span>
                {profileUser.isAdmin && <Badge className="bg-red-600">管理员</Badge>}
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 text-yellow-400">
                <Star size={18} className="animate-bounce" />
                <span>{profileUser.reputation} 声望</span>
              </div>
              {profileUser.faction && (
                <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 text-[#B0B0CC]">
                  {renderFactionIcon(profileUser.faction)}
                  <span>{profileUser.faction} 派系</span>
                </div>
              )}
              {/* 活跃度动画条 */}
              <div className="mt-2">
                <div className="text-xs text-[#B0B0CC] mb-1 flex items-center gap-1"><Zap className="w-3 h-3 text-green-400 animate-pulse" />活跃度</div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] animate-pulse-slow" style={{width: `${activity}%`}} />
                </div>
              </div>
              <div className="mt-4 text-[#B0B0CC] space-y-2">
                {editMode ? (
                  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} key={activeStep} className="space-y-2">
                    <div className="mb-2 font-bold text-white">{steps[activeStep].label}</div>
                    {steps[activeStep].render}
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={()=>setActiveStep(s=>Math.max(0,s-1))} disabled={activeStep===0}>上一步</Button>
                      <Button size="sm" onClick={()=>setActiveStep(s=>Math.min(steps.length-1,s+1))} disabled={activeStep===steps.length-1}>下一步</Button>
                      <Button size="sm" onClick={()=>{setEditMode(false);setActiveStep(0);}} variant="secondary">完成</Button>
                    </div>
                    {autoSaveMsg && <div className="text-xs text-green-400 animate-fade-in mt-2">{autoSaveMsg}</div>}
                  </motion.div>
                ) : (
                  <p>{profileUser.bio}</p>
                )}
              </div>
              <div className="mt-6 flex justify-center md:justify-start space-x-4">
                {isCurrentUserProfile && !editMode && (
                  <Button onClick={()=>{setEditMode(true);setActiveStep(0);}} className="bg-[#FF00FF] hover:bg-[#FF88FF] text-[#1A1A2E] animate-glow"><Edit2 className="mr-2" /> 编辑资料</Button>
                )}
                {currentUser && currentUser.id !== profileUser.id && (
                  <Button onClick={()=>setView('messages', profileUser.username)} className="bg-[#00E4FF] hover:bg-[#00BFFF] text-[#1A1A2E] animate-glow"><MessageCircle className="mr-2" /> 发送私信</Button>
                )}
              </div>
              {/* 主题切换 */}
              <div className="mt-4 flex gap-2 items-center">
                <span className="text-xs text-[#B0B0CC]">主题：</span>
                <Button size="sm" className="bg-[var(--neon-blue)] text-white rounded-full px-3 py-1" onClick={()=>handleTheme('default')}><Monitor className="w-4 h-4" />默认</Button>
                <Button size="sm" className="bg-[var(--neon-pink)] text-white rounded-full px-3 py-1" onClick={()=>handleTheme('cyberpunk')}><Sparkles className="w-4 h-4" />赛博</Button>
                <Button size="sm" className="bg-[#232946] text-white rounded-full px-3 py-1" onClick={()=>handleTheme('dark')}><SunMoon className="w-4 h-4" />暗色</Button>
                <Button size="sm" className="bg-black text-yellow-300 rounded-full px-3 py-1" onClick={()=>handleTheme('high-contrast')}>高对比</Button>
              </div>
              {/* 打赏历史/成就 */}
              <div className="mt-4">
                <div className="text-xs text-[#B0B0CC] mb-1">打赏历史</div>
                <div className="flex gap-2 flex-wrap">
                  {donateHistory.map(d=>(<span key={d.date} className="bounty-tag animate-glow">{d.date} ¥{d.amount}</span>))}
                </div>
                <div className="text-xs text-[#B0B0CC] mt-3 mb-1">成就</div>
                <div className="flex gap-2 flex-wrap">
                  {achievements.map(a=>(<span key={a} className="level-badge diamond animate-gradient-text">{a}</span>))}
                </div>
              </div>
              {/* 成就佩戴选择区块，仅本人可见 */}
              {isCurrentUserProfile && (
                <div className="mt-4">
                  <div className="text-xs text-[#B0B0CC] mb-1">选择佩戴的成就（聊天和资料页展示）</div>
                  <div className="flex gap-2 flex-wrap">
                    {allAchievements.map(a=>(
                      <button
                        key={a}
                        onClick={()=>setEquippedAchievement(a)}
                        className={`level-badge ${equippedAchievement===a?'diamond animate-glow':'silver'} transition border-2 ${equippedAchievement===a?'border-[var(--neon-blue)]':'border-transparent'}`}
                      >{a}</button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-green-400">当前佩戴：{equippedAchievement}</div>
                </div>
              )}
              {/* 动画反馈提示 */}
              <div className="mt-2">
                <span className="text-xs text-green-400 animate-fade-in">{autoSaveMsg}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Card3D>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
          <CardHeader>
            <CardTitle className="text-white text-xl">已发布的帖子</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userThreads.length > 0 ? (
              userThreads.map(thread => (
                <div key={thread.id} className="p-4 bg-[#2B2B4A] rounded-md transition-colors hover:bg-[#3D3D5A] cursor-pointer" onClick={() => setView('forum', thread.id)}>
                  <h4 className="text-lg font-bold text-[#00E4FF]">{thread.title}</h4>
                  <p className="text-sm text-[#B0B0CC] truncate">{thread.content.substring(0, 100)}...</p>
                </div>
              ))
            ) : (
              <p className="text-[#B0B0CC]">该用户尚未发布任何内容。</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
          <CardHeader>
            <CardTitle className="text-white text-xl">徽章</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profileUser.badges.length > 0 ? (
              profileUser.badges.map(badge => (
                <Badge key={badge} className="bg-[#00E4FF]/20 text-[#00E4FF] border border-[#00E4FF]">{badge}</Badge>
              ))
            ) : (
              <p className="text-[#B0B0CC]">该用户还没有获得任何徽章。</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
// ...existing code up to the correct function end...

// ========== 文件末尾所有多余和断裂的JSX片段已彻底移除 ==========

// ========== 底部所有多余和断裂的JSX片段已彻底移除 ==========

// ========== 移除底部所有多余和断裂的JSX片段，彻底修复结构 ==========
}
// ...existing code up to the correct return statement and function end...
