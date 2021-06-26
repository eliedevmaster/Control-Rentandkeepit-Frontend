import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { CustomerActionTypes, GetCustomerList,
        GetCustomerListError,GetCustomerListComplete, 
        GetOrderListForCustomer, GetOrderListForCustomerComplete, GetOrderListForCustomerError, 
        UpdateCustomerError, UpdateCustomerComplete, UpdateCustomer, 
        AddCustomer, AddCustomerComplete, AddCustomerError, GetUserListComplete, GetUserListError, 
        CreateUserError, CreateUser, CreateUserComplete, 
        DeleteUser, DeleteUserComplete, DeleteUserError, UpdateUser, UpdateUserComplete, UpdateUserError } from '../actions/customer.action';
  
import { GetCurrentUser } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';

import { Router } from '@angular/router';

import { of } from 'rxjs';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../models/customer';
import { Order } from '../../models/order/order';
import Swal from 'sweetalert2/dist/sweetalert2.js';  
import { User } from 'app/models/user';

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
        private customerService: CustomerService ,
        private _store: Store<AppState>,

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
                console.log('customerArray : ', customerArray);
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

    @Effect()
    getUserList$ = this.actions$.pipe(
      ofType(CustomerActionTypes.GET_USER_LIST),
      switchMap(() => {  
        return this.customerService.getUserList().pipe(
          map((userList) => {
            let userArray: any[] = [];
              userList.forEach(element => {
              userArray.push(element);
            });
            
            return new GetUserListComplete({ userList : userArray });
          }),

          catchError((error : Error) => {
            Swal.fire('Sorry!', "user list error", 'error');
            return of(new GetUserListError({ errorMessage : error.message }));
          })
        );
      })
    );

    @Effect()
    createUser$ = this.actions$.pipe(
      ofType(CustomerActionTypes.CREATE_USER),
      map((action: CreateUser) => action.payload),
      switchMap((payload) => {
        return this.customerService.createUser(payload.user)
            .pipe(
            map((msg) => {
                Swal.fire('Yes!', 'User was created successfully', 'success');
                return new CreateUserComplete()
            }),
            catchError((error: Error) => {
              Swal.fire('Ooops!', 'The user creation was faild', 'error');
              return of(new CreateUserError({ errorMessage: error.message }));
            })
          );
      })
    );

    @Effect()
    updateUser$ = this.actions$.pipe(
      ofType(CustomerActionTypes.UPDATE_USER),
      map((action: UpdateUser) => action.payload),
      switchMap((payload) => {
        return this.customerService.updateUser(payload.user)
            .pipe(
            map((msg) => {
                this._store.dispatch(new GetCurrentUser());
                Swal.fire('Yes!', 'User was updated successfully', 'success');
                return new UpdateUserComplete()
            }),
            catchError((error: Error) => {
              Swal.fire('Ooops!', 'The user update was faild', 'error');
              return of(new UpdateUserError({ errorMessage: error.message }));
            })
          );
      })
    );

    deleteUser$ = this.actions$.pipe(
      ofType(CustomerActionTypes.DELETE_USER),
      map((action: DeleteUser) => action.payload),
      switchMap((payload) => {
        return this.customerService.deleteUser(payload.userId)
            .pipe(
            map((msg) => {
                Swal.fire('Yes!', 'User was deleted successfully', 'success');
                return new DeleteUserComplete()
            }),
            catchError((error: Error) => {
              Swal.fire('Ooops!', 'The user delete was faild', 'error');
              return of(new DeleteUserError({ errorMessage: error.message }));
            })
          );
      })
    );
   
    
}