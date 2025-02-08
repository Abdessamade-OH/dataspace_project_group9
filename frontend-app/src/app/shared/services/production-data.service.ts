import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionDataService {

  private apiUrl = 'http://localhost:3000/data/production'; // Ajustez selon l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les données de production
  getAllProduction(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Récupérer les données de production pour une année spécifique
  getProductionByYear(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${year}`);
  }

  // Récupérer une entrée par ID
  getProductionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  // Ajouter une nouvelle entrée
  createProduction(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Mettre à jour une entrée existante par ID
  updateProduction(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Supprimer une entrée par ID
  deleteProduction(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Mise à jour en masse des données
  bulkUpdate(documents: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bulk-update`, { documents });
  }
}
