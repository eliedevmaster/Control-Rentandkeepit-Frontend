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

import { FacilityListService } from 'app/main/ui/company/facility-list/facility-list.service';
import { FacilityFormService } from 'app/main/ui/company/facility-form/facility-form.service';

import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import { Go , DeleteFacility} from 'app/store/actions';

import { User } from 'app/models/user';
import { Facility } from 'app/models/companymanagement/facility';
import Swal from 'sweetalert2/dist/sweetalert2.js';  


@Component({
  selector: 'app-facility-item',
  templateUrl: './facility-item.component.html',
  styleUrls: ['./facility-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class FacilityItemComponent implements OnInit {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    facilityListLength: number = 0;
    facilityList: Array<Facility>;
    user: User;
    dataSource: MatTableDataSource<Facility> | null;
    displayedColumns = ['checkbox', 'avatar', 'type', 'name', 'action'];
    selectedFacilityList: Facility[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    
    /**
     * Constructor
     *
     * @param {FacilityListService} _facilityListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _facilityListService: FacilityListService,
        private _cdref: ChangeDetectorRef,
        public _matDialog: MatDialog,
        private _store: Store<AppState>,
        private _baseService: BaseService,
        private _facilityFormService: FacilityFormService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    
    get shareData(): any {
        return this._baseService.shareFacilityData;
    }

    set shareData(value: any) {
        this._baseService.shareFacilityData = value;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        localStorage.removeItem('facility_or_space');
        localStorage.removeItem('parent_type');
    }

    ngAfterViewChecked(): void 
    {
        if(!this.willLoad && this.facilityListLength == this._facilityListService.facilityList.length) {
            return;
        }
        this.dataSource = new MatTableDataSource(this._facilityListService.facilityList);
        this._facilityListService.onSelectedFacilityListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(facilityList => {
                this.facilityList = facilityList;

                this.checkboxes = {};
                facilityList.map(facility => {
                    this.checkboxes[facility.id] = false;
                });
            });

        this._facilityListService.onSelectedFacilityListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedFacilityList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedFacilityList.includes(id);
                }
                this.selectedFacilityList = selectedFacilityList;
            });

        this._facilityListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._facilityListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._facilityListService.deselectFacilityList();
            });

        this._facilityListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._facilityListService.facilityList);
        });    
        this._cdref.detectChanges();
        this.facilityListLength = this._facilityListService.facilityList.length;
        
        if(this.facilityListLength != 0)
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
     * @param facility
     */
    editFacility(facility): void
    {
        this.shareData = facility;
        this._facilityFormService.parentType = 'facility';
        
        localStorage.setItem('facility_or_space', JSON.stringify(facility));
        localStorage.setItem('parent_type', 'facility');

        this._store.dispatch(new Go({path: ['/ui/company/facility-form/facility/' + facility.id], query: null, extras: null}));
    }

    /**
     * Delete Contact
     */
    deleteFacility(facility): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._facilityListService.deleteFacility(facility);
                this.willLoad = true;
                this._store.dispatch(new DeleteFacility({facilityId : facility.id}));
                console.log("delete...");
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param facilityId
     */
    onSelectedChange(facilityId): void
    {
        this._facilityListService.toggleSelectedFacility(facilityId);
    }

    /**
     * Toggle star
     *
     * @param facilityId
     */
    toggleStar(facilityId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._facilityListService.updateUserData(this.user);*/
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {FacilityListService} _facilityListService
     */
    constructor(
        private _facilityListService: FacilityListService
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
        return this._facilityListService.onSelectedFacilityListChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}