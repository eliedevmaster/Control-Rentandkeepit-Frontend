
export class Figure {
    id : number;
    figure_type_id: number;
    shape: string;
 
    constructor (data : any) {
        this.id = data.id ? data.id : 0;
        this.figure_type_id = data.figure_type_id ? data.figure_type_id : 0;
        this.shape = data.shape? data.shape : '';
    }
}
