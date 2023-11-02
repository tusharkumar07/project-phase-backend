const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { ProductTable, UserTable, PaymentTable } = require("./schema");

const app = express();
app.use(bodyParser.json());

var currentUser = "Unknown";

mongoose
  .connect("mongodb+srv://tusharkumar:WsON62M1bESbVfH9@cluster0.v6urapj.mongodb.net/")
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(`Error in connecting : ${err}`);
  });

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", async (req, res) => {
  const { name, contact, email, orders } = req.body;
  var flag = 1;
  while (flag) {
    try {
      const newUser = new UserTable({
        id: (Math.random() * 1000000).toFixed(0),
        name: name,
        email: email,
        contact: contact,
        orders: orders,
      });
      await newUser.save();
      flag = 0;
      console.log(newUser);
      res.status(201).send("Registered Successfully");
    } catch (err) {
      if (err.keyValue.email) {
        console.log(err);
        flag = 0;
        res.status(409).send("Invalid User");
      } else if (err.keyValue.id) {
        flag = 1;
      }
    }
  }
});

app.get("/userDetails", async (req, res) => {
  try {
    const foundUser = await UserTable.find({ name: req.query.name });
    if (foundUser.length > 0) {
      console.log(`User Found : ${foundUser[0]}`);
      res.status(200).send(foundUser[0]);
    } else {
      console.log("No User Found");
      res.status(404).send(false)
    }
  } catch (err) {
    console.log(`Error in Finding detail : ${err}`);(
    res.status(500).send(false)
)}
});

app.get("/all", (req, res) => {
  const foundUser = UserTable.find();
  res.status(200).send(foundUser);
});

app.get("/changeUser", (req, res) => {
  currentUser = req.body.username;
});

app.get("/currentUser", (req, res) => {
  const foundUser = UserTable.find({ email: currentUser });
  if (foundUser.length > 0) {
    res.status(200).send(foundUser[0]);
  } else {
    res.status(401).send("User not found");
  }
});

app.post("/addProduct", function (req, res) {
  const { id, price, imageUrl, quantity } = req.body;
  const newProduct = new ProductTable({
    id: id,
    price: price,
    imageUrl: imageUrl,
    quantity: quantity,
  });
  newProduct.save().then(() => {
    res.status(201).send("Product Added Successfully");
  });
});

app.post("/addProductToUser", (req, res) => {
  const { productId, size, qty } = req.body;
  const foundUser = UserTable.find({ email: currentUser });
  if (foundUser.length > 0) {
    foundUser[0].orders.push(productId);
    // foundUser[0].recommendation.push(productId)
    foundUser[0].save().then(() => {
      res.status(201).send("Product Added Successfully");
    });
  } else {
    res.status(401).send("User not found");
  }
});

app.listen(5000, () => {
  console.log("Server listening at 5000");
});
