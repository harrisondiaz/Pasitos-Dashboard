import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Photo, Product } from '../../interfaces/product.interface';
//import { ItemCardComponent } from '../item-card/item-card.component';
import { elementAt } from 'rxjs';
import { PdfService } from '../../services/pdf.service';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  imports: [ToastModule],
})
export class ProductComponent implements OnInit {
  productList: Product[] = [];
  products: Product[] = [];
  groupedPhotosByColor: Record<string, Photo[]> = {};
  colorOrder: string[] = [];
  product: Product = {} as Product;
  isLoading: boolean = true;
  isDeleted: boolean = false;


  getProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productList = products;
        this.isLoading = false;
        this.products = this.productList;
        this.setCurrentColor();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  searchProduct(event: any) {
    let term = '';
    if (event) {
      term = event.target.value.toLowerCase();
    }
    if (term === '') {
      this.products = this.productList;
    } else {
      this.products = this.productList.filter((product) => {
        const condition =
          term !== '' &&
          (product.productname.toLowerCase().includes(term) ||
            product.classification.toLowerCase().includes(term) ||
            product.reference.toLowerCase().includes(term) ||
            product.homeprice.value.toString().includes(term));
        return condition;
      });
    }
  }

  hasColor(product: Product): boolean {
    product.hasColor = product.photos.some((photo) => photo.color !== '');
    return product.hasColor;
  }

  setColor(product: Product, color: string) {
    this.productList.forEach((element) => {
      if (element.id === product.id) {
        element.currentColor = color;
        element.currentPhoto = element.photos.find(
          (photo) => photo.color === color
        )!.url;
      }
    });
  }

  getColor(product: Product): string[] {
    if (product && product.photos) {
      this.groupedPhotosByColor = this.groupPhotosByColor(product.photos);
      this.colorOrder = Object.keys(this.groupedPhotosByColor);
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
    this.router.navigate(['/dashboard', pasare]);
  }

  setEdit(pasare: string, product: Product) {
    this.router.navigate(['dashboard', pasare, product.id]);
  }

  formatColors(product: Product): [string, string[]][] {
    const colors = this.getColor(product);

    // Set hasColor property
    product.hasColor = colors.some((color) => color !== '');

    if (product.id === 13) {
      console.log(
        colors.map((color) => {
          const photoUrls = this.groupedPhotosByColor[color].map(
            (photo) => photo.url
          );
          return [color, photoUrls];
        })
      );
    }

    if (!product.hasColor) {
      return [
        [product.photos[0].color, product.photos.map((photo) => photo.url)],
      ];
    }

    return colors
      .filter((color) => color !== '')
      .map((color) => {
        const photoUrls = this.groupedPhotosByColor[color].map(
          (photo) => photo.url
        );
        return [color, photoUrls];
      });
  }

  getFormatter(value: number) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  }


  getPDF() {
    this.pdfService.exportProducts(this.products).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  setCurrentColor() {
    this.productList.forEach((element) => {
      element.currentColor = element.photos[0].color;
      element.currentPhoto = element.photos[0].url;
    });
  }

  closeDelete() {
    this.isDeleted = false;
  }

  toggleDelete(product: Product) {
    this.product = product;
    this.isDeleted = true;
  }

  deleteProduct() {
    const product = this.product;
    for (let i = 0; i < product.photos.length; i++) {
      this.imageService.deleteImage(product.photos[i].url);
    }
    this.productService.delete(this.product.id).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Producto eliminado', detail: 'Producto eliminado correctamente', life: 5000 });
        this.getProducts();
        this.isDeleted = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto', life: 5000 });
      },
    });
  }

  constructor(
    private productService: ProductService,
    private pdfService: PdfService,
    private router: Router,
    private imageService: ImageService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getProducts();
  }
}
