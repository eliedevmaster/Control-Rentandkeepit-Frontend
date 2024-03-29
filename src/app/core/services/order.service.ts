import { HttpClient } from '@angular/common/http';
import { parseI18nMeta } from '@angular/compiler/src/render3/view/i18n/meta';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})

export class OrderService {

  orderInfo : any;
  orderMeta : any;
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
        customer_id         : param.customer_id,
        order_id            : param.order_id,
        meta_key            : param.meta_key,
        term_length         : param.term_length,
        start_date_day      : param.start_date_day,
        start_date_month    : param.start_date_month,
        start_date_year     : param.start_date_year,
        start_date          : param.start_date,
        rental_amount_total : param.rental_amount_total,
        instalment_amount   : param.instalment_amount,
    }
    return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  savePaymentHistory(param : any) 
  {
    const url = `${env.backendBaseUrl}/api/orders/payment/manual`;
    const body = {
      customer_id         : param.customer_id,
      order_id            : param.order_id,
      date                : param.date,
      paid_amount         : param.paid_amount,
      refund              : param.refund,
      payment_method      : param.payment_method,
    }
    return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  setOrderStatus(param : any)  : Observable<any> {
    const url = `${env.backendBaseUrl}/api/orders/status`;
    const body = {
      order_id          : param.order_id,
      type              : param.type,
    }
    return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  saveOrderMetaFirst(param : any)  : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/orders/metafirst`;
      const body = {
            order_id              : param.order_id,
            _billing_first_name   : param._billing_first_name,
            _billing_last_name    : param._billing_last_name,
            billing_middle_name   : param.billing_middle_name,
            _billing_email        : param._billing_email,
            _billing_address_1    : param._billing_address_1,
            _billing_state        : param._billing_state, 
            _billing_city         : param._billing_city,
            _billing_postcode     : param._billing_postcode,
            _billing_phone        : param._billing_phone,
            billing_mobile        : param.billing_mobile,

            
      }
      return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  saveOrderMetaSecond(param : any)  : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/orders/metasecond`;
      const body = {
        order_id                : param.order_id,
        id_type                 : param.id_type,
        id_number               : param.id_number,
        id_expiry_date          : param.id_expiry_date,
        id_date_of_birth        : param.id_date_of_birth,
        id_existing_customer    : param.id_existing_customer,
       
    }
      return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  saveOrderMetaThird(param : any)  : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/orders/metathird`;
      const body = {
        order_id                    : param.order_id,
        employment_status           : param.employment_status,
        employer_name               : param.employer_name,
        employer_phone              : param.employer_phone,
        employer_time               : param.employer_time,
        _order_total                : param._order_total,
        residential_status          : param.residential_status,
        residential_time            : param.residential_time,
        owner_mortgage              : param.owner_mortgage,
        debt_list                   : param.debt_list,
        debt_amount                 : param.debt_amount,
        debt_repayments             : param.debt_repayments,
        expenses_bills              : param.expenses_bills,
        expenses_household          : param.expenses_household,
    }
      return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  saveOrderMetaForth(param : any)  : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/orders/metaforth`;
      const body = {
        order_id                    : param.order_id,
        referee_name                : param.referee_name,
        referee_address             : param.referee_address,
        referee_phone               : param.referee_phone,
        referee_relationship        : param.referee_relationship,
      }
      return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  saveProfit(param : any) : Observable<any> 
  {
      const url = `${env.backendBaseUrl}/api/orders/agreement/profit`;
      const body = {
        customer_id                 : param.customer_id,
        order_id                    : param.order_id,
        rental_amount_total         : param.rental_amount_total,
        profit_total                : param.profit_total,
        profit_per_week             : param.profit_per_week,
        profit_per_fortnight        : param.profit_per_fortnight,
        profit_per_month            : param.profit_per_month,
        revenue_per_month           : param.revenue_per_month,
      }

      return this.http.post(url, body, {headers: this.authService.authHeaders()});
  }

  getYearsForReport() : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/orders/report/years`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  getRevenueForReport() : Observable<any>
  {
    const url = `${env.backendBaseUrl}/api/orders/report/revenue`;
    return this.http.get(url, {headers: this.authService.authHeaders()});
  }

  deleteOrder(param : number) : Observable<any>
  {
      const url =  `${env.backendBaseUrl}/api/orders/delete/` + param;
      return this.http.delete(url, {headers: this.authService.authHeaders()});
  }
  
}
