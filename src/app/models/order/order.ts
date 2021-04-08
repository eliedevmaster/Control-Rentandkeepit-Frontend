import { OrderItem } from './order_item';
import { Product } from '../product/product';

export class Order {

    id? : number;
    order_item_id? : number;
    product_id? : number;
    customer_id? : number;
    product_qty? : number;
    product_gross_revenue? : number;

    order_item? : OrderItem;
    product? : Product;

    constructor (data : any) {
        this.id = data.order_id;
        this.order_item_id = data.order_item_id;
        this.product_id = data.product_id;
        this.customer_id = data.customer_id;
        this.product_qty = data.product_qty;
        this.product_gross_revenue = data.product_gross_revenue;
        
        this.order_item = data.order_item ? new OrderItem(data.order_item) : null;
        this.product = data.product ? new Product(data.product) : null;
    }
}