
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Company } from 'app/models/companymanagement/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyListService {
  onCompaniesChanged: BehaviorSubject<any>;
  onSelectedCompanyListChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  companyList: Company[] = [];
  user: User;
  selectedCompanyList: number[] = [];

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
      this.onCompaniesChanged = new BehaviorSubject([]);
      this.onSelectedCompanyListChanged = new BehaviorSubject([]);
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
              this.getCompanyList(),
              this.getUserData()
          ]).then(
              ([files]) => {
                  this.onSearchTextChanged.subscribe(searchText => {
                      this.searchText = searchText;
                      this.getCompanyList();
                  });

                  this.onFilterChanged.subscribe(filter => {
                      this.filterBy = filter;
                      this.getCompanyList();
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
  getCompanyList(): Promise<any>
  {
      this.companyList = [];
      return new Promise((resolve, reject) => {
              this._store.select(getCompanyState).subscribe((state) => {
                  if (state.companyList == null) {
                    resolve('the state has problem');
                  }
                  else {
                      state.companyList.forEach(element => {
                          this.companyList.push(new Company(element));
                      });

                      if ( this.searchText && this.searchText !== '' )
                      {
                          this.companyList = FuseUtils.filterArrayByString(this.companyList, this.searchText);
                      }

                      this.onCompaniesChanged.next(this.companyList);
                      resolve(this.companyList);
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
  toggleSelectedCompany(id): void
  {
      // First, check if we already have that contact as selected...
      if ( this.selectedCompanyList.length > 0 )
      {
          const index = this.selectedCompanyList.indexOf(id);

          if ( index !== -1 )
          {
              this.selectedCompanyList.splice(index, 1);

              // Trigger the next event
              this.onSelectedCompanyListChanged.next(this.selectedCompanyList);

              // Return
              return;
          }
      }

      // If we don't have it, push as selected
      this.selectedCompanyList.push(id);

      // Trigger the next event
      this.onSelectedCompanyListChanged.next(this.selectedCompanyList);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void
  {
      if ( this.selectedCompanyList.length > 0 )
      {
          this.deselectCompanyList();
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
      this.selectedCompanyList = [];

      // If there is no filter, select all contacts
      if ( filterParameter === undefined || filterValue === undefined )
      {
          this.selectedCompanyList = [];
          this.companyList.map(Company => {
              this.selectedCompanyList.push(Company.id);
          });
      }

      // Trigger the next event
      this.onSelectedCompanyListChanged.next(this.selectedCompanyList);
  }

  /**
   * Update contact
   *
   * @param contact
   * @returns {Promise<any>}
   */
  updateContact(contact): Promise<any>
  {
      return new Promise((resolve, reject) => {

          this._httpClient.post('api/contacts-contacts/' + contact.id, {...contact})
              .subscribe(response => {
                  this.getCompanyList();
                  resolve(response);
              });
      });
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
          this._httpClient.post('api/contacts-user/' + this.user.id, {...userData})
              .subscribe(response => {
                  this.getUserData();
                  this.getCompanyList();
                  resolve(response);
              });
      });
  }

  /**
   * Deselect contacts
   */
  deselectCompanyList(): void
  {
      this.selectedCompanyList = [];

      // Trigger the next event
      this.onSelectedCompanyListChanged.next(this.selectedCompanyList);
  }

  /**
   * Delete contact
   *
   * @param contact
   */
  deleteCompany(company): void
  {
      const companyIndex = this.companyList.indexOf(company);
      this.companyList.splice(companyIndex, 1);
      this.onCompaniesChanged.next(this.companyList);
  }

  /**
   * Delete selected contacts
   */
  deleteselectedCompanyList(): void
  {
      for ( const companyId of this.selectedCompanyList )
      {
          const company = this.companyList.find(_company => {
              return _company.id === companyId;
          });
          const companyIndex = this.companyList.indexOf(company);
          this.companyList.splice(companyIndex, 1);
      }
      this.onCompaniesChanged.next(this.companyList);
      this.deselectCompanyList();
  }
}