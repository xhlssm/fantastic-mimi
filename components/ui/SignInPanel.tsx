import React, { useState } from 'react';

const today = new Date().toLocaleDateString();

const getSignInStatus = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('signedIn') === today;
};

const setSignInStatus = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('signedIn', today);
};

const SignInPanel: React.FC = () => {
  const [signedIn, setSignedIn] = useState(getSignInStatus());
  const [msg, setMsg] = useState('');
  // ================= 导入区 =================
  // ...existing code...
  // ================= 组件实现 =================

  const handleSignIn = () => {
    setSignInStatus();
    setSignedIn(true);
    setMsg('签到成功，获得成长值+1！');
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#232946] to-[#181824] border border-[#00e4ff] rounded-2xl px-6 py-3 shadow-lg flex flex-col items-center animate-fade-in">
      <div className="text-lg font-bold text-[var(--neon-blue)] mb-1">每日签到</div>
      <div className="text-white mb-2">{signedIn ? '今日已签到' : '点击签到领取成长值'}</div>
      <button
        className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#00e4ff] to-[#ff00ff] text-white font-bold shadow hover:from-[#00bfff] hover:to-[#ff88ff] disabled:opacity-60"
        onClick={handleSignIn}
        disabled={signedIn}
      >
        {signedIn ? '已签到' : '签到'}
      </button>
      {msg && <div className="mt-2 text-green-400 text-sm">{msg}</div>}
    </div>
  );
};

export default SignInPanel;
