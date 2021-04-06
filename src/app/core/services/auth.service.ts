import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'environments/environment';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}

  nonAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
        'Accept':'application/vnd.api.v1+json',
        'Content-Type': 'application/json',
    });
    return headers;
  }

  authHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Accept' : 'application/vnd.api.v1+json',
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer ' + localStorage.getItem('token'),
    });
    return headers;
  }

  logIn(email: string, password: string): Observable<any> {
    const url = `${env.backendBaseUrl}/api/auth`;
    return this.http.post(url, {email, password}, {headers: this.nonAuthHeaders()});
  }

  signUp(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    const url = `${env.backendBaseUrl}/api/auth/register`;
    return this.http.post(url, {name, email, password, password_confirmation}, {headers: this.nonAuthHeaders()});
  }

  resetPassword(current_password: string, password: string, password_confirmation: string) : Observable<any> {
    const url = `${env.backendBaseUrl}/api/me/password`;
    return this.http.put(url, {current_password, password, password_confirmation}, {headers: this.authHeaders()});    
  }
  
  forgotPassword(email: string): Observable<any> {
    const url = `${env.backendBaseUrl}/api/auth/forgotpassword`;
    return this.http.post(url, {email}, {headers: this.nonAuthHeaders()});
  }

  logout(): Observable<any> {
    const url = `${env.backendBaseUrl}/api/auth/logout`;
    //console.log("token = " + localStorage.getItem('token'));
    return this.http.post(url, {}, {headers: this.authHeaders()});
  }
}