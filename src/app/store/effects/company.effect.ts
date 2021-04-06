import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { CompanyActionTypes, RegisterCompany, RegisterCompanyComplete, RegisterCompanyError,
         UpdateCompany, UpdateCompanyComplete, UpdateCompanyError, 
         GetCompanyList, GetCompanyListComplete, GetCurrentCompany, GetCurrentCompanyComplete, 
         GetCollaboratorListForMe, GetCollaboratorListForMeComplete,
         GetInstructorListForMe, GetInstructorListForMeComplete,
         GetFacilityListForMe, GetFacilityListForMeComplete,
         GetSpaceListForFacility, GetSpaceListForFacilityComplete,
         GetSpaceListForSpace, GetSpaceListForSpaceComplete,
         GetPermissionList, GetPermissionListComplete, 
         SetMembership, SetMembershipComplete, SetMembershipError,
         RegisterFacility, RegisterFacilityComplete, RegisterFacilityError, 
         UpdateFacility, UpdateFacilityComplete, UpdateFacilityError,
         DeleteFacility, DeleteFacilityComplete, DeleteFacilityError,
         UpdateSpace, UpdateSpaceError, UpdateSpaceComplete,
         SaveFigure, SaveFigureComplete, SaveFigureError, 
         DeleteFigure, DeleteFigureComplete, DeleteFigureError,
         DeleteSpace, DeleteSpaceComplete, DeleteSpaceError, 
         GetSeasonListForCompany, GetSeasonListForCompanyComplete,
         RegisterSeasonError, RegisterSeasonComplete, RegisterSeason,
         UpdateSeason, UpdateSeasonComplete, UpdateSeasonError,
         DeleteSeason, DeleteSeasonComplete, DeleteSeasonError,
         RegisterCourse, RegisterCourseComplete, RegisterCourseError,
         UpdateCourse, UpdateCourseComplete, UpdateCourseError,
         DeleteCourse, DeleteCourseComplete, DeleteCourseError,
         GetCourseListForCompany, GetCourseListForCompanyComplete ,
         RegisterWeekday, RegisterWeekdayComplete, RegisterWeekdayError,
         UpdateWeekday, UpdateWeekdayComplete,UpdateWeekdayError,
         DeleteWeekday, DeleteWeekdayComplete, DeleteWeekdayError,
         GetWeekdayListForCompany, GetWeekdayListForCompanyComplete,
         RegisterTimeschedule, RegisterTimescheduleComplete, RegisterTimescheduleError,
         UpdateTimeschedule, UpdateTimescheduleComplete, UpdateTimescheduleError,
         DeleteTimeschedule, DeleteTimescheduleComplete, DeleteTimescheduleError,
         GetTimescheduleListForCompany, GetTimescheduleListForCompanyComplete, 
         RegisterBasecourse, RegisterBasecourseError, RegisterBasecourseComplete,
         UpdateBasecourse, UpdateBasecourseComplete, UpdateBasecourseError,
         DeleteBasecourse, DeleteBasecourseComplete, DeleteBasecourseError,
         GetBasecourseListForCompany, GetBasecourseListForCompanyComplete, GetLastLevelSpaceListForMe, GetLastLevelSpaceListForMeComplete} from '../actions/company.action';

import { SetActive } from '../actions/auth.action';
import { CompanyService } from '../../core/services/company.service';
import { PermissionService } from '../../core/services/permission.service';

import { Permission } from '../../models/companymanagement/permission'; 
import { Company } from '../../models/companymanagement/company';
import { Collaborator } from '../../models/collaboratormanagement/collaborator';
import { Instructor } from '../../models/instructormanagement/instructor';
import { Facility } from '../../models/companymanagement/facility';
import { Season } from '../../models/companymanagement/season';
import { Timeschedule } from '../../models/companymanagement/timeschedule';
import { Weekday } from '../../models/companymanagement/weekday';
import { Course } from '../../models/companymanagement/course';
import { Space } from '../../models/companymanagement/space';
import { Basecourse } from '../../models/companymanagement/basecourse';

import { Store } from '@ngrx/store';
import { State as AppState } from 'app/store/reducers';
import Swal from 'sweetalert2/dist/sweetalert2.js';  
import { Go } from '../actions';



@Injectable()
export class CompanyEffects
{
    /**
     * Constructor
     *
     * @param {Actions} actions$
     */
    constructor(
        private actions$: Actions,
        private companyService: CompanyService,
        private permissionService: PermissionService,
        private store: Store<AppState>,
        private router: Router
    )
    {
    }

    //--------------------------------company -------------------------------

    @Effect()
    register$ = this.actions$.pipe(
        ofType(CompanyActionTypes.REGISTER),
        map((action: RegisterCompany) => action.payload),
        switchMap(payload => {
            return this.companyService.registerCompany( payload.company )
                .pipe(
                map((companyData) => {
                    localStorage.setItem('company', JSON.stringify(new Company(companyData)));
                    Swal.fire('Yes!', 'Registeration was succeded!', 'success');
                    this.store.dispatch(new SetActive({role_relation_id: companyData.id}));
                    return new RegisterCompanyComplete({ company : new Company(companyData) });
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, reegisteration was failed!', 'error');
                    return of(new RegisterCompanyError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    @Effect()
    update$ = this.actions$.pipe(
        ofType(CompanyActionTypes.UPDATE),
        map((action: UpdateCompany) => action.payload),
        switchMap(payload => {
            return this.companyService.updateCompany( payload.company )
                .pipe(
                map((companyData) => {
                    localStorage.setItem('company', JSON.stringify(new Company(companyData)));
                    Swal.fire('Yes!', 'The company information was successfully updated!', 'success');
                    return new UpdateCompanyComplete({ company : new Company(companyData) });
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new UpdateCompanyError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    getCompanyList$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_COMPANY_LIST),
        switchMap(() => {
            return this.companyService.getCompanyList()
                .pipe(
                map((companyList) => {
                    let companyArray : Array<Company> = [];
                    companyList.forEach(element => {
                    companyArray.push(element);
                    });
                    return new GetCompanyListComplete({ companyList : companyArray });
                }),
            );
        })
    );

    
    @Effect()
    getCurrentCompany$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_CURRENT_COMPANY),
        map((action: GetCurrentCompany) => action.payload),
        switchMap((payload) => {
            return this.companyService.getCurrentCompany(payload.userId)
                .pipe(
                map((companyData) => {
                    localStorage.setItem('company', JSON.stringify(new Company(companyData)));
                    return new GetCurrentCompanyComplete({ company : companyData });
                }),
            );
        })
    );

    
    //-----------------------------membership--------------------------

    @Effect()
    membership$ = this.actions$.pipe(
        ofType(CompanyActionTypes.SET_MEMBERSHIP),
        map((action: SetMembership) => action.payload),
        switchMap(payload => {
            return this.companyService.sendCreditCardInfo( payload.card )
                .pipe(
                map((msg) => {
                    Swal.fire('Yes!', 'The membership was succeded', 'success');
                    return new SetMembershipComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, membsership was failed!', 'error');
                    return of(new SetMembershipError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    
    //------------------------------permission-------------------------

    @Effect()
    getPermissionList$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_PERMISSION_LIST),
        switchMap(() => {
            return this.permissionService.getPermissionList()
                .pipe(
                map((permissionList) => {
                    let permissionArray : Array<Permission> = [];
                    permissionList.permissions.forEach(element => {
                        permissionArray.push(element);
                    });
                    localStorage.setItem('permissionList', JSON.stringify(permissionArray));
                    return new GetPermissionListComplete({ permissionList : permissionArray });
                }),
            );
        })
    );

    
    //------------------------------collaborator-------------------------

    @Effect()
    getCollaboratorListForMe$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_COLLABORATOR_LIST_FOR_ME),
        map((action: GetCollaboratorListForMe) => action.payload),
        switchMap((payload) => {
            return this.companyService.getCollaboratorListForMe(payload.companyId)
                .pipe(
                map((collaboratorList) => {
                    let collaboratorArray : Array<Collaborator> = [];
                    collaboratorList.forEach(element => {
                    collaboratorArray.push(element);
                    });
                    //localStorage.setItem('collaboratorListForMe', JSON.stringify(collaboratorArray));
                    return new GetCollaboratorListForMeComplete({ collaboratorList : collaboratorArray });
                }),
            );
        })
    );

    
    //----------------------------instructor ---------------------------

    @Effect()
    getInstructorListForMe$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_INSTRUCTOR_LIST_FOR_ME),
        map((action: GetInstructorListForMe) => action.payload),
        switchMap((payload) => {
            return this.companyService.getInstructorListForMe(payload.companyId)
                .pipe(
                map((InstructorList) => {
                    let instructorArray : Array<Instructor> = [];
                    InstructorList.forEach(element => {
                    instructorArray.push(element);
                    });                
                    return new GetInstructorListForMeComplete({ instructorList : instructorArray });
                }),
                );
        })
    );
    

    //------------------------------facility -----------------------------
    @Effect()
    registerFacility$ = this.actions$.pipe(
        ofType(CompanyActionTypes.REGISTER_FACILTIY),
        map((action: RegisterFacility) => action.payload),
        switchMap(payload => {
            return this.companyService.registerFacility( payload.facility )
                .pipe(
                map((facilityData) => {
                    Swal.fire('Yes!', 'The facility information was successfully registered!', 'success');
                    this.router.navigate(['/ui/company/facility-list/']);
                    return new RegisterFacilityComplete({ facility : new Facility(facilityData) });
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new RegisterFacilityError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    updateFacility$ = this.actions$.pipe(
        ofType(CompanyActionTypes.UPDATE_FACILTIY),
        map((action: UpdateFacility) => action.payload),
        switchMap(payload => {
            return this.companyService.updateFacility( payload.facility )
                .pipe(
                map((facilityData) => {
                    Swal.fire('Yes!', 'The facility information was successfully updated!', 'success');
                    localStorage.setItem('facility_or_space', JSON.stringify(facilityData));
                    return new UpdateFacilityComplete({ facility : new Facility(facilityData) });
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new UpdateFacilityError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    @Effect()
    deleteFacility$ = this.actions$.pipe(
        ofType(CompanyActionTypes.DELETE_FACILTIY),
        map((action: DeleteFacility) => action.payload),
        switchMap(payload => {
            return this.companyService.deleteFacility( payload.facilityId )
                .pipe(
                map((msg) => {
                    Swal.fire('Yes!', 'The facility was successfully deleted!', 'success');
                    return new DeleteFacilityComplete({ message: msg });
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, deleting was failed!', 'error');
                    return of(new DeleteFacilityError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    getFacilityListForMe$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_FACILITY_LIST_FOR_ME),
        map((action: GetFacilityListForMe) => action.payload),
        switchMap((payload) => {
            return this.companyService.getFacilityListForCompany(payload.companyId)
                .pipe(
                map((facilityList) => {
                    let facilityArray : Array<Facility> = [];
                    facilityList.forEach(element => {
                        facilityArray.push(element);
                    });
                    return new GetFacilityListForMeComplete({ facilityList : facilityArray });
                }),
            );
        })
    );
    
    
    //-------------------------------space ------------------------------

    @Effect()
    deleteSpace$ = this.actions$.pipe(
        ofType(CompanyActionTypes.DELETE_SPACE),
        map((action: DeleteSpace) => action.payload),
        switchMap(payload => {
            return this.companyService.deleteSpace( payload.spaceId )
                .pipe(
                map((msg) => {
                    Swal.fire('Yes!', 'The facility was successfully deleted!', 'success');
                    return new DeleteSpaceComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, deleting was failed!', 'error');
                    return of(new DeleteSpaceError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    @Effect()
    updateSpace$ = this.actions$.pipe(
        ofType(CompanyActionTypes.UPDATE_SPACE),
        map((action: UpdateSpace) => action.payload),
        switchMap(payload => {
            return this.companyService.updateSpace( payload.space )
                .pipe(
                map((spaceData) => {
                    Swal.fire('Yes!', 'The space information was successfully updated!', 'success');
                    localStorage.setItem('facility_or_space', JSON.stringify(spaceData));
                    return new UpdateSpaceComplete({ space : new Space(spaceData) });
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new UpdateSpaceError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    getSpaceListForFacility$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_SPACE_LIST_FOR_FACILITY),
        map((action: GetSpaceListForFacility) => action.payload),
        switchMap((payload) => {
            return this.companyService.getSpaceListForFacility(payload.facilityId)
                .pipe(
                map((spaceList) => {
                    console.log("eeee");
                    let spaceArray : Array<Space> = [];
                    spaceList.forEach(element => {
                        spaceArray.push(element);
                    });
                    return new GetSpaceListForFacilityComplete({ spaceList : spaceArray });
                }),
            );
        })
    );
    
    @Effect()
    getSpaceListForSpace$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_SPACE_LIST_FOR_SPACE),
        map((action: GetSpaceListForSpace) => action.payload),
        switchMap((payload) => {
            return this.companyService.getSpaceListForSpace(payload.spaceId)
                .pipe(
                map((spaceList) => {
                    let spaceArray : Array<Space> = [];
                    spaceList.forEach(element => {
                        spaceArray.push(element);
                    });

                    return new GetSpaceListForSpaceComplete({ spaceList : spaceArray });
                }),
            );
        })
    );
    
    @Effect()
    getLastLevelSpaceListForMe$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_LAST_LEVEL_SPACE_LIST_FOR_ME),
        map((action: GetLastLevelSpaceListForMe) => action.payload),
        switchMap((payload) => {
            return this.companyService.getLastLevelSpaceListForMe(payload.companyId)
                .pipe(
                map((spaceList) => {
                    let spaceArray : Array<Space> = [];
                    spaceList.forEach(element => {
                        spaceArray.push(element);
                    });
                    return new GetLastLevelSpaceListForMeComplete({ spaceList : spaceArray });
                }),
            );
        })
    );

    //-----------------------------figure---------------------------------
    
    @Effect()
    saveFigure$ = this.actions$.pipe(
        ofType(CompanyActionTypes.SAVE_FIGURE),
        map((action: SaveFigure) => action.payload),
        switchMap(payload => {
            return this.companyService.saveFigure( payload.figure )
                .pipe(
                map((parentInfo) => {
                    Swal.fire('Yes!', 'The Space information was successfully updated!', 'success');
                    return new SaveFigureComplete({ parentId: parentInfo.parentId, parentType: parentInfo.parentType });
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new SaveFigureError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    deleteFigure$ = this.actions$.pipe(
        ofType(CompanyActionTypes.DELETE_FIGURE),
        map((action: DeleteFigure) => action.payload),
        switchMap(payload => {
            return this.companyService.deleteFigure(payload.name)
                .pipe(
                map((msg) => {
                    if(msg.message != "No") 
                        Swal.fire('Yes!', 'The Space information was successfully deleted!', 'success');
                    return new DeleteFigureComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, Destory was failed!', 'error');
                    return of(new DeleteFigureError({ errorMessage: error.message }));
                })
            );
        })
    );

    //------------------------------season------------------------------------------

    @Effect()
    registerSeason$ = this.actions$.pipe(
        ofType(CompanyActionTypes.REGISTER_SEASON),
        map((action: RegisterSeason) => action.payload),
        switchMap(payload => {
            return this.companyService.registerSeason( payload.season )
                .pipe(
                map((season) => {
                    Swal.fire('Yes!', 'The Season information was successfully registered!', 'success');
                    this.store.dispatch(new Go({path: ['/ui/company/season-list'], query: null, extras: null}));

                    return new RegisterSeasonComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, registeration was failed!', 'error');
                    return of(new RegisterSeasonError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    updateSeason$ = this.actions$.pipe(
        ofType(CompanyActionTypes.UPDATE_SEASON),
        map((action: UpdateSeason) => action.payload),
        switchMap(payload => {
            return this.companyService.updateSeason( payload.season )
                .pipe(
                map((season) => {
                    Swal.fire('Yes!', 'The Season information was successfully updated!', 'success');
                    this.store.dispatch(new Go({path: ['/ui/company/season-list'], query: null, extras: null}));
                    return new UpdateSeasonComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new UpdateSeasonError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    @Effect()
    deleteSeason$ = this.actions$.pipe(
        ofType(CompanyActionTypes.DELETE_SEASON),
        map((action: DeleteSeason) => action.payload),
        switchMap(payload => {
            return this.companyService.deleteSeason( payload.seasonId )
                .pipe(
                map((msg) => {
                    Swal.fire('Yes!', 'The Season information was successfully deleted!', 'success');
                    return new DeleteSeasonComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, delete was failed!', 'error');
                    return of(new DeleteSeasonError({ errorMessage: error.message }));
                })
            );
        })
    );


    @Effect()
    getSeasonListForCompany$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_SEASON_LIST_FOR_COMPANY),
        map((action: GetSeasonListForCompany) => action.payload),
        switchMap((payload) => {
            return this.companyService.getSeasonListForCompany(payload.companyId)
                .pipe(
                map((seasonList) => {
                    let seasonArray : Array<Season> = [];
                    seasonList.forEach(element => {
                        seasonArray.push(element);
                    });
                    return new GetSeasonListForCompanyComplete({ seasonList : seasonArray });
                }),
            );
        })
    );

    //----------------------------course ------------------------------

    @Effect()
    registerCourse$ = this.actions$.pipe(
        ofType(CompanyActionTypes.REGISTER_COURSE),
        map((action: RegisterCourse) => action.payload),
        switchMap(payload => {
            return this.companyService.registerCourse( payload.course )
                .pipe(
                map((course) => {
                    Swal.fire('Yes!', 'The Coures information was successfully registered!', 'success');
                    this.store.dispatch(new Go({path: ['/ui/company/course-list'], query: null, extras: null}));
                    return new RegisterCourseComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, registeration was failed!', 'error');
                    return of(new RegisterCourseError({ errorMessage: error.message }));
                })
            );
        })
    );
    @Effect()
    getCourseListForCompany$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_COURSE_LIST_FOR_COMPANY),
        map((action: GetCourseListForCompany) => action.payload),
        switchMap((payload) => {
            return this.companyService.getCourseListForCompany(payload.companyId)
                .pipe(
                map((courseList) => {
                    let courseArray : Array<Course> = [];
                    courseList.forEach(element => {
                        courseArray.push(element);
                    });
                    return new GetCourseListForCompanyComplete({ courseList : courseArray });
                }),
            );
        })
    );

    @Effect()
    updateCourse$ = this.actions$.pipe(
        ofType(CompanyActionTypes.UPDATE_COURSE),
        map((action: UpdateCourse) => action.payload),
        switchMap(payload => {
            return this.companyService.updateCourse( payload.course )
                .pipe(
                map((course) => {
                    Swal.fire('Yes!', 'The Course information was successfully updated!', 'success');
                    return new UpdateCourseComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new UpdateCourseError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    @Effect()
    deleteCourse$ = this.actions$.pipe(
        ofType(CompanyActionTypes.DELETE_COURSE),
        map((action: DeleteCourse) => action.payload),
        switchMap(payload => {
            return this.companyService.deleteCourse( payload.courseId )
                .pipe(
                map((msg) => {
                    Swal.fire('Yes!', 'The Course information was successfully deleted!', 'success');
                    return new DeleteCourseComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, delete was failed!', 'error');
                    return of(new DeleteCourseError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    //------------------------------basecourse -----------------------------------
    
    @Effect()
    registerBasecourse$ = this.actions$.pipe(
        ofType(CompanyActionTypes.REGISTER_BASECOURSE),
        map((action: RegisterBasecourse) => action.payload),
        switchMap(payload => {
            return this.companyService.registerBasecourse( payload.basecourse )
                .pipe(
                map((basecourse) => {
                    Swal.fire('Yes!', 'The Coures information was successfully registered!', 'success');
                    return new RegisterBasecourseComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, registeration was failed!', 'error');
                    return of(new RegisterBasecourseError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    updateBasecourse$ = this.actions$.pipe(
        ofType(CompanyActionTypes.UPDATE_BASECOURSE),
        map((action: UpdateBasecourse) => action.payload),
        switchMap(payload => {
            return this.companyService.updateBasecourse( payload.basecourse )
                .pipe(
                map((basecourse) => {
                    Swal.fire('Yes!', 'The Course information was successfully updated!', 'success');
                    return new UpdateBasecourseComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new UpdateBasecourseError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    deleteBasecourse$ = this.actions$.pipe(
        ofType(CompanyActionTypes.DELETE_BASECOURSE),
        map((action: DeleteBasecourse) => action.payload),
        switchMap(payload => {
            return this.companyService.deleteBasecourse( payload.basecourseId )
                .pipe(
                map((msg) => {
                    Swal.fire('Yes!', 'The Course information was successfully deleted!', 'success');
                    return new DeleteBasecourseComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, delete was failed!', 'error');
                    return of(new DeleteBasecourseError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    @Effect()
    getBasecourseListForCompany$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_BASECOURSE_LIST_FOR_COMPANY),
        map((action: GetBasecourseListForCompany) => action.payload),
        switchMap((payload) => {
            return this.companyService.getBasecourseListForCompany(payload.companyId)
                .pipe(
                map((basecourseList) => {
                    let basecourseArray : Array<Basecourse> = [];
                    basecourseList.forEach(element => {
                        basecourseArray.push(element);
                    });
                    return new GetBasecourseListForCompanyComplete({ basecourseList : basecourseArray });
                }),
            );
        })
    );

    //-------------------------------weekday --------------------------------------
    
    @Effect()
    registerWeekday$ = this.actions$.pipe(
        ofType(CompanyActionTypes.REGISTER_WEEKDAY),
        map((action: RegisterWeekday) => action.payload),
        switchMap(payload => {
            return this.companyService.registerWeekday( payload.weekday )
                .pipe(
                map((weekday) => {
                    Swal.fire('Yes!', 'The Weekday schedule information was successfully registered!', 'success');
                    //this.weekdayService.updateWeekday(weekday);
                    return new RegisterWeekdayComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, registeration was failed!', 'error');
                    return of(new RegisterWeekdayError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    updateWeekday$ = this.actions$.pipe(
        ofType(CompanyActionTypes.UPDATE_WEEKDAY),
        map((action: UpdateWeekday) => action.payload),
        switchMap(payload => {
            return this.companyService.updateWeekday( payload.weekday )
                .pipe(
                map((weekday) => {
                    Swal.fire('Yes!', 'The Weekday Shcedule information was successfully updated!', 'success');
                    return new UpdateWeekdayComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new UpdateWeekdayError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    @Effect()
    deleteWeekday$ = this.actions$.pipe(
        ofType(CompanyActionTypes.DELETE_WEEKDAY),
        map((action: DeleteWeekday) => action.payload),
        switchMap(payload => {
            return this.companyService.deleteWeekday( payload.weekdayId )
                .pipe(
                map((msg) => {
                    Swal.fire('Yes!', 'The Weekday Schedule information was successfully deleted!', 'success');
                    return new DeleteWeekdayComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, delete was failed!', 'error');
                    return of(new DeleteWeekdayError({ errorMessage: error.message }));
                })
            );
        })
    );


    @Effect()
    getWeekdayListForCompany$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_WEEKDAY_LIST_FOR_COMPANY),
        map((action: GetWeekdayListForCompany) => action.payload),
        switchMap((payload) => {
            return this.companyService.getWeekdayListForCompany(payload.companyId)
                .pipe(
                map((weekdayList) => {
                    let weekdayArray : Array<Weekday> = [];
                    weekdayList.forEach(element => {
                        weekdayArray.push(element);
                    });
                    return new GetWeekdayListForCompanyComplete({ weekdayList : weekdayArray });
                }),
            );
        })
    );

    //-----------------------------timeschedule ----------------------------------

    @Effect()
    registerTimeschedule$ = this.actions$.pipe(
        ofType(CompanyActionTypes.REGISTER_TIMESCHEDULE),
        map((action: RegisterTimeschedule) => action.payload),
        switchMap(payload => {
            return this.companyService.registerTimeschedule( payload.timeschedule )
                .pipe(
                map((timeschedule) => {
                    Swal.fire('Yes!', 'The time schedule information was successfully updated!', 'success');
                    return new RegisterTimescheduleComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new RegisterTimescheduleError({ errorMessage: error.message }));
                })
            );
        })
    );

    @Effect()
    updateTimeschedule$ = this.actions$.pipe(
        ofType(CompanyActionTypes.UPDATE_TIMESCHEDULE),
        map((action: UpdateTimeschedule) => action.payload),
        switchMap(payload => {
            return this.companyService.updateTimeschedule( payload.timeschedule )
                .pipe(
                map((timeschedule) => {
                    Swal.fire('Yes!', 'The time schedule information was successfully updated!', 'success');
                    return new UpdateTimescheduleComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, update was failed!', 'error');
                    return of(new UpdateTimescheduleError({ errorMessage: error.message }));
                })
            );
        })
    );
    
    @Effect()
    deleteTimeschedule$ = this.actions$.pipe(
        ofType(CompanyActionTypes.DELETE_TIMESCHEDULE),
        map((action: DeleteTimeschedule) => action.payload),
        switchMap(payload => {
            return this.companyService.deleteTimeschedule( payload.timescheduleId )
                .pipe(
                map((msg) => {
                    Swal.fire('Yes!', 'The times chedule information was successfully deleted!', 'success');
                    return new DeleteTimescheduleComplete();
                }),
                catchError((error: Error) => {
                    Swal.fire('Ooops!', 'Sorry, delete was failed!', 'error');
                    return of(new DeleteTimescheduleError({ errorMessage: error.message }));
                })
            );
        })
    );


    @Effect()
    getTimescheduleListForCompany$ = this.actions$.pipe(
        ofType(CompanyActionTypes.GET_TIMESCHEDULE_LIST_FOR_COMPANY),
        map((action: GetTimescheduleListForCompany) => action.payload),
        switchMap((payload) => {
            return this.companyService.getTimescheduleListForCompany(payload.companyId)
                .pipe(
                map((timescheduleList) => {
                    let timescheduleArray : Array<Timeschedule> = [];
                    timescheduleList.forEach(element => {
                        timescheduleArray.push(element);
                    });
                    return new GetTimescheduleListForCompanyComplete({ timescheduleList : timescheduleArray });
                }),
            );
        })
    );
}


