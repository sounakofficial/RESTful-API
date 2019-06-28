const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Product = require('../models/products');
const mongoose = require("mongoose");

const multer = require('multer');
const upload = multer({ dest: './uploads/' });


//v1 GET
// router.get("/", (req, res, next) => {
//   res.status(200).json({
//     messege: "Handling get requests to /orders"
//   });
// });



router.get("/", (req, res, next) => {
  Order.find()
    .select('_id product quantity')
    .populate('product', '_id name')
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
              url: 'http://localhost:3000/orders/' + doc._id
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



router.post("/", upload.single('productImage'), (req, res, next) => {
  console.log(req.file),
    Product.findById(req.body.productID)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productID
        });
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
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



router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});




router.patch("/", (req, res, next) => {
  res.status(200).json({
    messege: "Handling patch requests to /orders"
  });
});


//v1 delete
// router.delete("/", (req, res, next) => {
//   res.status(200).json({
//     messege: "Handling delete requests to /orders"
//   });
// });


router.delete("/:orderID", (req, res, next) => {
  Order.remove({ _id: req.params.orderID })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'order deleted',
        request: {
          type: 'POST',
          description: 'creating new order',
          url: 'http://localhost/orders/',
          body: { productID: 'String', quantity: 'Number' }
        }
      })
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({
          error: err
        })
    })
});

module.exports = router;
