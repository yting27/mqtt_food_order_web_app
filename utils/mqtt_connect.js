const { DateTime } = require('luxon');
const mqtt = require('mqtt');
const { Item } = require('../models/Item');
const { Order } = require('../models/Order');
const client = mqtt.connect('mqtt://localhost:1883', {
    clientId: "mqttjs_web-app-client1"
});


// Two topics:
// 1. fromDevice_order - Send from device to web app
// 2. toDevice_order - Send from web app to device

client.on('connect', function () {
    // Get new order
    client.subscribe('fromDevice_order', function (err) {
        if (!err) {
            console.log('Successfully subscribed to "fromDevice_order" topic');
        } else {
            console.log(err);
            throw err;
        }
    });
});


client.on('message', (topic, message, packet) => {
    console.log("Received MQTT message: ", message.toString());

    switch (topic) {
        case "fromDevice_order":
            // Save to DB for new order.
            // messsage in json format:
            // let example = {
            //     "action": "add_order",
            //     "items": [
            //         {
            //             "id": "001",
            //             "qty": 2
            //         },
            //         {
            //             "id": "002",
            //             "qty": 1
            //         }
            //     ]
            //     "table_num": 10
            // }

            let message_obj = JSON.parse(message);
            if (message_obj["action"] == "add_order") {
                // Process each item
                let itemList = []
                for (let item of message_obj["items"]) {
                    if (!(item["id"] in Item.FOOD_MENU)) {
                        console.log("[WARN] Item not found in menu: ", item);
                        continue;
                    }
                    
                    menu_item = Item.FOOD_MENU[item["id"]]

                    itemList.push(new Item(item["id"], menu_item["name"], menu_item["unit_price"], item["qty"], DateTime.now()))
                }

                if (itemList.length > 0) {
                    let newOrder = new Order(DateTime.now(), 1, message_obj["table_num"], null, itemList);
                
                    Order.insertNewOrder(newOrder); // insert new order
                } else {
                    console.log("[WARN] No order created because number of items are zero.")
                }
            }

            // IF data corrupted, publish to 'toDevice_order':
            // let example = {
            //     "action": "error_add_order"
            // }
            // Device will resend the data
            break;
    }

});

client.on('error', function(error)
{
	console.log("MQTT connection error: ", error);
});

client.on('close', function()
{
	console.log("MQTT connection closed.");
});


module.exports.client = client;
