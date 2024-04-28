import { Component } from '@angular/core';
import { Photo, HomePrice, Product } from '../../interfaces/product.interface';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-new-produc',
  standalone: true,
  imports: [ReactiveFormsModule, NgxCurrencyDirective],
  templateUrl: './new-produc.component.html',
  styleUrl: './new-produc.component.scss'
})
export class NewProducComponent {

  form = new FormGroup({
    id: new FormControl('', Validators.required),
    reference: new FormControl('', Validators.required),
    productname: new FormControl('', Validators.required),
    quantity: new FormControl(0, Validators.required),
    costwithoutvat: new FormControl(0, Validators.required),
    costwithvat: new FormControl(0, Validators.required),
    vat: new FormControl(0.0, Validators.required),
    totalcost: new FormControl(0, Validators.required),
    stock: new FormControl(0, Validators.required),
    classification: new FormControl(0, Validators.required),
    supplier: new FormControl(0, Validators.required),
    homepricevalue: new FormControl(0, Validators.required),
    homepriceutilitypercentage: new FormControl(0.0, Validators.required),
    homepriceutilityvalue: new FormControl(0, Validators.required),
    photos: new FormArray([
      new FormGroup({
        color: new FormControl('', Validators.required),
        url: new FormControl('', Validators.required),
      }),
    ]),
    description: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
  });

  isNegative = false;
  selectedColors: Photo[] = [];
  selectedColors2: Photo[] = [{ color: '', url: '' }];
  currentImageIndex = 0;
  providerList: any = [];

  setValues() {
    this.form.valueChanges.subscribe(values => {

      /**
       * Calcula el costo total en función del costo sin IVA y el IVA
       */
      const costWithoutVat  = values.costwithoutvat!;
      const costWithVAT = values.costwithvat!;
      const vat = ((costWithVAT - costWithoutVat) / costWithoutVat) * 100;
      const totalCost = costWithoutVat + (costWithoutVat * vat) / 100;
      this.form.get('totalcost')?.setValue(totalCost, { emitEvent: false });
      this.form.get('vat')?.setValue(vat, { emitEvent: false });


      /**
       * Calcula el porcentaje de utilidad y el valor de utilidad en función del precio del producto 
       */
      const homePriceValue = values.homepricevalue!;
      const utilityPercentage = homePriceValue !==0 ? ((homePriceValue-values.totalcost!) / homePriceValue )*100:0;
      const utilityValue = homePriceValue !== 0 ? homePriceValue - values.totalcost! : 0;
      if(homePriceValue < values.totalcost!){
        this.isNegative = true;
      }else{
        this.isNegative = false;
      }
      
  
      // Actualiza el valor de utility en el formulario, pero evita que se dispare un nuevo evento de cambio de valor
      this.form.get('homepriceutilityvalue')?.setValue(utilityValue, { emitEvent: false });
      this.form.get('homepriceutilitypercentage')?.setValue(utilityPercentage, { emitEvent: false });
    });
  }


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

  images: File[] = [];

  postProduct() {
    const formData = new FormData();
    this.images.forEach((image, index) => {
      formData.append(`image${index}`, image, image.name);
    });
    
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    window.location.reload();
  }

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProviders().subscribe((providers: any) => {
      this.providerList = providers;
    });
    this.setValues();
  }

}
