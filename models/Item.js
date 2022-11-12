

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


    constructor(item_id, order_id, name, unit_price, qty, created_at) {
        this.item_id = item_id;
        this.order_id = order_id;
        this.name = name;
        this.unit_price = unit_price;
        this.qty = qty;
        this.created_at = created_at;
        this.total_price = this.qty * this.unit_price;
    }

    calcTotalPrice () {
        this.total_price = this.qty * this.unit_price;
    }
    
}