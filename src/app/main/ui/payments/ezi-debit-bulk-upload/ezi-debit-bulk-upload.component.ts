import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Back } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';
import { FileUploadService } from  'app/core/services/file-upload.service';

import { State as AppState, getAuthState } from 'app/store/reducers';
import { User } from 'app/models/user';

import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-ezi-debit-bulk-upload',
  templateUrl: './ezi-debit-bulk-upload.component.html',
  styleUrls: ['./ezi-debit-bulk-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class EziDebitBulkUploadComponent implements OnInit {

  eziDebitBulkForm: FormGroup;
  user: User;

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
      this.eziDebitBulkForm = this._formBuilder.group({
       
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
  onConfirm(): void
  {
    if(this.files.length == 0) {
      Swal.fire('Ooops', 'Please upload the files.', 'error');
    }
    else
      Swal.fire('Yes', 'File upload succeded.', 'success');
    
  } 

  backPath(): void 
  {
    this._store.dispatch(new Back());
  }

  uploadFile(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);
    formData.append('category', 'payment-2');
  
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
