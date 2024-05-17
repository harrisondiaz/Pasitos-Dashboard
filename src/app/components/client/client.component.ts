import { Component } from '@angular/core';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { ToastComponent } from '../toast/toast.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-client',
  standalone: true,
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  imports: [ToastComponent, ReactiveFormsModule],
})
export class ClientComponent {
  clients: Client[] = [];
  isLoading: boolean = true;
  client: Client[] = [];
  aux: any = {};
  isToast: boolean = false;
  message: string = '';
  type: string = '';
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    whatsapp: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]*$')]),
  });
  

  constructor(private clientService: ClientService) {
    
  }

  getClients() {
    this.clientService.getClient().subscribe({
      next: (clients: any) => {
        this.clients = clients;
        this.isLoading = false;
        this.client = this.clients;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createClient() {
    if (this.form.valid) {
      this.aux = this.form.value;
      this.message = 'Creando cliente...';
      this.type = 'load';
      this.isToast = true;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
      this.clientService.createClient(this.aux).subscribe({
        next: (response: any) => {
          this.getClients();
          this.message = 'Cliente creado correctamente';
          this.type = 'success';
          this.isToast = true;
          setTimeout(() => {
            this.isToast = false;
          }, 3000);
          this.form.reset();
        },
        error: (error) => {
          console.error(error);
          this.message = 'Error al crear el cliente';
          this.type = 'error';
          this.isToast = true;
          setTimeout(() => {
            this.isToast = false;
          }, 3000);
        },
      });
    }else if (this.form.invalid){
      this.message = 'Debe llenar todos los campos';
      this.type = 'warning';
      this.isToast = true;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
    }
  }

  deleteClient(id: number) {
    this.message = 'Eliminando cliente...';
    this.type = 'load';
    this.isToast = true;
    setTimeout(() => {
      this.isToast = false;
    }, 3000);
    this.clientService.deleteClient(id).subscribe({
      next: (response: any) => {
        this.getClients();
        this.message = 'Cliente eliminado correctamente';
        this.type = 'success';
        this.isToast = true;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
      },
      error: (error) => {
        console.error(error);
        this.message = 'Error al eliminar el cliente';
        this.type = 'error';
        this.isToast = true;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
      },
    });
  }

  setWindow(parse: string) {}

  searchClient(event?: any) {
    let term = '';
    if (event) {
      term = event.target.value;
    }
    this.clients = this.client.filter((client) => {
      return (
        client.name.includes(term) ||
        client.whatsapp.toString().includes(term.toLowerCase()) ||
        client.email.toLowerCase().includes(term.toLowerCase())
      );
    });
  }

  ngOnInit() {
    this.getClients();
  }
}
