import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState } from 'app/store/reducers';
import { PermissionService } from 'app/core/services/permission.service';

import { Instructor } from 'app/models/instructormanagement/instructor';
import { Permission } from 'app/models/companymanagement/permission';

@Component({
  selector: 'app-instructor-permission-form',
  templateUrl: './instructor-permission-form.component.html',
  styleUrls: ['./instructor-permission-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstructorPermissionFormComponent {

  action: string;
  instructor: Instructor;
  instructorForm: FormGroup;
  dialogTitle: string;
  permissionList: Array<Permission> = [];
  
  permissionListForUser: Array<Permission> = [];
  permissionListForUserViaRole: Array<Permission> = [];
  
  addPermissionIds: string = '';
  deletePermissionIds: string = '';

  /**
   * Constructor
   *
   * @param {MatDialogRef<InstructorPermissionFormComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      public matDialogRef: MatDialogRef<InstructorPermissionFormComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder,
      private _permissionService: PermissionService,
      private _store: Store<AppState>
  )
  {
      // Set the defaults
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Give Permissions';
          this.instructor = _data.instructor;
      }
      else
      {
          this.dialogTitle = 'New Instructor';
          this.instructor = new Instructor({});
      }

      this.instructorForm = this.createinstructorForm();
    }

    ngOnInit(): void
    {
        this.mapPermissionListStateToModel();
        this.getPermissionForUser(this.instructor.user.id);
        this.getPermissionsForUserViaRole(this.instructor.user.id);
        this.instructorForm = this.createinstructorForm();
      }

    
    ngOnDestroy(): void
    {
        
    }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create contact form
   *
   * @returns {FormGroup}
   */
  createinstructorForm(): FormGroup
  {
      const payload = {};
      return this._formBuilder.group(payload);
  }

   mapPermissionListStateToModel(): void
   {
        this._store.select(getCompanyState).subscribe(state => {
            if(state.permissionList != null) {
                state.permissionList.forEach(element => {
                    this.permissionList.push(new Permission(element));
                });
            }
        });
    }

    getPermissionForUser(id): void
    {   
        let permissionsTemp = JSON.parse(localStorage.getItem(id + 'permissions'));
        if(permissionsTemp != null) {
            permissionsTemp.forEach(element => {
                this.permissionListForUser.push(new Permission(element));
            });
        }
        else {
            this._permissionService.getPermissionsForUser(id).subscribe(permissions => {
                permissions.forEach(element => {
                    this.permissionListForUser.push(new Permission(element));
                });
                localStorage.setItem((id + 'permissions'), JSON.stringify(this.permissionListForUser));
            });            
        }
    }

    getPermissionsForUserViaRole(id): void
    {
      let permissionsTemp = JSON.parse(localStorage.getItem('role_permissions_instructor'));
      if(permissionsTemp != null) {
          permissionsTemp.forEach(element => {
            this.permissionListForUserViaRole.push(new Permission(element));
          });
          this.permissionListForUserViaRole.forEach(element => {
            this.permissionList = this.permissionList.filter(obj => obj.id !== element.id);
          });
      }
      else {
          this._permissionService.getPermissionsForUserViaRole(id).subscribe(permissions => {
  
            permissions.forEach(element => {
                this.permissionListForUserViaRole.push(new Permission(element));
              });

              this.permissionListForUserViaRole.forEach(element => {
                this.permissionList = this.permissionList.filter(obj => obj.id !== element.id);
              });
              localStorage.setItem(('role_permissions_instructor'), JSON.stringify(this.permissionListForUserViaRole));
          });            
      }
    }

    checkPermissionExistence (param) : any
    {
      return this.permissionListForUser.some( ({name}) => name == param)  
    } 

    onToggle($event: MatSlideToggleChange, permission: Permission) 
    {
        if($event.checked)
            this.addPermissionIds += (',' + permission.id);
        else
            this.deletePermissionIds += (',' + permission.id);
    }

    onSave()
    {
        this._permissionService.givePermissionsToUser(this.instructor.user.id, this.addPermissionIds, this.deletePermissionIds).subscribe(permissions => {
            this.permissionListForUser = [];
            permissions.forEach(element => {
                this.permissionListForUser.push(new Permission(element));
            });
            localStorage.removeItem((this.instructor.user.id + 'permissions'));
            localStorage.setItem((this.instructor.user.id + 'permissions'), JSON.stringify(this.permissionListForUser));
        });
        this.matDialogRef.close(['save', true]);
    }
}
