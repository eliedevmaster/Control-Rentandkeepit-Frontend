
export class Basecourse {
    id?: number;
    company_id?: number;
    type?: string;
    name?: string;
    price?: number;
    currency_id?: number;
    min_number?: number;
    max_number?: number;
    description?: string;
    
    constructor (data : any) {
        
        this.id = data.id ? data.id : 0;
        this.company_id = data.company_id ? data.company_id : 0;
        this.type = data.type ? data.type : '';
        this.name = data.name ? data.name : '';
        this.price = data.price ? data.price : 0;
        this.currency_id = data.currency_id ? data.currency_id : 0;
        this.min_number = data.min_number ? data.min_number : 0;
        this.max_number = data.max_number ? data.max_number : 0;

        this.description = data.description ? data.description : '';
    }
}