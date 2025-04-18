import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import {
  attachmentsSchema,
  messagesSchema,
  reactionsSchema,
} from '@/models/Schema';

export async function createMessage(
  circleId: string,
  channelId: string,
  userId: string,
  content: string,
  mediaUrl?: string,
  mediaType?: string,
  thumbnailUrl?: string,
  isTts?: boolean,
) {
  try {
    const newMessage = await db.insert(messagesSchema).values({
      circleId,
      channelId,
      userId,
      content,
      isTts: isTts || false,
      mediaUrl,
      mediaType,
      thumbnailUrl,
    });
    return newMessage;
  } catch (error) {
    throw new Error('Failed to create message');
  }
}

export async function updateMessage(
  messageId: string,
  updates: Partial<{ content: string; isPinned: boolean; editedAt: Date }>,
) {
  try {
    const updatedMessage = await db
      .update(messagesSchema)
      .set(updates)
      .where(eq(messagesSchema.messageId, messageId))
      .returning();
    return updatedMessage; // Return the updated message
  } catch (error) {
    throw new Error('Failed to update message');
  }
}

export async function deleteMessage(messageId: string) {
  try {
    const deletedMessage = await db
      .delete(messagesSchema)
      .where(eq(messagesSchema.messageId, messageId))
      .returning();
    return deletedMessage; // Return the deleted message
  } catch (error) {
    throw new Error('Failed to delete message');
  }
}

export async function getAllMessagesForCircle(circleId: string) {
  try {
    const messages = await db.query.messagesSchema.findMany({
      where: eq(messagesSchema.circleId, circleId),
    });
    return messages; // Return the list of messages
  } catch (error) {
    throw new Error('Failed to fetch messages for circle');
  }
}

export async function getAllMessagesForChannel(channelId: string) {
  try {
    const messages = await db.query.messagesSchema.findMany({
      where: eq(messagesSchema.channelId, channelId),
    });
    return messages; // Return the list of messages
  } catch (error) {
    throw new Error('Failed to fetch messages for channel');
  }
}

export async function getMessageById(messageId: string) {
  try {
    const message = await db.query.messagesSchema.findFirst({
      where: eq(messagesSchema.messageId, messageId),
    });
    return message || null; // Return null if no message is found
  } catch (error) {
    throw new Error('Failed to fetch message');
  }
}

export async function createAttachment(
  messageId: string,
  filename: string,
  size: number,
  url: string,
  proxyUrl?: string,
  contentType?: string,
) {
  try {
    const newAttachment = await db.insert(attachmentsSchema).values({
      messageId,
      filename,
      size,
      url,
      proxyUrl,
      contentType,
    });
    return newAttachment; // Return the newly created attachment
  } catch (error) {
    throw new Error('Failed to create attachment');
  }
}

export async function deleteAttachment(attachmentId: string) {
  try {
    const deletedAttachment = await db
      .delete(attachmentsSchema)
      .where(eq(attachmentsSchema.attachmentId, attachmentId))
      .returning();
    return deletedAttachment;
  } catch (error) {
    throw new Error('Failed to delete attachment');
  }
}

export async function createReaction(
  messageId: string,
  userId: string,
  emoji: string,
) {
  try {
    const newReaction = await db.insert(reactionsSchema).values({
      messageId,
      userId,
      emoji,
    });
    return newReaction; // Return the newly created reaction
  } catch (error) {
    throw new Error('Failed to create reaction');
  }
}

export async function deleteReaction(
  messageId: string,
  userId: string,
  emoji: string,
) {
  try {
    const deletedReaction = await db
      .delete(reactionsSchema)
      .where(eq(reactionsSchema.messageId, messageId))
      .where(eq(reactionsSchema.userId, userId))
      .where(eq(reactionsSchema.emoji, emoji))
      .returning();
    return deletedReaction; // Return the deleted reaction
  } catch (error) {
    throw new Error('Failed to delete reaction');
  }
}

export async function getAllReactionsForMessage(messageId: string) {
  try {
    const reactions = await db.query.reactionsSchema.findMany({
      where: eq(reactionsSchema.messageId, messageId),
    });
    return reactions;
  } catch (error) {
    throw new Error('Failed to fetch reactions for message');
  }
}

export async function generateThumbnail(
  videoUrl: string,
): Promise<string | undefined> {
  try {
    // Create FFmpeg instance
    const ffmpeg = new FFmpeg();

    // Load FFmpeg
    await ffmpeg.load({
      coreURL: await toBlobURL('/ffmpeg-core.js', 'text/javascript'),
      wasmURL: await toBlobURL('/ffmpeg-core.wasm', 'application/wasm'),
    });

    // Fetch video file
    const videoData = await fetchFile(videoUrl);
    await ffmpeg.writeFile('input.mp4', videoData);

    // Extract frame at 1 second mark
    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-ss',
      '00:00:01.000',
      '-frames:v',
      '1',
      '-c:v',
      'png',
      'thumbnail.png',
    ]);

    // Read the thumbnail
    const thumbnailData = await ffmpeg.readFile('thumbnail.png');
    const thumbnailBlob = new Blob([thumbnailData], { type: 'image/png' });

    // Upload thumbnail to blob storage
    const formData = new FormData();
    formData.append('file', thumbnailBlob, 'thumbnail.png');
    formData.append('type', 'thumbnail');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Thumbnail upload failed');
    const { url } = await response.json();

    return url;
  } catch (error) {
    return undefined;
  }
}
