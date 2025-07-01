"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function NavbarApp() {
    const { user, signOut } = useAuth()

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-900">
                            WeatherWardrobe
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link href="/ai-image-test">
                            <Button variant="outline" size="sm">
                                AI Image Test
                            </Button>
                        </Link>
                        
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    Welcome, {user.email}
                                </span>
                                <Button onClick={signOut} variant="outline" size="sm">
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button size="sm">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
