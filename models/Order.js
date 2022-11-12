const { DateTime } = require("luxon");
var db_access = require('../database/access')
const { Item } = require('./Item');

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

    /**
     * Constructs an Order object.
     * 
     * @param {String|DateTime} created_at String representation ('LLL d, yyyy, HH:mm:ss') of the DateTime object. 
     * @param {int} status Status
     * @param {int} table_number Table number.
     * @param {int} order_id Order ID. Please let it null if this is a new order. (Default: null)
     * @param {Item} items Array of Item objects
     */
    constructor(created_at, status, table_number, order_id = null, items = []) {
        let created_at_str = created_at;
        if (created_at instanceof DateTime) {
            created_at_str = created_at.toFormat('LLL d, yyyy, HH:mm:ss');
        }

        this.created_at = created_at_str; // string format ('LLL d, yyyy, HH:mm:ss')
        this.status = status;
        this.table_number = table_number;
        this.order_id = order_id; // Let order_id be null if this is a new order
        this.items = items;

        this.total_amount = items.reduce((total, item) => total + (item.unit_price * item.qty), 0);
    }

    
    // Object methods
    /**
     * Return order_id string representation.
     * 
     * @returns {String} Order ID string representation
     */
    gerOrderIdString() {
        return "#" + this.order_id.toString().padStart(5, '0')
    }

    /**
     * Return status label of `status` property of this order.
     * @returns {String} status string
     */
    getStatusString() {
        return Order.STATUS_MAP[this.status];
    }

    /**
     * Return DateTime object of created_at field.
     * @returns {DateTime} DateTime object
     */
    getCreatedAtDatetime() {
        return DateTime.fromFormat(this.created_at, 'LLL d, yyyy, HH:mm:ss')
    }

    /**
     * Return Javascript version of Order object.
     * 
     * @returns {Object} Order javascript object
     */
    toJSON() {
        let items_json = [];
        for (let item of this.items) {
            items_json.push(item.toJSON());
        }

        return {
            "order_id": this.order_id,
            "created_at": this.created_at,
            "status": this.status,
            "table_number": this.table_number,
            "total_amount": this.total_amount,
            "items": items_json,
            // Extra fields for display
            "order_id_str": this.gerOrderIdString(),
            "status_str": this.getStatusString()
        }
    }

    /**
     * Add items to the order. (IMPORTANT: Please use this method to add items to the order)
     * @param {Array.<Item>} items Array of Item objects to add.
     */
    addItemsToOrder(items) {
        let current_amount = 0;
        for (let item of items) {
            item.order_id = this.order_id; // Ensure the order_id of all items are this order.

            current_amount += item.unit_price * item.qty;
        }

        this.items = this.items.concat(items);
        this.total_amount += current_amount;
    }


    // Static methods

    /**
     * @async
     * 
     * Return Order object from json.
     * @param {Object} json Javascript object containing order information.
     * 
     * @return {Order} Order object with the same values as in `json`.
     */
    static createOrderFromJSON(json) {
        let items = []
        if ("items" in json) {
            let items_json = json["items"]

            for (let data of items_json) {
                items.push(Item.createItemFromJSON(data))
            }
        }

        return new Order(json["created_at"], json["status"], json["table_number"], json["order_id"], items);
    }

    /**
     * @async
     * 
     * Convert array of Order objects to array of Javascript objects to be displayed on the table.
     * @param {Array.<Order>} orders Array of Order objects
     * 
     * @return {Array.<Object>} Array of Javascript objects.
     */
    static convertOrderArrayToJSON(orders) {
        let orders_json = [];
        for (let order of orders) {
            orders_json.push(order.toJSON());
        }

        return orders_json;
    }

    /**
     * @async
     * 
     * Get all orders (with their respective items) from the database.
     * 
     * @return {Array.<Order>} Order array with their respective items.
     */
    static async getAllOrders() {
        let _db = db_access.getDB();

        let orders_json = await _db.all("SELECT * FROM Orders");

        let orders_obj = [];
        for (let each_order of orders_json) {
            const order_id = each_order["order_id"];

            let items_json = await _db.all("SELECT * FROM Items WHERE order_id = ?", [order_id]); // [{ col: 'test', col2: 'test2' }]

            each_order["items"] = items_json;
            orders_obj.push(Order.createOrderFromJSON(each_order));
        }

        return orders_obj;
    }

    /**
     * @async
     * 
     * Get an order with the ID `order_id` from the database.
     * @param {int} order_id Order object to be inserted into the database.
     * 
     * @return {Order} Order object matching the `order_id`.
     */
    static async getOrderWithId(order_id) {
        let _db = db_access.getDB();

        let order_json = await _db.get("SELECT * FROM Orders WHERE order_id = ?", order_id); // { col: 'test', col2: 'test2' }
        let items_json = await _db.all("SELECT * FROM Items WHERE order_id = ?", order_id); // [{ col: 'test', col2: 'test2' }]

        order_json["items"] = items_json

        return Order.createOrderFromJSON(order_json);
    }

    /**
     * @async
     * 
     * Insert a new order into the database.
     * @param {Order} newOrder Order object to be inserted into the database.
     * 
     * @return {boolean} true if the order was successfully added, false otherwise.
     */
    static async insertNewOrder(newOrder) {
        let _db = db_access.getDB();

        let orderResult = await _db.run(`INSERT INTO Orders 
                                            (created_at, status, table_number, total_amount) 
                                            VALUES (?, ?, ?, ?)`,
            [newOrder.created_at, newOrder.status, newOrder.table_number, newOrder.total_amount]
        );
        const order_id = orderResult.lastID;

        for (let item of newOrder.items) {
            let itemResult = await _db.run(`INSERT INTO Items 
                                            (item_id, order_id, name, unit_price, qty, created_at) 
                                            VALUES (?, ?, ?, ?, ?, ?)`,
                [item.item_id, order_id, item.name, item.unit_price, item.qty, item.created_at]
            );
        }

        return true;
    }

    /**
     * @async
     * 
     * Update the order details given by `newOrder` instance in the database.
     * @param {Order} orderUpdated Order object to insert into the database.
     * 
     * @return {boolean} true if the order was successfully updated, false otherwise.
     */
    static async updateOrderDetails(orderUpdated) {
        let _db = db_access.getDB();

        if (orderUpdated.order_id === null) {
            return false; // This order (with order_id = null) does not exists in the database.
        }

        const orderResult = await _db.run(
            'UPDATE Orders SET created_at = ?, status = ?, table_number = ?, total_amount = ? WHERE order_id = ?',
            [orderUpdated.created_at, orderUpdated.status, orderUpdated.table_number, orderUpdated.total_amount, orderUpdated.order_id]
        )

        if (orderResult.changes == 0) {
            return false; // No record is changed in the database as no order matches
        }

        // Update order items
        for (let item of orderUpdated.items) {
            const orderResult = await _db.run(
                'UPDATE Items SET item_id = ?, name = ?, unit_price = ?, qty = ?, created_at =? WHERE order_id = ?',
                [item.item_id, item.name, item.unit_price, item.qty, item.created_at, orderUpdated.order_id]
            )
        }

        return true;
    }

    /**
     * @async
     * 
     * Delete the order and its items in the database.
     * @param {int} order_id Order ID of the order to be deleted.
     * 
     * @return {boolean} true if the order was successfully deleted, false otherwise.
     */
    static async deleteOrderById(order_id) {

        const deleteOrderResult = await _db.run(
            'DELETE FROM Orders WHERE order_id = ?', [order_id]
        )

        if (deleteOrderResult.changes == 0) {
            return false;
        }

        const deleteItemsResult = await _db.run(
            'DELETE FROM Items WHERE order_id = ?', [order_id]
        )

        return true;
    }
}


module.exports = {
    Order
};