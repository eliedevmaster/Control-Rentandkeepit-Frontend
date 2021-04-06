import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState } from 'app/store/reducers';

import { Basecourse } from 'app/models/companymanagement/basecourse';
import { User } from 'app/models/user';
import { GetBasecourseListForCompany, RegisterBasecourse, UpdateBasecourse } from 'app/store';

@Component({
  selector: 'app-basecourse-form',
  templateUrl: './basecourse-form.component.html',
  styleUrls: ['./basecourse-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BasecourseFormComponent {

  action: string;
  basecourse: Basecourse;
  basecourseForm: FormGroup;
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
      public matDialogRef: MatDialogRef<BasecourseFormComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder,
      private _store: Store<AppState>
  )
  {
      // Set the defaults
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Edit Course';
          this.basecourse = _data.basecourse;
      }
      else
      {
          this.dialogTitle = 'New Course';
          this.basecourse = new Basecourse({});
      }
      this.mapUserStateToModel();

      this.basecourseForm = this.createBasecourseForm();
    }

    ngOnInit(): void
    {
        this.basecourseForm = this.createBasecourseForm();
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
  createBasecourseForm(): FormGroup
  {
      return this._formBuilder.group({
        type          : [this.basecourse.type, Validators.required], 
        name          : [this.basecourse.name, Validators.required],
        price         : [this.basecourse.price, Validators.required],
        currency      : [this.basecourse.currency_id, Validators.required],
        minNumber     : [this.basecourse.min_number, Validators.required],
        maxNumber     : [this.basecourse.max_number, Validators.required],
        description   : [this.basecourse.description],
      });
  }
  
  onSave()
  {
      if(this.action === "edit") {
        const payload = {
          id               : this.basecourse.id,
          company_id       : this.user.role_relation_id,
          type             : this.basecourseForm.value['type'],
          name             : this.basecourseForm.value['name'],
          price            : this.basecourseForm.value['price'],
          currency_id      : this.basecourseForm.value['currency'],
          min_number       : this.basecourseForm.value['minNumber'],
          max_number       : this.basecourseForm.value['maxNumber'],
          description      : this.basecourseForm.value['description'],
        }
  
        this._store.dispatch(new UpdateBasecourse({basecourse : payload}));
        this._store.dispatch(new GetBasecourseListForCompany({companyId : this.user.role_relation_id}));
      }
      else {

        const payload = {
          company_id       : this.user.role_relation_id,
          type             : this.basecourseForm.value['type'],
          name             : this.basecourseForm.value['name'],
          price            : this.basecourseForm.value['price'],
          currency_id      : this.basecourseForm.value['currency'],
          min_number       : this.basecourseForm.value['minNumber'],
          max_number       : this.basecourseForm.value['maxNumber'],
          description      : this.basecourseForm.value['description'],
        }
  
        this._store.dispatch(new RegisterBasecourse({basecourse : payload}));
        this._store.dispatch(new GetBasecourseListForCompany({companyId : this.user.role_relation_id}));
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

