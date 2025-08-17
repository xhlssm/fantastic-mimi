// ================= 导入区 =================
import './globals.css';
import ClientRoot from './ClientRoot';

// ================= 元数据区 =================
export const metadata = {
  title: '绳网终端',
  description: 'A cyberpunk terminal simulator.',
};

// ================= 组件实现 =================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
