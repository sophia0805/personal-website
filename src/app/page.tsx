'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import PhotoLoop from "../components/photoloop";
import { PhotoResponse } from "../models/Photo";

export default function Home() {
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const cachedData = localStorage.getItem('photos-cache');
      const cacheTimestamp = localStorage.getItem('photos-cache-timestamp');
      const now = Date.now();
      const cacheExpiry = 5 * 60 * 1000;
      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < cacheExpiry) {
        try {
          const parsedData = JSON.parse(cachedData);
          setPhotos(parsedData.photos || []);
          return;
        } catch (error) {
          console.error('Failed to parse cached photos:', error);
        }
      }

      const response = await fetch('/api/photos');
      const result = await response.json();
      setPhotos(result.photos || []);
      
      localStorage.setItem('photos-cache', JSON.stringify(result));
      localStorage.setItem('photos-cache-timestamp', now.toString());
      
    };
    fetchPhotos();
  }, []);
  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center pt-16 pb-8">
        <h1 className="text-4xl font-bold mb-8 text-center">hii! i'm sophia</h1>
      </div>
      <div className="flex justify-center space-x-6">
            <a 
              href="https://www.linkedin.com/in/sophia-wang-3a68b1313/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
            </a>
            
            <a 
              href="https://github.com/sophia0805" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <img src="/github.png" alt="Github" className="w-6 h-6" />
            </a>
            
            <a 
              href="https://instagram.com/sophiaa.0805" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors duration-300 transform hover:scale-110"
              aria-label="Instagram"
            >
              <img src="/instagram.png" alt="Instagram" className="w-6 h-6" />
            </a>
            
            <a 
              href="mailto:sophiawang8509@gmail.com" 
              className="text-gray-600 hover:text-purple-600 transition-colors duration-300 transform hover:scale-110"
              aria-label="Email"
            >
              <img src="/gmail.png" alt="Gmail" className="w-6 h-6" />
            </a>
          </div>
      <div className="py-8">
        <PhotoLoop photos={photos} />
        
      </div>
      <div className="space-x-4 mb-12 text-center">
          <Link 
            href="/photos"
            className="inline-block px-8 py-4 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-all duration-300 font-medium shadow-sm hover:shadow-md border border-purple-200 hover:border-purple-300"
          >
            moments
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto my-8 px-4">
						my favorite song 
						<iframe
							src="https://open.spotify.com/embed/track/5jgFfDIR6FR0gvlA56Nakr"
							width="100%"
							height="152"
							frameBorder="0"
							allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
							loading="lazy"
							className="rounded-[20px] shadow-md"
						></iframe>
				</div>

    </main>
  );
}
