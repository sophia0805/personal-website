'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import PhotoLoop from "../components/photoloop";
import { PhotoResponse } from "../models/Photo";

export default function Home() {
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const result = await response.json();
        setPhotos(result.photos || []);
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);
  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center pt-16 pb-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to My Personal Website</h1>
        <div className="space-x-4 mb-12">
          <Link 
            href="/photos"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            View Photos
          </Link>
        </div>
      </div>

      <div className="py-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Recent Photos</h2>
        <PhotoLoop photos={photos} />
      </div>
    </main>
  );
}
