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
            id: data.id,
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
                <div className="w-2 h-2 bg-purple-600/20 rounded-full mt-2 flex-shrink-0"></div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">coding a new FTC robot for team #26507</h3>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600/20 rounded-full mt-2 flex-shrink-0"></div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">organizing hackathons thru hack club</h3>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600/20 rounded-full mt-2 flex-shrink-0"></div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">taking sunset photos</h3>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600/20 rounded-full mt-2 flex-shrink-0"></div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">learning machine learning</h3>
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
            <div className="w-full">
              <iframe
                src={`https://open.spotify.com/embed/track/${currentTrack.id}`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              ></iframe>
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
