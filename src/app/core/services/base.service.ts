import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  shareSignUpInfo: any;
  shareFacilityData: any;

  constructor( private http: HttpClient, private authService: AuthService ) { }

  roleList(): Observable<any> {
    const url = `${env.backendBaseUrl}/api/rolelist`;
    return this.http.get(url);
  }

  getCompanyTypes(): Observable<any> {
    const url = `${env.backendBaseUrl}/api/bases/companytypes`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  getCurrencies(): Observable<any> {
    const url = `${env.backendBaseUrl}/api/bases/currencies`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

}
