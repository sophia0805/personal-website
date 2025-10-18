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
    <main className="min-h-screen bg-background flex">
      <div className="w-1/2 flex flex-col items-center justify-center pt-16 pb-8">
        <h1 className="text-8xl font-bold mb-2 text-center text-gray-900 border-b-4 border-purple-600/20 pb-4">hihi! i'm sophia</h1>
        <p className="text-lg text-center mb-8 ml-16">i'm a student from atlanta, georgia. i'm interested in exploring both computer science and biology (specifically gene expression) by building projects.
          when i'm not studying, you can find me taking sunset photos or baking with friends!</p>
        <div className="flex justify-center space-x-6 mb-8">
          <a 
            href="https://www.linkedin.com/in/sophia-wang-3a68b1313/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-all duration-300 transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <img 
              src="/linkedin.svg" 
              alt="LinkedIn" 
              className="w-6 h-6" 
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(1500%) hue-rotate(246deg) brightness(60%) contrast(110%)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            />
          </a>
          
          <a 
            href="https://github.com/sophia0805" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-all duration-300 transform hover:scale-110"
            aria-label="GitHub"
          >
            <img 
              src="/github.png" 
              alt="Github" 
              className="w-6 h-6" 
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(1500%) hue-rotate(246deg) brightness(60%) contrast(110%)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            />
          </a>
          
          <a 
            href="https://instagram.com/sophiaa.0805" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-all duration-300 transform hover:scale-110"
            aria-label="Instagram"
          >
            <img 
              src="/instagram.png" 
              alt="Instagram" 
              className="w-6 h-6" 
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(1500%) hue-rotate(246deg) brightness(60%) contrast(110%)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            />
          </a>
          
          <a 
            href="mailto:sophiawang8509@gmail.com" 
            className="transition-all duration-300 transform hover:scale-110"
            aria-label="Email"
          >
            <img 
              src="/gmail.png" 
              alt="Gmail" 
              className="w-6 h-6" 
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(1500%) hue-rotate(246deg) brightness(60%) contrast(110%)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            />
          </a>
        </div>
        
        <div className="space-x-8 mb-16 text-center">
          <Link 
            href="/currently"
            className="text-xl text-gray-800 hover:text-gray-500 transition-all duration-300 font-medium relative group"
          >
            <span className="relative z-10">/currently</span>
            <span className="absolute inset-0 bg-purple-600/20 scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link 
            href="/photos"
            className="text-xl text-gray-800 hover:text-gray-500 transition-all duration-300 font-medium relative group"
          >
            <span className="relative z-10">/moments</span>
            <span className="absolute inset-0 bg-purple-600/20 scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-left"></span>
          </Link>
        </div>
      </div>
      
       <div className="w-1/2 flex justify-end">
         <PhotoLoop photos={photos}/>
       </div>
    </main>
  );
}
