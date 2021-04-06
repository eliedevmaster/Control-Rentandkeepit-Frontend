import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Course } from 'app/models/companymanagement/course';

@Injectable({
  providedIn: 'root'
})
export class CourseListService {

  onCoursesChanged: BehaviorSubject<any>;
    onSelectedCourseListChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    isUpdate: Boolean = false;
    courseList: Course[] = [];
    user: User;
    selectedCourseList: number[] = [];

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
        this.onCoursesChanged = new BehaviorSubject([]);
        this.onSelectedCourseListChanged = new BehaviorSubject([]);
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
                this.getCourseList(),
                this.getUserData()
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getCourseList();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getCourseList();
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
    getCourseList(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._store.select(getCompanyState).subscribe((state) => {
                    if (state.courseListForMe == null) {
                        resolve('the state has problem');
                    }
                    else {
                        this.courseList = [];
                        state.courseListForMe.forEach(element => {
                            this.courseList.push(new Course(element));
                        });

                        if ( this.searchText && this.searchText !== '' ) {
                            this.courseList = FuseUtils.filterArrayByString(this.courseList, this.searchText);
                        }
                        this.onCoursesChanged.next(this.courseList);
                        resolve(this.courseList);
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
    toggleSelectedCourse(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedCourseList.length > 0 )
        {
            const index = this.selectedCourseList.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedCourseList.splice(index, 1);

                // Trigger the next event
                this.onSelectedCourseListChanged.next(this.selectedCourseList);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedCourseList.push(id);

        // Trigger the next event
        this.onSelectedCourseListChanged.next(this.selectedCourseList);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedCourseList.length > 0 )
        {
            this.deselectCourseList();
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
        this.selectedCourseList = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedCourseList = [];
            this.courseList.map(course => {
                this.selectedCourseList.push(course.id);
            });
        }

        // Trigger the next event
        this.onSelectedCourseListChanged.next(this.selectedCourseList);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateCourse(): Promise<any>
    {   
        this.courseList = [];
        return new Promise((resolve, reject) => {

            this._store.select(getCompanyState).subscribe((state) => {
                if (state.courseListForMe == null) {
                    resolve('the state has problem');
                }
                else {
                    this.courseList = [];
                    state.courseListForMe.forEach(element => {
                        this.courseList.push(new Course(element));
                    });

                    if ( this.searchText && this.searchText !== '' )
                    {
                        this.courseList = FuseUtils.filterArrayByString(this.courseList, this.searchText);
                    }
                    this.onCoursesChanged.next(this.courseList);
                    resolve(this.courseList);
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
                    this.getCourseList();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectCourseList(): void
    {
        this.selectedCourseList = [];

        // Trigger the next event
        this.onSelectedCourseListChanged.next(this.selectedCourseList);
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
    deleteCourse(course): void
    {
        const courseIndex = this.courseList.indexOf(course);
        this.courseList.splice(courseIndex, 1);
        this.onCoursesChanged.next(this.courseList);
    }

    /**
     * Delete selected contacts
     */
    deleteselectedCourseList(): void
    {
        for ( const courseId of this.selectedCourseList )
        {
            const course = this.courseList.find(_course => {
                return _course.id === courseId;
            });
            const courseIndex = this.courseList.indexOf(course);
            this.courseList.splice(courseIndex, 1);
        }
        this.onCoursesChanged.next(this.courseList);
        this.deselectCourseList();
    }
}
