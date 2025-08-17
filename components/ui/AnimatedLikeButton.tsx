// 炫酷点赞/打赏动画按钮，支持粒子爆炸、缩放、发光
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function AnimatedLikeButton({ onClick, liked }: { onClick: () => void, liked: boolean }) {
  const [showAnim, setShowAnim] = useState(false);
  const handleClick = () => {
    setShowAnim(true);
    onClick();
    setTimeout(()=>setShowAnim(false), 700);
  };
  return (
    <button onClick={handleClick} className={`relative p-2 rounded-full transition ${liked ? 'bg-pink-500/20' : 'bg-white/10'} hover:scale-110 focus:outline-none`}>
      <Heart className={`w-6 h-6 ${liked ? 'text-pink-500' : 'text-white/80'} drop-shadow`} fill={liked ? '#FF7EDB' : 'none'} />
      <AnimatePresence>
        {showAnim && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="block w-10 h-10 rounded-full bg-pink-400/30 animate-ping" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
