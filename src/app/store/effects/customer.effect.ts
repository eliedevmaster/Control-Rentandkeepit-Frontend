import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { CustomerActionTypes, GetCustomerList, GetCustomerListError,GetCustomerListComplete } from '../actions/customer.action';

import { Router } from '@angular/router';

import { of } from 'rxjs';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../models/customer';

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

 
    
}