/**
 * ================= Next.js 配置文件 =================
 * - reactStrictMode: 启用严格模式
 * - images: 配置远程图片域名
 * - experimental: 实验性优化包导入
 */
const nextConfig = {
  // ========== React 严格模式 ==========
  reactStrictMode: true,

  // ========== 图片远程加载配置 ==========
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
    ],
  },

  // ========== 实验性功能区 ==========
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion'
    ]
  }
};

// ========== 导出配置 ==========
module.exports = nextConfig;