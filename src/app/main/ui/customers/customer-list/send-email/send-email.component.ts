import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Back, UpdateCustomer } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';

import Swal from 'sweetalert2/dist/sweetalert2.js';  

import { State as AppState, getAuthState } from 'app/store/reducers';
import { User } from 'app/models/user';


@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class SendEmailComponent implements OnInit {

  emailForm: FormGroup;
  user: User;
  type: string;
  customerId: number;
  customer : any;
  email : string;

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
      private _store: Store<AppState>,
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.customerId = this._activatedRoute.snapshot.params.customerId;
      this.customer = JSON.parse(localStorage.getItem('customer'));
      this.email = this.customer.email;
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
      this.emailForm = this._formBuilder.group({
        subject         : ['', Validators.required],
        message         : ['', Validators.required]
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
  onSend(): void
  {
    
    let payload = {
      email                : this.customer.email,
      subject              : this.emailForm.value['postCode'],
      message              : this.emailForm.value['city'],
    }
    Swal.fire('Yes', "You have sent email successfully.", 'success');
    //this._store.dispatch(new UpdateCustomer({ customer : payload }));
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

}
