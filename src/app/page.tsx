import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to My Personal Website</h1>
        <div className="space-x-4">
          <Link 
            href="/photos"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            View Photos
          </Link>
        </div>
      </div>
    </main>
  );
}
