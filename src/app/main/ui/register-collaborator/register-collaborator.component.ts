import { Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { RegisterCollaborator, UpdateCollaborator, SetActive, GetCompanyList } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getCollaboratorState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Collaborator } from 'app/models/collaboratormanagement/collaborator';
import { Company } from 'app/models/companymanagement/company';
import Swal from 'sweetalert2/dist/sweetalert2.js';  


@Component({
  selector: 'app-register-collaborator',
  templateUrl: './register-collaborator.component.html',
  styleUrls: ['./register-collaborator.component.scss']
})
export class RegisterCollaboratorComponent implements OnInit {

    collaboratorForm: FormGroup;
    user: User;
    collaborator: Collaborator;
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
        this.collaboratorForm = this._formBuilder.group({

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
        this.mapCollaboratorStateToModel();

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
        var company = this.companyList.filter(obj => obj.personal_code == this.collaboratorForm.value['companyPersonalCode']);
        if(company[0] == null) {
            this.companyName = "No Company";
            Swal.fire('Sorry!', "You didn't select the company!", 'error');

            return null;
        }
        let formData = {
            company_id                  : company[0].id,
            first_name                  : this.collaboratorForm.value['firstName'],
            last_name                   : this.collaboratorForm.value['lastName'],
            address                     : this.collaboratorForm.value['address'],
            birthday                    : this.collaboratorForm.value['birthday'],
            gender                      : this.collaboratorForm.value['gender'],
            zipcode                     : this.collaboratorForm.value['zipCode'],
            tax_identification_number   : this.collaboratorForm.value['taxIdentificationNumber'],
            phone                       : this.collaboratorForm.value['phoneNumber'],
            fax                         : this.collaboratorForm.value['fax'],
        };

        let payload = new Collaborator(formData);
        if(this.user.active == 0) {
            this._store.dispatch(new RegisterCollaborator({collaborator : payload}));
            //this._store.dispatch(new SetActive());
            this.reloadCollaboratorInfo();
        }
        else if(this.user.active == 1) {
            payload.id = this.collaborator.id;
            this._store.dispatch(new UpdateCollaborator({collaborator : payload}))
        }
    } 

    onEnterPersonalCode(): void
    {
        let personal_code: string = '';
        personal_code = this.collaboratorForm.value['companyPersonalCode'];        
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
        if(this.user != null && this.collaborator != null && this.user.active == 1) {
            this.collaboratorForm.controls['companyPersonalCode'].setValue(this.collaborator.company.personal_code);
            this.onEnterPersonalCode();
            this.collaboratorForm.controls['firstName'].setValue(this.collaborator.first_name);
            this.collaboratorForm.controls['lastName'].setValue(this.collaborator.last_name);
            this.collaboratorForm.controls['address'].setValue(this.collaborator.address);
            this.collaboratorForm.controls['birthday'].setValue(new Date(this.collaborator.birthday));
            this.collaboratorForm.controls['gender'].setValue(this.collaborator.gender);
            this.collaboratorForm.controls['zipCode'].setValue(this.collaborator.zipcode);
            this.collaboratorForm.controls['taxIdentificationNumber'].setValue(this.collaborator.tax_identification_number);
            this.collaboratorForm.controls['phoneNumber'].setValue(this.collaborator.phone);
            this.collaboratorForm.controls['fax'].setValue(this.collaborator.fax);
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

    mapCollaboratorStateToModel(): void
    {
        this.getCollaboratorState().subscribe(state => {
            if(state.collaborator != null) {
                this.collaborator = new Collaborator(state.collaborator);
            }
        });
    }   

    reloadCollaboratorInfo(): void
    {
        if(this.user != null) {
            this.user.active = 1;
            this.isActive = true;
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(this.user));
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ State methods
    // ----

    getAuthState()
    {
        return this._store.select(getAuthState);
    }

    getCompanyState()
    {
        return this._store.select(getCompanyState);
    }

    getCollaboratorState()
    {
        return this._store.select(getCollaboratorState);
    }

}
