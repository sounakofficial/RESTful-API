const express = require("express");
const router = express.Router();

const Product = require("../models/products");
const mongoose = require("mongoose");


const multer = require('multer');
//const upload = multer({ dest: './uploads/' });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploadData/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});


//V1 GET
// router.get("/", (req, res, next) => {
//   res.status(200).json({
//     messege: "Handling get requests to /products"
//   });
// });


//V2 GET
// router.get("/", (req, res, next) => {
//   Product.find()
//     .exec()
//     .then(doc => {
//       console.log(doc);
//       res.status(200).json(doc);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });


router.get("/", (req, res, next) => {
  Product.find()
    .select('_id name price productImage')
    .exec()
    .then(doc => {
      const response = {
        count: doc.length,
        products: doc.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//V1 of post
// router.post("/", (req, res, next) => {
//   const product = {
//     name: req.body.name,
//     price: req.body.price
//   };
//   res.status(200).json({
//     messege: "Handling post requests to /products",
//     created: product
//   });
// });

router.post("/", upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(results => {
      console.log(results);
      res.status(200).json({
        messege: "Product created successfully",
        created: {
          _id: results._id,
          name: results.name,
          price: results.price,
          productImage: results.productImage
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + results._id
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

// V1 post/:product ID
// router.get("/:productID", (req, res, next) => {
//   const id = req.params.productID;
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

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'GET all products',
            url: 'http://localhost:3000/products/'
          }
        });
      } else {
        res.status(404).json({
          messege: "No valid entry found for given ID"
        });
      }
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({
          error: err
        });
    });
});

//V1 patch
// router.patch("/", (req, res, next) => {
//   res.status(200).json({
//     messege: "Handling patch requests to /products"
//   });
// });

router.patch("/:productID", (req, res, next) => {
  const id = req.params.productID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  //use if update both always
  //Product.update({_id:id},{$set:{name:req.body.newName,price:req.body.newPrice}});
});

//v1 delete
// router.delete("/", (req, res, next) => {
//   res.status(200).json({
//     messege: "Handling delete requests to /products"
//   });
// });

router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: 'POST',
          description: "adding new products",
          url: 'http://localhost:3000/products/',
          body: {
            name: 'String', price: 'Number'
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
