import { supabase } from './supabase'

export class FileUploadService {
  static async uploadImage(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { error } = await supabase.storage
      .from('wardrobe-images')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading image:', error)
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('wardrobe-images')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }

  static async deleteImage(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('wardrobe-images')
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }
} 