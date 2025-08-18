'use client';
import { useStore } from '@/store';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import Image from 'next/image';

export default function MessageBox() {
  const { user, users, messages, sendMessage, selectedUsername } = useStore();
  const [input, setInput] = useState('');

  if (!user || !selectedUsername) {
    return (
      <Card className="bg-white/5 border-none mt-4">
        <CardContent className="p-4 text-center text-white/70">
          <p>请从用户资料页选择一个用户以开始对话。</p>
        </CardContent>
      </Card>
    );
  }

  const targetUser = users.find(u => u.username === selectedUsername);
  if (!targetUser) {
    return <div>用户未找到。</div>;
  }

  const conversation = messages.filter(
    m => (m.senderId === user.id && m.receiverId === targetUser.id) || (m.senderId === targetUser.id && m.receiverId === user.id)
  ).sort((a, b) => a.timestamp - b.timestamp);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(targetUser.id, input);
      setInput('');
    }
  };

  return (
    <Card className="bg-white/5 border-none flex flex-col h-[calc(100vh-10rem)]">
      <CardHeader className="p-4 border-b border-white/10">
        <CardTitle className="text-base text-white">与 {targetUser.username} 的对话</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
        {conversation.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.senderId === user.id ? 'justify-end' : ''}`}>
            {msg.senderId !== user.id && (
              <Image src={targetUser.avatarUrl} alt={targetUser.username} width={32} height={32} className="rounded-full" />
            )}
            <div className={`max-w-xs p-3 rounded-xl ${msg.senderId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
            {msg.senderId === user.id && (
              <Image src={user.avatarUrl} alt={user.username} width={32} height={32} className="rounded-full" />
            )}
          </div>
        ))}
      </CardContent>
      <div className="p-4 border-t border-white/10 flex items-center gap-2">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="输入消息..."
          className="bg-gray-800 border-gray-700 text-white"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
