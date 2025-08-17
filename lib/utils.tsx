
// Vercel build cache fix
// ================= 导入区 =================
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ================= 工具函数实现 =================

/**
 * 合并 Tailwind CSS 类名，支持条件拼接
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 判断URL是否为图片链接
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url.split('?')[0]);
}

/**
 * 派系徽章组件，支持多色
 */
export function FactionBadge({ faction }: { faction: string }) {
  const getFactionColor = (faction: string) => {
    switch (faction.toLowerCase()) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-black';
      case 'purple':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFactionColor(faction)}`}>
      {faction}
    </span>
  );
}
