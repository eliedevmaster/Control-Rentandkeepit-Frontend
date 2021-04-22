import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Go, GetOrderList} from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';

import { CustomerOrderListService } from 'app/main/ui/customers/customer-order-list/customer-order-list.service';
//import { CustomerFormComponent } from './customer-form/customer-form.component';
import { User } from 'app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerOrderListComponent implements OnInit {

  dialogRef: any;
  hasSelectedOrders: boolean;
  searchInput: FormControl;
  user: User;
  customerId: number;
  customerName: string;
  
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {OrderListService} _customerOrderListService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(
      private _customerOrderListService: CustomerOrderListService,
      private _fuseSidebarService: FuseSidebarService,
      private _store: Store<AppState>,
      private _activatedRoute: ActivatedRoute,
  )
  {
      // Set the defaults
      this.searchInput = new FormControl('');

      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.mapUserStateToModel();
      this.customerId = this._activatedRoute.snapshot.params.customerId;
      this.customerName = this._activatedRoute.snapshot.params.customerName;
      this._store.dispatch(new GetOrderList());
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      this._customerOrderListService.onSelectedOrderListChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(selectedOrders => {
              this.hasSelectedOrders = selectedOrders.length > 0;
          });

      this.searchInput.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              distinctUntilChanged()
          )
          .subscribe(searchText => {
              this._customerOrderListService.onSearchTextChanged.next(searchText);
          });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Reset the search
      this._customerOrderListService.onSearchTextChanged.next('');

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
  newOrder(): void
  {

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
