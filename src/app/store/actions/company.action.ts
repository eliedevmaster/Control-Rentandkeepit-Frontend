import { Action } from '@ngrx/store';
import { Company} from '../../models/companymanagement/company';
import { Collaborator } from '../../models/collaboratormanagement/collaborator';
import { Instructor } from '../../models/instructormanagement/instructor';
import { Permission } from '../../models/companymanagement/permission';

export enum CompanyActionTypes {
  
    //---------------------------company----------------------------

    REGISTER = '[Company] REGISTER',
    REGISTER_COMPLETE = '[Company] REGISTER_COMPLETE',
    REGISTER_ERROR = '[Company] REGISTER_ERROR',
    
    UPDATE = '[Company] UPDATE',
    UPDATE_COMPLETE = '[Company] UPDATE_COMPLETE',
    UPDATE_ERROR = '[Company] UPDATE_ERROR',

    GET_CURRENT_COMPANY = '[Company] GET_CURRENT_COMPANY',
    GET_CURRENT_COMPANY_COMPLETE = '[Company] GET_CURRENT_COMPANY_COMPLETE',
    
    GET_COMPANY_LIST = '[Company] GET_COMPANY_LIST',
    GET_COMPANY_LIST_COMPLETE = '[Company] GET_COMPANY_LIST_COMPLETE',

    //---------------------collaaboators -----------------------------------

    GET_COLLABORATOR_LIST_FOR_ME = '[Cmpany] GET_COLLABORATOR_LIST_FOR_ME',
    GET_COLLABORATOR_LIST_FOR_ME_COMPLETE = '[Cmpany] GET_COLLABORATOR_LIST_FOR_ME_COMPLETE',

    
    //---------------------instructors -------------------------------------

    GET_INSTRUCTOR_LIST_FOR_ME = '[Company] GET_INSTRUCTOR_LIST_FOR_ME',
    GET_INSTRUCTOR_LIST_FOR_ME_COMPLETE = '[Company] GET_INSTRUCTOR_LIST_FOR_ME_COMPLETE',

    
    //-----------------permission ------------------------------

    GET_PERMISSION_LIST = '[Company] GET_PERMISSION_LIST',
    GET_PERMISSION_LIST_COMPLETE = '[Company] GET_PERMISSION_LIST_COMPLETE',

    
    //-----------------membership --------------------------------

    SET_MEMBERSHIP = '[company] SET_MEMBERSHIP',
    SET_MEMBERSHIP_COMPLETE = '[company] SET_MEMBERSHIP_COMPLETE',
    SET_MEMBERSHIP_ERROR = '[Company] SET_MEMBERSHIP_ERROR',


    
    //--------------facilty ---------------------------

    REGISTER_FACILTIY = '[Company] REGISTER_FACILTIY',
    REGISTER_FACILTIY_COMPLETE = '[Company] REGISTER_FACILTIY_COMPLETE',
    REGISTER_FACILTIY_ERROR = '[Company] REGISTER_FACILTIY_ERROR',

    UPDATE_FACILTIY = '[Company] UPDATE_FACILTIY',
    UPDATE_FACILTIY_COMPLETE = '[Company] UPDATE_FACILTIY_COMPLETE',
    UPDATE_FACILTIY_ERROR = '[Company] UPDATE_FACILTIY_ERROR',

    DELETE_FACILTIY = '[Company] DELETE_FACILTIY',
    DELETE_FACILTIY_COMPLETE = '[Company] DELETE_FACILTIY_COMPLETE',
    DELETE_FACILTIY_ERROR = '[Company] DELETE_FACILTIY_ERROR',

    GET_FACILITY_LIST_FOR_ME = '[Company] GET_FACILITY_LIST_FOR_ME',
    GET_FACILITY_LIST_FOR_ME_COMPLETE = '[Company] GET_FACILITY_LIST_FOR_ME_COMPLETE',
    

    //----------------space ----------------------------

    UPDATE_SPACE = '[Company] UPDATE_SPACE',
    UPDATE_SPACE_COMPLETE = '[Company] UPDATE_SPACE_COMPLETE',
    UPDATE_SPACE_ERROR = '[Company] UPDATE_SPACE_ERROR',

    DELETE_SPACE = '[Company] DELETE_SPACE',
    DELETE_SPACE_COMPLETE = '[Company] DELETE_SPACE_COMPLETE',
    DELETE_SPACE_ERROR = '[Company] DELETE_SPACE_ERROR',

    GET_SPACE_LIST_FOR_FACILITY = '[Company] GET_SPACE_LIST_FOR_FACILITY',
    GET_SPACE_LIST_FOR_FACILITY_COMPLETE = '[Company] GET_SPACE_LIST_FOR_FACILITY_COMPLETE',

    GET_SPACE_LIST_FOR_SPACE = '[Company] GET_SPACE_LIST_FOR_SPACE',
    GET_SPACE_LIST_FOR_SPACE_COMPLETE = '[Company] GET_SPACE_LIST_FOR_SPACE_COMPLETE',

    GET_LAST_LEVEL_SPACE_LIST_FOR_ME = '[Company] GET_LAST_LEVEL_SPACE_LIST_FOR_ME',
    GET_LAST_LEVEL_SPACE_LIST_FOR_ME_COMPLETE = '[Company] GET_LAST_LEVEL_SPACE_LIST_FOR_ME_COMPLETE',
    

    
    //----------------figure -----------------------------

    SAVE_FIGURE = '[Compnay] SAVE_FIGURE',
    SAVE_FIGURE_COMPLETE = '[Compnay] SAVE_FIGURE_COMPLETE',
    SAVE_FIGURE_ERROR = '[Company] SAVE_FIGURE_ERROR',

    DELETE_FIGURE = '[Compnay] DELETE_FIGURE',
    DELETE_FIGURE_COMPLETE = '[Compnay] DELETE_FIGURE_COMPLETE',
    DELETE_FIGURE_ERROR = '[Compnay] DELETE_FIGURE_ERROR',

    DELETE_ALL_FIGURES = '[Compnay] DELETE_ALL_FIGURES',
    DELETE_ALL_FIGURES_COMPLETE = '[Compnay] DELETE_ALL_FIGURES_COMPLETE',
    DELETE_ALL_FIGURES_ERROR = '[Compnay] DELETE_ALL_FIGURES_ERROR',

    //------------------season------------------------------

    REGISTER_SEASON = '[Company] REGISTER_SEASON',
    REGISTER_SEASON_COMPLETE = '[Company] REGISTER_SEASON_COMPLETE',
    REGISTER_SEASON_ERROR = '[Company] REGISTER_SEASON_ERROR',
    
    UPDATE_SEASON = '[Company] UPDATE_SEASON',
    UPDATE_SEASON_COMPLETE = '[Company] UPDATE_SEASON_COMPLETE',
    UPDATE_SEASON_ERROR = '[Company] UPDATE_SEASON_ERROR',

    DELETE_SEASON = '[Company] DELETE_SEASON',
    DELETE_SEASON_COMPLETE = '[Company] DELETE_SEASON_COMPLETE',
    DELETE_SEASON_ERROR = '[Company] DELETE_SEASON_ERROR',

    GET_SEASON_LIST_FOR_COMPANY = '[Company] GET_SEASON_LIST_FOR_COMPANY',
    GET_SEASON_LIST_FOR_COMPANY_COMPLETE = '[Company] GET_SEASON_LIST_FOR_COMPANY_COMPLETE',

    //-------------------------course--------------------------------

    REGISTER_COURSE = '[Company] REGISTER_COURSE',
    REGISTER_COURSE_COMPLETE = '[Company] REGISTER_COURSE_COMPLETE',
    REGISTER_COURSE_ERROR = '[Company] REGISTER_COURSE_ERROR',

    UPDATE_COURSE = '[Company] UPDATE_COURSE',
    UPDATE_COURSE_COMPLETE = '[Company] UPDATE_COURSE_COMPLETE',
    UPDATE_COURSE_ERROR = '[Company] UPDATE_COURSE_ERROR',

    DELETE_COURSE = '[Company] DELETE_COURSE',
    DELETE_COURSE_COMPLETE = '[Company] DELETE_COURSE_COMPLETE',
    DELETE_COURSE_ERROR = '[Company] DELETE_COURSE_ERROR',

    GET_COURSE_LIST_FOR_COMPANY = '[Company] GET_COURSE_LIST_FOR_COMPANY',
    GET_COURSE_LIST_FOR_COMPANY_COMPLETE = '[Company] GET_COURSE_LIST_FOR_COMPANY_COMPLETE',

    //--------------------------basecourse --------------------------------
    
    REGISTER_BASECOURSE = '[Company] REGISTER_BASECOURSE',
    REGISTER_BASECOURSE_COMPLETE = '[Company] REGISTER_BASECOURSE_COMPLETE',
    REGISTER_BASECOURSE_ERROR = '[Company] REGISTER_BASECOURSE_ERROR',

    UPDATE_BASECOURSE = '[Company] UPDATE_BASECOURSE',
    UPDATE_BASECOURSE_COMPLETE = '[Company] UPDATE_BASECOURSE_COMPLETE',
    UPDATE_BASECOURSE_ERROR = '[Company] UPDATE_BASECOURSE_ERROR',

    DELETE_BASECOURSE = '[Company] DELETE_BASECOURSE',
    DELETE_BASECOURSE_COMPLETE = '[Company] DELETE_BASECOURSE_COMPLETE',
    DELETE_BASECOURSE_ERROR = '[Company] DELETE_BASECOURSE_ERROR',

    GET_BASECOURSE_LIST_FOR_COMPANY = '[Company] GET_BASECOURSE_LIST_FOR_COMPANY',
    GET_BASECOURSE_LIST_FOR_COMPANY_COMPLETE = '[Company] GET_BASECOURSE_LIST_FOR_COMPANY_COMPLETE',


    //--------------------------weekday -----------------------------------

    REGISTER_WEEKDAY = '[Company] REGISTER_WEEKDAY',
    REGISTER_WEEKDAY_COMPLETE = '[Company] REGISTER_WEEKDAY_COMPLETE',
    REGISTER_WEEKDAY_ERROR = '[Company] REGISTER_WEEKDAY_ERROR',

    UPDATE_WEEKDAY = '[Company] UPDATE_WEEKDAY',
    UPDATE_WEEKDAY_COMPLETE = '[Company] UPDATE_WEEKDAY_COMPLETE',
    UPDATE_WEEKDAY_ERROR = '[Company] UPDATE_WEEKDAY_ERROR',

    DELETE_WEEKDAY = '[Company] DELETE_WEEKDAY',
    DELETE_WEEKDAY_COMPLETE = '[Company] DELETE_WEEKDAY_COMPLETE',
    DELETE_WEEKDAY_ERROR = '[Company] DELETE_WEEKDAY_ERROR',

    GET_WEEKDAY_LIST_FOR_COMPANY = '[Company] GET_WEEKDAY_LIST_FOR_COMPANY',
    GET_WEEKDAY_LIST_FOR_COMPANY_COMPLETE = '[Company] GET_WEEKDAY_LIST_FOR_COMPANY_COMPLETE',

    
    //-------------------------timeschedule ----------------------------------
    
    REGISTER_TIMESCHEDULE = '[Company] REGISTER_TIMESCHEDULE',
    REGISTER_TIMESCHEDULE_COMPLETE = '[Company] REGISTER_TIMESCHEDULE_COMPLETE',
    REGISTER_TIMESCHEDULE_ERROR = '[Company] REGISTER_TIMESCHEDULE_ERROR',

    UPDATE_TIMESCHEDULE = '[Company] UPDATE_TIMESCHEDULE',
    UPDATE_TIMESCHEDULE_COMPLETE = '[Company] UPDATE_TIMESCHEDULE_COMPLETE',
    UPDATE_TIMESCHEDULE_ERROR = '[Company] UPDATE_TIMESCHEDULE_ERROR',

    DELETE_TIMESCHEDULE = '[Company] DELETE_TIMESCHEDULE',
    DELETE_TIMESCHEDULE_COMPLETE = '[Company] DELETE_TIMESCHEDULE_COMPLETE',
    DELETE_TIMESCHEDULE_ERROR = '[Company] DELETE_TIMESCHEDULE_ERROR',

    GET_TIMESCHEDULE_LIST_FOR_COMPANY = '[Company] GET_TIMESCHEDULE_LIST_FOR_COMPANY',
    GET_TIMESCHEDULE_LIST_FOR_COMPANY_COMPLETE = '[Company] GET_TIMESCHEDULE_LIST_FOR_COMPANY_COMPLETE',
}

//------------------company--------------------

export class RegisterCompany implements Action {
    readonly type = CompanyActionTypes.REGISTER;  
    constructor(public payload: { company: Company }) {};
}
  
export class RegisterCompanyComplete implements Action {
    readonly type = CompanyActionTypes.REGISTER_COMPLETE;
    constructor(public payload: { company: Company }) {};
}
  
export class RegisterCompanyError implements Action {
    readonly type = CompanyActionTypes.REGISTER_ERROR;
    constructor(public payload: { errorMessage: string }) {};
}

export class UpdateCompany implements Action {
    readonly type = CompanyActionTypes.UPDATE;  
    constructor(public payload: { company: Company }) {};
}
  
export class UpdateCompanyComplete implements Action {
    readonly type = CompanyActionTypes.UPDATE_COMPLETE;
    constructor(public payload: { company: Company }) {};
}
  
export class UpdateCompanyError implements Action {
    readonly type = CompanyActionTypes.UPDATE_ERROR;
    constructor(public payload: { errorMessage: string }) {};
}

export class GetCurrentCompany implements Action {
    readonly type = CompanyActionTypes.GET_CURRENT_COMPANY;
    constructor(public payload: { userId: number }) {};
}

export class GetCurrentCompanyComplete implements Action {
    readonly type = CompanyActionTypes.GET_CURRENT_COMPANY_COMPLETE;
    constructor(public payload: { company: Company }) {};
}

export class GetCompanyList implements Action {
    readonly type = CompanyActionTypes.GET_COMPANY_LIST;
}

export class GetCompanyListComplete implements Action {
    readonly type = CompanyActionTypes.GET_COMPANY_LIST_COMPLETE;
    constructor(public payload: { companyList: Array<Company> }) {};
}


//-------------------------permission----------------------------------

export class GetPermissionList implements Action {
    readonly type = CompanyActionTypes.GET_PERMISSION_LIST;
}

export class GetPermissionListComplete implements Action {
    readonly type = CompanyActionTypes.GET_PERMISSION_LIST_COMPLETE;
    constructor(public payload: { permissionList: Array<Permission> }) {};
}


//----------------------collaborator----------------------------------

export class GetCollaboratorListForMe implements Action {
    readonly type = CompanyActionTypes.GET_COLLABORATOR_LIST_FOR_ME;
    constructor(public payload: { companyId: number }) {};
}

export class GetCollaboratorListForMeComplete implements Action {
    readonly type = CompanyActionTypes.GET_COLLABORATOR_LIST_FOR_ME_COMPLETE;
    constructor(public payload: { collaboratorList: Array<Collaborator> }) {};
}


//----------------------instructor ------------------------------------

export class GetInstructorListForMe implements Action {
    readonly type = CompanyActionTypes.GET_INSTRUCTOR_LIST_FOR_ME;
    constructor(public payload: { companyId: number }) {};
}

export class GetInstructorListForMeComplete implements Action {
    readonly type = CompanyActionTypes.GET_INSTRUCTOR_LIST_FOR_ME_COMPLETE;
    constructor(public payload: { instructorList: Array<Instructor> }) {};
}


//-----------------------Facility ---------------------------------------

export class RegisterFacility implements Action {
    readonly type = CompanyActionTypes.REGISTER_FACILTIY;
    constructor (public payload: {facility : any}) {}
}

export class RegisterFacilityComplete implements Action {
    readonly type = CompanyActionTypes.REGISTER_FACILTIY_COMPLETE;
    constructor (public payload: {facility: any}) {}
}

export class RegisterFacilityError implements Action {
    readonly type = CompanyActionTypes.REGISTER_FACILTIY_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export class UpdateFacility implements Action {
    readonly type = CompanyActionTypes.UPDATE_FACILTIY;
    constructor (public payload: {facility : any}) {}
}

export class UpdateFacilityComplete implements Action {
    readonly type = CompanyActionTypes.UPDATE_FACILTIY_COMPLETE;
    constructor (public payload: {facility: any}) {}
}

export class UpdateFacilityError implements Action {
    readonly type = CompanyActionTypes.UPDATE_FACILTIY_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export class DeleteFacility implements Action {
    readonly type = CompanyActionTypes.DELETE_FACILTIY;
    constructor (public payload: {facilityId : number}) {}
}

export class DeleteFacilityComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_FACILTIY_COMPLETE;
    constructor (public payload: {message : string}) {}
}

export class DeleteFacilityError implements Action {
    readonly type = CompanyActionTypes.DELETE_FACILTIY_ERROR;
    constructor (public payload: {errorMessage : string}) {}
}

export class GetFacilityListForMe implements Action {
    readonly type = CompanyActionTypes.GET_FACILITY_LIST_FOR_ME;
    constructor(public payload: { companyId: number }) {};
}

export class GetFacilityListForMeComplete implements Action {
    readonly type = CompanyActionTypes.GET_FACILITY_LIST_FOR_ME_COMPLETE;
    constructor(public payload: { facilityList: any }) {};
}

//------------------------space ---------------------------------------

export class DeleteSpace implements Action {
    readonly type = CompanyActionTypes.DELETE_SPACE;
    constructor (public payload: {spaceId : number}) {}
}

export class DeleteSpaceComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_SPACE_COMPLETE;
}

export class DeleteSpaceError implements Action {
    readonly type = CompanyActionTypes.DELETE_SPACE;
    constructor (public payload: {errorMessage : string}) {}
}

export class UpdateSpace implements Action {
    readonly type = CompanyActionTypes.UPDATE_SPACE;
    constructor (public payload: {space : any}) {}
}

export class UpdateSpaceComplete implements Action {
    readonly type = CompanyActionTypes.UPDATE_SPACE_COMPLETE;
    constructor (public payload: {space: any}) {}
}

export class UpdateSpaceError implements Action {
    readonly type = CompanyActionTypes.UPDATE_SPACE_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export class GetSpaceListForFacility implements Action {
    readonly type = CompanyActionTypes.GET_SPACE_LIST_FOR_FACILITY;
    constructor(public payload: { facilityId: number }) {};
}

export class GetSpaceListForFacilityComplete implements Action {
    readonly type = CompanyActionTypes.GET_SPACE_LIST_FOR_FACILITY_COMPLETE;
    constructor(public payload: { spaceList: any }) {};
}

export class GetSpaceListForSpace implements Action {
    readonly type = CompanyActionTypes.GET_SPACE_LIST_FOR_SPACE;
    constructor(public payload: { spaceId: number }) {};
}

export class GetSpaceListForSpaceComplete implements Action {
    readonly type = CompanyActionTypes.GET_SPACE_LIST_FOR_SPACE_COMPLETE;
    constructor(public payload: { spaceList: any }) {};
}

export class GetLastLevelSpaceListForMe implements Action {
    readonly type = CompanyActionTypes.GET_LAST_LEVEL_SPACE_LIST_FOR_ME;
    constructor(public payload: { companyId: number}) {};
}

export class GetLastLevelSpaceListForMeComplete implements Action {
    readonly type = CompanyActionTypes.GET_LAST_LEVEL_SPACE_LIST_FOR_ME_COMPLETE;
    constructor(public payload: { spaceList: any }) {};
}


//-----------------------figure---------------------------------------

export class SaveFigure implements Action {
    readonly type = CompanyActionTypes.SAVE_FIGURE;
    constructor(public payload: { figure: any }) {}
}

export class SaveFigureComplete implements Action {
    readonly type = CompanyActionTypes.SAVE_FIGURE_COMPLETE;
    constructor(public payload: { parentType: number, parentId: number,}) {}
}

export class SaveFigureError implements Action {
    readonly type = CompanyActionTypes.SAVE_FIGURE_ERROR;
    constructor(public payload: { errorMessage : string }) {}
}

export class DeleteFigure implements Action {
    readonly type = CompanyActionTypes.DELETE_FIGURE;
    constructor (public payload: {name: string}) {}
}

export class DeleteFigureComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_FIGURE_COMPLETE;
}

export class DeleteFigureError implements Action {
    readonly type = CompanyActionTypes.DELETE_FIGURE_ERROR;
    constructor (public payload: {errorMessage: string}) {}
}

export class DeleteAllFigures implements Action {
    readonly type = CompanyActionTypes.DELETE_ALL_FIGURES;
    constructor (public payload: {name: string}) {}
}

export class DeleteAllFiguresComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_ALL_FIGURES_COMPLETE;
}

export class DeleteAllFiguresError implements Action {
    readonly type = CompanyActionTypes.DELETE_ALL_FIGURES_ERROR;
    constructor (public payload: {errorMessgae: string}) {}
}


//-----------------------season--------------------------------------

export class RegisterSeason implements Action {
    readonly type = CompanyActionTypes.REGISTER_SEASON
    constructor (public payload: {season: any}) {}
}

export class RegisterSeasonComplete implements Action {
    readonly type = CompanyActionTypes.REGISTER_SEASON_COMPLETE
}

export class RegisterSeasonError implements Action {
    readonly type = CompanyActionTypes.REGISTER_SEASON_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class UpdateSeason implements Action {
    readonly type = CompanyActionTypes.UPDATE_SEASON
    constructor (public payload: {season: any}) {}
}

export class UpdateSeasonComplete implements Action {
    readonly type = CompanyActionTypes.UPDATE_SEASON_COMPLETE
}

export class UpdateSeasonError implements Action {
    readonly type = CompanyActionTypes.UPDATE_SEASON_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class DeleteSeason implements Action {
    readonly type = CompanyActionTypes.DELETE_SEASON
    constructor (public payload: {seasonId: number}) {}
}

export class DeleteSeasonComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_SEASON_COMPLETE
}

export class DeleteSeasonError implements Action {
    readonly type = CompanyActionTypes.DELETE_SEASON_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class GetSeasonListForCompany implements Action {
    readonly type = CompanyActionTypes.GET_SEASON_LIST_FOR_COMPANY;
    constructor (public payload: {companyId: number}) {}
}
export class GetSeasonListForCompanyComplete implements Action {
    readonly type = CompanyActionTypes.GET_SEASON_LIST_FOR_COMPANY_COMPLETE;
    constructor (public payload: {seasonList: any}) {}
}


//----------------------course -------------------------------------

export class RegisterCourse implements Action {
    readonly type = CompanyActionTypes.REGISTER_COURSE
    constructor (public payload: {course: any}) {}
}

export class RegisterCourseComplete implements Action {
    readonly type = CompanyActionTypes.REGISTER_COURSE_COMPLETE
}

export class RegisterCourseError implements Action {
    readonly type = CompanyActionTypes.REGISTER_COURSE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class UpdateCourse implements Action {
    readonly type = CompanyActionTypes.UPDATE_COURSE
    constructor (public payload: {course: any}) {}
}

export class UpdateCourseComplete implements Action {
    readonly type = CompanyActionTypes.UPDATE_COURSE_COMPLETE
}

export class UpdateCourseError implements Action {
    readonly type = CompanyActionTypes.UPDATE_COURSE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class DeleteCourse implements Action {
    readonly type = CompanyActionTypes.DELETE_COURSE
    constructor (public payload: {courseId: number}) {}
}

export class DeleteCourseComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_COURSE_COMPLETE
}

export class DeleteCourseError implements Action {
    readonly type = CompanyActionTypes.DELETE_COURSE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class GetCourseListForCompany implements Action {
    readonly type = CompanyActionTypes.GET_COURSE_LIST_FOR_COMPANY;
    constructor (public payload: {companyId: number}) {}
}
export class GetCourseListForCompanyComplete implements Action {
    readonly type = CompanyActionTypes.GET_COURSE_LIST_FOR_COMPANY_COMPLETE;
    constructor (public payload: {courseList: any}) {}
}


//-----------------------basecourse---------------------------------

export class RegisterBasecourse implements Action {
    readonly type = CompanyActionTypes.REGISTER_BASECOURSE
    constructor (public payload: {basecourse: any}) {}
}

export class RegisterBasecourseComplete implements Action {
    readonly type = CompanyActionTypes.REGISTER_BASECOURSE_COMPLETE
}

export class RegisterBasecourseError implements Action {
    readonly type = CompanyActionTypes.REGISTER_BASECOURSE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class UpdateBasecourse implements Action {
    readonly type = CompanyActionTypes.UPDATE_BASECOURSE
    constructor (public payload: {basecourse: any}) {}
}

export class UpdateBasecourseComplete implements Action {
    readonly type = CompanyActionTypes.UPDATE_BASECOURSE_COMPLETE
}

export class UpdateBasecourseError implements Action {
    readonly type = CompanyActionTypes.UPDATE_BASECOURSE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class DeleteBasecourse implements Action {
    readonly type = CompanyActionTypes.DELETE_BASECOURSE
    constructor (public payload: {basecourseId: number}) {}
}

export class DeleteBasecourseComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_BASECOURSE_COMPLETE
}

export class DeleteBasecourseError implements Action {
    readonly type = CompanyActionTypes.DELETE_BASECOURSE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class GetBasecourseListForCompany implements Action {
    readonly type = CompanyActionTypes.GET_BASECOURSE_LIST_FOR_COMPANY;
    constructor (public payload: {companyId: number}) {}
}
export class GetBasecourseListForCompanyComplete implements Action {
    readonly type = CompanyActionTypes.GET_BASECOURSE_LIST_FOR_COMPANY_COMPLETE;
    constructor (public payload: {basecourseList: any}) {}
}


//------------------------weekday ----------------------------------

export class RegisterWeekday implements Action {
    readonly type = CompanyActionTypes.REGISTER_WEEKDAY
    constructor (public payload: {weekday: any}) {}
}

export class RegisterWeekdayComplete implements Action {
    readonly type = CompanyActionTypes.REGISTER_WEEKDAY_COMPLETE
}

export class RegisterWeekdayError implements Action {
    readonly type = CompanyActionTypes.REGISTER_WEEKDAY_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class UpdateWeekday implements Action {
    readonly type = CompanyActionTypes.UPDATE_WEEKDAY
    constructor (public payload: {weekday: any}) {}
}

export class UpdateWeekdayComplete implements Action {
    readonly type = CompanyActionTypes.UPDATE_WEEKDAY_COMPLETE
}

export class UpdateWeekdayError implements Action {
    readonly type = CompanyActionTypes.UPDATE_WEEKDAY_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class DeleteWeekday implements Action {
    readonly type = CompanyActionTypes.DELETE_WEEKDAY
    constructor (public payload: {weekdayId: number}) {}
}

export class DeleteWeekdayComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_WEEKDAY_COMPLETE
}

export class DeleteWeekdayError implements Action {
    readonly type = CompanyActionTypes.DELETE_WEEKDAY_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class GetWeekdayListForCompany implements Action {
    readonly type = CompanyActionTypes.GET_WEEKDAY_LIST_FOR_COMPANY;
    constructor (public payload: {companyId: number}) {}
}
export class GetWeekdayListForCompanyComplete implements Action {
    readonly type = CompanyActionTypes.GET_WEEKDAY_LIST_FOR_COMPANY_COMPLETE;
    constructor (public payload: {weekdayList: any}) {}
}


//-------------------timeschedule ---------------------------------------

export class RegisterTimeschedule implements Action {
    readonly type = CompanyActionTypes.REGISTER_TIMESCHEDULE
    constructor (public payload: {timeschedule: any}) {}
}

export class RegisterTimescheduleComplete implements Action {
    readonly type = CompanyActionTypes.REGISTER_TIMESCHEDULE_COMPLETE
}

export class RegisterTimescheduleError implements Action {
    readonly type = CompanyActionTypes.REGISTER_TIMESCHEDULE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class UpdateTimeschedule implements Action {
    readonly type = CompanyActionTypes.UPDATE_TIMESCHEDULE
    constructor (public payload: {timeschedule: any}) {}
}

export class UpdateTimescheduleComplete implements Action {
    readonly type = CompanyActionTypes.UPDATE_TIMESCHEDULE_COMPLETE
}

export class UpdateTimescheduleError implements Action {
    readonly type = CompanyActionTypes.UPDATE_TIMESCHEDULE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class DeleteTimeschedule implements Action {
    readonly type = CompanyActionTypes.DELETE_TIMESCHEDULE
    constructor (public payload: {timescheduleId: number}) {}
}

export class DeleteTimescheduleComplete implements Action {
    readonly type = CompanyActionTypes.DELETE_TIMESCHEDULE_COMPLETE
}

export class DeleteTimescheduleError implements Action {
    readonly type = CompanyActionTypes.DELETE_TIMESCHEDULE_ERROR
    constructor (public payload: {errorMessage: string}) {}
}

export class GetTimescheduleListForCompany implements Action {
    readonly type = CompanyActionTypes.GET_TIMESCHEDULE_LIST_FOR_COMPANY;
    constructor (public payload: {companyId: number}) {}
}
export class GetTimescheduleListForCompanyComplete implements Action {
    readonly type = CompanyActionTypes.GET_TIMESCHEDULE_LIST_FOR_COMPANY_COMPLETE;
    constructor (public payload: {timescheduleList: any}) {}
}


//-----------------------membership -----------------------------------

export class SetMembership implements Action {
    readonly type = CompanyActionTypes.SET_MEMBERSHIP;
    constructor(public payload: {card : any}) {};
}

export class SetMembershipComplete implements Action {
    readonly type = CompanyActionTypes.SET_MEMBERSHIP_COMPLETE;
}

export class SetMembershipError implements Action {
    readonly type = CompanyActionTypes.SET_MEMBERSHIP_ERROR;
    constructor(public payload: {errorMessage : string}) {};
}


export type CompanyActions
    //-----------------company---------------------------
    = RegisterCompany
    | RegisterCompanyComplete
    | RegisterCompanyError
    | UpdateCompany
    | UpdateCompanyComplete
    | UpdateCompanyError
    | GetCurrentCompany
    | GetCurrentCompanyComplete
    | GetCompanyList
    | GetCompanyListComplete

    //-------------------permission---------------------
    | GetPermissionList
    | GetPermissionListComplete
    
    //-----------------collaborator---------------------
    | GetCollaboratorListForMe
    | GetCollaboratorListForMeComplete

    //-----------------instructor-----------------------
    | GetInstructorListForMe
    | GetInstructorListForMeComplete

    //-----------------facility------------------------
    | RegisterFacility
    | RegisterFacilityComplete
    | RegisterFacilityError
    | UpdateFacility
    | UpdateFacilityComplete
    | UpdateFacilityError
    | GetFacilityListForMe
    | GetFacilityListForMeComplete

    //-----------------space-----------------------------
    | UpdateSpace
    | UpdateSpaceComplete
    | UpdateSpaceError
    | GetSpaceListForFacility
    | GetSpaceListForFacilityComplete
    | GetSpaceListForSpace
    | GetSpaceListForSpaceComplete
    | GetLastLevelSpaceListForMe
    | GetLastLevelSpaceListForMeComplete

    //-----------------figure----------------------------
    | SaveFigure
    | SaveFigureComplete
    | SaveFigureError
    | DeleteFigure
    | DeleteFigureComplete
    | DeleteFigureError
    | DeleteAllFigures
    | DeleteAllFiguresComplete
    | DeleteAllFiguresError
    
    //-----------------season-----------------------------
    | RegisterSeason
    | RegisterSeasonComplete
    | RegisterSeasonError
    | UpdateSeason
    | UpdateSeasonComplete
    | UpdateSeasonError
    | DeleteSeason
    | DeleteSeasonComplete
    | DeleteSeasonError
    | GetSeasonListForCompany 
    | GetSeasonListForCompanyComplete
    
    //-----------------course ----------------------------
    | RegisterCourse
    | RegisterCourseComplete
    | RegisterCourseError
    | UpdateCourse
    | UpdateCourseComplete
    | UpdateCourseError
    | DeleteCourse
    | DeleteCourseComplete
    | DeleteCourseError
    | GetCourseListForCompany
    | GetCourseListForCompanyComplete

    //-----------------basecourse---------------------------
    | RegisterBasecourse
    | RegisterBasecourseComplete
    | RegisterBasecourseError
    | UpdateBasecourse
    | UpdateBasecourseComplete
    | UpdateBasecourseError
    | DeleteBasecourse
    | DeleteBasecourseComplete
    | DeleteBasecourseError
    | GetBasecourseListForCompany
    | GetBasecourseListForCompanyComplete

    //-----------------weekday -----------------------------
    | RegisterWeekday
    | RegisterWeekdayComplete
    | RegisterWeekdayError
    | UpdateWeekday
    | UpdateWeekdayComplete
    | UpdateWeekdayError
    | DeleteWeekday
    | DeleteWeekdayComplete
    | DeleteWeekdayError
    | GetWeekdayListForCompany
    | GetWeekdayListForCompanyComplete

    //------------------timeschedule ----------------------------
    | RegisterTimeschedule
    | RegisterTimescheduleComplete
    | RegisterTimescheduleError
    | UpdateTimeschedule
    | UpdateTimescheduleComplete
    | UpdateTimescheduleError
    | DeleteTimeschedule
    | DeleteTimescheduleComplete
    | DeleteTimescheduleError
    | GetTimescheduleListForCompany
    | GetTimescheduleListForCompanyComplete

    //-----------------membership-------------------------
    | SetMembership
    | SetMembershipComplete
    | SetMembershipError;