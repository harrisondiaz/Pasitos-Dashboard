import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Photo, Product } from '../../interfaces/product.interface';
import { NgxCurrencyDirective } from 'ngx-currency';


@Component({
  selector: 'app-product-edit',
  standalone: true,
  providers: [],
  imports: [NgxCurrencyDirective  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',

  
})
export class ProductEditComponent {

  product = localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product') as string) : {} as Product;

  form = new FormGroup({
    productID: new FormControl(this.product.productID, Validators.required),
    reference: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    costWithoutVAT: new FormControl('', Validators.required),
    costWithVAT: new FormControl('', Validators.required),
    vat: new FormControl('', Validators.required),
    totalCost: new FormControl('', Validators.required),
    stock: new FormControl('', Validators.required),
    classification: new FormControl('', Validators.required),
    supplier: new FormControl('', Validators.required),
    homePrice: new FormGroup({
      value: new FormControl('', Validators.required),
      profitPercentage: new FormControl('', Validators.required),
      profitValue: new FormControl('', Validators.required),
    }),
    photos: new FormArray([
      new FormGroup({
        color: new FormControl('', Validators.required),
        url: new FormControl('', Validators.required),
      }),
    ]),
    description: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
  });

  selectedColors: Photo[] = [{ color: '', url: '' }];
  selectedColors2: Photo[] = [{ color: '', url: '' }];
  currentImageIndex = 0;

  addImages() {
    this.selectedColors2.push({ color: '', url: '' });
    this.currentImageIndex = this.selectedColors.length - 1;
  }

  remove(){
    if(this.selectedColors2.length > 1){
      this.selectedColors.pop();
      this.currentImageIndex = this.selectedColors.length - 1;
    }
  }

  updateProduct(){
    console.log(this.form.value);
    localStorage.removeItem('product');
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    window.location.reload();
  }

  constructor() { }

  ngOnInit(): void {
    if (this.product && this.product.photos) {
      this.selectedColors = this.product.photos;
    }
    
  }

}
