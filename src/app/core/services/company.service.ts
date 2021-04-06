import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Company } from '../../models/companymanagement/company';
import { Season } from 'app/models/companymanagement/season';

@Injectable({
    providedIn: 'root'
})

export class CompanyService {

    constructor( private http: HttpClient, private authService: AuthService ) { }

    registerCompany( param : Company ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/companies`;
        const body = {
                company_type_id               : param.company_type.id,
                display_name                  : param.display_name,
                fiscal_code                   : param.fiscal_code,
                vat_code                      : param.vat_code,
                country_name                  : param.country.name,
                country_alpha2Code            : param.country.alpha2Code,
                country_alpha3Code            : param.country.alpha3Code,
                country_numericCode           : param.country.numericCode,
                phone                         : param.phone,
                fax                           : param.fax, 
                currency_id                   : param.currency.id,
                start_date                    : param.start_date.toISOString().substring(0, 10), 
                end_date                      : param.end_date.toISOString().substring(0, 10),
        };
        return this.http.post(url, body, { headers: this.authService.authHeaders() });
    }

    updateCompany( param : Company ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/companies/` + param.id;
        param.start_date.setFullYear(2021);//fixed year, don't consider
        param.end_date.setFullYear(2021);//fixed year , don't consider
        const body = {
                company_type_id               : param.company_type.id,
                display_name                  : param.display_name,
                fiscal_code                   : param.fiscal_code,
                vat_code                      : param.vat_code,
                country_name                  : param.country.name,
                country_alpha2Code            : param.country.alpha2Code,
                country_alpha3Code            : param.country.alpha3Code,
                country_numericCode           : param.country.numericCode,
                phone                         : param.phone,
                fax                           : param.fax, 
                currency_id                   : param.currency.id,
                start_date                    : param.start_date.toISOString().substring(0, 10), 
                end_date                      : param.end_date.toISOString().substring(0, 10),
        };
        return this.http.put(url, body, {headers: this.authService.authHeaders()});
    }

    getCurrentCompany(param : number) : Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/companies/showbyuser/` + param.toString();
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }

    getCompanyList() : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/companies`;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }
        
    getCollaboratorListForMe(param : number): Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/companies/collaboratorlist/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }

    getInstructorListForMe(param : number): Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/companies/instructorlist/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }

    sendCreditCardInfo( params : any) : Observable<any> {

        const url = `${env.backendBaseUrl}/api/companies/membership/` + params.companyId;
        const body = {
                cardName       : params.cardName,
                stripeToken    : params.stripeToken,
        };
        return this.http.put(url, body, {headers: this.authService.authHeaders()});
    }

    
    //--------------------------facility management --------------------------

    registerFacility(param : any) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/facilities`;
        const body = {
            company_id : param.company_id, 
            type: param.type,
            name: param.name,
            description: param.description
        }

        return this.http.post(url, body, {headers: this.authService.authHeaders()});

    } 
    updateFacility(param: any) : Observable<any> 
    {
        const url =  `${env.backendBaseUrl}/api/facilities/` + param.id;
        const body = {
            type : param.type,
            name : param.name,
            description : param.description,
        }
        return this.http.put(url, body, {headers: this.authService.authHeaders()});
    }
    
    deleteFacility(param : number) : Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/facilities/` + param;
        return this.http.delete(url, {headers: this.authService.authHeaders()});
    }
    
    getFacilityListForCompany(param : number) : Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/facilities/showbycompany/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }   

    //-----------------------------------figure ------------------------------------

    saveFigure(param: any) : Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/spaces`;
        const body = {
            company_id: param.company_id,
            figure_type_ids: param.figure_type_ids,
            figure_names: param.figure_names,
            parent_type: param.parent_type,
            parent_id: param.parent_id,
            shapes: param.shapes
        }
        return this.http.post(url, body, {headers: this.authService.authHeaders()});
    }

    deleteFigure(param: string) : Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/spaces/` + param;
        return this.http.delete(url, {headers: this.authService.authHeaders()});
    }

    /*getFiguresForFacility(param: number) : Observable<any> 
    {

    }*/
    //-------------------------------space management--------------------------

    deleteSpace(param : number) : Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/spaces/deletebyId/` + param;
        return this.http.delete(url, {headers: this.authService.authHeaders()});
    }
    
    updateSpace(param: any) : Observable<any> 
    {
        const url =  `${env.backendBaseUrl}/api/spaces/` + param.id;
        const body = {
            type: param.type,
            name: param.name,
            description: param.description,
        }
        return this.http.put(url, body, {headers: this.authService.authHeaders()});
    }

    getSpaceListForFacility(param : number): Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/spaces/showbyfacility/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }

    getSpaceListForSpace(param : number): Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/spaces/showbyspace/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }

    getLastLevelSpaceListForMe(param: number) : Observable<any> 
    {
        const url =  `${env.backendBaseUrl}/api/spaces/showlastlevelspace/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }
    //------------------------------Season managment----------------------------------

    registerSeason( param : any ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/seasons`;
        const body = {
            company_id      : param.company_id,
            name            : param.name,
            description     : param.description,
            start_date      : param.start_date.toISOString().substring(0, 10),
            end_date        : param.end_date.toISOString().substring(0, 10),
        }
        return this.http.post(url, body, {headers: this.authService.authHeaders()});
    }

    updateSeason( param : any ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/seasons/` + param.id;
        const body = {
            company_id      : param.company_id,
            name            : param.name,
            description     : param.description,
            start_date      : param.start_date.toISOString().substring(0, 10),
            end_date        : param.end_date.toISOString().substring(0, 10),
        }
        return this.http.put(url, body, {headers: this.authService.authHeaders()});
    }

    deleteSeason (param : number) :  Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/seasons/` + param;
        return this.http.delete(url, {headers: this.authService.authHeaders()});
    }
    getSeasonListForCompany( param : number ) : Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/seasons/showbycompany/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }

    //-------------------------------course---------------------------
    
    registerCourse( param : any ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/courses`;
    
        const body = {
            company_id            : param.company_id,
            base_course_id        : param.base_course_id,
            instructor_id         : param.instructor_id,
            season_id             : param.season_id,
            space_id              : param.space_id,
            weekday_id            : param.weekday_id,
            timeschedule_id       : param.timeschedule_id,
            rate_1                : param.rate1,
            rate_2                : param.rate2,
            rate_3                : param.rate3,
            description           : param.description,
        }
        return this.http.post(url, body, { headers: this.authService.authHeaders() });
    }

    updateCourse( param : any ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/courses/` + param.id;
        const body = {
            company_id            : param.company_id,
            base_course_id        : param.base_course_id,
            instructor_id         : param.instructor_id,
            season_id             : param.season_id,
            space_id              : param.space_id,
            weekday_id            : param.weekday_id,
            timeschedule_id       : param.timeschedule_id,
            rate_1                : param.rate1,
            rate_2                : param.rate2,
            rate_3                : param.rate3,
            description           : param.description,
        }

        return this.http.put(url, body, { headers: this.authService.authHeaders() });
    }

    deleteCourse (param : number) :  Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/courses/` + param;
        return this.http.delete(url, {headers: this.authService.authHeaders()});
    }

    getCourseListForCompany( param : number ) : Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/courses/showbycompany/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }

    //--------------------------------basecourse---------------------------

    registerBasecourse( param : any ) : Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/courses/basecourses`;
        const body = {
            company_id       : param.company_id,
            type             : param.type,
            name             : param.name,
            price            : param.price,
            currency_id      : param.currency_id,
            min_number       : param.min_number,
            max_number       : param.max_number,
            description      : param.description
        }

        return this.http.post(url, body, { headers: this.authService.authHeaders() });
    }

    updateBasecourse( param : any ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/courses/basecourses/` + param.id;
        const body = {
            company_id       : param.company_id,
            type             : param.type,
            name             : param.name,
            price            : param.price,
            currency_id      : param.currency_id,
            min_number       : param.min_number,
            max_number       : param.max_number,
            description      : param.description
        }

        return this.http.put(url, body, { headers: this.authService.authHeaders() });
    }

    deleteBasecourse (param : number) : Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/courses/basecourses/` + param;
        return this.http.delete(url, {headers: this.authService.authHeaders()});    
    }

    getBasecourseListForCompany ( param : number ) : Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/courses/basecourses/showbycompany/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }


    //---------------------------------weekday -----------------------------

    registerWeekday( param : any ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/courses/weekdays`;
        
        const body = {
            company_id            : param.company_id,
            name                  : param.name,
            days                  : param.days,
        }

        return this.http.post(url, body, { headers: this.authService.authHeaders() });
    }

    updateWeekday( param : any ) : Observable<any> 
    {
        const url = `${env.backendBaseUrl}/api/courses/weekdays/` + param.id;
        
        const body = {
            company_id            : param.company_id,
            name                  : param.name,
            days                  : param.days,
        }

        return this.http.put(url, body, { headers: this.authService.authHeaders() });
    }

    deleteWeekday (param : number) : Observable<any>
    {
        const url = `${env.backendBaseUrl}/api/courses/weekdays/` + param;
        return this.http.delete(url, {headers: this.authService.authHeaders()});    
    }

    getWeekdayListForCompany (param : number ) : Observable<any>
    {
        const url =  `${env.backendBaseUrl}/api/courses/weekdays/showbycompany/` + param;
        return this.http.get(url, {headers: this.authService.authHeaders()});
    }

     //---------------------------------timeschedule -----------------------------

     registerTimeschedule( param : any ) : Observable<any> 
     {
         const url = `${env.backendBaseUrl}/api/courses/timeschedules`;
         
         const body = {
             company_id            : param.company_id,
             name                  : param.name,
             start_time            : param.start_time,
             end_time              : param.end_time,
         }
 
         return this.http.post(url, body, { headers: this.authService.authHeaders() });
     }
 
     updateTimeschedule ( param : any ) : Observable<any> 
     {
         const url = `${env.backendBaseUrl}/api/courses/timeschedules/` + param.id;
         
         const body = {
             company_id            : param.company_id,
             name                  : param.name,
             start_time            : param.start_time,
             end_time              : param.end_time,
         }
 
         return this.http.put(url, body, { headers: this.authService.authHeaders() });
     }
 
     deleteTimeschedule (param : number) : Observable<any>
     {
         const url = `${env.backendBaseUrl}/api/courses/timeschedules/` + param;
         return this.http.delete(url, {headers: this.authService.authHeaders()});    
     }
 
     getTimescheduleListForCompany (param : number ) : Observable<any>
     {
         const url =  `${env.backendBaseUrl}/api/courses/timeschedules/showbycompany/` + param;
         return this.http.get(url, {headers: this.authService.authHeaders()});
     }
}
