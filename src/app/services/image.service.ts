import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private supabase: SupabaseClient ;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  async uploadImageAndGetUrl(file: File): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('Products')
      .upload(file.name, file);
    if (error) {
      throw error;
    }
    const url = await this.supabase.storage.from('Products').createSignedUrl(file.name,631152000); 
    console.log(url.data?.signedUrl);
    return url.data!.signedUrl;
  }

  async downloadImage(name: string) {
    const { data, error } = await this.supabase.storage
      .from('Products')
      .download(name);
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteImage(name: string) {
    const { data, error } = await this.supabase.storage
      .from('Products')
      .remove([name]);
    if (error) {
      throw error;
    }
    return data;
  }
}
