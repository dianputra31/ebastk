import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SharedService } from '../services/shared.service';
import { ApiClientService } from '../services/api.client';
import axios from 'axios';

@Component({
  selector: 'app-the-login',
  templateUrl: './the-login.component.html',
  styleUrls: ['./the-login.component.scss']
})
export class TheLoginComponent implements OnInit {
  showLauncher = true;  
  username: string = '';  
  password: string = '';  
  fadeOut = false;  
  isButtonDisabled: boolean = false;   
  showBackground = true; // Menampilkan latar belakang putih  
  slices = [  
    '../../assets/icons/row-1-column-1.png',  
    '../../assets/icons/row-1-column-2.png',  
    '../../assets/icons/row-1-column-3.png',  
    '../../assets/icons/row-1-column-4.png',  
    '../../assets/icons/row-1-column-5.png' 
  ];  
  errlog: string = '';
  @Output() onSuccessLogin = new EventEmitter();
  isLoading: boolean = false;
  loggedIn: string | null | undefined;
  isLogin = false;

  @ViewChild('passwordInput') passwordField!: ElementRef;


  constructor(private router: Router, private authService: AuthService, private apiClient: ApiClientService) {}  

  ngOnInit() { 
    this.isLogin = localStorage.getItem('userToken') !== null;

    this.loggedIn = localStorage.getItem('userToken');
    
    if(this.isLogin){
      this.authService.login();
      this.router.navigate(['/dashboard']);
    }

    setTimeout(() => {  
      this.showBackground = false; // Sembunyikan latar belakang putih  
      this.startSliceAnimation(); // Mulai animasi slice  
    }, 50); // Tampilkan latar belakang putih selama 3 detik  
  } 

  startSliceAnimation() {  
    setTimeout(() => {  
      this.showLauncher = false; // Sembunyikan launcher setelah animasi selesai  
    }, this.slices.length * 500); // Sesuaikan durasi sesuai jumlah slice  
  }  
  



  onSubmit() {  
    // Logika untuk menangani login  
    console.log('Username:', this.username);  
    console.log('Password:', this.password);  
    this.isLoading = false;
    this.login();
  }  

  focusPassword() {
    this.passwordField.nativeElement.focus();
  }


  async login() {
    this.isButtonDisabled = true;
    const loginData = {
      username: this.username.toLowerCase(),
      password: this.password
    };
    this.errlog = "";
    try {
      const response = await this.apiClient.postone<any>('/login', loginData);
      console.log('Data posted:', response);

      // Jika login berhasil, simpan data ke localStorage
      if (response && response.username) {
        // Set status login  

        // localStorage.setItem('username', response.username);
        // localStorage.setItem('email', response.email);
        // localStorage.setItem('userToken', response.token);
        // localStorage.setItem('refresh_token', response.refresh_token);
        
        // console.log('Login successful:', response);
        // this.isLoading = false;

        // this.onSuccessLogin.emit(true);
        // console.log(response.token);
        // this.authService.login();

        // this.router.navigate(['/dashboard']);
        console.log("here we go");

        try {
          localStorage.setItem('username', response.username);
          localStorage.setItem('email', response.email);
          localStorage.setItem('userToken', response.token);
          localStorage.setItem('refresh_token', response.refresh_token);

          console.log('Login successful:', response);
          this.isLoading = false;
          this.onSuccessLogin.emit(true);
          console.log(response.token);
          this.authService.login();
          this.router.navigate(['/dashboard']);
      } catch (localStorageError) {
          console.error('Error saat menyimpan ke localStorage:', localStorageError);
          this.errlog = 'Terjadi kesalahan saat menyimpan data.';
          this.isLoading = false;
          this.isButtonDisabled = false;
      }

      }else{
        console.log('here failed')
        this.errlog = 'Username atau password salah';
      }

    } catch (error) {
      this.isButtonDisabled = false;
      this.authService.logout();
      if (axios.isAxiosError(error)) {
        // Cek status kode dari respons
        if (error.response && error.response.status === 401) {
          this.errlog = 'Username atau password salah.';
        } else {
          this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
        }
      } else {
        this.errlog = 'Terjadi kesalahan, silakan coba lagi.';
      }
      console.error('Error during login:', error);
      this.isLoading = false;
    }
  }

}
