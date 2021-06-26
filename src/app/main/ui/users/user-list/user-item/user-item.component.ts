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

import { UserListService } from 'app/main/ui/users/user-list/user-list.service';

import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import { Go , GetUserList, DeleteUser } from 'app/store/actions';
import { environment as env } from '../../../../../../environments/environment';

import { User } from 'app/models/user';


@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class UserItemComponent implements OnInit {

  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  willLoad: boolean = true;
  userListLength: number = 0;
  userList: Array<User>;
  user: User;
  dataSource: MatTableDataSource<User> | null;
  displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'action'];
  selectedUserList: User[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  backendUrl: string = `${env.backendBaseUrl}/uploads/pictures/`;
   
  // Private
  private _unsubscribeAll: Subject<any>;

  
  /**
   * Constructor
   *
   * @param {userListService} _userListService
   * @param {MatDialog} _matDialog
   */
  constructor(
      private _userListService: UserListService,
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
      //localStorage.removeItem('user');
  }

  ngAfterViewChecked(): void 
  {
      this.dataSource = new MatTableDataSource(this._userListService.userList);
      this._userListService.onSelectedUserListChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(userList => {
              this.userList = userList;

              this.checkboxes = {};
              userList.map(user => {
                  this.checkboxes[user.id] = false;
              });
          });

      this._userListService.onSelectedUserListChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(selectedUserList => {
              for ( const id in this.checkboxes )
              {
                  if ( !this.checkboxes.hasOwnProperty(id) )
                  {
                      continue;
                  }
                  this.checkboxes[id] = selectedUserList.includes(id);
              }
              this.selectedUserList = selectedUserList;
          });

      this._userListService.onUserDataChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(user => {
              this.user = user;
          });

      this._userListService.onFilterChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
              this._userListService.deselectUserList();
          });

      this._userListService.onSearchTextChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
          this.dataSource = new MatTableDataSource(this._userListService.userList);
      });    
      this._cdref.detectChanges();
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
   * @param user
   */
  editUser(user): void
  {
      localStorage.setItem('user', JSON.stringify(user));
      //this._store.dispatch(new Go({path: ['/ui/users/user-form/' + 'update/' + user.id], query: null, extras: null}));
  }

  /**
   * Delete Contact
   */
  deleteUser(user): void
  {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if ( result )
          {
              this._userListService.deleteUser(user);
              this.willLoad = true;
              this._store.dispatch(new DeleteUser({userId : user.id}));
              console.log("delete...");
          }
          this.confirmDialogRef = null;
      });
  }

  /**
   * On selected change
   *
   * @param userId
   */
  onSelectedChange(userId): void
  {
      this._userListService.toggleSelectedUser(userId);
  }

  /**
   * Toggle star
   *
   * @param userId
   */
  toggleStar(userId): void
  {
      /*if ( this.user.starred.includes(contactId) )
      {
          this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
      }
      else
      {
          this.user.starred.push(contactId);
      }

      this._userListService.updateUserData(this.user);*/
  }
}

export class FilesDataSource extends DataSource<any>
{
  /**
   * Constructor
   *
   * @param {userListService} _userListService
   */
  constructor(
      private _userListService: UserListService
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
      return this._userListService.onSelectedUserListChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void
  {
  }

}
