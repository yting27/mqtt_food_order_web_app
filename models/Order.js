const { DateTime } = require("luxon");
var db_access = require('../database/access')


/**
 * Class Order used to store the order.
 */
class Order {
    static STATUS_MAP = {
        1: "Queuing",
        2: "Preparing",
        3: "Ready",
        4: "Served"
    }

    constructor(order_id, created_at, status, table_number, total_amount, items = []) {
        this.order_id = order_id;
        this.created_at = created_at;
        this.status = status;
        this.table_number = table_number;
        this.total_amount = total_amount;
        this.items = items;
    }


    // Static methods

    // static createOrdrFromJSON(json) {
    //     return new Order(json["order_id"], json["created_at"], json["status"], json["table_number"], json["total_amount"], json["items"])
    // }

    static getAllOrders() {
        let _db = db_access.getDB();

        _db.all("SELECT * FROM Orders", (err, rows) => {
            if (err) {
                throw err;
            }

            
        });

        _db.serialize(() => {
            _db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

            const stmt = _db.prepare("INSERT INTO lorem VALUES (?)");
            for (let i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }

            stmt.finalize();


        });
    }

    static getOrderWithId(order_id) {

    }

    static insertNewOrder(newOrder) {

    }

    static updateNewOrder(newOrder) {

    }

    static deleteOrderById(order_id) {

    }

    // Order instance methods
    gerOrderIdString() {
        return "#" + this.order_id.toString().padStart(5, '0')
    }

    getStatusString() {
        return Order.STATUS_MAP[this.status];
    }

    getCreatedAtDatetime() {
        return DateTime.fromFormat('LLL d, yyyy, HH:mm:ss')
    }

    getJSON() {
        return {
            "order_id": this.order_id,
            "created_at": this.created_at,
            "status": this.status,
            "table_number": this.table_number,
            "total_amount": this.total_amount,
            "items": this.items,
            // Extra fields for display
            "order_str": this.gerOrderIdString(),
            "status_str": this.getStatusString()
        }
    }

    addItemsToOrder(items) {
        this.items = this.items.concat(items);
    }
}