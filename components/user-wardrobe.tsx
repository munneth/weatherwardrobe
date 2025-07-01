"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { WardrobeService } from '@/lib/wardrobe-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WardrobeItem {
  id: string
  name: string
  category: string
  color: string
  material: string
  image_url?: string
  created_at: string
}

export default function UserWardrobe() {
  const { user } = useAuth()
  const [items, setItems] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserItems() {
      if (user) {
        try {
          setLoading(true)
          setError(null)
          const userItems = await WardrobeService.getItems(user.uid)
          setItems(userItems)
        } catch (err) {
          console.error('Error loading wardrobe items:', err)
          setError('Failed to load wardrobe items')
        } finally {
          setLoading(false)
        }
      }
    }

    loadUserItems()
  }, [user])

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, WardrobeItem[]>)

  // Category display names
  const categoryNames: Record<string, string> = {
    top: 'Tops',
    bottom: 'Bottoms',
    dress: 'Dresses',
    outerwear: 'Outerwear',
    shoes: 'Shoes',
    accessory: 'Accessories'
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Please log in to view your wardrobe.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading your wardrobe...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>Your wardrobe is empty. Add some items to get started!</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Wardrobe ({items.length} items)</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <Card key={category} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">
                {categoryNames[category] || category} ({categoryItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded border">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.color} • {item.material}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 