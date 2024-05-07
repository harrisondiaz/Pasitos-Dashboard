import { Injectable, NgZone } from '@angular/core';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase!: SupabaseClient;
  user = new BehaviorSubject<User | null>(null);
  private returnUrl: string | null = null;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );

    /*this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event);
      console.log('session', session);
      if (event === 'SIGNED_IN') {
        this.user.next(session!.user);
        this.ngZone.run(() => {
          console.log(this.returnUrl);
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          }
          
          this.returnUrl = null;
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        this.user.next(null);
        this.ngZone.run(() => {
          this.returnUrl = this.router.url;
          this.router.navigate(['/']);
        });
      }
    });*/
    this.session();
    
  }

  async session(){
    const {data, error} = await this.supabase.auth.getSession();

    if(error){
      throw error;
    }
    if(data && data.session){
      this.user.next(data.session.user);
      this.router.navigate(['dashboard']);
    }else{
      this.user.next(null);
      this.router.navigate(['']);
    }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    data && this.user.next(data.user);
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }

  getCurrentUser() {
    return this.user.asObservable();
  }
}
