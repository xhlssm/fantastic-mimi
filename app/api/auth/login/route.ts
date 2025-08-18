import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, instanceId } = await request.json();

    if (!username || !instanceId) {
      return NextResponse.json({ error: 'Username and instanceId are required' }, { status: 400 });
    }

    const user = dbService.findUserByUsername(instanceId, username);

    if (!user) {
      return NextResponse.json({ error: 'User not found on this instance' }, { status: 404 });
    }

    // 在真实应用中，这里应该有密码验证
    // 为了简化，我们直接返回用户信息和 token
    return NextResponse.json({
      user,
      token: `fake-jwt-token-for-${user.username}`, // 模拟 JWT
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
