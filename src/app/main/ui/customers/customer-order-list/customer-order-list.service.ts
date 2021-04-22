import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getOrderState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Order } from 'app/models/order/order';


@Injectable({
  providedIn: 'root'
})
export class CustomerOrderListService {

  onOrdersChanged: BehaviorSubject<any>;
  onSelectedOrderListChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  orderList: any[] = [];
  user: User;
  selectedOrderList: number[] = [];

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
      this.onOrdersChanged = new BehaviorSubject([]);
      this.onSelectedOrderListChanged = new BehaviorSubject([]);
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
              this.getOrderList(),
              this.getUserData()
          ]).then(
              ([files]) => {
                  this.onSearchTextChanged.subscribe(searchText => {
                      this.searchText = searchText;
                      this.getOrderList();
                  });

                  this.onFilterChanged.subscribe(filter => {
                      this.filterBy = filter;
                      this.getOrderList();
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
  getOrderList(): Promise<any>
  {
      this.orderList = [];
      return new Promise((resolve, reject) => {
              this._store.select(getOrderState).subscribe((state) => {
                            if (state.orderList == null) {

                                resolve('the state has problem');
                            }
                            else {
                                this.orderList = [];
                                state.orderList.forEach(element => {
                                    this.orderList.push(element);
                                });

                                if ( this.searchText && this.searchText !== '' ) {
                                    this.orderList = FuseUtils.filterArrayByString(this.orderList, this.searchText);
                                }

                                if ( this.filterBy === 'unprocessed') {
                                    this.orderList = FuseUtils.filterArrayByString(this.orderList, 'wc-processing');
                                }

                                if ( this.filterBy === 'approved') {
                                    this.orderList = FuseUtils.filterArrayByString(this.orderList, 'wc-approved');
                                }

                                if ( this.filterBy === 'declined') {
                                    this.orderList = FuseUtils.filterArrayByString(this.orderList, 'wc-declined');
                                }

                                if ( this.filterBy === 'finalised') {
                                    this.orderList = FuseUtils.filterArrayByString(this.orderList, 'wc-finalised');
                                }

                                this.onOrdersChanged.next(this.orderList);
                                resolve(this.orderList);
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
  toggleSelectedOrder(id): void
  {
      // First, check if we already have that contact as selected...
      if ( this.selectedOrderList.length > 0 )
      {
          const index = this.selectedOrderList.indexOf(id);

          if ( index !== -1 )
          {
              this.selectedOrderList.splice(index, 1);

              // Trigger the next event
              this.onSelectedOrderListChanged.next(this.selectedOrderList);

              // Return
              return;
          }
      }

      // If we don't have it, push as selected
      this.selectedOrderList.push(id);

      // Trigger the next event
      this.onSelectedOrderListChanged.next(this.selectedOrderList);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void
  {
      if ( this.selectedOrderList.length > 0 )
      {
          this.deselectOrderList();
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
      this.selectedOrderList = [];

      // If there is no filter, select all contacts
      if ( filterParameter === undefined || filterValue === undefined )
      {
          this.selectedOrderList = [];
          this.orderList.map(order => {
              this.selectedOrderList.push(order.id);
          });
      }

      // Trigger the next event
      this.onSelectedOrderListChanged.next(this.selectedOrderList);
  }

  /**
   * Update contact
   *
   * @param contact
   * @returns {Promise<any>}
   */
  updateOrder(order): void   
  {
      this.orderList.push(order);
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
        this._store.select(getOrderState).subscribe((state) => {
          if (state.orderList == null) {

              resolve('the state has problem');
          }
          else {
              this.orderList = [];
              state.orderList.forEach(element => {
                  this.orderList.push(element);
              });

              if ( this.searchText && this.searchText !== '' )
              {
                  this.orderList = FuseUtils.filterArrayByString(this.orderList, this.searchText);
              }
              this.onOrdersChanged.next(this.orderList);
              resolve(this.orderList);
          }

      }, reject);

    });
  }

  /**
   * Deselect contacts
   */
  deselectOrderList(): void
  {
      this.selectedOrderList = [];

      // Trigger the next event
      this.onSelectedOrderListChanged.next(this.selectedOrderList);
  }

  /**
   * Delete contact
   *
   * @param contact
   */
  deleteOrder(order): void
  {
      const orderIndex = this.orderList.indexOf(order);
      this.orderList.splice(orderIndex, 1);
      this.onOrdersChanged.next(this.orderList);
  }

  /**
   * Delete selected contacts
   */
  deleteselectedOrderList(): void
  {
      for ( const orderId of this.selectedOrderList )
      {
          const order = this.orderList.find(_order => {
              return _order.id === orderId;
          });
          const orderIndex = this.orderList.indexOf(order);
          this.orderList.splice(orderIndex, 1);
      }
      this.onOrdersChanged.next(this.orderList);
      this.deselectOrderList();
  }
}