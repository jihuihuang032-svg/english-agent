import { NextRequest, NextResponse } from 'next/server';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export function validateAccess(request: NextRequest): NextResponse | null {
  if (!ACCESS_TOKEN) {
    return null;
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== ACCESS_TOKEN) {
    return NextResponse.json(
      { error: '未授权访问' },
      { status: 401 }
    );
  }

  return null;
}

export function getAuthHeaders(token?: string): HeadersInit {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
