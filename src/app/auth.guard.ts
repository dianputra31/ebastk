import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor(private router: Router) {}  

  canActivate(): boolean {  
    const isLoggedIn = this.checkLogin(); // Ganti dengan logika pemeriksaan login Anda  
  
    if (!isLoggedIn) {  
      this.router.navigate(['/login']); // Arahkan ke halaman login jika belum login  
      return false;  
    }  
    return true;  
  }  
  
  checkLogin(): boolean {  
    // Implementasikan logika untuk memeriksa apakah pengguna sudah login  
    // Misalnya, cek token di localStorage atau service  
    return !!localStorage.getItem('userToken'); // Contoh sederhana  
  }  
  
}
