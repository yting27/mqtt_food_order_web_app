var express = require('express');
var router = express.Router();
const { DateTime } = require("luxon");
const { Order } = require('../models/Order');

/* GET order list. */
router.get('/', async function (req, res, next) {
  let orderArray = await Order.getAllOrders();
  let orderJSObject = Order.convertOrderArrayToJSON(orderArray);

  // console.log(orderJSObject);

  // for (let order of orderArray) {
  //   Order.updateOrderDetails(order);
  // }

  res.render("pages/orders", { 
    title: 'Orders', 
    orderList: orderJSObject 
  });

});


/* GET order details. */
router.get('/:order_id', async function (req, res, next) {
  let order_id = req.params.order_id;

  // Get order details
  let orderJS = (await Order.getOrderWithId(order_id)).toJSON()

  // console.log(orderJS);

  res.render("pages/orderDetails", { 
    title: `#00123 Order Details`, 
    orderDetails: orderJS 
  });

});


module.exports = router;
