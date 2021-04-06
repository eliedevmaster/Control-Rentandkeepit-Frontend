import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import { DeleteSpace, Reload } from 'app/store/actions';

import { FacilityFormService } from 'app/main/ui/company/facility-form/facility-form.service';
import { ShapeService } from '../../draw-space/service/shape.service';

import { ShapeComponent } from '../../draw-space/components/shape/shape.component';
import { User } from 'app/models/user';
import { Space } from 'app/models/companymanagement/space';

@Component({
    selector: 'app-space-item',
    templateUrl: './space-item.component.html',
    styleUrls: ['./space-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SpaceItemComponent implements OnInit {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;
     
    willLoading: boolean = true;
    spaceListLength: number = 0;
    spaceList: Array<Space>;
    user: User;
    dataSource: MatTableDataSource<Space> | null;
    displayedColumns = ['checkbox', 'avatar', 'type', 'name', 'action'];
    selectedSpaceList: Space[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FacilityFormService} _facilityFormService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _facilityFormService: FacilityFormService,
        private _shapeService: ShapeService,
        private _cdref: ChangeDetectorRef,
        private _store: Store<AppState>,
        public _matDialog: MatDialog
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

    } 
    ngAfterViewChecked(): void 
    {
        if(!this.willLoading && this.spaceListLength == this._facilityFormService.spaceList.length)
        {
            return;
        }
        this.dataSource = new MatTableDataSource(this._facilityFormService.spaceList);
        this._facilityFormService.onSelectedSpaceListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(spaceList => {
                this.spaceList = spaceList;

                this.checkboxes = {};
                spaceList.map(space => {
                    this.checkboxes[space.id] = false;
                });
            });

        this._facilityFormService.onSelectedSpaceListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedSpaceList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedSpaceList.includes(id);
                }
                this.selectedSpaceList = selectedSpaceList;
            });

        this._facilityFormService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._facilityFormService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._facilityFormService.deselectSpaceList();
            });

        this._facilityFormService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._facilityFormService.spaceList);
        }); 
        this._cdref.detectChanges();

        this.spaceListLength = this._facilityFormService.spaceList.length;

        if(this._facilityFormService.spaceList.length != 0)
            this.willLoading = false;
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
     * @param space
     */
    editSpace(space): void
    {
       console.log("space");
       this._facilityFormService.parentType = 'space';

       localStorage.setItem('facility_or_space', JSON.stringify(space));
       localStorage.setItem('parent_type', 'space');

       this._store.dispatch(new Reload({path: ['/ui/company/facility-form/space/' + space.id], query: null, extras: null}));
    }

    /**
     * Delete Contact
     */
    deleteSpace(space): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._facilityFormService.deleteSpace(space);
                let shape: ShapeComponent = this._shapeService.findShapeComponent(space.shape_name);
                this._shapeService.removeSelectedShapeComponent(shape);
                this.willLoading = true;
                this._store.dispatch(new DeleteSpace({spaceId : space.id}));
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param space
     */
    onSelectedChange(spaceId): void
    {
        this._facilityFormService.toggleSelectedSpace(spaceId);
    }

    /**
     * Toggle star
     *
     * @param spaceId
     */
    toggleStar(spaceId): void
    {

    }
}

    export class FilesDataSource extends DataSource<any>
    {
    /**
     * Constructor
     *
     * @param {FacilityFormService} _facilityFormService
     */
    constructor(
        private _facilityFormService: FacilityFormService
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
        return this._facilityFormService.onSelectedSpaceListChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
