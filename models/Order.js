const { DateTime } = require("luxon");


/**
 * Class Order used to store the order.
 */
class Order {
    STATUS_MAP = {
        1: "Queuing",
        2: "Preparing",
        3: "Ready",
        4: "Served"
    }

    constructor(order_id, created_at, status, table_number, total_amount) {
        this.order_id = order_id;
        this.created_at = created_at;
        this.status = status;
        this.table_number = table_number;
        this.total_amount = total_amount;
    }

    // ===============-
    // Methods
    // ================

    gerOrderIdString() {
        return "#" + this.order_id.toString().padStart(5, '0')
    }

    getStatusString() {
        return this.STATUS_MAP[this.status];
    }

    getCreatedAtDatetime() {
        return DateTime.fromFormat('LLL d, yyyy, HH:mm:ss')
    }

    static createOrdrFromJSON(json) {
        return new Order(json["order_id"], json["created_at"], json["status"], json["table_number"], json["total_amount"])
    }

    getJSON() {
        return {
            "order_id": this.order_id,
            "created_at": this.created_at,
            "status_id": this.status,
            "table_number": this.table_number,
            "total_amount": this.total_amount,
            // Extra fields for display
            "order_str": this.gerOrderIdString(),
            "status_str": this.getStatusString()
        }
    }
}