import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Season } from 'app/models/companymanagement/season';

@Injectable({
  providedIn: 'root'
})
export class SeasonListService {

    onSeasonsChanged: BehaviorSubject<any>;
    onSelectedSeasonListChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    isUpdate: Boolean = false;
    seasonList: Season[] = [];
    user: User;
    selectedSeasonList: number[] = [];

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
        this.onSeasonsChanged = new BehaviorSubject([]);
        this.onSelectedSeasonListChanged = new BehaviorSubject([]);
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
                this.getSeasonList(),
                this.getUserData()
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getSeasonList();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getSeasonList();
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
    getSeasonList(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._store.select(getCompanyState).subscribe((state) => {
                    if (state.seasonListForMe == null) {
                        resolve('the state has problem');
                    }
                    else {
                        this.seasonList = [];
                        state.seasonListForMe.forEach(element => {
                            this.seasonList.push(new Season(element));
                        });

                        if ( this.searchText && this.searchText !== '' ) {
                            this.seasonList = FuseUtils.filterArrayByString(this.seasonList, this.searchText);
                        }
                        this.onSeasonsChanged.next(this.seasonList);
                        resolve(this.seasonList);
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
    toggleSelectedSeason(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedSeasonList.length > 0 )
        {
            const index = this.selectedSeasonList.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedSeasonList.splice(index, 1);

                // Trigger the next event
                this.onSelectedSeasonListChanged.next(this.selectedSeasonList);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedSeasonList.push(id);

        // Trigger the next event
        this.onSelectedSeasonListChanged.next(this.selectedSeasonList);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedSeasonList.length > 0 )
        {
            this.deselectSeasonList();
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
        this.selectedSeasonList = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedSeasonList = [];
            this.seasonList.map(season => {
                this.selectedSeasonList.push(season.id);
            });
        }

        // Trigger the next event
        this.onSelectedSeasonListChanged.next(this.selectedSeasonList);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateSeason(): Promise<any>
    {   
        this.seasonList = [];
        return new Promise((resolve, reject) => {

            this._store.select(getCompanyState).subscribe((state) => {
                if (state.seasonListForMe == null) {
                    resolve('the state has problem');
                }
                else {
                    this.seasonList = [];
                    state.seasonListForMe.forEach(element => {
                        this.seasonList.push(new Season(element));
                    });

                    if ( this.searchText && this.searchText !== '' )
                    {
                        this.seasonList = FuseUtils.filterArrayByString(this.seasonList, this.searchText);
                    }
                    this.onSeasonsChanged.next(this.seasonList);
                    resolve(this.seasonList);
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
                    this.getSeasonList();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectSeasonList(): void
    {
        this.selectedSeasonList = [];

        // Trigger the next event
        this.onSelectedSeasonListChanged.next(this.selectedSeasonList);
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
    deleteSeason(season): void
    {
        const seasonIndex = this.seasonList.indexOf(season);
        this.seasonList.splice(seasonIndex, 1);
        this.onSeasonsChanged.next(this.seasonList);
    }

    /**
     * Delete selected contacts
     */
    deleteselectedSeasonList(): void
    {
        for ( const seasonId of this.selectedSeasonList )
        {
            const season = this.seasonList.find(_season => {
                return _season.id === seasonId;
            });
            const seasonIndex = this.seasonList.indexOf(season);
            this.seasonList.splice(seasonIndex, 1);
        }
        this.onSeasonsChanged.next(this.seasonList);
        this.deselectSeasonList();
    }
}
