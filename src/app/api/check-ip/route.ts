import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '../../../lib/owner';

export async function GET(request: NextRequest) {
  const { clientIp, isOwner } = checkAuth(request);

  return NextResponse.json({ 
    isOwner,
    clientIp,
    isDevelopment: process.env.NODE_ENV === 'development'
  });
}

