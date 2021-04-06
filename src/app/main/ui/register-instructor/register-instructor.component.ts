import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { RegisterInstructor, UpdateInstructor, SetActive, GetCompanyList } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getInstructorState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Instructor } from 'app/models/instructormanagement/instructor';
import { Company } from 'app/models/companymanagement/company';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-register-instructor',
  templateUrl: './register-instructor.component.html',
  styleUrls: ['./register-instructor.component.scss']
})
export class RegisterInstructorComponent implements OnInit {

  instructorForm: FormGroup;
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
      this._store.dispatch(new GetCompanyList());
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
      this.instructorForm = this._formBuilder.group({
        companyPersonalCode     : ['', Validators.required],
        firstName               : ['', Validators.required],
        lastName                : ['', Validators.required],
        address                 : ['', Validators.required],
        birthday                : ['', Validators.required],
        gender                  : ['', Validators.required],
        zipCode                 : ['', Validators.required],
        taxIdentificationNumber : ['', Validators.required],
        phoneNumber             : ['', Validators.required],
        fax                     : [''],

      });

      this.mapUserStateToModel();
      this.mapCompanyListStateToModel();
      this.mapInstructorStateToModel();

      this.setInitFormValues();


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
      var company = this.companyList.filter(obj => obj.personal_code == this.instructorForm.value['companyPersonalCode']);
      if(company[0] == null) {
          this.companyName = "No Company";
          Swal.fire('Sorry!', "You didn't select the company!", 'error');

          return null;
      }
      let formData = {
          company_id                  : company[0].id,
          first_name                  : this.instructorForm.value['firstName'],
          last_name                   : this.instructorForm.value['lastName'],
          address                     : this.instructorForm.value['address'],
          birthday                    : this.instructorForm.value['birthday'],
          gender                      : this.instructorForm.value['gender'],
          zipcode                     : this.instructorForm.value['zipCode'],
          tax_identification_number   : this.instructorForm.value['taxIdentificationNumber'],
          phone                       : this.instructorForm.value['phoneNumber'],
          fax                         : this.instructorForm.value['fax'],
      };
      let payload = new Instructor(formData);

      if(this.user.active == 0) {
        this._store.dispatch(new RegisterInstructor({ instructor : payload }));
        //this._store.dispatch(new SetActive());
        this.reloadInstructorInfo();
      }
      else if(this.user.active == 1) {
        payload.id = this.instructor.id;
        this._store.dispatch(new UpdateInstructor({ instructor : payload }))
      }

  } 
  onEnterPersonalCode(): void
  {
      let personal_code: string = '';
      personal_code = this.instructorForm.value['companyPersonalCode'];        
      var company = this.companyList.filter(obj => obj.personal_code == personal_code );
      if(company[0] == null) {
          this.companyName = "";    
      }
      else {
          this.companyName = company[0].display_name;
      }

  }
  setInitFormValues(): void
  {
    if(this.user != null && this.instructor != null && this.user.active == 1) {
          this.instructorForm.controls['companyPersonalCode'].setValue(this.instructor.company.personal_code);
          this.onEnterPersonalCode();
          this.instructorForm.controls['firstName'].setValue(this.instructor.first_name);
          this.instructorForm.controls['lastName'].setValue(this.instructor.last_name);
          this.instructorForm.controls['address'].setValue(this.instructor.address);
          this.instructorForm.controls['birthday'].setValue(new Date(this.instructor.birthday));
          this.instructorForm.controls['gender'].setValue(this.instructor.gender);
          this.instructorForm.controls['zipCode'].setValue(this.instructor.zipcode);
          this.instructorForm.controls['taxIdentificationNumber'].setValue(this.instructor.tax_identification_number);
          this.instructorForm.controls['phoneNumber'].setValue(this.instructor.phone);
          this.instructorForm.controls['fax'].setValue(this.instructor.fax);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Map methods
  // ----
    
  mapUserStateToModel(): void
  {
    this.getAuthState().subscribe(state => {
      if(state.user != null) {
        this.user = new User(state.user);
        if(this.user.active == 0 && this.isActive == true)
          this.user.active = 1;
      }
    });
  }

  mapInstructorStateToModel(): void
  {
    this.getInstructorState().subscribe(state => {
      if(state.instructor != null) {                
          this.instructor = new Instructor(state.instructor);
      }
    });

  }

  mapCompanyListStateToModel(): void
  {
    this.getCompanyState().subscribe(state => {
      if(state.companyList != null) {
          state.companyList.forEach(element => {
              this.companyList.push(element);
          });
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ State methods
  // ----

  reloadInstructorInfo(): void
  {
      if(this.user != null) {
          this.user.active = 1;
          this.isActive = true;
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(this.user));
      }
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
