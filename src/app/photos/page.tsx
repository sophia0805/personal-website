'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '../../components/AuthProvider';

interface Photo {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export default function Photos() {
  const { isOwner, isLoading, clientIp } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = async () => {
    const response = await fetch('/api/photos');
    const result = await response.json();
    setPhotos(result.photos);
    setLoadingPhotos(false);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
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

    const result = await response.json();
    const uploadedPhoto = {
      ...file,
      id: result.photo.id,
      url: result.photo.url,
    };

    const newPhoto: Photo = {
      id: uploadedPhoto.id,
      filename: uploadedPhoto.name,
      originalName: uploadedPhoto.name,
      mimeType: uploadedPhoto.type,
      size: uploadedPhoto.size,
      uploadedAt: new Date().toISOString(),
      url: uploadedPhoto.url
    };
    setPhotos(prev => [newPhoto, ...prev]);
    setUploading(false);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/photos/${id}`, {
      method: 'DELETE',
    });
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  if (isLoading || loadingPhotos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{isLoading ? 'Checking access...' : 'Loading photos...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Photo Gallery</h1>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {isOwner ? (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
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
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Photos</h2>
              {photos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No photos uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div 
                        className="aspect-square relative overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <Image
                          src={photo.url}
                          alt={photo.originalName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                      
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
              </p>
              {photos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No photos available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div 
                        className="aspect-square relative overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <Image
                          src={photo.url}
                          alt={photo.originalName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {clientIp && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Accessing from IP: {clientIp}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              ×
            </button>
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
