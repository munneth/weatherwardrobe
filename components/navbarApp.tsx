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


export default function NavbarApp() {
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
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>

        </div>
)}
