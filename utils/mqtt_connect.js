const mqtt = require('mqtt');
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
            // }

            // IF data corrupted, publish to 'toDevice_order':
            // let example = {
            //     "action": "error_add_order"
            // }
            // Device will resend the data
            console.log("Received message: ", message.toString());

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
