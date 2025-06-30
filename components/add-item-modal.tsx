"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WardrobeService } from "@/lib/wardrobe-service"
import { FileUploadService } from "@/lib/file-upload-service"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function AddItemModal({ isOpen, onClose, userId }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    color: "",
    material: "",
    image_url: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl: string | undefined = undefined
      
      // Upload image if selected
      if (selectedFile) {
        imageUrl = await FileUploadService.uploadImage(selectedFile, userId)
      }

      await WardrobeService.addItem({
        user_id: userId,
        name: formData.name,
        category: formData.category as any,
        color: formData.color,
        material: formData.material,
        image_url: imageUrl
      })

      // Reset form and close modal
      setFormData({
        name: "",
        category: "",
        color: "",
        material: "",
        image_url: ""
      })
      setSelectedFile(null)
      setImagePreview(null)
      onClose()
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Failed to add item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add to Wardrobe</SheetTitle>
          <SheetDescription>
            Add a new item to your wardrobe. Fill in the details below.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Blue Denim Jacket"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select category</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="dress">Dress</option>
              <option value="outerwear">Outerwear</option>
              <option value="shoes">Shoes</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
              placeholder="e.g., Blue, Black, White"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => handleInputChange("material", e.target.value)}
              placeholder="e.g., Cotton, Denim, Wool"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Item Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <SheetFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
} 