import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmploymentDataService {

  private apiUrl = 'http://localhost:3000/data/employment'; // Ajustez selon l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les données d'emploi
  getAllEmployment(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Récupérer les données pour une année spécifique
  getEmploymentByYear(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${year}`);
  }

  // Récupérer une entrée par ID
  getEmploymentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  // Ajouter une nouvelle entrée
  createEmployment(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Mettre à jour une entrée existante par ID
  updateEmployment(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Supprimer une entrée par ID
  deleteEmployment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Mise à jour en masse des données
  bulkUpdate(documents: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bulk-update`, { documents });
  }

}
