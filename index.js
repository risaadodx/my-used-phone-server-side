const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@dbuser1.oi3ncct.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db("recycle-me").collection("products");

    const bookingsCollection = client.db("recycle-me").collection("bookings");

    const usersCollection = client.db("recycle-me").collection("users");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    //bookings api//
    app.post("/bookings", async (req, res) => {
      const bookingSubmit = req.body;
      console.log(bookingSubmit);
      const result = await bookingsCollection.insertOne(bookingSubmit);
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });

    //users api//
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  } finally {
  }
}
run().catch((e) => console.error(e));

app.get("/", (req, res) => {
  res.send("recycleme server is running");
});
app.listen(port, () => {
  console.log(`recycleme server is running on ${port}`);
});
