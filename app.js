const express = require('express');
const app = express();
const port= process.env.port || 5000;
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv=require('dotenv');
const path = require("path");
const connectDB = require('./config/db');
dotenv.config();

connectDB();

app.use(cors())
require('./models/model')
require('./models/post')

app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))


// app.use(express.static(path.join(__dirname, "./frontend/build")))

// app.get("*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "./frontend/build/index.html"),
//     function (err) {
//       res.status(500).send(err)
//     }
//   )
// })

app.listen(port, () => {
  console.log("Server is running on " + port);
})
