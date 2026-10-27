import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DisneyResponse } from '../models/disney.model';

@Injectable({
  providedIn: 'root'
})
export class DisneyService {

  // Permite realizar peticiones HTTP.
  private http = inject(HttpClient);

  // Dirección base de la API de Disney.
  private apiUrl = 'https://api.disneyapi.dev/character';

  // Obtiene personajes mediante paginación y búsqueda opcional.
  getCharacters(
    page: number = 1,
    name: string = '',
    pageSize: number = 20
  ): Observable<DisneyResponse> {

    // Construye los parámetros de la petición.
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    // Elimina espacios innecesarios del nombre buscado.
    const search = name.trim();

    // Agrega el filtro solamente cuando existe una búsqueda.
    if (search.length > 0) {
      params = params.set('name', search);
    }

    // Envía la petición y devuelve la respuesta observable.
    return this.http.get<DisneyResponse>(
      this.apiUrl,
      { params }
    );
  }

  // Obtiene un personaje específico mediante su identificador.
  getCharacterById(id: number): Observable<DisneyResponse> {
    return this.http.get<DisneyResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}