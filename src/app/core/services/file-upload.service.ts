import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';  
import { map } from  'rxjs/operators';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor( private http: HttpClient, private authService: AuthService ) { }

  authFileUploadHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Accept' : 'application/vnd.api.v1+json',
      'Authorization' : 'Bearer ' + localStorage.getItem('token'),
    });
    return headers;
  }

  upload(formData) 
  {
    const url = `${env.backendBaseUrl}/api/assets`;
    return this.http.post<any>(url, formData,  {reportProgress: true, observe: 'events', headers: this.authFileUploadHeaders()});  
  }

  
}