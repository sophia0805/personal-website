import { NextRequest, NextResponse } from 'next/server';

const OWNER_IP = process.env.IP;

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
  const actualIp = clientIp === '::1' ? '127.0.0.1' : clientIp;
  const isOwner = actualIp === OWNER_IP || (process.env.NODE_ENV === 'development' && actualIp === '127.0.0.1');

  return NextResponse.json({ 
    isOwner,
    clientIp: actualIp,
    isDevelopment: process.env.NODE_ENV === 'development'
  });
}

