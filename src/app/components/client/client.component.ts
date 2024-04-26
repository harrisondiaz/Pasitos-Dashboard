import { Component } from '@angular/core';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent {
  clients: Client[] = [];
  isLoading: boolean = true;
  client: Client[] = [];

  constructor(private clientService: ClientService) {}

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
