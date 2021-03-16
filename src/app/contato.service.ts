import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Contato} from './contato/contato';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {PaginaContato} from './contato/pagina-contato';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url: string = environment.apiURLBase;

  constructor(
    private http: HttpClient
  ) {
  }

  salva(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.url, contato);
  }

  lista(pagina: string | number, tamanho: string | number): Observable<PaginaContato> {
    const params = new HttpParams()
      .set('page', <string> pagina)
      .set('size', <string> tamanho);
    return this.http.get<any>(`${this.url}?${params.toString()}`);
  }

  favorita(contato: Contato): Observable<any> {
    return this.http.patch(`${this.url}/${contato.id}/favorito`, null);
  }

  upload(contato: Contato, formData: FormData): Observable<any> {
    return this.http.put(`${this.url}/${contato.id}/foto`, formData, {responseType: 'blob'});
  }
}
