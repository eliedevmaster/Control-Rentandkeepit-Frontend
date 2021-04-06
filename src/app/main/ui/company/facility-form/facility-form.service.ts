import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Space } from 'app/models/companymanagement/space';


@Injectable({
  providedIn: 'root'
})
export class FacilityFormService {

    onSpacesChanged: BehaviorSubject<any>;
    onSelectedSpaceListChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    parentType: string;
    spaceList: Space[] = [];
    user: User;
    selectedSpaceList: number[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _activatedRoute: ActivatedRoute,
        private _store: Store<AppState>,
    )
    {
        // Set the defaults
        this.onSpacesChanged = new BehaviorSubject([]);
        this.onSelectedSpaceListChanged = new BehaviorSubject([]);
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
                this.getSpaceList(),
                this.getUserData()
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getSpaceList();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getSpaceList();
                    });
                    resolve();
                },
                reject
            );
        });
    }

    clearSpaceList(): void {
        this.spaceList = [];
    }
    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getSpaceList(): Promise<any>
    {
        return new Promise((resolve, reject) => {

                this.parentType = localStorage.getItem('parent_type');
                this._store.select(getCompanyState).subscribe((state) => {
                    if ((state.spaceListForFacility == null && this.parentType == 'facility') || 
                        (state.spaceListForSpace == null && this.parentType == 'space')) {
                        this.spaceList = [];
                        resolve('the state has problem');
                    }
                    else {
                        this.spaceList = [];
                        
                        if(this.parentType == 'facility') {
                            if(state.spaceListForFacility != null) {
                                state.spaceListForFacility.forEach(element => {
                                    this.spaceList.push(new Space(element));
                                });        
                            }
                        }
                        else if(this.parentType == 'space') {
                            if(state.spaceListForSpace != null) {
                                state.spaceListForSpace.forEach(element => {
                                    this.spaceList.push(new Space(element));
                                });       
                            }
                        }

                        if ( this.searchText && this.searchText !== '' ) {
                            this.spaceList = FuseUtils.filterArrayByString(this.spaceList, this.searchText);
                        }

                        this.onSpacesChanged.next(this.spaceList);
                        resolve(this.spaceList);
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
    toggleSelectedSpace(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedSpaceList.length > 0 )
        {
            const index = this.selectedSpaceList.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedSpaceList.splice(index, 1);

                // Trigger the next event
                this.onSelectedSpaceListChanged.next(this.selectedSpaceList);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedSpaceList.push(id);

        // Trigger the next event
        this.onSelectedSpaceListChanged.next(this.selectedSpaceList);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedSpaceList.length > 0 )
        {
            this.deselectSpaceList();
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
        this.selectedSpaceList = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedSpaceList = [];
            this.spaceList.map(space => {
                this.selectedSpaceList.push(space.id);
            });
        }

        // Trigger the next event
        this.onSelectedSpaceListChanged.next(this.selectedSpaceList);
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
                    this.getSpaceList();
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
                    this.getSpaceList();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectSpaceList(): void
    {
        this.selectedSpaceList = [];

        // Trigger the next event
        this.onSelectedSpaceListChanged.next(this.selectedSpaceList);
    }

    addSpace(space): void
    {
        let newSpace: Space  = new Space(space);
        this.spaceList.push(newSpace);
        this.onSpacesChanged.next(this.spaceList);
    }
    /**
     * Delete contact
     *
     * @param contact
     */
    deleteSpace(space): void
    {
        const spaceIndex = this.spaceList.indexOf(space);
        this.spaceList.splice(spaceIndex, 1);
        this.onSpacesChanged.next(this.spaceList);
    }

    /**
     * Delete selected contacts
     */
    deleteselectedSpaceList(): void
    {
        for ( const spaceId of this.selectedSpaceList )
        {
            const space = this.spaceList.find(_space => {
                return _space.id === spaceId;
            });
            const spaceIndex = this.spaceList.indexOf(space);
            this.spaceList.splice(spaceIndex, 1);
        }
        this.onSpacesChanged.next(this.spaceList);
        this.deselectSpaceList();
    }
}
