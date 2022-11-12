const { DateTime } = require("luxon");


/**
 * Class Item to store each order item information.
 */
class Item {
    // **** Define the food menu here
    static FOOD_MENU = {
        // key: item_id
        // value: dict of name and unit_price
        "001": {
            "name": "Roasted chicken",
            "unit_price": 15.99
        },
        "012": {
            "name": "Orange juice",
            "unit_price": 1.80
        },
        "020": {
            "name": "Mushroom soup",
            "unit_price": 2.30
        }
    }


    constructor(item_id, name, unit_price, qty, created_at, order_id=null) {
        let created_at_str = created_at;
        if (created_at instanceof DateTime) {
            created_at_str = created_at.toFormat('LLL d, yyyy, HH:mm:ss');
        }

        this.item_id = item_id;
        this.order_id = order_id; // Let order_id be null if this item belongs to newly created order.
        this.name = name;
        this.unit_price = unit_price;
        this.qty = qty;
        this.created_at = created_at_str; // string format ('LLL d, yyyy, HH:mm:ss')
        this.total_price = this.qty * this.unit_price;
    }

    calcTotalPrice () {
        this.total_price = this.qty * this.unit_price;
    }

    toJSON() {
        return {
            "item_id": this.item_id,
            "order_id": this.order_id,
            "name": this.name,
            "unit_price": this.unit_price,
            "qty": this.qty,
            "created_at": this.created_at,
            "total_price": this.total_price
        }
    }

    static createItemFromJSON(json) {
        return new Item(json["item_id"], json["name"], json["unit_price"], json["qty"], json["created_at"], json["order_id"])
    }
}

module.exports = {
    Item
};