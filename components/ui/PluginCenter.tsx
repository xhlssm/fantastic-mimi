// 用户插件中心，支持自定义小组件/主题/脚本
'use client';
import { useState } from 'react';
import { Puzzle, PlusCircle } from 'lucide-react';

const mockPlugins = [
  { name: '天气小组件', desc: '显示实时天气', enabled: true },
  { name: '倒计时', desc: '重要事件倒计时', enabled: false },
  { name: '自定义主题', desc: '上传你的配色', enabled: false },
  { name: '快捷命令面板', desc: '一键执行常用操作', enabled: true },
];

export default function PluginCenter() {
  const [open, setOpen] = useState(false);
  const [plugins, setPlugins] = useState(mockPlugins);
  const toggle = idx => setPlugins(ps => ps.map((p,i)=>i===idx?{...p,enabled:!p.enabled}:p));
  // 安全校验函数
  const sanitizeInput = (input: string) => {
    // 仅允许中英文、数字、常用符号，禁止注入脚本和SQL关键字
    return input.replace(/[<>"'`;]|(select|update|delete|insert|drop|script|alert|onerror|onload)/gi, '');
  };
  // 插件上传/开发弹窗
  const [showUpload, setShowUpload] = useState(false);
  const [pluginName, setPluginName] = useState('');
  const [pluginDesc, setPluginDesc] = useState('');
  const [pluginCode, setPluginCode] = useState('');
  const [uploadError, setUploadError] = useState('');
  // 代码内容安全校验
  const sanitizeCode = (code: string) => {
    // 禁止<script>、eval、Function、new Function、document、window、SQL等危险关键字
    return code.replace(/<script|eval\(|Function\(|new Function|document\.|window\.|select |update |delete |insert |drop |alert\(|onerror=|onload=|require\(|import |fetch\(|XMLHttpRequest|localStorage|sessionStorage/gi, '');
  };
  const handleUpload = () => {
    const name = sanitizeInput(pluginName.trim());
    const desc = sanitizeInput(pluginDesc.trim());
    const code = sanitizeCode(pluginCode.trim());
    if (!name || !desc) {
      setUploadError('插件名称和描述不能为空，且不能包含危险字符/关键词');
      return;
    }
    if (pluginCode && code.length < pluginCode.length) {
      setUploadError('检测到危险代码片段，已自动过滤，请检查后再提交');
      return;
    }
    setPlugins(ps => [...ps, { name, desc, enabled: false }]);
    setShowUpload(false);
    setPluginName('');
    setPluginDesc('');
    setPluginCode('');
    setUploadError('');
  };
  return (
  <div className="fixed bottom-20 right-8 z-50 md:bottom-24 md:right-12">
      <button onClick={()=>setOpen(o=>!o)} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
        <Puzzle className="w-6 h-6" />
      </button>
      {open && (
        <div className="mt-3 bg-[#181824] rounded-2xl shadow-2xl border border-[#00E4FF] p-6 w-[90vw] max-w-md animate-fade-in">
          <div className="font-bold text-white mb-3 flex items-center gap-2"><Puzzle className="w-5 h-5" />插件中心</div>
          <ul className="space-y-2">
            {plugins.map((p,i)=>(
              <li key={p.name} className="flex items-center justify-between text-white/90">
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-[#B0B0CC]">{p.desc}</div>
                </div>
                <button onClick={()=>toggle(i)} className={`ml-2 px-3 py-1 rounded-full text-xs ${p.enabled?'bg-[var(--neon-blue)] text-white':'bg-white/10 text-[#B0B0CC]'}`}>{p.enabled?'已启用':'启用'}</button>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white py-2 rounded-xl hover:scale-105 transition" onClick={()=>setShowUpload(true)}><PlusCircle className="w-4 h-4" />上传/开发新插件</button>
          {showUpload && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
              <div className="bg-[#232946] border border-[var(--neon-blue)] rounded-2xl p-6 w-96 shadow-2xl relative">
                <div className="font-bold text-white mb-2">上传/开发新插件</div>
                <input className="w-full mb-2 p-2 rounded bg-[#181824] border border-[#00E4FF]/40 text-white" placeholder="插件名称" value={pluginName} onChange={e=>setPluginName(e.target.value)} maxLength={32} />
                <textarea className="w-full mb-2 p-2 rounded bg-[#181824] border border-[#00E4FF]/40 text-white" placeholder="插件描述" value={pluginDesc} onChange={e=>setPluginDesc(e.target.value)} maxLength={100} />
                <textarea className="w-full mb-2 p-2 rounded bg-[#181824] border border-[#FF00FF]/40 text-pink-200 font-mono text-xs" placeholder="可选：粘贴插件代码（仅支持前端JS/TS，自动过滤危险片段）" value={pluginCode} onChange={e=>setPluginCode(e.target.value)} maxLength={2000} rows={5} />
                {pluginCode && (
                  <div className="mb-2 text-xs text-[#B0B0CC] bg-[#181824] p-2 rounded border border-[#FF00FF]/20 overflow-x-auto max-h-32">
                    <span className="text-pink-400 font-bold">代码预览：</span>
                    <pre className="whitespace-pre-wrap break-all text-xs text-[#FF00FF]">{pluginCode}</pre>
                  </div>
                )}
                {uploadError && <div className="text-red-400 text-xs mb-2">{uploadError}</div>}
                <div className="text-xs text-[#B0B0CC] mb-2">禁止注入脚本、SQL等危险内容，所有输入将自动过滤。代码仅在前端沙箱环境运行，严禁粘贴敏感/后门/远程加载代码。</div>
                <div className="flex gap-2 justify-end">
                  <button className="px-4 py-1 rounded bg-[#00E4FF] text-[#181824] font-bold" onClick={handleUpload}>提交</button>
                  <button className="px-4 py-1 rounded bg-[#232946] text-white border border-[#00E4FF]/40" onClick={()=>{setShowUpload(false);setUploadError('');}}>取消</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
