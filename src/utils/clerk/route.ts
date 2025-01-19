import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function updateUserMetadata(id: string, circles: string[]) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(id, {
    publicMetadata: {
      circles,
    },
  });

  // after success update session claims
  return NextResponse.json({ success: true });
}

export async function getUserMetadata(id: string) {
  const client = await clerkClient();

  const user = await client.users.getUser(id);

  return NextResponse.json(user.publicMetadata);
}

type UserMetadata = {
  circles: [];
};
export async function getUserCircles(id: string) {
  const client = await clerkClient();

  const user = await client.users.getUser(id);
  const circles = user.publicMetadata as UserMetadata;

  return circles;
}
