import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState, } from 'app/store/reducers';
import { GetUserList, Go } from 'app/store/actions';
import { UserListService } from 'app/main/ui/users/user-list/user-list.service';
import { User } from 'app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class UserListComponent implements OnInit {

  dialogRef: any;
  hasSelectedUsers: boolean;
  searchInput: FormControl;
  user: User;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ContactsService} _userListService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(
      private _userListService: UserListService,
      private _fuseSidebarService: FuseSidebarService,
      private _store: Store<AppState>,
  )
  {
      // Set the defaults
      this.searchInput = new FormControl('');

      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.mapUserStateToModel();
      this._store.dispatch(new GetUserList());

  }


      // -----------------------------------------------------------------------------------------------------
      // @ Lifecycle hooks
      // -----------------------------------------------------------------------------------------------------

      /**
       * On init
       */
      ngOnInit(): void
      {

          this._userListService.onSelectedUserListChanged
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe(selectedUsers => {
                  this.hasSelectedUsers = selectedUsers.length > 0;
              });

          this.searchInput.valueChanges
              .pipe(
                  takeUntil(this._unsubscribeAll),
                  debounceTime(300),
                  distinctUntilChanged()
              )
              .subscribe(searchText => {
                  this._userListService.onSearchTextChanged.next(searchText);
              });
      }

      /**
       * On destroy
       */
      ngOnDestroy(): void
      {
          // Reset the search
          this._userListService.onSearchTextChanged.next('');

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
      newUser(): void
      {
          this._store.dispatch(new Go({path: ['/ui/users/user-form/0'], query: null, extras: null}));
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
