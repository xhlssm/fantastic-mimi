/**
 * ================= Tailwind CSS 配置文件 =================
 * - content: 扫描哪些目录下的文件生成样式
 * - theme: 主题扩展
 * - plugins: 插件扩展
 */
module.exports = {
  // ========== 内容扫描区 ==========
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],

  // ========== 主题扩展区 ==========
  theme: {
    extend: {},
  },

  // ========== 插件扩展区 ==========
  plugins: [],
};
