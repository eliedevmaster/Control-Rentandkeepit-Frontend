import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})

export class OrderService {

  orderInfo : any;

  constructor(private http: HttpClient, private authService: AuthService) { }

  addOrder(param: any, customer_id: number) : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/orders`;
    const body = {
      start_date          : param.start_date,
      num_items_sold      : param.num_items_sold,
      total_sales         : param.total_sales,
      customer_id         : customer_id,
    }

    
    return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  getOrderList() : Observable<any> 
  {
    const url = `${env.backendBaseUrl}/api/orders`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  saveAgreement(param: any) : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/orders/agreement`;
    const body = {
        customer_id       : param.customer_id,
        order_id          : param.order_id,
        meta_key          : param.meta_key,
    }
    return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  setOrderStatus(param : any) {
    const url = `${env.backendBaseUrl}/api/orders/status`;
    const body = {
      order_id          : param.order_id,
      type              : param.type,
    }
    return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

}
