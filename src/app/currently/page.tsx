'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Currently() {
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await fetch('/api/currently-playing');
        const data = await response.json();
        
        if (data.isPlaying) {
          setCurrentTrack({
            name: data.title,
            artists: [{ name: data.artist }],
            album: {
              images: [{ url: data.albumImageUrl }],
              name: data.album
            },
            duration_ms: data.duration
          });
        } else {
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error('Failed to fetch currently playing track:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentlyPlaying();
    const interval = setInterval(fetchCurrentlyPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">currently</h1>
          <Link 
            href="/"
            className="text-purple-600 hover:text-gray-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">what i'm up to right now</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">studying</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">computer science and biology courses, focusing on data structures and molecular biology</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">building</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">this personal website and exploring web development with Next.js</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">reading</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">articles about bioinformatics and computational biology</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">listening to</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">indie pop and discovering new artists on spotify</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">excited about</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">upcoming projects that combine my interests in tech and biology</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">exploring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">atlanta's coffee shops and taking sunset photos around the city</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">currently listening to</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
            </div>
          ) : currentTrack ? (
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="relative">
                <img 
                  src={currentTrack.album.images[0]?.url || '/placeholder-album.png'} 
                  alt={currentTrack.album.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded transition-all duration-200 flex items-center justify-center">
                  <button className="opacity-0 hover:opacity-100 bg-green-500 hover:bg-green-400 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 transform hover:scale-110">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{currentTrack.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {currentTrack.artists.map((artist: any) => artist.name).join(', ')}
                </p>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {Math.floor(currentTrack.duration_ms / 60000)}:{(currentTrack.duration_ms % 60000 / 1000).toFixed(0).padStart(2, '0')}
              </div>
              
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Nothing playing right now</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">my favorite song rn</h2>
          <iframe
            src="https://open.spotify.com/embed/track/5jgFfDIR6FR0gvlA56Nakr"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
