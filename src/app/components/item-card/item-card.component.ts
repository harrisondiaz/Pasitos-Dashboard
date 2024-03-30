import { Component } from '@angular/core';
import { Product, HomePrice, Photo } from '../../interfaces/product.interface';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
  inputs: ['product']
})
export class ItemCardComponent {

  product: Product = {} as Product;

  groupedPhotosByColor: Record<string, Photo[]> = {};
  
  currentColor: string = 'blue';
  
  colorOrder: string[] = [];
  
  modal = false;

   homePriceValueInput = document.getElementById('homePriceValue') as HTMLInputElement;
  homePriceProfitPercentageInput: HTMLInputElement;
  homePriceProfitValueInput: HTMLInputElement;

  constructor() {
    this.homePriceProfitPercentageInput = document.getElementById('homePriceProfitPercentage') as HTMLInputElement;
    this.homePriceProfitValueInput = document.getElementById('homePriceProfitValue') as HTMLInputElement;
    this.homePriceValueInput = document.getElementById('homePriceValue') as HTMLInputElement;
  }


  setColor(color: string) {
    this.currentColor = color;
  }

  print(){
    console.log(this.formattedColors);
  }

  ngOnInit() {
    if (this.product && this.product.photos) {
      this.groupedPhotosByColor = this.groupPhotosByColor(this.product.photos);
      this.colorOrder = Object.keys(this.groupedPhotosByColor); // Capture color order
    }
    this.homePriceValueInput.addEventListener('input', () => {
      const price = parseFloat(this.homePriceValueInput.value);
      const profitPercentage = 30; // Porcentaje de ganancia deseado
      const profitValue = (price * (profitPercentage / 100)).toFixed(2);

      this.homePriceProfitPercentageInput.value = profitPercentage.toString();
      this.homePriceProfitValueInput.value = profitValue;
    });
  }

  groupPhotosByColor(photos: Photo[]): Record<string, Photo[]> {
    const groupedPhotos: Record<string, Photo[]> = {};
  
    photos.forEach(photo => {
      if (!groupedPhotos[photo.color]) {
        groupedPhotos[photo.color] = [];
      }
      groupedPhotos[photo.color].push(photo);
    });
  
    return groupedPhotos;
  }

  get formattedColors(): [string, string[]][] {
    return this.colorOrder.map(color => {
      return [color, this.groupedPhotosByColor[color].map(photo => photo.url)];
    });
  }

  show(){
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
}
