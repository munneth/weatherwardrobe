export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      wardrobe_items: {
        Row: {
          id: string
          user_id: string
          name: string
          category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory'
          color: string
          material: string
          season: 'spring' | 'summer' | 'fall' | 'winter' | 'all'
          weather_condition: 'sunny' | 'rainy' | 'snowy' | 'cloudy' | 'all'
          min_temp: number
          max_temp: number
          image_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory'
          color: string
          material: string
          season: 'spring' | 'summer' | 'fall' | 'winter' | 'all'
          weather_condition: 'sunny' | 'rainy' | 'snowy' | 'cloudy' | 'all'
          min_temp: number
          max_temp: number
          image_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory'
          color?: string
          material?: string
          season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all'
          weather_condition?: 'sunny' | 'rainy' | 'snowy' | 'cloudy' | 'all'
          min_temp?: number
          max_temp?: number
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      outfits: {
        Row: {
          id: string
          user_id: string
          name: string
          items: string[] // Array of wardrobe_item IDs
          season: 'spring' | 'summer' | 'fall' | 'winter' | 'all'
          weather_condition: 'sunny' | 'rainy' | 'snowy' | 'cloudy' | 'all'
          min_temp: number
          max_temp: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          items: string[]
          season: 'spring' | 'summer' | 'fall' | 'winter' | 'all'
          weather_condition: 'sunny' | 'rainy' | 'snowy' | 'cloudy' | 'all'
          min_temp: number
          max_temp: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          items?: string[]
          season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all'
          weather_condition?: 'sunny' | 'rainy' | 'snowy' | 'cloudy' | 'all'
          min_temp?: number
          max_temp?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 