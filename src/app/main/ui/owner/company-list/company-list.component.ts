import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';

import { GetCompanyList } from 'app/store/actions';

import { CompanyListService } from 'app/main/ui/owner/company-list/company-list.service';
import { CompanyItemFormComponent } from './company-item-form/company-item-form.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CompanyListComponent implements OnInit, OnDestroy {

  dialogRef: any;
  hasSelectedInstructors: boolean;
  searchInput: FormControl;
  
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CompanyListService} _companyListService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   * @param {Store<AppState>} _store
   */
  constructor(
      private _companyListService: CompanyListService,
      private _fuseSidebarService: FuseSidebarService,
      private _matDialog: MatDialog,
      private _store: Store<AppState>,
  )
  {
      // Set the defaults
      this.searchInput = new FormControl('');

      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this._store.dispatch(new GetCompanyList());
  }


   /**
     * On init
     */
    ngOnInit(): void
    {
        this._companyListService.onSelectedCompanyListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedInstructors => {
                this.hasSelectedInstructors = selectedInstructors.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._companyListService.onSearchTextChanged.next(searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Reset the search
        this._companyListService.onSearchTextChanged.next('');

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
   // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * New contact
     */
    newContact(): void
    {
        this.dialogRef = this._matDialog.open(CompanyItemFormComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }

                this._companyListService.updateContact(response.getRawValue());
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

}
