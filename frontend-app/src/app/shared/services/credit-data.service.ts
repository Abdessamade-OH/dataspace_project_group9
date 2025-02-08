import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditDataService {

  private apiUrl = 'http://localhost:3000/data/credit'; // Adjust this to match your backend URL

  constructor(private http: HttpClient) {}

  // Get all credit data
  getAllCreditData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Get data for a specific year
  getCreditDataByYear(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${year}`);
  }

  // Get a single credit entry by ID
  getCreditDataById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  // Create a new credit data entry
  createCreditData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Update an existing entry by ID
  updateCreditData(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Delete an entry by ID
  deleteCreditData(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Bulk update the dataset
  bulkUpdateCreditData(documents: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bulk-update`, { documents });
  }

}
