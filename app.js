const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "it works"
//   });
// });

const ProductRoutes = require("./api/routes/products");
const OrderRoutes = require("./api/routes/orders");

mongoose.connect(
  "mongodb+srv://sounak1337:" +
  process.env.MONGO_ATLASS_PW +
  "@mongocluster-vklk8.mongodb.net/test?retryWrites=true&w=majority",
  {
    //useMongoClient:
    useNewUrlParser: true
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Acccess-Control-Allow-Headers",
    "Orihin, X-Requeset-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", ProductRoutes);
app.use("/orders", OrderRoutes);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
