import { Component } from '@angular/core';
import { Photo, HomePrice, Product } from '../../interfaces/product.interface';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-new-produc',
  standalone: true,
  imports: [],
  templateUrl: './new-produc.component.html',
  styleUrl: './new-produc.component.scss'
})
export class NewProducComponent {

  form = new FormGroup({
    productID: new FormControl('', Validators.required),
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

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    window.location.reload();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
