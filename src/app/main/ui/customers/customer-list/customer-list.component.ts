import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Go, GetCustomerList } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';

import { CustomerListService } from 'app/main/ui/customers/customer-list/customer-list.service';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { User } from 'app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerListComponent implements OnInit {

 
  dialogRef: any;
  hasSelectedCustomers: boolean;
  searchInput: FormControl;
  user: User;
  
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CustomerListService} _customerListService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(
      private _customerListService: CustomerListService,
      private _fuseSidebarService: FuseSidebarService,
      private _store: Store<AppState>,
      private _matDialog: MatDialog
  )
  {
      // Set the defaults
      this.searchInput = new FormControl('');

      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.mapUserStateToModel();
      this._store.dispatch(new GetCustomerList());

  }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      this._customerListService.onSelectedCustomerListChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(selectedCustomers => {
              this.hasSelectedCustomers = selectedCustomers.length > 0;
          });

      this.searchInput.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              distinctUntilChanged()
          )
          .subscribe(searchText => {
              this._customerListService.onSearchTextChanged.next(searchText);
          });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Reset the search
      this._customerListService.onSearchTextChanged.next('');

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
  newCustomer(): void
  {
      if(this.user.active == 0) {
        Swal.fire('Ooops!', 'You have to register company at first!', 'error');
        this._store.dispatch(new Go({path: ['/ui/register-company'], query: null, extras: null}));
        return;
      }
      this.dialogRef = this._matDialog.open(CustomerFormComponent, {
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
              //this._customerListService.updateCustomer();
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

  mapUserStateToModel(): void
  {
      this.getAuthState().subscribe(state => {
          if(state.user != null) {
              this.user = new User(state.user);
          }
      });
  }

  getAuthState()
  {
      return this._store.select(getAuthState);
  }

}

