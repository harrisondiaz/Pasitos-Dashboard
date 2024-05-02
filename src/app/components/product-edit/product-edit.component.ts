import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Photo, Product } from '../../interfaces/product.interface';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  providers: [],
  imports: [NgxCurrencyDirective, ReactiveFormsModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
})
export class ProductEditComponent {
  product: Product = {} as Product;
  id: number = parseInt(localStorage.getItem('id') || '0');
  isNegative = false;
  providerList: any = [];

  form = new FormGroup({
    id: new FormControl(this.product.id, Validators.required),
    reference: new FormControl(this.product.reference, Validators.required),
    productname: new FormControl(this.product.productname, Validators.required),
    quantity: new FormControl(this.product.quantity, Validators.required),
    costwithoutvat: new FormControl(
      this.product.costwithoutvat,
      Validators.required
    ),
    costwithvat: new FormControl(this.product.costwithvat, Validators.required),
    vat: new FormControl(this.product.vat, Validators.required),
    totalcost: new FormControl(this.product.totalcost, Validators.required),
    stock: new FormControl(this.product.stock, Validators.required),
    classification: new FormControl(
      this.product.classification,
      Validators.required
    ),
    supplier: new FormControl(this.product.supplier, Validators.required),
    homepricevalue: new FormControl(
      this.product.homeprice?.value,
      Validators.required
    ),
    homepriceutilitypercentage: new FormControl(
      this.product.homeprice?.utilitypercentage,
      Validators.required
    ),
    homepriceutilityvalue: new FormControl(
      this.product.homeprice?.utilityvalue,
      Validators.required
    ),
    photos: new FormArray([
      new FormGroup({
        color: new FormControl('', Validators.required),
        url: new FormControl('', Validators.required),
      }),
    ]),
    description: new FormControl(this.product.description, Validators.required),
    type: new FormControl(this.product.type, Validators.required),
  });

  selectedColors: Photo[] = [{ color: '', url: '' }];
  selectedColors2: Photo[] = [{ color: '', url: '' }];
  currentImageIndex = 0;

  addImages() {
    this.selectedColors2.push({ color: '', url: '' });
    this.currentImageIndex = this.selectedColors.length - 1;
  }

  remove() {
    if (this.selectedColors2.length > 1) {
      this.selectedColors.pop();
      this.currentImageIndex = this.selectedColors.length - 1;
    }
  }

  updateProduct() {
    console.log(this.form.value);
    localStorage.removeItem('id');
  }

  setWindow(pasare: string) {
    this.router.navigate(['/dashboard', pasare]);
  }

  getProduct() {
    this.productService.getById(this.id).subscribe((product: any) => {
      this.product = product;
      this.form.patchValue(product);
      console.log(product);
      this.selectedColors = product.photos;
      this.form.value.photos = product.photos;
    });
    this.productService.getProviders().subscribe((providers: any) => {
      this.providerList = providers;
    });
    this.setValues();
  }

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProduct();

    if (this.product && this.product.photos) {
      this.selectedColors = this.product.photos;
    }
    this.setValues();
  }

  setValues() {
    this.form.valueChanges.subscribe(values => {

      /**
       * Calcula el costo total en función del costo sin IVA y el IVA
       */
      const costWithoutVat = values.costwithoutvat!;
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
      this.product.homeprice = {
        value: homePriceValue,
        utilitypercentage: utilityPercentage,
        utilityvalue: utilityValue,
      };
  
      // Actualiza el valor de utility en el formulario, pero evita que se dispare un nuevo evento de cambio de valor
      this.form.get('homepriceutilityvalue')?.setValue(utilityValue, { emitEvent: false });
      this.form.get('homepriceutilitypercentage')?.setValue(utilityPercentage, { emitEvent: false });
    });
  }
  
}
