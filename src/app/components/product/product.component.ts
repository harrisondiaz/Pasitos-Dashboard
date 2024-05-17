import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Photo, Product } from '../../interfaces/product.interface';
//import { ItemCardComponent } from '../item-card/item-card.component';
import { elementAt } from 'rxjs';
import { PdfService } from '../../services/pdf.service';
import { Router } from '@angular/router';
import { ToastComponent } from "../toast/toast.component";
import { ImageService } from '../../services/image.service';

@Component({
    selector: 'app-product',
    standalone: true,
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
    imports: [ToastComponent]
})
export class ProductComponent implements OnInit {
  productList: Product[] = [];
  products: Product[] = [];
  groupedPhotosByColor: Record<string, Photo[]> = {};
  colorOrder: string[] = [];
  product: Product = {} as Product;
  isLoading: boolean = true;
  isDeleted: boolean = false;
  IsCorrectlyDeleted: string = '';
  message: string = '';
  type: string = '';

  getProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productList = products;
        console.log(this.productList);
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
    if(event){
      term = event.target.value.toLowerCase();
      console.log(term);
    } 
    if(term === '') {
      this.products = this.productList;
    }else{
      this.products = this.productList.filter((product) => {
      const condition =
          term !== '' &&
          (product.productname.toLowerCase().includes(term)||
          product.classification.toLowerCase().includes(term)|| 
          product.reference.toLowerCase().includes(term) ||
          product.homeprice.value.toString().includes(term));
          console.log(condition);
        return condition;
            
          });
    }
  }

  hasColor(product: Product): boolean {
    product.hasColor = product.photos.some((photo) => photo.color !== "");
    return product.hasColor;
  }

  setColor(product: Product,color: string) {
    this.productList.forEach((element) => {
      if (element.id === product.id) {
        console.log(element.productname, color);
        element.currentColor = color;
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
    product.hasColor = colors.some(color => color !== "");
  
    return colors
      .filter((color) => color !== "")
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

  print(text: string) {
    console.log(text);
  }

  getPDF(){
    this.pdfService.exportProducts(this.products).subscribe({
      next: (response) => {
        console.log(response);
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  setCurrentColor(){
    this.productList.forEach((element) => {
      element.currentColor = element.photos[0].color;
    });
  }

  closeDelete(){
    this.isDeleted = false;
  }

  toggleDelete(product: Product) {
    this.product = product;
    this.isDeleted = true;
  }

  deleteProduct(){
    const product = this.product;
    this.productService.delete(this.product.id).subscribe({
      next: (response) => {
        for (let i = 0; i < product.photos.length; i++) {
          this.imageService.deleteImage(product.photos[i].url);
        }
        this.IsCorrectlyDeleted = 'true';
        this.message = 'Producto eliminado correctamente';
        this.type = 'success';
        setTimeout(() => {
          this.message = '';
          this.IsCorrectlyDeleted = '';
          this.type = '';
        }, 5000);
        this.getProducts();
        this.isDeleted = false;
      },
      error: (error) => {
        this.IsCorrectlyDeleted = 'false';
        this.message = 'Error al eliminar el producto';
        this.type = 'error';
        setTimeout(() => {
          this.message = '';
          this.IsCorrectlyDeleted = '';
          this.type = '';
        }, 5000);
        console.error(error);
      },
    });
  }

  constructor(private productService: ProductService, private pdfService: PdfService, private router: Router, private imageService:ImageService) {}

  ngOnInit() {
    this.getProducts();
  }
}
