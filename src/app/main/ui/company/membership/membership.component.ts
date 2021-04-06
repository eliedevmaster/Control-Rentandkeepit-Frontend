import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Go } from 'app/store/actions';

import { Store } from '@ngrx/store';
import { State as AppState, getCompanyState, getAuthState } from 'app/store/reducers';

import { Company } from 'app/models/companymanagement/company';
import { User } from 'app/models/user';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class MembershipComponent implements OnInit {

  user: User;
  company: Company;
  
  constructor(private _store: Store<AppState>) 
  { }

  ngOnInit(): void 
  {
    this.mapUserStateToModel();
    this.mapCompanyStateToModel();
  }

  onClickProMembership(): void 
  {
    this._store.dispatch(new Go({path: ['ui/company/membership/creditcardfrom'], query: null, extras: null}));   
  }

  mapUserStateToModel(): void
  {
      this.getAuthState().subscribe(state => {
          if(state.user != null) {
              this.user = new User(state.user);
          }
      });
  }

  mapCompanyStateToModel(): void
  {
      this.getCompanyState().subscribe(state => {
          if(state.company != null) {                
              this.company = new Company(state.company);
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

}
