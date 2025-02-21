import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false; // Status login  
  
  constructor() {}  
  
  login() {  
    this.loggedIn = true; // Set status login  
  }  
  
  logout() {  
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userToken');
    localStorage.removeItem('refresh_token');
    this.loggedIn = false; // Set status logout  
  }  
  
  isLoggedIn(): boolean {  
    return this.loggedIn; // Mengembalikan status login  
  }  
  
}
