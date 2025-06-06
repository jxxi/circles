export interface Message {
  id: string;
  circleId: string;
  channelId: string;
  userId: string;
  content: string;
  isTts?: boolean;
  mediaUrl?: string | null;
  mediaType?: string | null;
  thumbnailUrl?: string | null;
  createdAt: Date;
  editedAt?: Date | null;
  isPinned?: boolean;
  user?: {
    username: string;
    imageUrl: string;
  };
  replyToMessageId?: string;
  replyToMessage?: Message;
  reactions?: { emoji: string; userIds: string[] }[];
}

// For creating new messages
export type CreateMessage = Omit<
  Message,
  'id' | 'createdAt' | 'editedAt' | 'user' | 'replyToMessage'
> & {
  replyToMessageId?: string;
  id?: string;
};
