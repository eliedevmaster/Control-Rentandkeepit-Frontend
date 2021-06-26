import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  productInfo: any;
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  addCustomer(param: any) : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/customers`;
    const body = {
      first_name      : param.first_name,
      last_name       : param.last_name,
      postcode        : param.postcode,
      address         : param.address,
      city            : param.city,
      state           : param.state,
    }

    return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  //addNewOrder(param: any) : Observable<any>
  //{

  //}

  updateCustomer(param: any) : Observable<any> 
  {
    const url = `${env.backendBaseUrl}/api/customers/` + param.id;
    const body = {
      first_name        : param.first_name,
      last_name         : param.last_name,
      email             : param.email,
      address           : param.address,
      state             : param.state, 
      postcode          : param.postcode,
      city              : param.city,
    }
    return this.http.put(url, body, {headers: this.authService.authHeaders()});
  }
  
  getCustomerList() : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/customers`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  getOrderListForCustomer(param: number) : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/customers/orders/` + param;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  downLoadDocx()
  {
    const url = `${env.backendBaseUrl}/api/customers/download`;
    return this.http.get(url, {headers: this.authService.authHeaders()});  
  }

  getUserList() : Observable<any> 
  {
    const url = `${env.backendBaseUrl}/api/users`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  createUser(param: any) : Observable<any> 
  {

    const url = `${env.backendBaseUrl}/api/users`;
    const body = {
      name                  : param.name,
      email                 : param.email,
      password              : param.password,
      password_confirmation : param.password_confirmation,
      role_id           : 1,
    }
    return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  updateUser(param: any) : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/users/` + param.id;
    const body = {
      name                  : param.name,
      email                 : param.email,
    }
    return this.http.put(url, body, {headers: this.authService.authHeaders()});    
  }

  deleteUser(param: number) : Observable<any> 
  {
    const url = `${env.backendBaseUrl}/api/users/` + param;
    return this.http.get(url, {headers: this.authService.authHeaders()});     
  }
}
