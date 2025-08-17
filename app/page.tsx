
"use client";
import { useStore, Faction as FactionType } from "../store";
import Forum from "../components/Forum/Forum";
import UserProfile from "../components/UserProfile";
import Shop from "../components/Shop";
import Leaderboard from "../components/Leaderboard";
import Achievements from "../components/Achievements";
import FactionPage from "../components/FactionPage";
import AdminPanel from "../components/AdminPanel";

// ================= 导入区 =================

export default function Page() {
  const { activeView, selectedUsername, user } = useStore();

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
      return (
        <>
          <FactionPage factionId={(selectedUsername as FactionType | null) ?? null} />
          {/* 帮派内聊天功能入口（预留） */}
          <div style={{marginTop:32,background:'#181824cc',borderRadius:12,padding:'20px 16px',boxShadow:'0 2px 16px #00e4ff22'}}>
            <div style={{fontSize:20,fontWeight:600,color:'#00e4ff',marginBottom:8}}>帮派聊天</div>
            <div style={{color:'#e0eaff',fontSize:15,marginBottom:12}}>与帮派成员实时交流、分享资源、协作任务。<br />（功能即将上线，敬请期待！）</div>
            {/* 未来可在此集成实时聊天组件，如 WebSocket 聊天、消息列表、输入框等 */}
          </div>
        </>
      );
    case "factions":
      return <div className="text-center text-[#00e4ff] text-2xl mt-20">派系功能即将上线</div>;
    case "messages":
      return <div className="text-center text-[#00e4ff] text-2xl mt-20">消息中心即将上线</div>;
    case "admin":
      return <AdminPanel />;
    default:
      return <Forum />;
  }
}

// ================= 组件实现 =================
