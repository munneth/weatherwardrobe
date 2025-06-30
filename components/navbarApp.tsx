import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function NavbarApp() {
    const { user } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut(auth)
            console.log("User signed out successfully")
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div>
                <NavigationMenu >
                <NavigationMenuList >
                    <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                    </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
                </NavigationMenu>
            </div>    
            <div>
                {user ? (
                    <Button onClick={handleSignOut} variant="outline">
                        Sign Out
                    </Button>
                ) : (
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                )}
            </div>
        </div>
    )
}
