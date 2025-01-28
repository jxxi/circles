/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import type { Message } from '../../types/message';

const Messages = (props: { messages: Message[] }) => (
  <>
    {(!props.messages || props.messages.length === 0) && (
      <div
        id="noMessages"
        className="flex h-[600px] flex-col items-center justify-center rounded-md bg-card p-5"
      >
        <div className="size-16 rounded-full bg-muted p-3 [&_svg]:stroke-muted-foreground [&_svg]:stroke-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
          </svg>
        </div>

        <div className="mt-3 text-center">
          <div className="text-xl font-semibold">Let's get started!</div>
        </div>
      </div>
    )}{' '}
    <div className="space-y-2">
      {' '}
      {props.messages.map((message) => (
        <div key={message.id} className="rounded-lg bg-gray-800 p-3 shadow-md">
          <div className="font-semibold text-blue-400">{message.userId}</div>{' '}
          {/* User name color */}
          <div className="text-gray-300">{message.content}</div>{' '}
          {/* Message text color */}
        </div>
      ))}
    </div>
  </>
);

export { Messages };
