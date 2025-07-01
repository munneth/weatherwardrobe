import { supabase } from './supabase'
import { Database } from './database.types'

type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Insert']
type Outfit = Database['public']['Tables']['outfits']['Insert']

export class WardrobeService {
  // Add a new wardrobe item
  static async addItem(item: Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at'>) {
    console.log("WardrobeService.addItem called with:", item)
    
    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert(item)
      .select()
      .single()

    if (error) {
      console.error("Supabase error details:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)
      console.error("Error details:", error.details)
      throw error
    }

    console.log("Item added successfully:", data)
    return data
  }

  // Get all wardrobe items for a user
  static async getItems(userId: string) {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wardrobe items:', error)
      throw error
    }

    return data
  }

  // Get wardrobe items by category
  static async getItemsByCategory(userId: string, category: string) {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching items by category:', error)
      throw error
    }

    return data
  }

  // Get wardrobe items suitable for current weather
  static async getItemsForWeather(userId: string, temperature: number, weatherCondition: string) {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId)
      .lte('min_temp', temperature)
      .gte('max_temp', temperature)
      .or(`weather_condition.eq.${weatherCondition},weather_condition.eq.all`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching items for weather:', error)
      throw error
    }

    return data
  }

  // Add a new outfit
  static async addOutfit(outfit: Omit<Outfit, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('outfits')
      .insert(outfit)
      .select()
      .single()

    if (error) {
      console.error('Error adding outfit:', error)
      throw error
    }

    return data
  }

  // Get all outfits for a user
  static async getOutfits(userId: string) {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching outfits:', error)
      throw error
    }

    return data
  }

  // Get outfits suitable for current weather
  static async getOutfitsForWeather(userId: string, temperature: number, weatherCondition: string) {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('user_id', userId)
      .lte('min_temp', temperature)
      .gte('max_temp', temperature)
      .or(`weather_condition.eq.${weatherCondition},weather_condition.eq.all`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching outfits for weather:', error)
      throw error
    }

    return data
  }

  // Delete a wardrobe item
  static async deleteItem(itemId: string) {
    const { error } = await supabase
      .from('wardrobe_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error deleting wardrobe item:', error)
      throw error
    }
  }

  // Delete an outfit
  static async deleteOutfit(outfitId: string) {
    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', outfitId)

    if (error) {
      console.error('Error deleting outfit:', error)
      throw error
    }
  }
} 