import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState, getCustomerState } from 'app/store/reducers';

import { User } from 'app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  onUsersChanged: BehaviorSubject<any>;
    onSelectedUserListChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    isUpdate: Boolean = false;
    userList: User[] = [];
    user: User;
    selectedUserList: number[] = [];

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
        this.onUsersChanged = new BehaviorSubject([]);
        this.onSelectedUserListChanged = new BehaviorSubject([]);
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
                this.getUserList(),
                this.getUserData()
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getUserList();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getUserList();
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
    getUserList(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._store.select(getCustomerState).subscribe((state) => {
                    if (state.userList == null) {
                        resolve('the state has problem');
                    }
                    else {
                        this.userList = [];
                        state.userList.forEach(element => {
                            if(element.id != this.user.id)
                                this.userList.push(new User(element));
                        });

                        console.log(this.userList);
                        if ( this.searchText && this.searchText !== '' ) {
                            this.userList = FuseUtils.filterArrayByString(this.userList, this.searchText);
                        }
                        this.onUsersChanged.next(this.userList);
                        resolve(this.userList);
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
    toggleSelectedUser(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedUserList.length > 0 )
        {
            const index = this.selectedUserList.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedUserList.splice(index, 1);

                // Trigger the next event
                this.onSelectedUserListChanged.next(this.selectedUserList);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedUserList.push(id);

        // Trigger the next event
        this.onSelectedUserListChanged.next(this.selectedUserList);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedUserList.length > 0 )
        {
            this.deselectUserList();
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
        this.selectedUserList = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedUserList = [];
            this.userList.map(user => {
                this.selectedUserList.push(user.id);
            });
        }

        // Trigger the next event
        this.onSelectedUserListChanged.next(this.selectedUserList);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateUser(): Promise<any>
    {   
        this.userList = [];
        return new Promise((resolve, reject) => {

            this._store.select(getCustomerState).subscribe((state) => {
                if (state.userList == null) {
                    resolve('the state has problem');
                }
                else {
                    this.userList = [];
                    state.userList.forEach(element => {
                        this.userList.push(new User(element));
                    });

                    if ( this.searchText && this.searchText !== '' )
                    {
                        this.userList = FuseUtils.filterArrayByString(this.userList, this.searchText);
                    }
                    this.onUsersChanged.next(this.userList);
                    resolve(this.userList);
                }

            }, reject);

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
                    this.getUserList();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectUserList(): void
    {
        this.selectedUserList = [];

        // Trigger the next event
        this.onSelectedUserListChanged.next(this.selectedUserList);
    }

    setUpdateForView(): void 
    {
        this.isUpdate = true;
    }
    /**
     * Delete contact
     *
     * @param contact
     */
    deleteUser(user): void
    {
        const userIndex = this.userList.indexOf(user);
        this.userList.splice(userIndex, 1);
        this.onUsersChanged.next(this.userList);
    }

    /**
     * Delete selected contacts
     */
    deleteselectedUserList(): void
    {
        for ( const userId of this.selectedUserList )
        {
            const user = this.userList.find(_user => {
                return _user.id === userId;
            });
            const userIndex = this.userList.indexOf(user);
            this.userList.splice(userIndex, 1);
        }
        this.onUsersChanged.next(this.userList);
        this.deselectUserList();
    }
}
