import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import type { Circle } from '../../types/Circle';

interface UserCircleListProps {
  circles: Circle[];
  handleCircleClick: (circleId: string) => void;
  handleChannelClick: (channelId: string) => void;
  currentChannelId: string | undefined;
  currentCircleId: string | undefined;
}

const UserCircleList: React.FC<UserCircleListProps> = ({
  circles,
  handleCircleClick,
  handleChannelClick,
  currentChannelId,
  currentCircleId,
}) => {
  const selectedCircleIndex = circles.findIndex(
    (circle) => circle.circleId === currentCircleId,
  );

  const [currentChannel, setCurrentChannel] = useState<string | undefined>(
    currentChannelId,
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    selectedCircleIndex !== -1 ? selectedCircleIndex : null,
  );

  if (!circles) {
    return (
      <div className="rounded-md bg-card p-3">
        <div className="max-w-3xl space-y-2" />
      </div>
    );
  }

  return (
    <div className="flex h-full rounded-md bg-white shadow-md">
      <div className="w-1/3 rounded-md bg-gray-200 p-3">
        {circles.map((circle, index) => (
          <Button
            key={circle.circleId}
            className={`mb-2 flex w-full cursor-pointer items-center rounded-md border bg-white p-3 
                ${selectedIndex === index ? 'ring-4 ring-sky-200' : 'border-transparent'} 
                hover:bg-blue-200`}
            onClick={() => {
              setSelectedIndex(index);
              handleCircleClick(circle.circleId);
              setCurrentChannel(circle.channels?.[0]?.channelId);
            }}
          >
            <Image
              key={circle.circleId}
              src={
                circle.icon || '/assets/images/default-circle-icon-removebg.png'
              }
              alt=""
              width={64}
              height={64}
              className="mr-2"
            />
          </Button>
        ))}
      </div>
      <div className="w-2/3 rounded-md bg-gray-100 p-3">
        {selectedIndex !== null && circles[selectedIndex] && (
          <div className="flex flex-col space-y-1">
            <h2 className="mb-2 text-lg font-bold text-gray-800">
              {circles[selectedIndex].name}
            </h2>
            {circles[selectedIndex].channels.map((channel) => (
              <Button
                key={channel.channelId}
                className={`mb-1 rounded px-2 py-1 text-white ${currentChannel === channel.channelId ? 'bg-black' : 'bg-gray-400'}`}
                onClick={() => {
                  handleChannelClick(channel.channelId);
                  setCurrentChannel(channel.channelId);
                }}
              >
                {channel.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { UserCircleList };
