import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Back, UpdateCustomer } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';
import { FileUploadService } from  'app/core/services/file-upload.service';

import { State as AppState, getAuthState } from 'app/store/reducers';
import { User } from 'app/models/user';


@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerFormComponent implements OnInit {

  customerForm: FormGroup;
  user: User;
  type: string;
  customerId: number;
  customerName: string;

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];


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
      private _fileUploadService: FileUploadService,
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.customerId = this._activatedRoute.snapshot.params.customerId;
      this.customerName = this._activatedRoute.snapshot.params.customerName;
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
      this.customerForm = this._formBuilder.group({
        firstName         : ['', Validators.required],
        lastName          : ['', Validators.required],
        email             : ['', Validators.required],
        state             : ['', Validators.required],
        postCode          : ['', Validators.required],
        city              : ['', Validators.required], 
      });
      
      this.mapUserStateToModel();
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
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  onRegister(): void
  {
    
    let payload = {
      id                : this.customerId,
      first_name        : this.customerForm.value['firstName'],
      last_name         : this.customerForm.value['lastName'],
      email             : this.customerForm.value['email'],
      state             : this.customerForm.value['state'], 
      postcode          : this.customerForm.value['postCode'],
      city              : this.customerForm.value['city'],
    }
    this._store.dispatch(new UpdateCustomer({ customer : payload }));
  } 

  setinitValue(): void 
  {
    const customer = JSON.parse(localStorage.getItem('customer'));

    this.customerForm.controls['firstName'].setValue(customer.first_name);
    this.customerForm.controls['lastName'].setValue(customer.last_name);
    this.customerForm.controls['email'].setValue(customer.email);
    this.customerForm.controls['state'].setValue(customer.state);
    this.customerForm.controls['postCode'].setValue(customer.postcode);
    this.customerForm.controls['city'].setValue(customer.city);
  }

  backPath(): void 
  {
    this._store.dispatch(new Back());
  }

  uploadFile(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);  
    file.inProgress = true;  
    this._fileUploadService.upload(formData).pipe(  
      map(event => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            file.progress = Math.round(event.loaded * 100 / event.total);  
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      }),  
      catchError((error: HttpErrorResponse) => {  
        file.inProgress = false;  
        return of(`${file.data.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          console.log(event.body);  
        }  
      });  
  }

 uploadFiles() {  
    this.fileUpload.nativeElement.value = '';  
    console.log(this.files);
    this.files.forEach(file => {  
      this.uploadFile(file);  
    });  
}

  onClick() {  
      const fileUpload = this.fileUpload.nativeElement;
      fileUpload.onchange = () => {  
        for (let index = 0; index < fileUpload.files.length; index++)  
        {  
            const file = fileUpload.files[index];
            this.files.push({ data: file, inProgress: false, progress: 0});  
        }  
        this.uploadFiles();  
      };  
      fileUpload.click();  
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

