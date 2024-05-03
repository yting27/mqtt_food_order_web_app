var express = require('express');
var router = express.Router();
const { DateTime } = require("luxon");
const { Item } = require('../models/Item');
const { Order } = require('../models/Order');
var mqtt_client = require('../utils/mqtt_connect').client;


/* GET order list. */
router.get('/', async function (req, res, next) {
  let orderArray = await Order.getAllOrders();
  let orderJSObject = Order.convertOrderArrayToJSON(orderArray);

  res.render("pages/orders", {
    title: 'Orders',
    orderList: orderJSObject
  });

});


/* GET an order details. */
router.get('/:order_id', async function (req, res, next) {
  let order_id = req.params.order_id;

  // Get order details
  let orderJS = (await Order.getOrderWithId(order_id)).toJSON()

  const zeroPad = (num, places) => String(num).padStart(places, '0')

  res.render("pages/orderDetails", {
    title: `#${zeroPad(order_id, 6)} Order Details`,
    orderDetails: orderJS,
    orderStatusList: Order.STATUS_MAP
  });
});


/* POST (update) order details. */
router.post('/:order_id', async function (req, res, next) {
  let order_id = req.params.order_id;

  if (req.body.order_status) {
    let order = await Order.getOrderWithId(order_id);
    let new_status_str = req.body.order_status;

    if (Object.keys(Order.STATUS_MAP).includes(new_status_str)) {
      order.status = parseInt(new_status_str);

      let returnStatus = await Order.updateOrderDetails(order); // Update order details
      if (!returnStatus) {
        console.log("Failed to update order details");

      } else {
        // Send MQTT message to IoT devices to update order status
        mqtt_client.publish("toDevice_order",
          JSON.stringify({
            action: "update_order_status",
            table_num: order.table_number,
            order_status: order.status // int
          }),
          (err) => console.log("Error publishing to 'toDevice_order': ", err)
        );

        return res.send("Successfully updated order details");
      }
    }
  }

  return res.status(400).send("The request sent must contain the correct order_status!");

});


module.exports = router;
