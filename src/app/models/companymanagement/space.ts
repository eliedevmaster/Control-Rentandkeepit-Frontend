
import { Facility } from './facility';
import { Figure } from './figure';

export class Space {
    id : number;
    company_id: number;
    figure : Figure;
    parent_type: number;
    parent: any;
    type: string;
    name: string;
    shape_name: string;
    description: string;

    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.figure = data.figure ? new Figure(data.figure): null;
        this.company_id = data.company_id ? data.company_id : 0;
        
        if(data.parent_type && data.parent_type == 'App\Models\Facility')
            this.parent_type = 1;
        else if (data.parent_type && data.parent_type == 'App\Models\Space')
            this.parent_type = 2;
        else 
            this.parent_type = 0;
        
        if(this.parent_type == 1) {
            this.parent = data.parent ? new Facility(data.parent) : null;
            if(data.parent_id && this.parent == null) {
                this.parent =  new Facility({});
                this.parent.id = data.parent_id;
            }
        }
        else {
            this.parent = data.parent ? new Space(data.parent) : null;
            if(data.parent_id && this.parent == null) {
                this.parent =  new Space({});
                this.parent.id = data.parent_id;
            }
        } 
        this.type = data.type ? data.type : '';
        this.name = data.name ? data.name : '';
        this.shape_name = data.shape_name ? data.shape_name : '';
        this.description = data.description ? data.description : '';
            
    }
}
