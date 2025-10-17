import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Photo from '../../../../models/Photo';
import { checkAuth } from '../../../../lib/owner';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const photo = await Photo.findById(id);

  return new NextResponse(photo.data, {
    headers: {
      'Content-Type': photo.mimeType,
      'Content-Length': photo.size.toString(),
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isOwner } = checkAuth(request);
  
  if (!isOwner) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDB();
  const { id } = await params;
  await Photo.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: 'Photo deleted successfully'
  });
}
