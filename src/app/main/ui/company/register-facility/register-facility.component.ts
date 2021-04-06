import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import {  Go, Back, RegisterFacility } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getInstructorState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Instructor } from 'app/models/instructormanagement/instructor';
import { Company } from 'app/models/companymanagement/company';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-register-facility',
  templateUrl: './register-facility.component.html',
  styleUrls: ['./register-facility.component.scss']
})
export class RegisterFacilityComponent implements OnInit {

  facilityForm: FormGroup;
  user: User;
  instructor: Instructor;
  companyList: Company[] = [];
  isActive: boolean = false;
  companyName: string = '';

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      private _formBuilder: FormBuilder,
      private _store: Store<AppState>,
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
      // Reactive Form
      this.facilityForm = this._formBuilder.group({
        type               : ['', Validators.required],
        name               : ['', Validators.required],
        description        : [''],
      });
      this.mapUserStateToModel();
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
  onRegister(): void
  {
    console.log('user', this.user);

      let payload = {
          company_id        : this.user.role_relation_id,
          type              : this.facilityForm.value['type'],
          name              : this.facilityForm.value['name'],
          description       : this.facilityForm.value['description'],
      };
      this._store.dispatch(new RegisterFacility({ facility : payload }));
     // this._store.dispatch(new Go({path: ['/ui/company/facility-list'], query: null, extras: null}));
  } 

  backPath(): void 
  {
    this._store.dispatch(new Back());
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

  getCompanyState()
  {
    return this._store.select(getCompanyState);
  }

  getInstructorState()
  {
    return this._store.select(getInstructorState);
  }

}
