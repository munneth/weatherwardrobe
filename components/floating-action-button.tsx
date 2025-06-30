"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function FloatingActionButton() {
    const { user } = useAuth()

    if (!user) return null

    const handleAddToWardrobe = () => {
        // TODO: Implement add to wardrobe functionality
        console.log("Add to wardrobe clicked")
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                onClick={handleAddToWardrobe}
                size="lg"
                className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
            >
                <Plus className="w-6 h-6" />
            </Button>
        </div>
    )
} 