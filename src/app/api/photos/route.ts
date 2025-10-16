import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Photo from '../../../models/Photo';

export async function GET() {
  await connectDB();
  const photos = await Photo.find({}).sort({ uploadedAt: -1 });
  
  return NextResponse.json({
    success: true,
    photos: photos.map((photo: any) => ({
      id: photo._id,
      filename: photo.filename,
      originalName: photo.originalName,
      mimeType: photo.mimeType,
      size: photo.size,
      uploadedAt: photo.uploadedAt,
      url: `/api/photos/${photo._id}`
    }))
  });
}

export async function POST(request: NextRequest) {
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

  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  await connectDB();

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;

  const photo = new Photo({
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    data: buffer
  });

  await photo.save();

  return NextResponse.json({
    success: true,
    photo: {
      id: photo._id,
      filename: photo.filename,
      originalName: photo.originalName,
      mimeType: photo.mimeType,
      size: photo.size,
      uploadedAt: photo.uploadedAt,
      url: `/api/photos/${photo._id}`
    }
  });
}
