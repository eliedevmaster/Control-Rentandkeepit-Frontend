import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProductList() : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/products`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

}
