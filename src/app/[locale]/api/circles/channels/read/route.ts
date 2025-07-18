import { type NextRequest, NextResponse } from 'next/server';

import {
  getUnreadStatus,
  updateCircleLastRead,
} from '@/utils/circle/member/operations';
import { logError } from '@/utils/Logger';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const channelId = searchParams.get('channelId') as string;

  if (channelId) {
    try {
      const circle = await getUnreadStatus(channelId as string);
      return NextResponse.json(circle, { status: 200 });
    } catch (error) {
      logError('Error in channels read GET route', error);
      return NextResponse.json(
        { error: 'Failed to fetch channel read status' },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 },
    );
  }
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const channelId = searchParams.get('channelId') as string;
  const userId = searchParams.get('userId') as string;
  try {
    const response = await updateCircleLastRead(channelId, userId);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    logError('Error in channels read POST route', error);
    return NextResponse.json(
      { error: 'Failed to update channel to read' },
      { status: 500 },
    );
  }
}
