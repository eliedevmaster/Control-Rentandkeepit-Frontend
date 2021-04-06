import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCustomerState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Customer } from 'app/models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerListService {

  onCustomersChanged: BehaviorSubject<any>;
  onSelectedCustomerListChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  customerList: Customer[] = [];
  user: User;
  selectedCustomerList: number[] = [];

  searchText: string;
  filterBy: string;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
      private _httpClient: HttpClient,
      private _store: Store<AppState>,
  )
  {
      // Set the defaults
      this.onCustomersChanged = new BehaviorSubject([]);
      this.onSelectedCustomerListChanged = new BehaviorSubject([]);
      this.onUserDataChanged = new BehaviorSubject([]);
      this.onSearchTextChanged = new Subject();
      this.onFilterChanged = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
      return new Promise<void>((resolve, reject) => {
          Promise.all([
              this.getCustomerList(),
              this.getUserData()
          ]).then(
              ([files]) => {
                  this.onSearchTextChanged.subscribe(searchText => {
                      this.searchText = searchText;
                      this.getCustomerList();
                  });

                  this.onFilterChanged.subscribe(filter => {
                      this.filterBy = filter;
                      this.getCustomerList();
                  });
                  resolve();
              },
              reject
          );
      });
  }

  /**
   * Get contacts
   *
   * @returns {Promise<any>}
   */
  getCustomerList(): Promise<any>
  {
      this.customerList = [];
      return new Promise((resolve, reject) => {
              this._store.select(getCustomerState).subscribe((state) => {
                  if (state.customerList == null) {

                      resolve('the state has problem');
                  }
                  else {
                      this.customerList = [];
                      state.customerList.forEach(element => {
                          this.customerList.push(new Customer(element));
                      });

                      if ( this.searchText && this.searchText !== '' )
                      {
                          this.customerList = FuseUtils.filterArrayByString(this.customerList, this.searchText);
                      }
                      this.onCustomersChanged.next(this.customerList);
                      resolve(this.customerList);
                  }

              }, reject);
          }
      );
  }
  /**
   * Get user data
   *
   * @returns {Promise<any>}
   */
  getUserData(): Promise<any>
  {
      return new Promise((resolve, reject) => {

              this._store.select(getAuthState).subscribe(state => {
                  if (state.user == null) {
                      resolve('the state has problems');
                  }
                  else {
                      this.user = new User(state.user);
                      this.onUserDataChanged.next(this.user);
                      resolve(this.user);
                  }
              }, reject);

          }
      );
  }

  /**
   * Toggle selected contact by id
   *
   * @param id
   */
  toggleSelectedCustomer(id): void
  {
      // First, check if we already have that contact as selected...
      if ( this.selectedCustomerList.length > 0 )
      {
          const index = this.selectedCustomerList.indexOf(id);

          if ( index !== -1 )
          {
              this.selectedCustomerList.splice(index, 1);

              // Trigger the next event
              this.onSelectedCustomerListChanged.next(this.selectedCustomerList);

              // Return
              return;
          }
      }

      // If we don't have it, push as selected
      this.selectedCustomerList.push(id);

      // Trigger the next event
      this.onSelectedCustomerListChanged.next(this.selectedCustomerList);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void
  {
      if ( this.selectedCustomerList.length > 0 )
      {
          this.deselectCustomerList();
      }
      else
      {
          this.selectContacts();
      }
  }

  /**
   * Select contacts
   *
   * @param filterParameter
   * @param filterValue
   */
  selectContacts(filterParameter?, filterValue?): void
  {
      this.selectedCustomerList = [];

      // If there is no filter, select all contacts
      if ( filterParameter === undefined || filterValue === undefined )
      {
          this.selectedCustomerList = [];
          this.customerList.map(Customer => {
              this.selectedCustomerList.push(Customer.id);
          });
      }

      // Trigger the next event
      this.onSelectedCustomerListChanged.next(this.selectedCustomerList);
  }

  /**
   * Update contact
   *
   * @param contact
   * @returns {Promise<any>}
   */
  updateCustomer(customer): void   
  {
      this.customerList.push(new Customer(customer));
  }

  /**
   * Update user data
   *
   * @param userData
   * @returns {Promise<any>}
   */
  updateUserData(userData): Promise<any>
  {
      return new Promise((resolve, reject) => {
        this._store.select(getCustomerState).subscribe((state) => {
          if (state.customerList == null) {

              resolve('the state has problem');
          }
          else {
              this.customerList = [];
              state.customerList.forEach(element => {
                  this.customerList.push(new Customer(element));
              });

              if ( this.searchText && this.searchText !== '' )
              {
                  this.customerList = FuseUtils.filterArrayByString(this.customerList, this.searchText);
              }
              this.onCustomersChanged.next(this.customerList);
              resolve(this.customerList);
          }

      }, reject);

    });
  }

  /**
   * Deselect contacts
   */
  deselectCustomerList(): void
  {
      this.selectedCustomerList = [];

      // Trigger the next event
      this.onSelectedCustomerListChanged.next(this.selectedCustomerList);
  }

  /**
   * Delete contact
   *
   * @param contact
   */
  deleteCustomer(customer): void
  {
      const customerIndex = this.customerList.indexOf(customer);
      this.customerList.splice(customerIndex, 1);
      this.onCustomersChanged.next(this.customerList);
  }

  /**
   * Delete selected contacts
   */
  deleteselectedCustomerList(): void
  {
      for ( const customerId of this.selectedCustomerList )
      {
          const customer = this.customerList.find(_customer => {
              return _customer.id === customerId;
          });
          const customerIndex = this.customerList.indexOf(customer);
          this.customerList.splice(customerIndex, 1);
      }
      this.onCustomersChanged.next(this.customerList);
      this.deselectCustomerList();
  }
}