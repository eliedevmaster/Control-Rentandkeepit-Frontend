import { Company } from './company';
import { Instructor } from '../instructormanagement/instructor';
import { Space } from './space';
import { Season } from './season';
import { Weekday } from './weekday';
import { Timeschedule} from './timeschedule';
import { Basecourse } from './basecourse'

export class Course {
    id? : number;
    company_id? : number;
    instructor? : Instructor;
    space? : Space;
    season? : Season;
    weekday? : Weekday;
    timeschedule? : Timeschedule;
    basecourse? : Basecourse;
    rate1?: string;
    rate2?: string;
    rate3?: string;

    description? : string;
    
    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.company_id = data.company_id ? this.company_id : 0;
        
        if(data.base_course_id) {
            this.basecourse = new Basecourse({});
            this.basecourse.id = data.base_course_id
        }
        else
            this.basecourse = data.base_course ? new Basecourse(data.base_course) : null;    
        
        if(data.instructor_id) {
            this.instructor = new Company({});
            this.instructor.id = data.instructor_id
        }
        else
            this.instructor = data.instructor ? new Instructor(data.instructor) : null;
    

        if(data.space_id) {
            this.space = new Space({});
            this.space.id = data.space_id
        }
        else
            this.space = data.space ? new Space(data.space) : null;

        if(data.season_id) {
            this.season = new Season({});
            this.season.id = data.season_id
        }
        else
            this.season = data.season ? new Season(data.season) : null;

        if(data.weekday_id) {
            this.weekday = new Weekday({});
            this.weekday.id = data.weekday_id
        }
        else
            this.weekday = data.weekday ? new Weekday(data.weekday) : null;
        
        if(data.timeschedule_id) {
            this.timeschedule = new Timeschedule({});
            this.timeschedule.id = data.timeschedule_id
        }
        else
            this.timeschedule = data.timeschedule ? new Timeschedule(data.timeschedule) : null;
      
        this.rate1 = data.rate_1 ? data.rate_1 : '';
        this.rate2 = data.rate_2 ? data.rate_2 : null;
        this.rate3 = data.rate_3 ? data.rate_3 : null;
        this.description = data.description ? data.description : '';
    }
}
