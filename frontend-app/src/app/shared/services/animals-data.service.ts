import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalsDataService {

  private apiUrl = 'http://localhost:3000/data/animals'; // Adjust this to your backend URL

  constructor(private http: HttpClient) {}

  // Get all animal data
  getAllAnimals(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Get data for a specific year
  getAnimalsByYear(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${year}`);
  }

  // Get a single animal entry by ID
  getAnimalById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  // Create a new animal data entry
  createAnimal(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Update an existing entry by ID
  updateAnimal(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Delete an entry by ID
  deleteAnimal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Bulk update the dataset
  bulkUpdate(documents: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bulk-update`, { documents });
  }

}
