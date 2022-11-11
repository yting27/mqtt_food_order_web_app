var express = require('express');
var router = express.Router();
const { DateTime } = require("luxon");
var db_access = require('../database/access')


/* GET order list. */
router.get('/', function (req, res, next) {
  let _db = db_access.getDB();

  let orderList = [
    { order_id_str: "#0001", order_id: 1, created_at: DateTime.now().toFormat('LLL d, yyyy, HH:mm:ss'), table_num: 10, total_amount: 25.36, status: "Ready" },
    { order_id_str: "#0002", order_id: 2, created_at: DateTime.now().toFormat('LLL d, yyyy, HH:mm:ss'), table_num: 5, total_amount: 32.86, status: "Served" },
    { order_id_str: "#0003", order_id: 3, created_at: DateTime.now().toFormat('LLL d, yyyy, HH:mm:ss'), table_num: 2, total_amount: 65.52, status: "Preparing" },
    { order_id_str: "#0004", order_id: 4, created_at: DateTime.now().toFormat('LLL d, yyyy, HH:mm:ss'), table_num: 3, total_amount: 78.45, status: "Queuing" },
    { order_id_str: "#0005", order_id: 5, created_at: 'Nov 11, 2022, 22:08:20', table_num: 6, total_amount: 125.6, status: "Queuing" },
  ]

  res.render("pages/orders", { title: 'Orders', orderList: orderList });
});

/* GET order list. */
router.get('/:order_id', function (req, res, next) {
  let order_id = req.params.order_id;

  // Get order details
  let order = {
    //...
  }

  res.render("pages/orderDetails", { title: `#00123 Order Details` });
});

module.exports = router;
