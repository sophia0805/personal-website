'use client';

import Link from "next/link";

export default function Currently() {
  return (
    <main className="min-h-screen bg-background">
      <div className="absolute top-8 right-8">
        <Link 
          href="/"
          className="text-purple-600 hover:text-gray-500 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
      <div className="max-w-4xl mx-auto px-8 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md mx-auto my-8 px-4">
          my favorite song rn
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
      </div>
    </main>
  );
}
