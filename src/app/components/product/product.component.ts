import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Photo, Product } from '../../interfaces/product.interface';
//import { ItemCardComponent } from '../item-card/item-card.component';
import { elementAt } from 'rxjs';
import { PdfService } from '../../services/pdf.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  productList: Product[] = [];
  products: Product[] = [];
  groupedPhotosByColor: Record<string, Photo[]> = {};
  colorOrder: string[] = [];
  isLoading: boolean = true;

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
    this.router.navigate(['/dashboard', pasare]);
  }
  
  setEdit(pasare: string, product: Product) {
    localStorage.setItem('id', product.id.toString()); // Convert product.id to string
    this.router.navigate(['/dashboard', pasare]);
  }

  formatColors(product: Product): [string, string[]][] {
    const colors = this.getColor(product);
  
    // Set hasColor property
    product.hasColor = colors.some(color => color !== "");
  
    return colors
      .map((color) => {
        const photoUrls = this.groupedPhotosByColor[color].map(
          (photo) => photo.url
        );
        return [color, photoUrls];
      });
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

  constructor(private productService: ProductService, private pdfService: PdfService, private router: Router) {}

  ngOnInit() {
    this.getProducts();
  }
}
