import Image from 'next/image';
import { useEffect, useState } from 'react';

const CircleList = () => {
  const [circles, setCircles] = useState<any[]>([]); // Adjust type as necessary

  useEffect(() => {
    const fetchCircles = async () => {
      const response = await fetch('/api/circles/publicCircles'); // Fetch from the new API route
      const data = await response.json();
      setCircles(data);
    };

    fetchCircles();
  }, []);

  return (
    <div className="rounded-md bg-card p-5">
      <div className="max-w-3xl space-y-2">
        {circles.map((circle) => (
          <div
            key={circle.circleId}
            className="flex cursor-pointer items-center rounded-md border p-3 hover:bg-accent"
          >
            <Image
              src={circle.icon}
              alt={circle.name}
              width={32}
              height={32}
              className="mr-2"
            />
            <div>
              <div className="font-bold">{circle.name}</div>
              <div className="text-sm text-gray-500">{circle.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CircleList };
