import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemperatureDataService {

  private apiUrl = 'http://localhost:3000/data/temperature'; // Ajustez selon l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les données de température
  getAllTemperature(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Récupérer les données de température pour une année spécifique
  getTemperatureByYear(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${year}`);
  }

  // Récupérer une entrée par ID
  getTemperatureById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  // Ajouter une nouvelle entrée
  createTemperature(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Mettre à jour une entrée existante par ID
  updateTemperature(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Supprimer une entrée par ID
  deleteTemperature(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Mise à jour en masse des données
  bulkUpdate(documents: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bulk-update`, { documents });
  }
}
