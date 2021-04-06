
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Weekday } from 'app/models/companymanagement/weekday';

@Injectable({
  providedIn: 'root'
})
export class WeekdayListService {

    onWeekdaysChanged: BehaviorSubject<any>;
    onSelectedWeekdayListChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    weekdayList: Weekday[] = [];
    user: User;
    selectedWeekdayList: number[] = [];

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
        this.onWeekdaysChanged = new BehaviorSubject([]);
        this.onSelectedWeekdayListChanged = new BehaviorSubject([]);
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
                this.getWeekdayList(),
                this.getUserData()
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getWeekdayList();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getWeekdayList();
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
    getWeekdayList(): Promise<any>
    {
        this.weekdayList = [];
        return new Promise((resolve, reject) => {
                this._store.select(getCompanyState).subscribe((state) => {
                    if (state.weekdayListForMe == null) {

                        resolve('the state has problem');
                    }
                    else {
                        this.weekdayList = [];
                        state.weekdayListForMe.forEach(element => {
                            this.weekdayList.push(new Weekday(element));
                        });

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.weekdayList = FuseUtils.filterArrayByString(this.weekdayList, this.searchText);
                        }
                        this.onWeekdaysChanged.next(this.weekdayList);
                        resolve(this.weekdayList);
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
    toggleSelectedWeekday(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedWeekdayList.length > 0 )
        {
            const index = this.selectedWeekdayList.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedWeekdayList.splice(index, 1);

                // Trigger the next event
                this.onSelectedWeekdayListChanged.next(this.selectedWeekdayList);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedWeekdayList.push(id);

        // Trigger the next event
        this.onSelectedWeekdayListChanged.next(this.selectedWeekdayList);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedWeekdayList.length > 0 )
        {
            this.deselectWeekdayList();
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
        this.selectedWeekdayList = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedWeekdayList = [];
            this.weekdayList.map(Weekday => {
                this.selectedWeekdayList.push(Weekday.id);
            });
        }

        // Trigger the next event
        this.onSelectedWeekdayListChanged.next(this.selectedWeekdayList);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateWeekday(weekday): void   
    {
        this.weekdayList.push(new Weekday(weekday));
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
            if (state.weekdayListForMe == null) {

                resolve('the state has problem');
            }
            else {
                this.weekdayList = [];
                state.weekdayListForMe.forEach(element => {
                    this.weekdayList.push(new Weekday(element));
                });

                if ( this.searchText && this.searchText !== '' )
                {
                    this.weekdayList = FuseUtils.filterArrayByString(this.weekdayList, this.searchText);
                }
                this.onWeekdaysChanged.next(this.weekdayList);
                resolve(this.weekdayList);
            }

        }, reject);
 
      });
    }

    /**
     * Deselect contacts
     */
    deselectWeekdayList(): void
    {
        this.selectedWeekdayList = [];

        // Trigger the next event
        this.onSelectedWeekdayListChanged.next(this.selectedWeekdayList);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteWeekday(weekday): void
    {
        const weekdayIndex = this.weekdayList.indexOf(weekday);
        this.weekdayList.splice(weekdayIndex, 1);
        this.onWeekdaysChanged.next(this.weekdayList);
    }

    /**
     * Delete selected contacts
     */
    deleteselectedWeekdayList(): void
    {
        for ( const weekdayId of this.selectedWeekdayList )
        {
            const weekday = this.weekdayList.find(_weekday => {
                return _weekday.id === weekdayId;
            });
            const weekdayIndex = this.weekdayList.indexOf(weekday);
            this.weekdayList.splice(weekdayIndex, 1);
        }
        this.onWeekdaysChanged.next(this.weekdayList);
        this.deselectWeekdayList();
    }
}
