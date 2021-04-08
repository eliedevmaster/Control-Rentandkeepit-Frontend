
export class Customer {
    id? : number;
    username : string;
    first_name? : string;
    last_name? : string;

    email? : string;
    country?: string;
    postcode?: string;
    city?: string;
    state?: string;

    date_last_active? : string;
    date_registered? : string;

    constructor (data : any){
        this.id = data.customer_id;
        this.username = data.username ? data.username : '';
        this.first_name = data.first_name ? data.first_name : '';
        this.last_name = data.last_name ? data.last_name : '';
        this.email = data.email ? data.email : '';
        this.country = data.country ? data.country : '';
        this.postcode = data.postcode ? data.postcode : '';
        this.city = data.city ? data.city : '';
        this.state = data.state ? data.state : '';

        this.date_last_active = data.date_last_active ? new Date(data.date_registered).toISOString().substring(0, 10)  : '' ;
        this.date_registered = data.date_registered ? new Date(data.date_registered).toISOString().substring(0, 10) : '';
    }
  }