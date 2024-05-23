import { Component } from '@angular/core';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-client',
  standalone: true,
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  imports: [ToastModule, ReactiveFormsModule],
})
export class ClientComponent {
  clients: Client[] = [];
  isLoading: boolean = true;
  client: Client[] = [];
  aux: any = {};
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    whatsapp: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]*$')]),
  });
  

  constructor(private clientService: ClientService, private messageService: MessageService) {
    
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
      this.messageService.add({ severity: 'info', summary: 'Creando cliente...' });
      this.clientService.createClient(this.aux).subscribe({
        next: (response: any) => {
          this.getClients();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado correctamente' });
          this.form.reset();
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el cliente' });
        },
      });
    }else if (this.form.invalid){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, ingresa los datos correctamente' });
    }
  }

  deleteClient(id: number) {
   this.messageService.add({ severity: 'info', summary: 'Eliminando cliente...' });
    this.clientService.deleteClient(id).subscribe({
      next: (response: any) => {
        this.getClients();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado correctamente' });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el cliente' });
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
