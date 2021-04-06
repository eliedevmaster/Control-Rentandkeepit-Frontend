import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Timeschedule } from 'app/models/companymanagement/timeschedule';


@Injectable({
  providedIn: 'root'
})
export class TimescheduleListService {

  onTimeschedulesChanged: BehaviorSubject<any>;
  onSelectedTimescheduleListChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  timescheduleList: Timeschedule[] = [];
  user: User;
  selectedTimescheduleList: number[] = [];

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
      this.onTimeschedulesChanged = new BehaviorSubject([]);
      this.onSelectedTimescheduleListChanged = new BehaviorSubject([]);
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
              this.getTimescheduleList(),
              this.getUserData()
          ]).then(
              ([files]) => {
                  this.onSearchTextChanged.subscribe(searchText => {
                      this.searchText = searchText;
                      this.getTimescheduleList();
                  });

                  this.onFilterChanged.subscribe(filter => {
                      this.filterBy = filter;
                      this.getTimescheduleList();
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
  getTimescheduleList(): Promise<any>
  {
      this.timescheduleList = [];
      return new Promise((resolve, reject) => {
              this._store.select(getCompanyState).subscribe((state) => {
                  if (state.timescheduleListForMe == null) {

                      resolve('the state has problem');
                  }
                  else {
                      this.timescheduleList = [];
                      state.timescheduleListForMe.forEach(element => {
                          this.timescheduleList.push(new Timeschedule(element));
                      });

                      if ( this.searchText && this.searchText !== '' )
                      {
                          this.timescheduleList = FuseUtils.filterArrayByString(this.timescheduleList, this.searchText);
                      }
                      this.onTimeschedulesChanged.next(this.timescheduleList);
                      resolve(this.timescheduleList);
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
  toggleSelectedTimeschedule(id): void
  {
      // First, check if we already have that contact as selected...
      if ( this.selectedTimescheduleList.length > 0 )
      {
          const index = this.selectedTimescheduleList.indexOf(id);

          if ( index !== -1 )
          {
              this.selectedTimescheduleList.splice(index, 1);

              // Trigger the next event
              this.onSelectedTimescheduleListChanged.next(this.selectedTimescheduleList);

              // Return
              return;
          }
      }

      // If we don't have it, push as selected
      this.selectedTimescheduleList.push(id);

      // Trigger the next event
      this.onSelectedTimescheduleListChanged.next(this.selectedTimescheduleList);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void
  {
      if ( this.selectedTimescheduleList.length > 0 )
      {
          this.deselectTimescheduleList();
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
      this.selectedTimescheduleList = [];

      // If there is no filter, select all contacts
      if ( filterParameter === undefined || filterValue === undefined )
      {
          this.selectedTimescheduleList = [];
          this.timescheduleList.map(Timeschedule => {
              this.selectedTimescheduleList.push(Timeschedule.id);
          });
      }

      // Trigger the next event
      this.onSelectedTimescheduleListChanged.next(this.selectedTimescheduleList);
  }

  /**
   * Update contact
   *
   * @param contact
   * @returns {Promise<any>}
   */
  updateTimeschedule(timeschedule): void   
  {
      this.timescheduleList.push(new Timeschedule(timeschedule));
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
        this._store.select(getCompanyState).subscribe((state) => {
          if (state.timescheduleListForMe == null) {

              resolve('the state has problem');
          }
          else {
              this.timescheduleList = [];
              state.timescheduleListForMe.forEach(element => {
                  this.timescheduleList.push(new Timeschedule(element));
              });

              if ( this.searchText && this.searchText !== '' )
              {
                  this.timescheduleList = FuseUtils.filterArrayByString(this.timescheduleList, this.searchText);
              }
              this.onTimeschedulesChanged.next(this.timescheduleList);
              resolve(this.timescheduleList);
          }

      }, reject);

    });
  }

  /**
   * Deselect contacts
   */
  deselectTimescheduleList(): void
  {
      this.selectedTimescheduleList = [];

      // Trigger the next event
      this.onSelectedTimescheduleListChanged.next(this.selectedTimescheduleList);
  }

  /**
   * Delete contact
   *
   * @param contact
   */
  deleteTimeschedule(timeschedule): void
  {
      const timescheduleIndex = this.timescheduleList.indexOf(timeschedule);
      this.timescheduleList.splice(timescheduleIndex, 1);
      this.onTimeschedulesChanged.next(this.timescheduleList);
  }

  /**
   * Delete selected contacts
   */
  deleteselectedTimescheduleList(): void
  {
      for ( const timescheduleId of this.selectedTimescheduleList )
      {
          const timeschedule = this.timescheduleList.find(_timeschedule => {
              return _timeschedule.id === timescheduleId;
          });
          const timescheduleIndex = this.timescheduleList.indexOf(timeschedule);
          this.timescheduleList.splice(timescheduleIndex, 1);
      }
      this.onTimeschedulesChanged.next(this.timescheduleList);
      this.deselectTimescheduleList();
  }
}