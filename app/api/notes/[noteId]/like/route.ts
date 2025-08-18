import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { instanceId } = await request.json();
    const noteId = parseInt(params.noteId, 10);

    if (!instanceId || isNaN(noteId)) {
      return NextResponse.json({ error: 'instanceId and a valid noteId are required' }, { status: 400 });
    }

    // 在真实应用中，这里应该有 token 验证

    const updatedThread = dbService.toggleLike(instanceId, noteId);

    if (!updatedThread) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(updatedThread);
  } catch (error) {
    console.error('Like Note API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
