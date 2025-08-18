
"use client";
import { useStore, Faction as FactionType } from "../store";
import Forum from "../components/Forum/Forum";
import UserProfile from "../components/UserProfile";
import Shop from "../components/Shop";
import Leaderboard from "../components/Leaderboard";
import Achievements from "../components/Achievements";
import FactionPage from "../components/FactionPage";
import AdminPanel from "../components/AdminPanel";
import NavigationPanel from "@/components/Misskey/NavigationPanel";
import WidgetPanel from "@/components/Misskey/WidgetPanel";
import NotificationToast from "@/components/Misskey/NotificationToast";
import MessageBox from "@/components/Misskey/MessageBox";

// ================= 导入区 =================

const renderView = (activeView: string, selectedUsername: any) => {
  switch (activeView) {
    case "forum":
      return <Forum />;
    case "profile":
      return <UserProfile username={selectedUsername as string} />;
    case "shop":
      return <Shop />;
    case "leaderboard":
      return <Leaderboard />;
    case "achievements":
      return <Achievements />;
    case "faction_page":
      return <FactionPage factionId={(selectedUsername as FactionType | null) ?? null} />;
    case "factions":
      return <div className="text-center text-lg p-8">派系功能正在开发中...</div>;
    case "messages":
      return <MessageBox />;
    case "admin":
      return <AdminPanel />;
    default:
      return <Forum />;
  }
};

export default function Page() {
  const { activeView, selectedUsername, user } = useStore();

  if (!user) {
    // 如果未登录，可以显示一个登录页面或者直接在 ClientRoot 中处理
    return null; // ClientRoot 中已经有 SignInPanel
  }

  return (
    <div className="grid grid-cols-[auto_1fr_auto] h-screen">
      <NavigationPanel />
      <main className="overflow-y-auto">
        <div className="max-w-2xl mx-auto py-8 px-4">
          {renderView(activeView, selectedUsername)}
        </div>
      </main>
      <WidgetPanel />
      <NotificationToast />
    </div>
  );
}
// ================= 组件实现 =================
