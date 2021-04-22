import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { CustomerActionTypes, GetCustomerList,
        GetCustomerListError,GetCustomerListComplete, 
        GetOrderListForCustomer, GetOrderListForCustomerComplete, GetOrderListForCustomerError, 
        UpdateCustomerError, UpdateCustomerComplete, UpdateCustomer, 
        AddCustomer, AddCustomerComplete, AddCustomerError } from '../actions/customer.action';

import { Router } from '@angular/router';

import { of } from 'rxjs';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../models/customer';
import { Order } from '../../models/order/order';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Injectable()
export class CustomerEffects
{
    /**
     * Constructor
     *
     * @param {Actions} actions$
     */
    constructor(
        private actions$: Actions,
        private router: Router,
        private customerService: CustomerService 
    )
    {
    }

    @Effect()
    customer$ = this.actions$.pipe(
      ofType(CustomerActionTypes.GET_CUSTOMER_LIST),
      switchMap(() => {
        return this.customerService.getCustomerList()
            .pipe(
            map((customerList) => {
                let customerArray : Array<Customer> = [];
                customerList.forEach(element => {
                    customerArray.push(element);
                });
                return new GetCustomerListComplete({customerList : customerList})
            }),
              catchError((error: Error) => {
                return of(new GetCustomerListError({ errorMessage: error.message }));
              })
            );
      })
    );
    
    @Effect()
    oderListForCustomer$ = this.actions$.pipe(
      ofType(CustomerActionTypes.GET_ORDER_LIST_FOR_CUSTOMER),
      map((action: GetOrderListForCustomer) => action.payload),
      switchMap((payload) => {
        return this.customerService.getOrderListForCustomer(payload.customerId)
            .pipe(
            map((orderList) => {
                let orderArray : Array<Order> = [];
                orderList.forEach(element => {
                  orderArray.push(element);
                });
                return new GetOrderListForCustomerComplete({orderList : orderArray})
            }),
              catchError((error: Error) => {
                return of(new GetOrderListForCustomerError({ errorMessage: error.message }));
              })
            );
      })
    );
    
    @Effect()
    addCustomer$ = this.actions$.pipe(
      ofType(CustomerActionTypes.ADD_CUSTOMER),
      map((action: AddCustomer) => action.payload),
      switchMap((payload) => {
        return this.customerService.addCustomer(payload.customer)
            .pipe(
            map((customer) => {

                return new AddCustomerComplete()
            }),
            catchError((error: Error) => {
              Swal.fire('Ooops!', 'The customer can not be added', 'error');
              return of(new AddCustomerError({ errorMessage: error.message }));
            })
          );
      })
    );

    @Effect()
    updateCustomer$ = this.actions$.pipe(
      ofType(CustomerActionTypes.UPDATE_CUSTOMER),
      map((action: UpdateCustomer) => action.payload),
      switchMap((payload) => {
        return this.customerService.updateCustomer(payload.customer)
            .pipe(
            map((state) => {
                Swal.fire('Yes!', 'The customer profile has successfully updated', 'success');
                return new UpdateCustomerComplete()
            }),
              catchError((error: Error) => {
                Swal.fire('Ooops!', 'The customer profile update has failed', 'error');
                return of(new UpdateCustomerError({ errorMessage: error.message }));
              })
            );
      })
    );
}