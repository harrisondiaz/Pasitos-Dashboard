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
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { ToastComponent } from '../toast/toast.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  providers: [],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
  imports: [NgxCurrencyDirective, ReactiveFormsModule, ToastComponent],
})
export class ProductEditComponent {
  product: Product = {} as Product;
  id: number = 0;
  isNegative = false;
  providerList: any = [];

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
    classification: new FormControl('', Validators.required),
    supplier: new FormControl(0, Validators.required),
    homepricevalue: new FormControl(0, Validators.required),
    homepriceutilitypercentage: new FormControl(0.0, Validators.required),
    homepriceutilityvalue: new FormControl(0, Validators.required),
    description: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
  });

  selectedColors: any[] = [];
  selectedColors2: any[] = [{ color: '', url: File! }];
  currentImageIndex = 0;
  aux: Product = {} as Product;
  isCorrect: boolean = false;
  message: string = '';
  type: string = '';
  selectedFile: File | null = null;
  isSeleted: boolean = false;
  color: string = '';

  fileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.selectedFile = file;
    this.isSeleted = true;
  }

  changeColor(event: any) {
    this.color = event.target.value;
  }

  async addImages() {
    if (this.selectedFile) {
      try {
        this.message = 'Subiendo imagen...';
        this.type = 'load';
        this.isCorrect = true;
        const photos = File;
        const color = this.color;

        if (this.selectedFile) {
          const url = await this.imageService.uploadImageAndGetUrl(
            this.selectedFile
          );
          this.selectedFile = null;
          if (url) {
            this.isCorrect = false;
            this.message = 'Imagen subida correctamente';
            this.type = 'success';
            this.isCorrect = true;
            setTimeout(() => {
              this.message = '';
              this.type = '';
              this.isCorrect = false;
            }, 5000);
            this.isSeleted = false;
            this.selectedColors.push({ color: color || '', url });
            this.color = '';
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
    } else {
      this.message = 'No hay imagen seleccionada';
      this.type = 'warning';
      this.isCorrect = true;
      setTimeout(() => {
        this.message = '';
        this.type = '';
        this.isCorrect = false;
      }, 5000);
    }
  }

  changeColorIndex(event: any, index: number) {
    this.selectedColors[index].color = event.target.value;
  }

  removebyIndex(index: number) {
    const url = this.selectedColors[index].url;
    console.log(url);

    // Create a URL object
    const urlObj = new URL(url);

    // Split the pathname into segments
    const pathSegments = urlObj.pathname.split('/');

    // The file name is the last segment
    const fileName = pathSegments[pathSegments.length - 1];

    this.imageService.deleteImage(fileName).then(() => {
      this.selectedColors.splice(index, 1);
      this.message = 'Imagen eliminada correctamente';
      this.type = 'success';
      this.isCorrect = true;
      setTimeout(() => {
        this.message = '';
        this.type = '';
        this.isCorrect = false;
      }, 5000);
    });

    //this.selectedColors.splice(index, 1);
  }

  remove() {
    if (this.selectedFile) {
      this.selectedFile = null;
      this.isSeleted = false;
    } else {
      this.message = 'No hay imagen seleccionada';
      this.type = 'warning';
      this.isCorrect = true;
      setTimeout(() => {
        this.message = '';
        this.type = '';
        this.isCorrect = false;
      }, 5000);
    }
  }

  updateProduct() {
    if (this.form.valid && this.isDifferent(this.product)) {
      const id = this.product.id;
      this.product = this.form.value as Product;
      this.product.id = id;
      this.product.photos = this.selectedColors;
      console.log(this.product);
      this.message = 'Guardando cambios...';
      this.type = 'load';
      this.isCorrect = true;
      setInterval(() => {
        this.message = '';
        this.type = '';
        this.isCorrect = false;
      }, 5000);
      this.productService.update(this.product).subscribe(() => {
        this.message = 'Cambios guardados correctamente';
        this.type = 'success';
        this.isCorrect = true;
        setTimeout(() => {
          this.message = '';
          this.type = '';
          this.setWindow('product');
          this.isCorrect = false;
        }, 5000);
        
      } );
    } else {
      this.message = 'No hay cambios que guardar';
      this.type = 'warning';
      this.isCorrect = true;
      setTimeout(() => {
        this.message = '';
        this.type = '';
        this.isCorrect = false;
      }, 2000);
    }
  }

  isDifferent(product: Product): boolean {
    let productVatString = product.vat.toString();
    let decimalIndex = productVatString.indexOf('.');
    if (decimalIndex !== -1) {
      productVatString = productVatString.substring(0, decimalIndex + 3);
    }

    return (
      this.form.value.id !== product.id ||
      this.form.value.reference !== product.reference ||
      this.form.value.productname !== product.productname ||
      this.form.value.quantity !== product.quantity ||
      this.form.value.costwithoutvat !== product.costwithoutvat ||
      this.form.value.costwithvat !== product.costwithvat ||
      this.form.value.vat!.toFixed(2) !== productVatString ||
      this.form.value.totalcost !== product.totalcost ||
      this.form.value.stock !== product.stock ||
      this.form.value.classification !== product.classification ||
      this.form.value.supplier !== product.supplier ||
      this.form.value.homepricevalue !== product.homeprice.value ||
      this.form.value.homepriceutilitypercentage!.toFixed(2) !==
        product.homeprice.utilitypercentage.toFixed(2) ||
      this.form.value.homepriceutilityvalue !==
        product.homeprice.utilityvalue ||
      this.form.value.description !== product.description ||
      this.form.value.type !== product.type
    );
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    this.router.navigate(['dashboard', pasare]);
  }

  getProduct() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.id = Number(params.get('id'));
          return this.productService.getById(this.id);
        })
      )
      .subscribe((product: any) => {
        this.product = product;
        this.selectedColors = product.photos;
        this.form.patchValue(product);
        console.log(this.form.value);
      });
  }

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private imageService: ImageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProduct();
    this.productService.getProviders().subscribe((providers: any) => {
      this.providerList = providers;
    });
    if (this.product && this.product.photos) {
      this.selectedColors = this.product.photos;
    }
    this.setValues();
  }

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
      this.product.homeprice = {
        value: homePriceValue,
        utilitypercentage: utilityPercentage,
        utilityvalue: utilityValue,
      };

      // Actualiza el valor de utility en el formulario, pero evita que se dispare un nuevo evento de cambio de valor
      this.form
        .get('homepriceutilityvalue')
        ?.setValue(utilityValue, { emitEvent: false });
      this.form
        .get('homepriceutilitypercentage')
        ?.setValue(utilityPercentage, { emitEvent: false });
    });
  }
}
