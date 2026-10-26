// Orders are saved in the browser (localStorage) until a database and payments are connected.
// Each item keeps the Amazon ASIN and link it was listed from, so the order can be placed on Amazon.
const ORDERS = 'aaradhya-orders';

export type OrderItem = {sku:string;name:string;size?:string;qty:number;price:number;asin:string;amazonLink:string;amazonPrice:number;commission:number};
export type Order = {
 id:string;placed:string;payment:string;total:number;commission:number;
 customer:{name:string;phone:string;email:string;address:string;city:string;state:string;pincode:string};
 items:OrderItem[];
};

export function readOrders():Order[] {
 try { return JSON.parse(localStorage.getItem(ORDERS)||'[]'); } catch { return []; }
}
export function saveOrder(order:Order) {
 try { localStorage.setItem(ORDERS, JSON.stringify([order, ...readOrders()])); } catch {}
}
