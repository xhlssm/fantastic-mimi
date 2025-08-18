'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Trophy, 
  ShoppingCart, 
  Star, 
  Shield, 
  Search,
  Upload,
  Vote,
  Award,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  SkipForward
} from 'lucide-react';

interface GuideStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "欢迎来到上王终端",
    description: "这是一个集论坛、社交、游戏于一体的综合性平台",
    icon: <Home className="w-12 h-12 text-[#00E4FF]" />,
    features: ["现代化界面设计", "流畅的用户体验", "丰富的功能模块"]
  },
  {
    id: 2,
    title: "论坛交流",
    description: "在这里分享你的想法，参与讨论，结识志同道合的朋友",
    icon: <MessageSquare className="w-12 h-12 text-[#FF00FF]" />,
    features: ["发帖讨论", "回复互动", "话题分类", "内容审核"]
  },
  {
    id: 3,
    title: "派系系统",
    description: "加入不同的派系，参与团队活动，提升声望",
    icon: <Users className="w-12 h-12 text-[#00FF88]" />,
    features: ["派系管理", "团队协作", "声望系统", "等级晋升"]
  },
  {
    id: 4,
    title: "排行榜",
    description: "查看个人和派系声望排名，展示你的成就",
    icon: <Trophy className="w-12 h-12 text-[#FFD700]" />,
    features: ["个人排名", "派系排名", "实时更新", "成就展示"]
  },
  {
    id: 5,
    title: "商店系统",
    description: "使用声望购买道具，提升你的游戏体验",
    icon: <ShoppingCart className="w-12 h-12 text-[#8B5CF6]" />,
    features: ["道具商店", "声望消费", "限时商品", "收藏系统"]
  },
  {
    id: 6,
    title: "成就系统",
    description: "完成各种任务，获得成就徽章和奖励",
    icon: <Star className="w-12 h-12 text-[#FFA500]" />,
    features: ["任务系统", "成就徽章", "奖励机制", "进度追踪"]
  },
  {
    id: 7,
    title: "管理员功能",
    description: "管理员可以管理用户、内容审核、系统设置",
    icon: <Shield className="w-12 h-12 text-[#FF6B6B]" />,
    features: ["用户管理", "内容审核", "系统设置", "数据统计"]
  },
  {
    id: 8,
    title: "高级功能",
    description: "体验更多高级功能，提升你的使用体验",
    icon: <Search className="w-12 h-12 text-[#00E4FF]" />,
    features: ["智能搜索", "附件上传", "投票系统", "悬赏功能"]
  }
];

interface GuideSystemProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function GuideSystem({ isVisible, onClose }: GuideSystemProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % guideSteps.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % guideSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + guideSteps.length) % guideSteps.length);
  };

  const startAutoPlay = () => {
    setIsPlaying(true);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(guideSteps.length - 1);
    setIsPlaying(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <Card className="relative w-full max-w-4xl glass-effect-strong border-[#00E4FF]/50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isPlaying ? stopAutoPlay : startAutoPlay}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                {isPlaying ? <SkipForward className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipToEnd}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                跳过
              </Button>
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold neon-text">
            {guideSteps[currentStep].title}
          </CardTitle>
          
          <div className="flex justify-center mt-4">
            {guideSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-[#00E4FF] scale-125' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                {guideSteps[currentStep].icon}
              </div>
              
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
                {guideSteps[currentStep].description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {guideSteps[currentStep].features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="w-2 h-2 bg-[#00E4FF] rounded-full" />
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-[#00E4FF]/30 text-[#00E4FF] hover:bg-[#00E4FF]/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              上一步
            </Button>
            
            <span className="text-white/50 text-sm">
              {currentStep + 1} / {guideSteps.length}
            </span>
            
            <Button
              variant="outline"
              onClick={nextStep}
              disabled={currentStep === guideSteps.length - 1}
              className="border-[#00E4FF]/30 text-[#00E4FF] hover:bg-[#00E4FF]/10 disabled:opacity-50"
            >
              下一步
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          {currentStep === guideSteps.length - 1 && (
            <div className="mt-6">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white hover:from-[#00E4FF]/90 hover:to-[#FF00FF]/90 btn-glow"
              >
                开始探索
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

