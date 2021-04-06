import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SeasonListService } from "../season-list/season-list.service";
import { Subject } from 'rxjs';

import {  Back, RegisterSeason, UpdateSeason } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getInstructorState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';

@Component({
  selector: 'app-register-season',
  templateUrl: './register-season.component.html',
  styleUrls: ['./register-season.component.scss']
})
export class RegisterSeasonComponent implements OnInit {

  seasonForm: FormGroup;
  user: User;
  type: string;
  seasonId: number;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      private _formBuilder: FormBuilder,
      private _activatedRoute: ActivatedRoute,
      private _seasonListService: SeasonListService,
      private _store: Store<AppState>,
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.type = this._activatedRoute.snapshot.params.type;
      this.seasonId = this._activatedRoute.snapshot.params.id;
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
      this.seasonForm = this._formBuilder.group({
        name               : ['', Validators.required],
        description        : ['', Validators.required],
        startDate          : ['', Validators.required],
        endDate            : ['', Validators.required],
      });
      
      this.mapUserStateToModel();
      if(this.type == 'update')
        this.setinitValue();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      localStorage.removeItem('season');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  onRegister(): void
  {
      if(this.type == 'new') {
          let payload = {
            company_id        : this.user.role_relation_id,
            name              : this.seasonForm.value['name'],
            description       : this.seasonForm.value['description'],
            start_date        : this.seasonForm.value['startDate'],
            end_date          : this.seasonForm.value['endDate'],
        };
        this._store.dispatch(new RegisterSeason({ season : payload }));
      }
      else if(this.type == "update") {
          let payload = {
            id                : this.seasonId,
            company_id        : this.user.role_relation_id,
            name              : this.seasonForm.value['name'],
            description       : this.seasonForm.value['description'],
            start_date        : this.seasonForm.value['startDate'],
            end_date          : this.seasonForm.value['endDate'],      
          }
          this._seasonListService.setUpdateForView();
         this._store.dispatch(new UpdateSeason({ season : payload }));
         //this._store.dispatch(new GetSeasonListForCompany({companyId : this.user.role_relation_id}));
      }
      
     // this._store.dispatch(new Go({path: ['/ui/company/facility-list'], query: null, extras: null}));
  } 

  setinitValue(): void 
  {
    const season = JSON.parse(localStorage.getItem('season'));
    this.seasonForm.controls['name'].setValue(season.name);
    this.seasonForm.controls['description'].setValue(season.description);
    this.seasonForm.controls['startDate'].setValue(new Date(season.start_date));
    this.seasonForm.controls['endDate'].setValue(new Date(season.end_date));
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
