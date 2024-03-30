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
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{

  productList: Product[] = [];
  renderer: any;
  waiting: boolean = true;

  toggleModal() {
    const element: HTMLElement | null = document.getElementById('crud-modal');
    if (element) {
      element.classList.remove('hidden');
    }
  }

  close(){
    const element: HTMLElement | null = document.getElementById('crud-modal');
    if (element) {
      element.classList.add('hidden');
    }
  }

  selectedColors: Photo[] = [{ color: '', url: '' }];
  currentImageIndex = 0;

  addImages() {
    this.selectedColors.push({ color: '', url: '' });
    this.currentImageIndex = this.selectedColors.length - 1;
  }

  remove(){
    if(this.selectedColors.length > 1){
      this.selectedColors.pop();
      this.currentImageIndex = this.selectedColors.length - 1;
    }
  }

  


  getProducts() {
    console.log(this.productService.getAll());

    this.productService.getAll().subscribe({
      next: (products) => {
        this.productList= products;
      },
      error: (error) => {
        console.error(error);
      }
    
    });
  }

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
    setTimeout(() => {
      this.waiting = false;
    }, 5000);
  }

}
