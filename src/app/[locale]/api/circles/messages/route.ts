import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';

import {
  generateThumbnail,
  getAllMessagesForChannel,
  getAllMessagesForCircle,
} from '@/utils/message/operations';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const circleId = searchParams.get('circleId');
  const channelId = searchParams.get('channelId');

  if (!circleId && !channelId) {
    return NextResponse.json(
      { error: 'Circle or Channel Id are required' },
      { status: 400 },
    );
  }

  try {
    if (channelId) {
      const messages = await getAllMessagesForChannel(channelId);
      return NextResponse.json(messages);
    }
    if (circleId) {
      const messages = await getAllMessagesForCircle(circleId);
      return NextResponse.json(messages);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 },
    );
  }
  return NextResponse.json({ error: 'No messages found' }, { status: 404 });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${nanoid()}.${ext}`;
    const pathname = `uploads/${type}s/${filename}`;

    // Upload to blob storage
    const blob = await put(pathname, file, {
      access: 'public',
    });

    // For videos, generate thumbnail (you'll need to implement this)
    let poster;
    if (type === 'video') {
      poster = await generateThumbnail(blob.url);
    }

    return NextResponse.json({
      url: blob.url,
      poster,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
