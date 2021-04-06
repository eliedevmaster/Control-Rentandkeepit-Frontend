import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { BaseService } from 'app/core/services/base.service';

import { CourseListService } from 'app/main/ui/company/courses/course-list/course-list.service';

import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import { Go , DeleteCourse, RegisterCourse, GetCourseListForCompany } from 'app/store/actions';

import { User } from 'app/models/user';
import { Course } from 'app/models/companymanagement/course';

@Component({
  selector: 'app-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CourseItemComponent implements OnInit {

  @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    courseListLength: number = 0;
    courseList: Array<Course>;
    user: User;
    dataSource: MatTableDataSource<Course> | null;
    displayedColumns = ['checkbox', 'avatar', 'course', 'instructor', 'season', 'space', 'weekday', 'timeschedule', 'action'];
    selectedCourseList: Course[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    
    /**
     * Constructor
     *
     * @param {courseListService} _courseListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _courseListService: CourseListService,
        private _cdref: ChangeDetectorRef,
        public _matDialog: MatDialog,
        private _store: Store<AppState>,
        private _baseService: BaseService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        localStorage.removeItem('course');
    }

    ngAfterViewChecked(): void 
    {
        if(!this.willLoad && this.courseListLength == this._courseListService.courseList.length) {
            this._courseListService.isUpdate = false;
            return;
        }

        this.dataSource = new MatTableDataSource(this._courseListService.courseList);
        this._courseListService.onSelectedCourseListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(courseList => {
                this.courseList = courseList;

                this.checkboxes = {};
                courseList.map(course => {
                    this.checkboxes[course.id] = false;
                });
            });

        this._courseListService.onSelectedCourseListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedCourseList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }
                    this.checkboxes[id] = selectedCourseList.includes(id);
                }
                this.selectedCourseList = selectedCourseList;
            });

        this._courseListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._courseListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._courseListService.deselectCourseList();
            });

        this._courseListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._courseListService.courseList);
        });    
        this._cdref.detectChanges();
        if(this._courseListService.isUpdate) {
            console.log("true");
            console.log(this._courseListService.courseList);
            this._courseListService.isUpdate = false;
        }
        this.courseListLength = this._courseListService.courseList.length;

        if(this.courseListLength != 0)
            this.willLoad = false;
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param course
     */
    editCourse(course): void
    {
        localStorage.setItem('course', JSON.stringify(course));
        this._store.dispatch(new Go({path: ['/ui/company/course-form/' + 'update/' + course.id], query: null, extras: null}));
    }

    duplicateCourse(course): void
    {
        let payload = {
            company_id            : this.user.role_relation_id,
            base_course_id        : course.basecourse.id,
            instructor_id         : course.instructor.id,
            season_id             : course.season.id,
            space_id              : course.space.id,
            weekday_id            : course.weekday.id,
            timeschedule_id       : course.timeschedule.id,
            rate1                 : course.rate1,
            rate2                 : course.rate2,
            rate3                 : course.rate3,
            descrtiption          : course.description
                
        };
        this._store.dispatch(new RegisterCourse({ course : payload }));
        this._store.dispatch(new GetCourseListForCompany({companyId : this.user.role_relation_id}));        
    }

    /**
     * Delete Contact
     */
    deleteCourse(course): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._courseListService.deleteCourse(course);
                this.willLoad = true;
                this._store.dispatch(new DeleteCourse({courseId : course.id}));
                console.log("delete...");
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * On selected change
     *
     * @param courseId
     */
    onSelectedChange(courseId): void
    {
        this._courseListService.toggleSelectedCourse(courseId);
    }

    /**
     * Toggle star
     *
     * @param courseId
     */
    toggleStar(courseId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._courseListService.updateUserData(this.user);*/
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {courseListService} _courseListService
     */
    constructor(
        private _courseListService: CourseListService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._courseListService.onSelectedCourseListChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }

}
