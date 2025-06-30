"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import AddItemModal from "./add-item-modal"

export default function FloatingActionButton() {
    const { user } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!user) return null

    const handleAddToWardrobe = () => {
        setIsModalOpen(true)
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={handleAddToWardrobe}
                    size="lg"
                    className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <Plus className="w-6 h-6" />
                </Button>
            </div>
            
            <AddItemModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                userId={user.uid}
            />
        </>
    )
} 