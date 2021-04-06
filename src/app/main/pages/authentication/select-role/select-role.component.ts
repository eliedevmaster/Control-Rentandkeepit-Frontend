import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Go } from 'app/store/actions';
import { Store } from '@ngrx/store';
import {State as AppState, getAuthState} from 'app/store/reducers';

import { BaseService } from 'app/core/services/base.service';
import { AuthService } from 'app/core/services/auth.service';

@Component({
    selector     : 'select-role',
    templateUrl  : './select-role.component.html',
    styleUrls    : ['./select-role.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SelectRoleComponent implements OnInit
{
    languages: any;
    selectedLanguage: any;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _baseService: BaseService,
        private _authService: AuthService,
        private _store: Store<AppState>,
        private _translateService: TranslateService,

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
    }

    get shareData(): any {
        return this._baseService.shareSignUpInfo;
    }

    set shareData(value: any) {
        this._baseService.shareSignUpInfo = value;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
    }

    onClick (id: number) : void 
    {
        this.shareData = id;
        console.log(id.toString());
        localStorage.setItem('role_id', id.toString());
        this._store.dispatch(new Go({path: ['/pages/auth/register'], query: null, extras: null}));
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

