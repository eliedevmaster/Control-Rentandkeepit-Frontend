import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Login, Go, GetCurrentCompany, GetCurrentCollaborator, 
         GetCurrentInstructor, GetCollaboratorListForMe, GetInstructorListForMe,
         GetPermissionList } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getAuthState, getCompanyState } from 'app/store/reducers';

import { User } from 'app/models/user';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    http: HttpClient;
    languages: any;
    selectedLanguage: any;

    isAuthenticated: boolean = false;
    user: User;
    errorMsg: string;
    
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param {Store<AppState>} _store 
     * @param {TranslateService} _translateService

     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        private _store: Store<AppState>
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
                flag : 'au'
            }
        ];

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
    }

    onLogin(): void 
    {
        this._store.dispatch(new Login({email: this.loginForm.value['email'], password: this.loginForm.value['password']}));
        
        this.getAuthState().subscribe((state) => {
            if(state.isAuthenticated) {

                this.isAuthenticated = state.isAuthenticated;
                this._store.dispatch(new Go({path: ['/ui/customers/customer-list'], query: null, extras: null}));   
                
            }
            else {
                this.errorMsg = state.errorMessage;
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

    getAuthState(): any 
    {
        return this._store.select(getAuthState);
    }

    getCompanyState(): any
    {
        return this._store.select(getCompanyState);
    }
    
}
