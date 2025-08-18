import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceId = searchParams.get('instanceId');

    if (!instanceId) {
      return NextResponse.json({ error: 'instanceId is required' }, { status: 400 });
    }

    const threads = dbService.getThreads(instanceId);
    const users = dbService.getUsers(instanceId);

    // 模拟 Misskey API，将用户信息附加到帖子中
    const notes = threads.map(thread => ({
      ...thread,
      user: users.find(u => u.id === thread.authorId)
    }));

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Get Notes API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { instanceId, title, content, authorId } = await request.json();

    if (!instanceId || !content || !authorId) {
      return NextResponse.json({ error: 'instanceId, content, and authorId are required' }, { status: 400 });
    }

    // 在真实应用中，这里应该有 token 验证来确认 authorId 的合法性

    const newThread = dbService.createThread(instanceId, { title: title || '', content, authorId });
    
    return NextResponse.json(newThread, { status: 201 });
  } catch (error) {
    console.error('Create Note API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
