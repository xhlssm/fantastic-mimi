'use client';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function Shop() {
    const { user, shopItems, buyShopItem } = useStore();
    
    const handleBuy = (itemId: number) => {
        if (!user) {
            alert('请先登录才能购买。');
            return;
        }
        const item = shopItems.find(i => i.id === itemId);
        if (item && user.reputation >= item.price) {
            if (confirm(`确定要花费 ${item.price} 声望购买 ${item.name} 吗？`)) {
                buyShopItem(itemId);
            }
        } else {
            alert('声望不足！');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-[#00E4FF]">绳网商店</h2>
            <p className="text-[#B0B0CC]">在这里，声望值可以兑换终端定制化物品。你当前拥有 **{user?.reputation || 0}** 声望值。</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {shopItems.map(item => (
                    <Card key={item.id} className="bg-transparent backdrop-blur-md border-[#2B2B4A] transition-transform duration-200 hover:scale-105">
                        <CardHeader className="p-4">
                            <Image src={item.imageUrl} alt={item.name} width={400} height={200} className="rounded-md object-cover w-full h-32" />
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <CardTitle className="text-white text-xl flex items-center space-x-2">
                                <ImageIcon size={24} /> <span>{item.name}</span>
                            </CardTitle>
                            <p className="text-[#B0B0CC] text-sm">{item.description}</p>
                            <div className="flex items-center space-x-2">
                                <Star size={16} className="text-yellow-400" />
                                <span className="text-yellow-400 font-bold">{item.price} 声望</span>
                            </div>
                            <Button onClick={() => handleBuy(item.id)} className="w-full mt-4 bg-[#FF00FF] text-[#1A1A2E] hover:bg-[#FF88FF]">
                                购买
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
