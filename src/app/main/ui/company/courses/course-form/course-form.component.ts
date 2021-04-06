import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourseListService } from "../course-list/course-list.service";
import { Subject } from 'rxjs';

import { Back, RegisterCourse, UpdateCourse, 
         GetSeasonListForCompany, GetInstructorListForMe,
         GetWeekdayListForCompany, GetTimescheduleListForCompany, GetBasecourseListForCompany, 
         GetLastLevelSpaceListForMe 
       } from 'app/store/actions';
import { Store } from '@ngrx/store';
import { State as AppState, getInstructorState, getCompanyState, getAuthState } from 'app/store/reducers';

import { User } from 'app/models/user';
import { Season } from 'app/models/companymanagement/season';
import { Space } from 'app/models/companymanagement/space';
import { Weekday } from 'app/models/companymanagement/weekday';
import { Instructor } from 'app/models/instructormanagement/instructor';
import { Basecourse } from 'app/models/companymanagement/basecourse';


@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})

export class CourseFormComponent implements OnInit {

  courseForm: FormGroup;
  type: string;
  courseId: number;

  user: User;
  seasonList: Array<Season> = [];
  spaceList: Array<Space> = [];
  instructorList: Array<Instructor>= [];
  weekdayList: Array<Weekday> = [];
  timescheduleList: Array<Weekday> = [];
  basecourseList: Array<Basecourse> = [];

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
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.type = this._activatedRoute.snapshot.params.type;
      this.courseId = this._activatedRoute.snapshot.params.id;
      this.mapUserStateToModel();

      this._store.dispatch(new GetSeasonListForCompany({companyId: this.user.role_relation_id}));
      //this._store.dispatch(new GetSpaceListForFacility)
      this._store.dispatch(new GetInstructorListForMe({companyId: this.user.role_relation_id}));
      this._store.dispatch(new GetWeekdayListForCompany({companyId: this.user.role_relation_id}));
      this._store.dispatch(new GetTimescheduleListForCompany({companyId: this.user.role_relation_id}));
      this._store.dispatch(new GetBasecourseListForCompany({companyId: this.user.role_relation_id}));
      this._store.dispatch(new GetLastLevelSpaceListForMe({companyId: this.user.role_relation_id}));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      
      const course = JSON.parse(localStorage.getItem('course'));
      this.courseForm = this._formBuilder.group({
        course                  : [course ? course.course_id : '',          Validators.required],
        instructor              : [course ? course.instructor_id : '',      Validators.required],
        season                  : [course ? course.season_id : '',          Validators.required],
        space                   : [course ? course.space_id : '',           Validators.required],
        weekday                 : [course ? course.weekday_id : '',         Validators.required],
        timeschedule            : [course ? course.timeschedule_id : '',    Validators.required],
        rate1                   : [course ? course.rate1 : '',              Validators.required],
        rate2                   : [course ? course.rate2 : '',              Validators.required],
        rate3                   : [course ? course.rate3 : '',              Validators.required],
        description             : [course ? course.description : '',        Validators.required],
      });
      
      this.seasonList = [];
      this.mapDataListStateToModel();
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      localStorage.removeItem('course');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  onRegister(): void
  {
      if(this.type == 'new') {
          let payload = {
            company_id            : this.user.role_relation_id,
            base_course_id        : this.courseForm.value['course'],
            instructor_id         : this.courseForm.value['instructor'],
            season_id             : this.courseForm.value['season'],
            space_id              : this.courseForm.value['space'],
            weekday_id            : this.courseForm.value['weekday'],
            timeschedule_id       : this.courseForm.value['timeschedule'],
            rate1                 : this.courseForm.value['rate1'],
            rate2                 : this.courseForm.value['rate2'],
            rate3                 : this.courseForm.value['rate3'],
            description           : this.courseForm.value['description'],
        };
        this._store.dispatch(new RegisterCourse({ course : payload }));
      }
      else if(this.type == "update") {
        let payload = {
          id                    : this.courseId,
          company_id            : this.user.role_relation_id,
          base_course_id        : this.courseForm.value['course'],
          instructor_id         : this.courseForm.value['instructor'],
          season_id             : this.courseForm.value['season'],
          space_id              : this.courseForm.value['space'],
          weekday_id            : this.courseForm.value['weekday'],
          timeschedule_id       : this.courseForm.value['timeschedule'],
          rate1                 : this.courseForm.value['rate1'],
          rate2                 : this.courseForm.value['rate2'],
          rate3                 : this.courseForm.value['rate3'],
          description           : this.courseForm.value['description'],
        };
        
        //this._courseListService.setUpdateForView();
        this._store.dispatch(new UpdateCourse({ course : payload }));
      }
      
  } 

  setinitValue(): void 
  {
    const course = JSON.parse(localStorage.getItem('course'));
    this.courseForm.controls['name'].setValue(course.name);
    this.courseForm.controls['description'].setValue(course.description);
    this.courseForm.controls['startDate'].setValue(new Date(course.start_date));
    this.courseForm.controls['endDate'].setValue(new Date(course.end_date));
  }

  backPath(): void 
  {
    this._store.dispatch(new Back());
  }

  mapUserStateToModel(): void
  {
    this.getAuthState().subscribe(state => {
      if(state.user != null) {
        this.user = new User(state.user);
      }
    });
  }

  
  mapDataListStateToModel(): void
  {
    this.getCompanyState().subscribe(state => {
      if(state.seasonListForMe != null && state.weekdayListForMe != null 
        && state.timescheduleListForMe != null && state.instructorListForMe != null
        && state.basecourseListForMe != null && state.lastLevelSpaceListForMe != null) 
      {
        this.seasonList = [];
        this.weekdayList = [];
        this.timescheduleList = [];
        this.instructorList = [];
        this.basecourseList = [];
        this.spaceList = [];
        
        state.seasonListForMe.forEach(element => {
          this.seasonList.push(element);
        });
        state.weekdayListForMe.forEach(element => {
          this.weekdayList.push(element);
        });
        state.timescheduleListForMe.forEach(element => {
          this.timescheduleList.push(element);
        });
        state.instructorListForMe.forEach(element => {
          this.instructorList.push(element);
        });
        state.basecourseListForMe.forEach(element => {
          this.basecourseList.push(element);
        });
        state.lastLevelSpaceListForMe.forEach(element => {
          this.spaceList.push(element);
        });
      }
    })
  }

  getAuthState() 
  {
    return this._store.select(getAuthState);
  }

  getCompanyState()
  {
    return this._store.select(getCompanyState);
  }

  getInstructorState()
  {
    return this._store.select(getInstructorState);
  }

}
