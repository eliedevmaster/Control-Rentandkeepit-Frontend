import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Facility } from 'app/models/companymanagement/facility';

@Injectable({
  providedIn: 'root'
})
export class FacilityListService {

    onFacilitysChanged: BehaviorSubject<any>;
    onSelectedFacilityListChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    facilityList: Facility[] = [];
    user: User;
    selectedFacilityList: number[] = [];

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
        this.onFacilitysChanged = new BehaviorSubject([]);
        this.onSelectedFacilityListChanged = new BehaviorSubject([]);
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
                this.getFacilityList(),
                this.getUserData()
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getFacilityList();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getFacilityList();
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
    getFacilityList(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._store.select(getCompanyState).subscribe((state) => {
                    if (state.facilityListForMe == null) {
                        resolve('the state has problem');
                    }
                    else {
                            this.facilityList = [];
                            state.facilityListForMe.forEach(element => {
                            this.facilityList.push(new Facility(element));
                        });

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.facilityList = FuseUtils.filterArrayByString(this.facilityList, this.searchText);
                        }
                        this.onFacilitysChanged.next(this.facilityList);
                        resolve(this.facilityList);
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
    toggleSelectedFacility(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedFacilityList.length > 0 )
        {
            const index = this.selectedFacilityList.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedFacilityList.splice(index, 1);

                // Trigger the next event
                this.onSelectedFacilityListChanged.next(this.selectedFacilityList);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedFacilityList.push(id);

        // Trigger the next event
        this.onSelectedFacilityListChanged.next(this.selectedFacilityList);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedFacilityList.length > 0 )
        {
            this.deselectFacilityList();
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
        this.selectedFacilityList = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedFacilityList = [];
            this.facilityList.map(facility => {
                this.selectedFacilityList.push(facility.id);
            });
        }

        // Trigger the next event
        this.onSelectedFacilityListChanged.next(this.selectedFacilityList);
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
                    this.getFacilityList();
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
                    this.getFacilityList();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectFacilityList(): void
    {
        this.selectedFacilityList = [];

        // Trigger the next event
        this.onSelectedFacilityListChanged.next(this.selectedFacilityList);
    }

    
    /**
     * Delete contact
     *
     * @param contact
     */
    deleteFacility(facility): void
    {
        const facilityIndex = this.facilityList.indexOf(facility);
        this.facilityList.splice(facilityIndex, 1);
        this.onFacilitysChanged.next(this.facilityList);
    }

    /**
     * Delete selected contacts
     */
    deleteselectedFacilityList(): void
    {
        for ( const facilityId of this.selectedFacilityList )
        {
            const facility = this.facilityList.find(_facility => {
                return _facility.id === facilityId;
            });
            const facilityIndex = this.facilityList.indexOf(facility);
            this.facilityList.splice(facilityIndex, 1);
        }
        this.onFacilitysChanged.next(this.facilityList);
        this.deselectFacilityList();
    }
}

