import { ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { createFeatureSelector, ActionReducerMap, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { Injectable } from "@angular/core";

import * as auth from './auth.reducers';
import * as company from './company.reducers';
import * as collaborator from './collaborator.reducers';
import * as instructor from './instructor.reducers';
import * as customer from './customer.reducers';

export interface RouterStateUrl
{
    url: string;
    queryParams: Params;
    params: Params;
}

export interface State
{
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
    authReducer: auth.State;
    companyReducer: company.State;
    collaboratorReducer: collaborator.State;
    instructorReducer: instructor.State;
    customerReducer: customer.State;
}

export const reducers: ActionReducerMap<State> = {
    routerReducer: fromRouter.routerReducer,
    authReducer: auth.reducer,
    companyReducer: company.reducer,
    collaboratorReducer: collaborator.reducer,
    instructorReducer: instructor.reducer,
    customerReducer: customer.reducer,
};

export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('routerReducer');

export const getAuthState = createFeatureSelector<auth.State>('authReducer');
export const selectAuthTokenState = createSelector(
    getAuthState,
    auth.selectAuthToken
);

export const getCompanyState = createFeatureSelector<company.State>('companyReducer');
export const selectCompanyState = createSelector(
    getCompanyState,
    company.selectCompany
);

export const getCollaboratorState = createFeatureSelector<collaborator.State>('collaboratorReducer');
export const selectCollaboratorState = createSelector(
    getCollaboratorState,
    collaborator.selectCollaborator
);

export const getInstructorState = createFeatureSelector<instructor.State>('instructorReducer');
export const selectInstructorState = createSelector(
    getInstructorState,
    instructor.selectInstructor
);

export const getCustomerState = createFeatureSelector<customer.State>('customerReducer');
export const selectCustomerState = createSelector(
    getCustomerState,
    customer.selectCustomer
);

@Injectable()
export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterStateUrl>
{
    serialize(routerState: RouterStateSnapshot): RouterStateUrl
    {
        const {url} = routerState;
        const {queryParams} = routerState.root;

        let state: ActivatedRouteSnapshot = routerState.root;
        while ( state.firstChild )
        {
            state = state.firstChild;
        }
        const {params} = state;

        return {
            url,
            queryParams,
            params
        };
    }
}
