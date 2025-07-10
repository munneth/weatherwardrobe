"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function NavbarApp({ section1Ref }: { section1Ref: React.RefObject<HTMLDivElement | null> }) {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-sm font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-black transition">
            WeatherWardrobe
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 text-sm text-gray-700">
            <Link href="/" className="hover:text-black transition">Home</Link>
            <Link href="#" onClick={e =>{
              e.preventDefault();
              section1Ref.current?.scrollIntoView({ behavior: "smooth" });
            }} className="hover:text-black transition">Choose Our Fits</Link>
            <Link href="/ai-image-test"></Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {user.email}</span>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-400 hover:border-black hover:text-black"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="rounded-full border border-black hover:bg-black hover:text-white transition"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
