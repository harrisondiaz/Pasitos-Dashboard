import { Injectable } from '@angular/core';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase!: SupabaseClient;
  user = new BehaviorSubject<User | null >(null);

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event);
      console.log('session', session);
      if(event === 'SIGNED_IN') {
        console.log('User signed in');
        this.user.next(session!.user);
        this.router.navigate(['/dashboard']);
      } else if(event === 'SIGNED_OUT') {
        console.log('User signed out');
        this.user.next(null);
        this.router.navigate(['/']);
      }
      
    });
  }

  async signIn(email: string, password: string) {
    const {data, error} = await this.supabase.auth.signInWithPassword ({ email, password });
    data && this.user.next(data.user);
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }


  getCurrentUser(){
    return this.user.asObservable();
  }
}
