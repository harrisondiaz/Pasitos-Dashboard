import { Component } from '@angular/core';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  inputs: ['name']
})
export class BodyComponent {
  name = '';
  constructor(){}
}
