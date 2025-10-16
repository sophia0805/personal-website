import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Photo from '../../../../models/Photo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const photo = await Photo.findById(params.id);

  return new NextResponse(photo.data, {
    headers: {
      'Content-Type': photo.mimeType,
      'Content-Length': photo.size.toString(),
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
  
  const isLocalhost = clientIp === '::1' || clientIp.startsWith('192.168.');
  const isOwner = clientIp === process.env.IP || (process.env.NODE_ENV === 'development' && isLocalhost);
  
  if (!isOwner) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDB();
  await Photo.findByIdAndDelete(params.id);

  return NextResponse.json({
    success: true,
    message: 'Photo deleted successfully'
  });
}
