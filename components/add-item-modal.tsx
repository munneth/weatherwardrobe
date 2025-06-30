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
    season: "",
    weather_condition: "",
    min_temp: "",
    max_temp: "",
    image_url: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await WardrobeService.addItem({
        user_id: userId,
        name: formData.name,
        category: formData.category as any,
        color: formData.color,
        material: formData.material,
        season: formData.season as any,
        weather_condition: formData.weather_condition as any,
        min_temp: parseInt(formData.min_temp),
        max_temp: parseInt(formData.max_temp),
        image_url: formData.image_url || undefined
      })

      // Reset form and close modal
      setFormData({
        name: "",
        category: "",
        color: "",
        material: "",
        season: "",
        weather_condition: "",
        min_temp: "",
        max_temp: "",
        image_url: ""
      })
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
            <Label htmlFor="season">Season</Label>
            <select
              id="season"
              value={formData.season}
              onChange={(e) => handleInputChange("season", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select season</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
              <option value="all">All Seasons</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="weather_condition">Weather Condition</Label>
            <select
              id="weather_condition"
              value={formData.weather_condition}
              onChange={(e) => handleInputChange("weather_condition", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select weather</option>
              <option value="sunny">Sunny</option>
              <option value="rainy">Rainy</option>
              <option value="snowy">Snowy</option>
              <option value="cloudy">Cloudy</option>
              <option value="all">All Weather</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="min_temp">Min Temp (°F)</Label>
              <Input
                id="min_temp"
                type="number"
                value={formData.min_temp}
                onChange={(e) => handleInputChange("min_temp", e.target.value)}
                placeholder="30"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_temp">Max Temp (°F)</Label>
              <Input
                id="max_temp"
                type="number"
                value={formData.max_temp}
                onChange={(e) => handleInputChange("max_temp", e.target.value)}
                placeholder="80"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
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