import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Basecourse } from 'app/models/companymanagement/basecourse';

@Injectable({
  providedIn: 'root'
})
export class BasecourseListService {

  onBasecoursesChanged: BehaviorSubject<any>;
  onSelectedBasecourseListChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  basecourseList: Basecourse[] = [];
  user: User;
  selectedBasecourseList: number[] = [];

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
      this.onBasecoursesChanged = new BehaviorSubject([]);
      this.onSelectedBasecourseListChanged = new BehaviorSubject([]);
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
              this.getBasecourseList(),
              this.getUserData()
          ]).then(
              ([files]) => {
                  this.onSearchTextChanged.subscribe(searchText => {
                      this.searchText = searchText;
                      this.getBasecourseList();
                  });

                  this.onFilterChanged.subscribe(filter => {
                      this.filterBy = filter;
                      this.getBasecourseList();
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
  getBasecourseList(): Promise<any>
  {
      this.basecourseList = [];
      return new Promise((resolve, reject) => {
              this._store.select(getCompanyState).subscribe((state) => {
                  if (state.basecourseListForMe == null) {

                      resolve('the state has problem');
                  }
                  else {
                      this.basecourseList = [];
                      state.basecourseListForMe.forEach(element => {
                          this.basecourseList.push(new Basecourse(element));
                      });

                      if ( this.searchText && this.searchText !== '' )
                      {
                          this.basecourseList = FuseUtils.filterArrayByString(this.basecourseList, this.searchText);
                      }
                      this.onBasecoursesChanged.next(this.basecourseList);
                      resolve(this.basecourseList);
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
  toggleSelectedBasecourse(id): void
  {
      // First, check if we already have that contact as selected...
      if ( this.selectedBasecourseList.length > 0 )
      {
          const index = this.selectedBasecourseList.indexOf(id);

          if ( index !== -1 )
          {
              this.selectedBasecourseList.splice(index, 1);

              // Trigger the next event
              this.onSelectedBasecourseListChanged.next(this.selectedBasecourseList);

              // Return
              return;
          }
      }

      // If we don't have it, push as selected
      this.selectedBasecourseList.push(id);

      // Trigger the next event
      this.onSelectedBasecourseListChanged.next(this.selectedBasecourseList);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void
  {
      if ( this.selectedBasecourseList.length > 0 )
      {
          this.deselectBasecourseList();
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
      this.selectedBasecourseList = [];

      // If there is no filter, select all contacts
      if ( filterParameter === undefined || filterValue === undefined )
      {
          this.selectedBasecourseList = [];
          this.basecourseList.map(Basecourse => {
              this.selectedBasecourseList.push(Basecourse.id);
          });
      }

      // Trigger the next event
      this.onSelectedBasecourseListChanged.next(this.selectedBasecourseList);
  }

  /**
   * Update contact
   *
   * @param contact
   * @returns {Promise<any>}
   */
  updateBasecourse(basecourse): void   
  {
      this.basecourseList.push(new Basecourse(basecourse));
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
          if (state.basecourseListForMe == null) {

              resolve('the state has problem');
          }
          else {
              this.basecourseList = [];
              state.basecourseListForMe.forEach(element => {
                  this.basecourseList.push(new Basecourse(element));
              });

              if ( this.searchText && this.searchText !== '' )
              {
                  this.basecourseList = FuseUtils.filterArrayByString(this.basecourseList, this.searchText);
              }
              this.onBasecoursesChanged.next(this.basecourseList);
              resolve(this.basecourseList);
          }

      }, reject);

    });
  }

  /**
   * Deselect contacts
   */
  deselectBasecourseList(): void
  {
      this.selectedBasecourseList = [];

      // Trigger the next event
      this.onSelectedBasecourseListChanged.next(this.selectedBasecourseList);
  }

  /**
   * Delete contact
   *
   * @param contact
   */
  deleteBasecourse(basecourse): void
  {
      const basecourseIndex = this.basecourseList.indexOf(basecourse);
      this.basecourseList.splice(basecourseIndex, 1);
      this.onBasecoursesChanged.next(this.basecourseList);
  }

  /**
   * Delete selected contacts
   */
  deleteselectedBasecourseList(): void
  {
      for ( const basecourseId of this.selectedBasecourseList )
      {
          const basecourse = this.basecourseList.find(_basecourse => {
              return _basecourse.id === basecourseId;
          });
          const basecourseIndex = this.basecourseList.indexOf(basecourse);
          this.basecourseList.splice(basecourseIndex, 1);
      }
      this.onBasecoursesChanged.next(this.basecourseList);
      this.deselectBasecourseList();
  }
}