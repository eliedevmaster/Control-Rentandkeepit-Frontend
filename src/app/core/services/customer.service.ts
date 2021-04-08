import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Customer } from '../../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private authService: AuthService) { }

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

}
