import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor( private http: HttpClient, private authService: AuthService ) { }

  getPermissionList() : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/permissions`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  getPermissionsForUser(param : number) : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/permissions/` + param;
      return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  getPermissionsForUserViaRole(param : number) : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/permissions/role/` + param;
      return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  givePermissionsToUser(param : number,  addPermissionIds : string, deletePermissionIds: string) : Observable<any> 
  {
    const url = `${env.backendBaseUrl}/api/permissions/givepermissions/` + param;
    const body = {
      addPermissionIds: addPermissionIds,
      deletePermissionIds: deletePermissionIds
    };
    return this.http.post(url, body, {headers: this.authService.authHeaders()});

  }
}
