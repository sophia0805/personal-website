'use client';

import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import { PhotoResponse } from '../models/Photo';

interface PhotoLoopProps {
  photos: PhotoResponse[];
}

export default function PhotoLoop({ photos }: PhotoLoopProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No photos to display yet</p>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 w-1/2 lg:w-1/2 xl:w-1/2 md:w-1/2 sm:w-full overflow-hidden z-10">
      <div 
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-20"
        style={{ width: '30vw' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      />
      
      <div 
        className="absolute left-1/2 top-1/2"
        style={{
          width: '100vh',
          height: '100%',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          transformOrigin: 'center center'
        }}
      >
         <Marquee autoFill play={!isPaused} speed={3} gradient={false} className="h-full">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative w-64 h-40 lg:w-96 lg:h-60 xl:w-[28rem] xl:h-[18rem] md:w-80 md:h-52 sm:w-48 sm:h-32 border-4 border-[#9D87C4] rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow"
              style={{ transform: 'rotate(90deg)' }}
            >
              <Image
                src={photo.url}
                alt={photo.originalName}
                fill
                className="object-cover rounded"
                sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, (max-width: 1280px) 384px, 448px"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}