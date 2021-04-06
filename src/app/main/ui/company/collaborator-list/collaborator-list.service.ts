import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Collaborator } from 'app/models/collaboratormanagement/collaborator';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorListService {
    onCollaboratorsChanged: BehaviorSubject<any>;
    onSelectedCollaboratorListChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    collaboratorList: Collaborator[] = [];
    user: User;
    selectedCollaboratorList: number[] = [];

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
        this.onCollaboratorsChanged = new BehaviorSubject([]);
        this.onSelectedCollaboratorListChanged = new BehaviorSubject([]);
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
                this.getCollaboratorList(),
                this.getUserData()
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getCollaboratorList();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getCollaboratorList();
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
    getCollaboratorList(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._store.select(getCompanyState).subscribe((state) => {
                    if (state.collaboratorListForMe == null) {
                        resolve('the state has problem');
                    }
                    else {
                        this.collaboratorList = [];
                        state.collaboratorListForMe.forEach(element => {
                        this.collaboratorList.push(new Collaborator(element));
                        });

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.collaboratorList = FuseUtils.filterArrayByString(this.collaboratorList, this.searchText);
                        }

                        this.onCollaboratorsChanged.next(this.collaboratorList);
                        resolve(this.collaboratorList);
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
    toggleSelectedCollaborator(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedCollaboratorList.length > 0 )
        {
            const index = this.selectedCollaboratorList.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedCollaboratorList.splice(index, 1);

                // Trigger the next event
                this.onSelectedCollaboratorListChanged.next(this.selectedCollaboratorList);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedCollaboratorList.push(id);

        // Trigger the next event
        this.onSelectedCollaboratorListChanged.next(this.selectedCollaboratorList);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedCollaboratorList.length > 0 )
        {
            this.deselectCollaboratorList();
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
        this.selectedCollaboratorList = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedCollaboratorList = [];
            this.collaboratorList.map(collaborator => {
                this.selectedCollaboratorList.push(collaborator.id);
            });
        }

        // Trigger the next event
        this.onSelectedCollaboratorListChanged.next(this.selectedCollaboratorList);
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
                    this.getCollaboratorList();
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
                    this.getCollaboratorList();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectCollaboratorList(): void
    {
        this.selectedCollaboratorList = [];

        // Trigger the next event
        this.onSelectedCollaboratorListChanged.next(this.selectedCollaboratorList);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteCollabroator(collabroator): void
    {
        const collaboratorIndex = this.collaboratorList.indexOf(collabroator);
        this.collaboratorList.splice(collaboratorIndex, 1);
        this.onCollaboratorsChanged.next(this.collaboratorList);
    }

    /**
     * Delete selected contacts
     */
    deleteselectedCollaboratorList(): void
    {
        for ( const collaboratorId of this.selectedCollaboratorList )
        {
            const collaborator = this.collaboratorList.find(_collaborator => {
                return _collaborator.id === collaboratorId;
            });
            const collaboratorIndex = this.collaboratorList.indexOf(collaborator);
            this.collaboratorList.splice(collaboratorIndex, 1);
        }
        this.onCollaboratorsChanged.next(this.collaboratorList);
        this.deselectCollaboratorList();
    }
}
