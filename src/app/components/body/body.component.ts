import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

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

  getName() {
    const email = JSON.parse(localStorage.getItem('sb-ggbralugqoodmaklkses-auth-token') || '{}');
    this.userService.getName(email.user.email).subscribe((data: any) => {
      this.name = data.name;
    });
   
  }

  ngOnInit(): void {  
    this.getName();
  }
  

  constructor(private userService: UserService) { }
  
}
