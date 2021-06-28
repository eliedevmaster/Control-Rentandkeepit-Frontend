import { Component, OnDestroy, OnInit , ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Back, CreateUser, GetCurrentUser, Go, UpdateUser } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { fuseAnimations } from '@fuse/animations';
import { FileUploadService } from  'app/core/services/file-upload.service';

import { State as AppState, getAuthState } from 'app/store/reducers';
import { User } from 'app/models/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  user: User;
  type: string;
  isMe: number;
  userName: string;

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
      this.isMe = this._activatedRoute.snapshot.params.me;
      this.mapUserStateToModel();
      //this.userName = this._activatedRoute.snapshot.params.userName;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      //console.log(this.user);
      // Reactive Form
      if(this.isMe == 0) {
        this.userForm = this._formBuilder.group({
          userName              : ['', Validators.required],
          email                 : ['', Validators.required],
          password              : ['', Validators.required],
          passwordConfirmation  : ['', Validators.required],
          
        });
      }

      else {
        this.userForm = this._formBuilder.group({
          userName              : [this.user.name, Validators.required],
          email                 : [this.user.email, Validators.required],          
        });
      }
      //this.setinitValue();
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
    if(this.isMe == 0) {
      let payload = {
        name                  : this.userForm.value['userName'],
        email                 : this.userForm.value['email'],
        password              : this.userForm.value['password'],
        password_confirmation : this.userForm.value['passwordConfirmation'],
        role_id     : 1,
      }
  
      this._store.dispatch(new CreateUser({ user : payload }));
      this._store.dispatch(new Go({path: ['/ui/users/user-list'], query: null, extras: null}));
    }
    else 
    {
      let payload = {
        id                    : this.user.id,
        name                  : this.userForm.value['userName'],
        email                 : this.userForm.value['email'],
      }
      this._store.dispatch(new UpdateUser({ user : payload }));
    }
    
  } 

  setInitValue(user:any) : void 
  {
    this.userForm.controls['userName'].setValue(user.name);
    this.userForm.controls['email'].setValue(user.email);
  }

  backPath(): void 
  {
    this._store.dispatch(new Back());
  }

  uploadFile(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);
    formData.append('category', 'me');
      
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
          this._store.dispatch(new GetCurrentUser());
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
            this.files = [];
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
