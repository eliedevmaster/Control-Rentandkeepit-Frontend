import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState } from 'app/store/reducers';

import { PermissionService } from 'app/core/services/permission.service';

import { Collaborator } from 'app/models/collaboratormanagement/collaborator';
import { Permission } from 'app/models/companymanagement/permission';


@Component({
  selector: 'app-collaborator-permission-form',
  templateUrl: './collaborator-permission-form.component.html',
  styleUrls: ['./collaborator-permission-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollaboratorPermissionFormComponent {

    action: string;
    collaborator: Collaborator;
    collaboratorForm: FormGroup;
    dialogTitle: string;
    permissionList: Array<Permission> = [];

    permissionListForUser: Array<Permission> = [];
    permissionListForUserViaRole: Array<Permission> = [];

    addPermissionIds: string = '';
    deletePermissionIds: string = '';
    /**
     * Constructor
     *
     * @param {MatDialogRef<CollaboratorPermissionFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<CollaboratorPermissionFormComponent>,
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
            this.collaborator = _data.collaborator;
        }
        else
        {
            this.dialogTitle = 'New Collaborator';
            this.collaborator = new Collaborator({});
        }

    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void
    {
        
        this.mapPermissionListStateToModel();
        this.getPermissionForUser(this.collaborator.user.id);
        this.getPermissionsForUserViaRole(this.collaborator.user.id);
        this.collaboratorForm = this.createcollaboratorForm();
    }

    ngOnDestroy(): void
    {
        
    }

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createcollaboratorForm(): FormGroup
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
      let permissionsTemp = JSON.parse(localStorage.getItem('role_permissions_collaborator'));
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
              localStorage.setItem(('role_permissions_collaborator'), JSON.stringify(this.permissionListForUserViaRole));
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
        this._permissionService.givePermissionsToUser(this.collaborator.user.id, this.addPermissionIds, this.deletePermissionIds).subscribe(permissions => {
            this.permissionListForUser = [];
            permissions.forEach(element => {
                this.permissionListForUser.push(new Permission(element));
            });
            localStorage.removeItem((this.collaborator.user.id + 'permissions'));
            localStorage.setItem((this.collaborator.user.id + 'permissions'), JSON.stringify(this.permissionListForUser));
        });
        this.matDialogRef.close(['save', true]);
    }
}
