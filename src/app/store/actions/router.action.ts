import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const GO = '[Router] Go';
export const RELOAD = '[Route]  RELOAD';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';

export class Go implements Action
{
    readonly type = GO;

    /**
     * Constructor
     *
     * @param {{path: any[]; query?: object; extras?: NavigationExtras}} payload
     */
    constructor(
        public payload: {
            path: any[];
            query?: object;
            extras?: NavigationExtras;
        }
    )
    {
    }
}

export class Reload implements Action
{
    readonly type = RELOAD;

    /**
     * Constructor
     *
     * @param {{path: any[]; query?: object; extras?: NavigationExtras}} payload
     */
    constructor(
        public payload: {
            path: any[];
            query?: object;
            extras?: NavigationExtras;
        }
    )
    {
    }
}

export class Back implements Action
{
    readonly type = BACK;
}

export class Forward implements Action
{
    readonly type = FORWARD;
}

export type Actions = Go | Reload | Back | Forward;
