import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { instanceId, content, authorId } = await request.json();
    const noteId = parseInt(params.noteId, 10);

    if (!instanceId || !content || !authorId || isNaN(noteId)) {
      return NextResponse.json({ error: 'instanceId, content, authorId, and a valid noteId are required' }, { status: 400 });
    }

    // 在真实应用中，这里应该有 token 验证

    const newReply = dbService.createReply(instanceId, noteId, { content, authorId });

    if (!newReply) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(newReply, { status: 201 });
  } catch (error) {
    console.error('Create Reply API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
