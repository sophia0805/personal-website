'use client';

import React from 'react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import { PhotoResponse } from '../models/Photo';

interface PhotoLoopProps {
  photos: PhotoResponse[];
}

export default function PhotoLoop({ photos }: PhotoLoopProps) {

  if (photos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No photos to display yet</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <Marquee autoFill pauseOnHover speed={75} gradient={false}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative mx-4 w-80 h-48 border-4 border-[#9D87C4] rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={photo.url}
              alt={photo.originalName}
              fill
              className="object-cover rounded"
              sizes="300px 300px"
            />
          </div>
        ))}
        {photos.map((photo) => (
          <div
            key={`duplicate-${photo.id}`}
            className="relative mx-4 w-80 h-48 border-4 border-[#9D87C4] rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={photo.url}
              alt={photo.originalName}
              fill
              className="object-cover rounded"
              sizes="300px 300px"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
}
