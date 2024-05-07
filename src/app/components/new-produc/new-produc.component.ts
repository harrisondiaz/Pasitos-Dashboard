import { Component } from '@angular/core';
import { Photo, HomePrice, Product } from '../../interfaces/product.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ImageService } from '../../services/image.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-new-produc',
  standalone: true,
  templateUrl: './new-produc.component.html',
  styleUrl: './new-produc.component.scss',
  imports: [ReactiveFormsModule, NgxCurrencyDirective, ToastComponent],
})
export class NewProducComponent {
  form = new FormGroup({
    id: new FormControl(0, Validators.required),
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
    description: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
  });

  isNegative = false;
  selectedColors: any[] = [];
  selectedColors2: any[] = [{ color: '', url: File! }];
  currentImageIndex = 0;
  providerList: any = [];
  isCorrect: boolean = false;
  message: string = '';
  type: string = '';
  selectedFile: File | null = null;
  isSeleted: boolean = false;
  setValues() {
    this.form.valueChanges.subscribe((values) => {
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
      const utilityPercentage =
        homePriceValue !== 0
          ? ((homePriceValue - values.totalcost!) / homePriceValue) * 100
          : 0;
      const utilityValue =
        homePriceValue !== 0 ? homePriceValue - values.totalcost! : 0;
      if (homePriceValue < values.totalcost!) {
        this.isNegative = true;
      } else {
        this.isNegative = false;
      }

      // Actualiza el valor de utility en el formulario, pero evita que se dispare un nuevo evento de cambio de valor
      this.form
        .get('homepriceutilityvalue')
        ?.setValue(utilityValue, { emitEvent: false });
      this.form
        .get('homepriceutilitypercentage')
        ?.setValue(utilityPercentage, { emitEvent: false });
    });
  }

  

  fileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.selectedFile = file;
    this.isSeleted = true;
  }

  async addImages() {
    try {
      this.message = 'Subiendo imagen...';
      this.type = 'load';
      this.isCorrect = true;
      const photos = File;
      const color = this.form.get('color')?.value;

      if (this.selectedFile) {
        const url = await this.imageService.uploadImageAndGetUrl(
          this.selectedFile
        );
        if (url) {
          this.isCorrect =false;
          this.message = 'Imagen subida correctamente';
          this.type = 'success';
          this.isCorrect = true;
          setTimeout(() => {
            this.message = '';
            this.type = '';
            this.isCorrect = false;
          }, 5000);
          this.isSeleted = false;
          this.selectedColors.push({ color: color || "", url });
        } else {
          this.message = 'Error al subir la imagen';
          this.type = 'error';
          this.isCorrect = false;
          setTimeout(() => {
            this.message = '';
            this.type = '';
            this.isCorrect = false;
          }, 5000);
        }
      }
    } catch (error) {
      this.message = 'Error al subir la imagen';
      this.type = 'error';
      this.isCorrect = false;
      setTimeout(() => {
        this.message = '';
        this.type = '';
        this.isCorrect = false;
      }, 5000);
    }
  }

  remove() {
    if (this.selectedColors.length > 0) {
      this.imageService.deleteImage(this.selectedColors[this.selectedColors.length - 1].url);
      this.selectedColors.pop();

      this.currentImageIndex = this.selectedColors.length - 1;
    }
  }

  postProduct() {
    if (this.form.valid) {
      const product = this.form.value as unknown as Product;
      product.photos = this.selectedColors;
      console.log(product);
      this.productService.create(product).subscribe({
        next: (response) => {
          this.message = 'Producto creado correctamente';
          this.type = 'success';
          this.isCorrect = true;
          setTimeout(() => {
            this.message = '';
            this.type = '';
            this.isCorrect = false;
          }, 5000);
          setTimeout(() => {
            this.router.navigate(['dashboard', 'product']);
          }, 5000);
        },
        error: (error) => {
          this.message = 'Error al crear el producto';
          this.type = 'error';
          this.isCorrect = true;
          setTimeout(() => {
            this.message = '';
            this.type = '';
            this.isCorrect = false;
          }, 5000);
        },
      });
    } else {
      console.log('Por favor, llene todos los campos');
      this.message = 'Por favor, llene todos los campos';
      this.type = 'warning';
      this.isCorrect = true;
      setTimeout(() => {
        this.message = '';
        this.type = '';
        this.isCorrect = false;
      }, 5000);
    }
  }

  setWindow(pasare: string) {
    this.router.navigate(['/dashboard', pasare]);
  }

  constructor(
    private productService: ProductService,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.productService.getProviders().subscribe((providers: any) => {
      this.providerList = providers;
    });
    this.setValues();
  }
}
