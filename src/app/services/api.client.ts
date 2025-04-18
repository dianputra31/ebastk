import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private baseUrl = environment.apiUrl;
  private baseUrlOther = environment.apiUrlOther;
  public ctype = 'application/json'; // Contoh nilai untuk Content-Type

  constructor() { }

  // Metode GET
  async getone<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.baseUrl}${endpoint}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // Metode POST
  async postone<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await axios.post<T>(`${this.baseUrl}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }

  // Metode PUT
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await axios.put<T>(`${this.baseUrl}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  // Metode DELETE
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.delete<T>(`${this.baseUrl}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }


  private getToken(): string {
    // Implementasikan logika untuk mendapatkan token otentikasi
    // Misalnya, dari local storage atau session storage
    return localStorage.getItem('userToken') || '';
  }


  // Metode POST dengan headers
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      // Membuat objek headers
      const headers = {
        'accept': this.ctype,
        'Authorization': 'Bearer ' + this.getToken(),
        'Content-Type': this.ctype // Menggunakan this.ctype sebagai Content-Type
      };

      // Melakukan Axios POST request dengan headers
      const response = await axios.post<T>(`${this.baseUrl}${endpoint}`, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }


  async get<T>(endpoint: string): Promise<T> {
    try {
      // Membuat objek headers
      const headers = {
        'accept': this.ctype,
        'Authorization': 'Bearer ' + this.getToken(),
        'Content-Type': this.ctype // Menggunakan this.ctype sebagai Content-Type
      };

      // Melakukan Axios GET request dengan headers
      const response = await axios.get<T>(`${this.baseUrl}${endpoint}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }


  async getOther<T>(endpoint: string): Promise<T> {
    try {
      // Membuat objek headers
      const headers = {
        'accept': this.ctype,
        'Authorization': 'Bearer ' + this.getToken(),
        'Content-Type': this.ctype // Menggunakan this.ctype sebagai Content-Type
      };

      // Melakukan Axios GET request dengan headers
      const response = await axios.get<T>(`${this.baseUrlOther}${endpoint}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

}
