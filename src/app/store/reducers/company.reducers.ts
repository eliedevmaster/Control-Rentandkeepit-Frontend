import { CompanyActionTypes, CompanyActions } from '../actions/company.action';
import { Company } from '../../models/companymanagement/company';

export interface State {
    company: Company | null;
    companyList: any | null;
    
    permissionList: any | null; 
    
    collaboratorListForMe: any | null;   
    instructorListForMe: any | null;
    
    facilityListForMe: any | null;
    spaceListForFacility: any | null;
    spaceListForSpace: any | null;
    lastLevelSpaceListForMe: any | null;
    seasonListForMe: any | null;

    courseListForMe: any | null;
    basecourseListForMe: any | null;
    weekdayListForMe: any | null;
    timescheduleListForMe: any | null;

    errorMessage: string | null; 
}

export const initialState: State = {
    company: JSON.parse(localStorage.getItem('company')),
    companyList: null,

    permissionList: JSON.parse(localStorage.getItem('permissionList')), 
    
    collaboratorListForMe: null, 
    instructorListForMe: null,
    
    facilityListForMe : null,
    spaceListForFacility: null,
    spaceListForSpace: null,
    lastLevelSpaceListForMe: null,

    seasonListForMe: null,

    courseListForMe: null,
    basecourseListForMe: null,
    weekdayListForMe: null,
    timescheduleListForMe: null,

    errorMessage: '',
};

export function reducer(state = initialState, action: CompanyActions): State {
    switch (action.type) {
        
        //----------------------company-----------------------------

        case CompanyActionTypes.REGISTER_COMPLETE: {
            return {
                ...state,
                company: new Company(action.payload.company)
            };
        }
        
        case CompanyActionTypes.REGISTER_ERROR: {
            return {
                ...state,
                errorMessage: 'Incorrect company data.'
            };
        }

        case CompanyActionTypes.UPDATE_COMPLETE: {
            return {
                ...state,
                company: new Company(action.payload.company)
            };
        }
        
        case CompanyActionTypes.UPDATE_ERROR: {
            return {
                ...state,
                errorMessage: 'Incorrect company data.'
            };
        }

        case CompanyActionTypes.GET_CURRENT_COMPANY_COMPLETE: {
            return {
                ...state,
                company: new Company(action.payload.company)
            };
        }

        case CompanyActionTypes.GET_COMPANY_LIST_COMPLETE: {
            return {
                ...state,
                companyList: action.payload.companyList
            }
        }

        
        //---------------------------permission--------------------------

        case CompanyActionTypes.GET_PERMISSION_LIST_COMPLETE: {
            return {
                ...state,
                permissionList:action.payload.permissionList
            };
        }
        
        
        //----------------------------collaborator----------------------

        case CompanyActionTypes.GET_COLLABORATOR_LIST_FOR_ME_COMPLETE: {
            return {
                ...state,
                collaboratorListForMe: action.payload.collaboratorList
            }
        }


        //----------------------------instructor-------------------------

        case CompanyActionTypes.GET_INSTRUCTOR_LIST_FOR_ME_COMPLETE: {
            return {
                ...state,
                instructorListForMe: action.payload.instructorList
            }
        }


        //-----------------------------facility----------------------------

        case CompanyActionTypes.REGISTER_FACILTIY_COMPLETE: {
            return {
                ...state,
            }
        }

        case CompanyActionTypes.UPDATE_FACILTIY_COMPLETE: {
            return {
                ...state,
            }
        }

        case CompanyActionTypes.GET_FACILITY_LIST_FOR_ME_COMPLETE: {
            return {
                ...state,
                facilityListForMe: action.payload.facilityList
            }
        }


        //---------------------------------space---------------------------
        
        case CompanyActionTypes.UPDATE_SPACE_COMPLETE: {
            return {
                ...state,
            }
        }

        case CompanyActionTypes.UPDATE_SPACE_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }

        case CompanyActionTypes.GET_SPACE_LIST_FOR_FACILITY_COMPLETE: {
            return {
                ...state,
                spaceListForFacility: action.payload.spaceList
            }
        }

        case CompanyActionTypes.GET_SPACE_LIST_FOR_SPACE_COMPLETE: {
            return {
                ...state,
                spaceListForSpace: action.payload.spaceList
            }
        }

        case CompanyActionTypes.GET_LAST_LEVEL_SPACE_LIST_FOR_ME_COMPLETE: {
            return {
                ...state,
                lastLevelSpaceListForMe: action.payload.spaceList
            }
        }

        //-----------------------------figure ----------------------------

        case CompanyActionTypes.SAVE_FIGURE_COMPLETE: {
            return {
                ...state,
            }
        }

        case CompanyActionTypes.SAVE_FIGURE_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }

        case CompanyActionTypes.DELETE_FIGURE_COMPLETE: {
            return {
                ...state,
            }
        }

        case CompanyActionTypes.DELETE_FIGURE_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }

        //------------------------------season----------------------------
        
        case CompanyActionTypes.REGISTER_SEASON_COMPLETE : {
            return {
                ...state,
            }
        }

        case CompanyActionTypes.REGISTER_SEASON_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }

        case CompanyActionTypes.UPDATE_SEASON_COMPLETE : {
            return {
                ...state,
            }
        }

        case CompanyActionTypes.UPDATE_SEASON_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }

        case CompanyActionTypes.DELETE_SEASON_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        case CompanyActionTypes.GET_SEASON_LIST_FOR_COMPANY_COMPLETE: {
            return {
                ...state,
                seasonListForMe: action.payload.seasonList,
            }
        }

        //------------------------------course --------------------------
        
        case CompanyActionTypes.REGISTER_COURSE_COMPLETE : {
            return {
                ...state,
            }
        }
        
        case CompanyActionTypes.REGISTER_COURSE_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        
        case CompanyActionTypes.UPDATE_COURSE_COMPLETE : {
            return {
                ...state,
            }
        }
        
        case CompanyActionTypes.UPDATE_COURSE_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        
        case CompanyActionTypes.DELETE_COURSE_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        case CompanyActionTypes.GET_COURSE_LIST_FOR_COMPANY_COMPLETE: {
            return {
                ...state,
                courseListForMe: action.payload.courseList,
            }
        }

        //------------------------------basecourse-----------------------

        case CompanyActionTypes.REGISTER_BASECOURSE_COMPLETE : {
            return {
                ...state,
            }
        }
        
        case CompanyActionTypes.REGISTER_BASECOURSE_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        
        case CompanyActionTypes.UPDATE_BASECOURSE_COMPLETE : {
            return {
                ...state,
            }
        }
        
        case CompanyActionTypes.UPDATE_BASECOURSE_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        
        case CompanyActionTypes.DELETE_BASECOURSE_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        case CompanyActionTypes.GET_BASECOURSE_LIST_FOR_COMPANY_COMPLETE: {
            return {
                ...state,
                basecourseListForMe: action.payload.basecourseList,
            }
        }

        //------------------------------weekday --------------------------

        case CompanyActionTypes.REGISTER_WEEKDAY_COMPLETE : {
            return {
                ...state,
            }
        }
        
        case CompanyActionTypes.REGISTER_WEEKDAY_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        
        case CompanyActionTypes.UPDATE_WEEKDAY_COMPLETE : {
            return {
                ...state,
            }
        }
        
        case CompanyActionTypes.UPDATE_WEEKDAY_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        
        case CompanyActionTypes.DELETE_WEEKDAY_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        case CompanyActionTypes.GET_WEEKDAY_LIST_FOR_COMPANY_COMPLETE: {
            return {
                ...state,
                weekdayListForMe: action.payload.weekdayList,
            }
        }

        //-----------------------------timeschedule----------------------

        case CompanyActionTypes.REGISTER_TIMESCHEDULE_COMPLETE : {
            return {
                ...state,
            }
        }
        
        case CompanyActionTypes.REGISTER_TIMESCHEDULE_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        
        case CompanyActionTypes.UPDATE_TIMESCHEDULE_COMPLETE : {
            return {
                ...state,
            }
        }
        
        case CompanyActionTypes.UPDATE_TIMESCHEDULE_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        
        case CompanyActionTypes.DELETE_TIMESCHEDULE_ERROR : {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }
        case CompanyActionTypes.GET_TIMESCHEDULE_LIST_FOR_COMPANY_COMPLETE: {
            return {
                ...state,
                timescheduleListForMe: action.payload.timescheduleList,
            }
        }
        
        //------------------------------membership-------------------------

        case CompanyActionTypes.SET_MEMBERSHIP_COMPLETE: {
            return {
                ...state,
            }
        }
        case CompanyActionTypes.SET_MEMBERSHIP_ERROR: {
            return {
                ...state,
                errorMessage: action.payload.errorMessage
            }
        }


        //----------------------------------------------------------------
        default: {
            return state;
        }
    }
}

export const selectCompany = (state: State)  => state.company;