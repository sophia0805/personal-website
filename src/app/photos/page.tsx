'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { PhotoResponse } from '../../models/Photo';

export default function Photos() {
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [clientIp, setClientIp] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = async () => {
    try {
      const cachedData = localStorage.getItem('photos-cache');
      const cacheTimestamp = localStorage.getItem('photos-cache-timestamp');
      const now = Date.now();
      const cacheExpiry = 5 * 60 * 1000;

      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < cacheExpiry) {
        const parsed = JSON.parse(cachedData);
        setPhotos(parsed.photos || []);
        return;
      }

      const response = await fetch('/api/photos');
      const result = await response.json();
      setPhotos(result.photos || []);
      localStorage.setItem('photos-cache', JSON.stringify(result));
      localStorage.setItem('photos-cache-timestamp', now.toString());
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  useEffect(() => {
    const checkIP = async () => {
      const response = await fetch('/api/check-ip');
      const data = await response.json();
      setIsOwner(data.isOwner);
      setClientIp(data.clientIp);
    };
    
    checkIP();
    loadPhotos();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/photos', {
      method: 'POST',
      body: formData,
    });

    const { photo } = await response.json();
    const newPhoto: PhotoResponse = {
      id: photo.id,
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: photo.url
    };
    setPhotos(prev => {
      const updated = [newPhoto, ...prev];
      localStorage.setItem('photos-cache', JSON.stringify({ photos: updated }));
      localStorage.setItem('photos-cache-timestamp', Date.now().toString());
      return updated;
    });
    setUploading(false);
  };

  const onButtonClick = () => fileInputRef.current?.click();

  const handleDelete = async (id: string) => {
    await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('photos-cache', JSON.stringify({ photos: updated }));
      localStorage.setItem('photos-cache-timestamp', Date.now().toString());
      return updated;
    });
  };


  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">recents</h1>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {isOwner && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Photos</h2>
              <div className="w-full max-w-md mx-auto">
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  
                  <div className="space-y-4">
                    <div className="text-gray-500 dark:text-gray-400">
                      {uploading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm">
                            Drag and drop your photo here, or{' '}
                            <button
                              type="button"
                              onClick={onButtonClick}
                              className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {clientIp && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Access granted from IP: {clientIp}
                </p>
              )}
          </div>
        )}

        <div>
              {photos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No photos uploaded yet.</p>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center inset-0 gap-x-1.5 gap-y-12.5">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group inline-block cursor-pointer">
                      <img
                        src={photo.url}
                        alt={photo.originalName}
                        className="rounded-lg hover:shadow-lg transition-shadow w-full h-64"
                        onClick={() => setSelectedPhoto(photo)}
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
                          const aspectRatio = img.naturalWidth / img.naturalHeight;
                          const targetHeight = 256;
                          const calculatedWidth = targetHeight * aspectRatio;
                          img.style.width = `${calculatedWidth}px`;
                          img.style.height = `${targetHeight}px`;
                        }}
                      />
                      
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(photo.id);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Delete photo"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.filename}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
