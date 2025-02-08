import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WaterDataService {

  private apiUrl = 'http://localhost:3000/data/water'; // Ajustez selon l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les données d'eau
  getAllWaterData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Récupérer les données d'eau par nom
  getWaterDataByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/name/${name}`);
  }

  // Récupérer une entrée par ID
  getWaterDataById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  // Ajouter une nouvelle entrée
  createWaterData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Mettre à jour une entrée existante par ID
  updateWaterData(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Supprimer une entrée par ID
  deleteWaterData(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Mise à jour en masse des données
  bulkUpdate(documents: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bulk-update`, { documents });
  }
}
