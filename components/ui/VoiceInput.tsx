// ================= 导入区 =================
// 语音识别输入组件，支持发帖/评论语音转文字
"use client";
import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
// ================= 组件实现 =================

export default function VoiceInput({ onResult }: { onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(typeof window !== 'undefined' && !!(window as any).webkitSpeechRecognition);
  let recognition: any;
  if (supported) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
  }
  const handleStart = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };
  const handleStop = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };
  if (!supported) return null;
  return (
    <button onClick={listening ? handleStop : handleStart} className={`ml-2 p-2 rounded-full ${listening ? 'bg-pink-500/20' : 'bg-white/10'} hover:scale-110 transition`} title="语音输入">
      {listening ? <MicOff className="w-5 h-5 text-pink-500 animate-pulse" /> : <Mic className="w-5 h-5 text-white/80" />}
    </button>
  );
}
