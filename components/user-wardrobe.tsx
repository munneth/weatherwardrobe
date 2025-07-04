"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { WardrobeService } from '@/lib/wardrobe-service'

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

  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, WardrobeItem[]>)

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
      <div className="p-6 text-center font-serif">
        <p>Please log in to view your wardrobe.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 text-center font-serif">
        <p>Loading your wardrobe...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center font-serif">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="p-6 text-center font-serif">
        <p>Your wardrobe is empty. Add some items to get started!</p>
      </div>
    )
  }

  // Divide categories evenly into 3 columns
  const allCategories = Object.entries(itemsByCategory)
  const columns = [[], [], []] as [typeof allCategories, typeof allCategories, typeof allCategories]
  allCategories.forEach((entry, idx) => {
    columns[idx % 3].push(entry)
  })

  return (
    <div className="p-6 rounded-xl bg-[#70798C] font-serif">
      <h2 className="text-2xl font-bold mb-4 text-white font-serif">Your Wardrobe ({items.length} items)</h2>

      <div className="flex flex-col lg:flex-row gap-4">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="bg-white flex-1 p-4 rounded-lg shadow-inner text-black space-y-4">
            {column.map(([category, categoryItems]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-2 font-serif">
                  {categoryNames[category] || category} ({categoryItems.length})
                </h3>
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
                        <p className="font-medium text-sm truncate font-serif">{item.name}</p>
                        <p className="text-xs text-gray-600 font-serif">
                          {item.color} • {item.material}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

