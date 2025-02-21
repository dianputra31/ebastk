import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private baseUrl = environment.apiUrl;

  constructor() { }

  // Metode GET
  async get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.baseUrl}${endpoint}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // Metode POST
  async post<T>(endpoint: string, data: any): Promise<T> {
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
}
