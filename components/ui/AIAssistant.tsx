// AI助手问答入口，支持对话、摘要、翻译等
'use client';
import { useState } from 'react';
import { Bot, Send } from 'lucide-react';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: '你好，我是AI助手，有任何问题都可以问我！' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: 'user', text: input }]);
    setLoading(true);
    // 模拟AI回复
    setTimeout(() => {
      setMessages(msgs => [...msgs, { role: 'ai', text: '（AI回复示例）' }]);
      setLoading(false);
    }, 1200);
    setInput('');
  };

  return (
    <>
      <button onClick={()=>setOpen(o=>!o)} className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
        <Bot className="w-6 h-6" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-8 z-50 w-80 bg-[#181824] rounded-2xl shadow-2xl border border-[#00E4FF] animate-fade-in flex flex-col">
          <div className="p-4 border-b border-[#00E4FF] font-bold text-white flex items-center gap-2"><Bot className="w-5 h-5" />AI助手</div>
          <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-72 custom-scrollbar">
            {messages.map((m,i)=>(<div key={i} className={`text-sm ${m.role==='ai'?'text-[#00E4FF]':'text-white/80'} mb-1`}>{m.text}</div>))}
            {loading && <div className="text-xs text-[#00E4FF] animate-pulse">AI思考中...</div>}
          </div>
          <div className="flex items-center gap-2 p-2 border-t border-[#00E4FF]">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} className="flex-1 bg-[#232946] text-white px-3 py-2 rounded-lg outline-none" placeholder="输入问题/翻译/摘要..." />
            <button onClick={handleSend} className="bg-[#00E4FF] text-white px-3 py-2 rounded-lg hover:bg-[#FF00FF] transition"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
}
