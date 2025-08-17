'use client';
import { useStore, User } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User as UserIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Messages() {
    const { user, messages, users, sendMessage, markMessagesAsRead, selectedUsername, setView } = useStore();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof selectedUsername === 'string') {
            const user = users.find(u => u.username === selectedUsername);
            setSelectedUser(user || null);
            if (user) {
                markMessagesAsRead(user.id);
            }
        }
    }, [selectedUsername, users, markMessagesAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedUser]);

    if (!user) {
        return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 text-red-400">请先登录。</motion.div>;
    }

    const conversations = users
        .filter(u => u.id !== user.id)
        .map(otherUser => {
            const lastMessage = messages
                .filter(m => (m.senderId === user.id && m.receiverId === otherUser.id) || (m.senderId === otherUser.id && m.receiverId === user.id))
                .sort((a, b) => b.timestamp - a.timestamp)[0];
            const unreadCount = messages
                .filter(m => m.senderId === otherUser.id && m.receiverId === user.id && !m.read)
                .length;
            return { user: otherUser, lastMessage, unreadCount };
        })
        .sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));

    const currentConversation = messages
        .filter(m => (m.senderId === user.id && m.receiverId === selectedUser?.id) || (m.senderId === selectedUser?.id && m.receiverId === user.id))
        .sort((a, b) => a.timestamp - b.timestamp);

    const handleSendMessage = () => {
        if (messageInput.trim() && selectedUser) {
            sendMessage(selectedUser.id, messageInput);
            setMessageInput('');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[70vh] space-x-4">
            <Card className="w-1/3 bg-transparent backdrop-blur-md border-[#2B2B4A] flex flex-col">
                <div className="p-4 border-b border-[#2B2B4A] text-xl font-bold text-[#00E4FF]">对话列表</div>
                <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.map(({ user: otherUser, lastMessage, unreadCount }) => (
                        <div
                            key={otherUser.id}
                            onClick={() => setSelectedUser(otherUser)}
                            className={`flex items-center p-4 cursor-pointer hover:bg-[#2B2B4A] transition-colors relative
                                ${selectedUser?.id === otherUser.id ? 'bg-[#2B2B4A] border-l-4 border-[#00E4FF]' : ''}`}
                        >
                            <Image src={otherUser.avatarUrl} alt={otherUser.username} width={40} height={40} className="rounded-full mr-4" />
                            <div className="flex-1">
                                <h4 className="font-bold text-white">{otherUser.username}</h4>
                                <p className="text-sm text-[#B0B0CC] truncate">
                                    {lastMessage ? lastMessage.content : '开始对话'}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="w-2/3 bg-transparent backdrop-blur-md border-[#2B2B4A] flex flex-col">
                <div className="p-4 border-b border-[#2B2B4A] text-xl font-bold text-[#00E4FF] flex items-center space-x-4">
                    {selectedUser ? (
                        <>
                            <Image src={selectedUser.avatarUrl} alt={selectedUser.username} width={40} height={40} className="rounded-full" />
                            <span>{selectedUser.username}</span>
                        </>
                    ) : (
                        <span className="text-[#B0B0CC]">请选择一个对话</span>
                    )}
                </div>
                <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                    {selectedUser && currentConversation.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start space-x-2 max-w-[70%] ${msg.senderId === user.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <Image src={users.find(u => u.id === msg.senderId)?.avatarUrl || ''} alt="" width={32} height={32} className="rounded-full" />
                                <div className={`p-3 rounded-lg ${msg.senderId === user.id ? 'bg-[#00E4FF] text-[#1A1A2E]' : 'bg-[#2B2B4A] text-white'}`}>
                                    <p>{msg.content}</p>
                                    <span className={`block text-xs mt-1 ${msg.senderId === user.id ? 'text-[#1A1A2E]/70' : 'text-[#B0B0CC]'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-4 border-t border-[#2B2B4A]">
                    {selectedUser ? (
                        <div className="flex space-x-2">
                            <Input
                                placeholder={`向 ${selectedUser.username} 发送消息...`}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 bg-transparent border-[#00E4FF] text-white placeholder:text-[#B0B0CC]"
                            />
                            <Button onClick={handleSendMessage} className="bg-[#00E4FF] text-[#1A1A2E] hover:bg-[#00BFFF]">
                                <Send />
                            </Button>
                        </div>
                    ) : (
                        <p className="text-center text-[#B0B0CC]">请在左侧选择一个用户开始聊天。</p>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
