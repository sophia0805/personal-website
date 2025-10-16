import { NextRequest, NextResponse } from 'next/server';

const OWNER_IP = process.env.IP;

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
  const isLocalhost = clientIp === '::1' || clientIp.startsWith('192.168.');
  const isOwner = clientIp === OWNER_IP || (process.env.NODE_ENV === 'development' && isLocalhost);

  return NextResponse.json({ 
    isOwner,
    clientIp: clientIp,
    isDevelopment: process.env.NODE_ENV === 'development'
  });
}
