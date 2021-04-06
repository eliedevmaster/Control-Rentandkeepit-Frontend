import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';

import { Timeschedule } from 'app/models/companymanagement/timeschedule';
import { User } from 'app/models/user';
import { GetTimescheduleListForCompany, RegisterTimeschedule, UpdateTimeschedule } from 'app/store';

@Component({
  selector: 'app-timeschedule-form',
  templateUrl: './timeschedule-form.component.html',
  styleUrls: ['./timeschedule-form.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TimescheduleFormComponent {

  action: string;
  timeschedule: Timeschedule;
  timescheduleForm: FormGroup;
  dialogTitle: string;
  user: User;
  
  /**
   * Constructor
   *
   * @param {MatDialogRef<InstructorPermissionFormComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      public matDialogRef: MatDialogRef<TimescheduleFormComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder,
      private _store: Store<AppState>
  )
  {
      // Set the defaults
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Edit TimeSchedule';
          this.timeschedule = _data.timeschedule;
      }
      else
      {
          this.dialogTitle = 'New TimeSchedule';
          this.timeschedule = new Timeschedule({});
      }
      this.mapUserStateToModel();

      this.timescheduleForm = this.createTimescheduleForm();
    }

    ngOnInit(): void
    {
        this.timescheduleForm = this.createTimescheduleForm();
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
  createTimescheduleForm(): FormGroup
  {
      return this._formBuilder.group({
        name        : [this.timeschedule.name, Validators.required],
        startTime  : [this.timeschedule.start_time, Validators.required],
        endTime    : [this.timeschedule.end_time, Validators.required],
      });
  }
  

  onSave()
  {
      if(this.action === "edit") {
        const payload = {
          id               : this.timeschedule.id,
          company_id       : this.user.role_relation_id,
          name             : this.timescheduleForm.value['name'],
          start_time       : this.timescheduleForm.value['startTime'],
          end_time         : this.timescheduleForm.value['endTime'],
        }
  
        this._store.dispatch(new UpdateTimeschedule({timeschedule : payload}));
        this._store.dispatch(new GetTimescheduleListForCompany({companyId : this.user.role_relation_id}));
      }
      else {
        console.log("save");
        const payload = {
          company_id       : this.user.role_relation_id,
          name             : this.timescheduleForm.value['name'],
          start_time       : this.timescheduleForm.value['startTime'],
          end_time         : this.timescheduleForm.value['endTime'],
        }
  
        this._store.dispatch(new RegisterTimeschedule({timeschedule : payload}));
        this._store.dispatch(new GetTimescheduleListForCompany({companyId : this.user.role_relation_id}));
      }
      this.matDialogRef.close(['save', true]);

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
