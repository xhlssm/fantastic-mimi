import { useState } from 'react';
import { Input } from './ui/input';
import VoiceInput from './ui/VoiceInput';

export default function CreateThreadDialogTest() {
  const [title, setTitle] = useState('');
  return (
    <div style={{ padding: 24 }}>
      <Input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="标题"
        className="border p-2 rounded mb-2"
      />
      <VoiceInput onResult={txt => setTitle(txt)} />
      <div className="mt-4 text-gray-500">当前输入：{title}</div>
    </div>
  );
}