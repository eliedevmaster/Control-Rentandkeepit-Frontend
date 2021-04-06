
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Instructor } from 'app/models/instructormanagement/instructor';

@Injectable({
  providedIn: 'root'
})
export class InstructorListService {
    onInstructorsChanged: BehaviorSubject<any>;
    onSelectedInstructorListChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    instructorList: Instructor[] = [];
    user: User;
    selectedInstructorList: number[] = [];

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
        this.onInstructorsChanged = new BehaviorSubject([]);
        this.onSelectedInstructorListChanged = new BehaviorSubject([]);
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
                this.getInstructorList(),
                this.getUserData()
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getInstructorList();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getInstructorList();
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
    getInstructorList(): Promise<any>
    {
        this.instructorList = [];
        return new Promise((resolve, reject) => {
                this._store.select(getCompanyState).subscribe((state) => {
                    if (state.instructorListForMe == null) {

                        resolve('the state has problem');
                    }
                    else {
                        this.instructorList = [];
                        state.instructorListForMe.forEach(element => {
                            this.instructorList.push(new Instructor(element));
                        });

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.instructorList = FuseUtils.filterArrayByString(this.instructorList, this.searchText);
                        }

                        this.onInstructorsChanged.next(this.instructorList);
                        resolve(this.instructorList);
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
    toggleSelectedInstructor(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedInstructorList.length > 0 )
        {
            const index = this.selectedInstructorList.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedInstructorList.splice(index, 1);

                // Trigger the next event
                this.onSelectedInstructorListChanged.next(this.selectedInstructorList);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedInstructorList.push(id);

        // Trigger the next event
        this.onSelectedInstructorListChanged.next(this.selectedInstructorList);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedInstructorList.length > 0 )
        {
            this.deselectInstructorList();
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
        this.selectedInstructorList = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedInstructorList = [];
            this.instructorList.map(Instructor => {
                this.selectedInstructorList.push(Instructor.id);
            });
        }

        // Trigger the next event
        this.onSelectedInstructorListChanged.next(this.selectedInstructorList);
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
                    this.getInstructorList();
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
                    this.getInstructorList();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectInstructorList(): void
    {
        this.selectedInstructorList = [];

        // Trigger the next event
        this.onSelectedInstructorListChanged.next(this.selectedInstructorList);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteCollabroator(collabroator): void
    {
        const instructorIndex = this.instructorList.indexOf(collabroator);
        this.instructorList.splice(instructorIndex, 1);
        this.onInstructorsChanged.next(this.instructorList);
    }

    /**
     * Delete selected contacts
     */
    deleteselectedInstructorList(): void
    {
        for ( const instructorId of this.selectedInstructorList )
        {
            const instructor = this.instructorList.find(_instructor => {
                return _instructor.id === instructorId;
            });
            const instructorIndex = this.instructorList.indexOf(instructor);
            this.instructorList.splice(instructorIndex, 1);
        }
        this.onInstructorsChanged.next(this.instructorList);
        this.deselectInstructorList();
    }
}