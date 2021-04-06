import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Signup, Go, GetCompanyList } from 'app/store/actions';
import { Store } from '@ngrx/store';
import {State as AppState, getAuthState} from 'app/store/reducers';
import { BaseService } from '../../../../core/services/base.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    registerForm: FormGroup;
    errorMessage: string = "";
    languages: any;
    selectedLanguage: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        private _baseService: BaseService,
        private _store: Store<AppState>,

    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id : 'it',
                title: 'Italian',
                flag: 'it' 
            },
        ];

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
        this.registerForm = this._formBuilder.group({
            name           : ['', Validators.required],
            email          : ['', [Validators.required, Validators.email]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });

        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        localStorage.removeItem('role_id');
    }

    onSignUp(): void 
    {
        
        const userData = {
            name: this.registerForm.value['name'], 
            email: this.registerForm.value['email'],
            password: this.registerForm.value['password'],
            password_confirmation: this.registerForm.value['passwordConfirm'],
        };
        this._store.dispatch(new Signup ({
            name: userData.name, 
            email: userData.email,
            password: userData.password,
            password_confirmation: userData.password_confirmation,
        }));

        this.getAuthstate().subscribe(state => {
            if(state.isAuthenticated) {
                this._store.dispatch(new Go({path: ['/ui/customers/customer-list'], query: null, extras: null}));
            }
        });
    }

    /**
     * Set the language
     *
     * @param lang
     */
     setLanguage(lang): void
     {
         // Set the selected language for the toolbar
         this.selectedLanguage = lang;
 
         // Use the selected language for translations
         this._translateService.use(lang.id);
    }
    
    getAuthstate()
    {
        return this._store.select(getAuthState);
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
