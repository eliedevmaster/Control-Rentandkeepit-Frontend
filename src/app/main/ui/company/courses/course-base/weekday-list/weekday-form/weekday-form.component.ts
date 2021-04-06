import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';

import { Weekday } from 'app/models/companymanagement/weekday';
import { User } from 'app/models/user';
import { GetWeekdayListForCompany, RegisterWeekday, UpdateWeekday } from 'app/store';


@Component({
  selector: 'app-weekday-form',
  templateUrl: './weekday-form.component.html',
  styleUrls: ['./weekday-form.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class WeekdayFormComponent {

  action: string;
  weekday: Weekday;
  weekdayForm: FormGroup;
  dialogTitle: string;
  user: User;
  
  addDays: Array<number> = [];

  /**
   * Constructor
   *
   * @param {MatDialogRef<InstructorPermissionFormComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      public matDialogRef: MatDialogRef<WeekdayFormComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder,
      private _store: Store<AppState>
  )
  {
      // Set the defaults
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Edit WeekdaySchedule';
          this.weekday = _data.weekday;
          this.addDays = JSON.parse(this.weekday.days);
      }
      else
      {
          this.dialogTitle = 'New WeekdaySchedule';
          this.weekday = new Weekday({});
      }
      this.mapUserStateToModel();

      this.weekdayForm = this.createWeekdayForm();
    }

    ngOnInit(): void
    {
        this.weekdayForm = this.createWeekdayForm();
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
  createWeekdayForm(): FormGroup
  {
      return this._formBuilder.group({
        name : [this.weekday.name, Validators.required],
      });
  }
  
  onToggle($event: MatSlideToggleChange, day: number) 
  {
    this.addDays = this.addDays.filter(e => e != day);
    if($event.checked)
        this.addDays.push(day);    
  }

  checkedToggleValue(day): boolean 
  {
    let isExsistingDay = this.addDays.find(e => e == day);
    if(isExsistingDay)
      return true;
    return false;
  }
  onSave()
  {
      if(this.action === "edit") {
        const payload = {
          id         : this.weekday.id,
          company_id : this.user.role_relation_id,
          name       : this.weekdayForm.value['name'],
          days       : JSON.stringify(this.addDays),
        }
  
        this._store.dispatch(new UpdateWeekday({weekday : payload}));
        this._store.dispatch(new GetWeekdayListForCompany({companyId : this.user.role_relation_id}));
      }
      else {
        const payload = {
          company_id : this.user.role_relation_id,
          name       : this.weekdayForm.value['name'],
          days       : JSON.stringify(this.addDays),
        }
  
        this._store.dispatch(new RegisterWeekday({weekday : payload}));
        this._store.dispatch(new GetWeekdayListForCompany({companyId : this.user.role_relation_id}));
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
