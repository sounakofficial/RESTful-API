const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const mongoose = require("mongoose");


//v1 GET
// router.get("/", (req, res, next) => {
//   res.status(200).json({
//     messege: "Handling get requests to /orders"
//   });
// });



router.get("/", (req, res, next) => {
  Order.find()
    .exec()
    .then(doc => {
      res.status(200).json({
        count: doc.length,
        orders: doc.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/order/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({ error: err })
    })
});



// v1 post
// router.post("/", (req, res, next) => {
//   const order = {
//     productID: req.body.productID,
//     quantity: req.body.quantity
//   };
//   res.status(200).json({
//     messege: "Handling post requests to /orders",
//     ordered: order
//   });
// });



router.post("/", (req, res, next) => {
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    product: req.body.productID,
    quantity: req.body.quantity
  });
  order
    .save()
    .then(result => {
      console.log(result),
        res.status(201).json({
          message: "order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/order/' + result._id
          }
        })
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({ error: err })
    })
});



//v1 get/id
// router.get("/:orderID", (req, res, next) => {
//   const id = req.params.orderID;
//   if (id == "special") {
//     res.status(200).json({
//       message: "discovered special ID",
//       id: id
//     });
//   } else {
//     res.status(200).json({
//       message: "discovered special ID",
//       id: id
//     });
//   }
// });



router.get("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  Order.findById(id)
    .exec()
    .then(result => {
      res.status(200).json({
        product: result,
        request: {
          type: 'GET',
          description: 'get all orders',
          url: 'http://localhost:3000/order/'
        }
      })
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
});



router.patch("/", (req, res, next) => {
  res.status(200).json({
    messege: "Handling patch requests to /orders"
  });
});

router.delete("/", (req, res, next) => {
  res.status(200).json({
    messege: "Handling delete requests to /orders"
  });
});

module.exports = router;
