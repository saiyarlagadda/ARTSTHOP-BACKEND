import express, { json } from 'express';
import cors from "cors";
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as url from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const dbURL = "mongodb+srv://dudes01:7LZQjgVx3dPKoxkh@cluster0.oms8qj2.mongodb.net/?retryWrites=true&w=majority"; //Make sure your DB is available to any IP just like HW5.
const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
//Use a database named "final"
//Use a collection named "animals"
let db = client.db("artsthop");

app.use(cors());
app.use(express.json());

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// upload one image
app.post('/uploadimage', async (req, res) => {
  try {
    let collection = await db.collection("paintings");
    let result = await collection.insertOne(req.body);
    console.log(result);
    res.status(201).json({ message: 'Painting uploaded successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

//search route
app.get('/getall', async (req, res) => {
  let collection = await db.collection("paintings");
  let results = await collection.find({})
    .limit(50)
    .toArray();
  // console.log(results);
  res.send(results).status(200);
});

// get one image
app.get("/getimage/:name", async (req, res) => {
  let collection = await db.collection("paintings");
  let result = await collection.find({ product_title: req.params.name }).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// get orders
app.get("/getorders/:emailid", async (req, res) => {
  console.log('parar', req.params.emailid)
  let collection = await db.collection("orders");
  let result = await collection.find({ email: req.params.emailid }).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// submit order
app.post('/submitorder', async (req, res) => {
  try {
    let collection = await db.collection("orders");
    let result = await collection.insertOne(req.body);
    console.log(result);
    res.status(201).json({ message: 'Order submitted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//npm run dev to start React app and Express server