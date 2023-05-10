const express = require("express");
const stripe = require("stripe")(
  'sk_test_51N1D5fCpMD00KRTn0bLuW6d0wv26r0pUvVHoHSfBFFWxLbqmUEBLBoIy0e66gsECwgxFWy6C5AmS2CHzSDZIyK1I00gJRkQYDU'
);
const app = express();
const port = 3000;
var db = require("../database");
const cors = require("cors");

app.use(express.json());
app.use(cors());


// Define customers list
app.get("/customers", (req, res) => {
  db.connection.query(db.allCustomers, (err, result) => {
    if (err) console.log(err.message);
    else res.json(result);
  });
});
// get category list
app.get("/category", (req, res) => {
  db.connection.query(db.getCategory, (err, result) => {
    if (err) console.log(err.message);
    else res.json(result);
  });
});
// add a new customer
app.post("/customers", (req, res) => {
  var { name, email } = req.body;
  db.connection.query(db.newCustomer, [name, email], (err, result) => {
    if (err) console.log(err.message);
    else {
      console.log("hello");
      res.status(200).send("inserted successfully");
    }
  });
});
// get a list of products
app.get("/products", (req, res) => {
  db.connection.query(db.getProducts, (err, result) => {
    if (err) console.log(err.message);
    else res.json(result);
  });
});
//add a product
app.post("/products", (req, res) => {
  const { name_product, price, quantity, image_url, idcategory } = req.body;

  db.connection.query(
    "SELECT * FROM products WHERE name_product = ?",
    [name_product],
    (err, result) => {
      if (err) throw err;

      if (result.length) {
        // Product already exists, update only the quantity
        const newQuantity = result[0].quantity + Number(quantity);
        db.connection.query(
          db.updateProduct,
          [newQuantity, name_product],
          (err, result) => {
            if (err) throw err;
            res.send("Product quantity updated!");
          }
        );
      } else {
        // Product doesn't exist, insert the new product
        db.connection.query(
          db.addProduct,
          [name_product, price, quantity, image_url, idcategory],
          (err, result) => {
            if (err) throw err;
            res.send("Product added to database!");
          }
        );
      }
    }
  );
});
//modify quantity of products after purchase operation
app.put("/products", (req, res) => {
  const { soldQuantity, productsid } = req.body;
  db.connection.query(
    db.quantityAfterPurchase,
    [soldQuantity, productsid],
    (err, result) => {
      if (err) console.log(err.message);
      else {
        res.status(200).send("updated");
      }
    }
  );
});

//record orders
app.post("/order", (req, res) => {
  const { orderdate, totalprice, id_customers } = req.body;
  db.connection.query(
    db.newOrder,
    [orderdate, totalprice, id_customers],
    (err, result) => {
      if (err) console.log(err.message);
      else {
        res.status(200).send("new order inserted");
      }
    }
  );
});
//get orders list
app.get("/order", (req,res)=>{
  var sql= "SELECT * FROM orders"
  db.connection.query(sql,(err,result)=>{
    err?console.log(err):res.status(200).json(result)
  })
})
//get last orderId
app.get("/order/id", (req, res) => {
  db.connection.query(db.getLastOrderId, (err, result) =>
    err ? console.log(err.message) : res.status(200).json(result[0].id_orders)
  );
});
//insert new orderItem
app.post("/order/items", (req, res) => {
  const { idproducts, order_id, quantity, price } = req.body;
  db.connection.query(
    db.newOrderItem,
    [idproducts, order_id, quantity, price],
    (err, result) => {
      if (err) console.log(err.result);
      else {
        res.status(200).send("order item inserted");
      }
    }
  );
});
//get the list of orderItems
app.get("/orderItems",(req,res)=>{
var sql='SELECT * FROM orderitems'
db.connection.query(sql,(err,result)=>{
  err?console.log(err):res.status(200).json(result)
})
})
// payment with stripe


app.post('/create-payment-intent', async (req, res) => {
  const {amount}=req.body
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });
    res.status(200).json({ paymentIntent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating payment intent' });
  }})

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
