import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Collaborator } from '../../models/collaboratormanagement/collaborator';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  constructor( private http: HttpClient, private authService: AuthService ) { }

  registerCollaborator(param : Collaborator) : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/collaborators`;
      const body = {
          company_id                : param.company.id,
          first_name                : param.first_name,
          last_name                 : param.last_name,
          address                   : param.address,
          zipcode                   : param.zipcode,
          gender                    : param.gender,
          birthday                  : param.birthday.toISOString().substring(0, 10),
          tax_identification_number : param.tax_identification_number,
          phone                     : param.phone,
          fax                       : param.fax,
      };

      return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  updateCollaborator(param : Collaborator) : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/collaborators/` + param.id;
      const body = {
          company_id                : param.company.id,
          first_name                : param.first_name,
          last_name                 : param.last_name,
          address                   : param.address,
          zipcode                   : param.zipcode,
          gender                    : param.gender,
          birthday                  : param.birthday.toISOString().substring(0, 10),
          tax_identification_number : param.tax_identification_number,
          phone                     : param.phone,
          fax                       : param.fax,
      };
      return this.http.put(url, body, {headers: this.authService.authHeaders()});
  }

  getCurrentCollaborator(param : number) : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/collaborators/showbyuser/` + param.toString();
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }
}
