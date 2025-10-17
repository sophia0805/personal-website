import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
  return clientIp === '::1' ? '127.0.0.1' : clientIp;
}

export function isOwner(clientIp: string): boolean {
  const isLocalhost = clientIp === '127.0.0.1' || clientIp.startsWith('192.168.');
  return clientIp === process.env.IP || (process.env.NODE_ENV === 'development' && isLocalhost);
}

export function checkAuth(request: NextRequest) {
  const clientIp = getClientIP(request);
  return {
    clientIp,
    isOwner: isOwner(clientIp)
  };
}
