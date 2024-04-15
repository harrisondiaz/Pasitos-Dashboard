import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Photo, Product } from '../../interfaces/product.interface';
import { ItemCardComponent } from '../item-card/item-card.component';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ItemCardComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  productList: Product[] = [];
  groupedPhotosByColor: Record<string, Photo[]> = {};
  currentColor: string = 'blue';
  colorOrder: string[] = [];

  getProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productList = products;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  setColor(color: string) {
    this.currentColor = color;
  }

  getColor(product: Product): string[] {
    if (product && product.photos) {
      this.groupedPhotosByColor = this.groupPhotosByColor(product.photos);
      this.colorOrder = Object.keys(this.groupedPhotosByColor); // Capture color order
      return this.colorOrder;
    }
    return []; // Add a default return value
  }

  groupPhotosByColor(photos: Photo[]): Record<string, Photo[]> {
    const groupedPhotos: Record<string, Photo[]> = {};

    photos.forEach((photo) => {
      if (!groupedPhotos[photo.color]) {
        groupedPhotos[photo.color] = [];
      }
      groupedPhotos[photo.color].push(photo);
    });

    return groupedPhotos;
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    window.location.reload();
  }

  formatColors(product: Product): [string, string[]][] {
    const colors = this.getColor(product);
    return colors.map((color) => {
      const photoUrls = this.groupedPhotosByColor[color].map(
        (photo) => photo.url
      );
      return [color, photoUrls];
    });
  }

  print(text: string) {
    console.log(text);
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts();
  }
}
