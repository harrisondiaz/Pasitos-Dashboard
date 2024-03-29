import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ItemCardComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{

  productList: Product[] = [];

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
    
  }

}
