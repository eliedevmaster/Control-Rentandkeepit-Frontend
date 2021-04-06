import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Instructor } from '../../models/instructormanagement/instructor';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor( private http: HttpClient, private authService: AuthService ) { }

  registerInstructor(param : Instructor) : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/instructors`;
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

  updateInstructor( param : Instructor ) : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/instructors/` + param.id;
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

  getCurrentInstructor(param : number) : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/instructors/showbyuser/` + param.toString();
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }
}
