import { Component } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  inputs: ['message', 'type']
})
export class ToastComponent {

  message: string = '';
  type: string = '';

  constructor() { }

}
