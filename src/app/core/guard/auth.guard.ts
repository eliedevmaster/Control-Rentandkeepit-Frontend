import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {State as AppState, selectAuthTokenState} from 'app/store/reducers';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  authToken$: Observable<any>;

  constructor(private store: Store<AppState>, private router: Router){
    this.authToken$ = this.store.select(selectAuthTokenState);
  }
 
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authToken$.pipe(
        map(token => {
          if (!token) {
              this.router.navigate(['pages/auth/login']);
              return false;
            }
            return true;
          }
        )
      );
  }
}
