import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private supabase!: SupabaseClient;


  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);
   }

   async uploadImage(file: File) {
    const { data, error } = await this.supabase.storage.from('Products').upload(file.name, file);
    if (error) {
      throw error;
    }
    return data;
  }

  async downloadImage(name: string) {
    const { data, error } = await this.supabase.storage.from('Products').download(name);
    if (error) {
      throw error;
    }
    return data;
  }

  
}
