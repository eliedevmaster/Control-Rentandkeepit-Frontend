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

import { SeasonListService } from 'app/main/ui/company/seasons/season-list/season-list.service';

import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import { Go , DeleteSeason, RegisterSeason, GetSeasonListForCompany} from 'app/store/actions';

import { User } from 'app/models/user';
import { Season } from 'app/models/companymanagement/season';


@Component({
  selector: 'app-season-item',
  templateUrl: './season-item.component.html',
  styleUrls: ['./season-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SeasonItemComponent implements OnInit {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    willLoad: boolean = true;
    seasonListLength: number = 0;
    seasonList: Array<Season>;
    user: User;
    dataSource: MatTableDataSource<Season> | null;
    displayedColumns = ['checkbox', 'avatar', 'name', 'startDate', 'endDate', 'action'];
    selectedseasonList: Season[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    
    /**
     * Constructor
     *
     * @param {seasonListService} _seasonListService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _seasonListService: SeasonListService,
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

    }

    ngAfterViewChecked(): void 
    {
        if(!this.willLoad && this.seasonListLength == this._seasonListService.seasonList.length) {
            this._seasonListService.isUpdate = false;
            return;
        }

        this.dataSource = new MatTableDataSource(this._seasonListService.seasonList);
        this._seasonListService.onSelectedSeasonListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(seasonList => {
                this.seasonList = seasonList;

                this.checkboxes = {};
                seasonList.map(season => {
                    this.checkboxes[season.id] = false;
                });
            });

        this._seasonListService.onSelectedSeasonListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedseasonList => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }
                    this.checkboxes[id] = selectedseasonList.includes(id);
                }
                this.selectedseasonList = selectedseasonList;
            });

        this._seasonListService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._seasonListService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._seasonListService.deselectSeasonList();
            });

        this._seasonListService.onSearchTextChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.dataSource = new MatTableDataSource(this._seasonListService.seasonList);
        });    
        this._cdref.detectChanges();
        if(this._seasonListService.isUpdate) {
            console.log("true");
            console.log(this._seasonListService.seasonList);
            this._seasonListService.isUpdate = false;
        }
        this.seasonListLength = this._seasonListService.seasonList.length;

        if(this.seasonListLength != 0)
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
     * @param season
     */
    editSeason(season): void
    {
        localStorage.setItem('season', JSON.stringify(season));
        this._store.dispatch(new Go({path: ['/ui/company/register-season/' + 'update/' + season.id], query: null, extras: null}));
    }

    duplicateSeason(season): void
    {
        let payload = {
            company_id        : this.user.role_relation_id,
            name              : season.name,
            description       : season.description,
            start_date        : season.start_date,
            end_date          : season.end_date,
        };
        this._store.dispatch(new RegisterSeason({ season : payload }));
        this._store.dispatch(new GetSeasonListForCompany({companyId : this.user.role_relation_id}));        
    }

    /**
     * Delete Contact
     */
    deleteSeason(season): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._seasonListService.deleteSeason(season);
                this.willLoad = true;
                this._store.dispatch(new DeleteSeason({seasonId : season.id}));
                console.log("delete...");
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * On selected change
     *
     * @param seasonId
     */
    onSelectedChange(seasonId): void
    {
        this._seasonListService.toggleSelectedSeason(seasonId);
    }

    /**
     * Toggle star
     *
     * @param seasonId
     */
    toggleStar(seasonId): void
    {
        /*if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._seasonListService.updateUserData(this.user);*/
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {seasonListService} _seasonListService
     */
    constructor(
        private _seasonListService: SeasonListService
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
        return this._seasonListService.onSelectedSeasonListChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }

}
