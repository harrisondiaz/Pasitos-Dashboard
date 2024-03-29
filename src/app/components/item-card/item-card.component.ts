import { Component } from '@angular/core';
import { Product, HomePrice, Photo } from '../../interfaces/product.interface';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
  inputs: ['product']
})
export class ItemCardComponent {

  product: Product = {} as Product;

  groupedPhotosByColor: Record<string, Photo[]> = {};
  
  
  
  
  
  

  ngOnInit() {
    if (this.product && this.product.photos) {
      this.groupedPhotosByColor = this.groupPhotosByColor(this.product.photos);
    }
  }

  groupPhotosByColor(photos: Photo[]): Record<string, Photo[]> {
    const groupedPhotos: Record<string, Photo[]> = {};
  
    photos.forEach(photo => {
      if (!groupedPhotos[photo.color]) {
        groupedPhotos[photo.color] = [];
      }
      groupedPhotos[photo.color].push(photo);
    });
  
    return groupedPhotos;
  }

  get formattedColors(): [string, string[]][] {
    const colors = Object.entries(this.groupedPhotosByColor);
    return colors.map(([color, urls]) => [
      color,
      urls.map(url => url.url)
    ]);
  }
}
