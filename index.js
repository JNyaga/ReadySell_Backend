const express = require("express");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const listing = require("./routes/listing");
const users = require("./routes/users");
const user = require("./routes/user");
const auth = require("./routes/auth");
const my = require("./routes/my");
const messages = require("./routes/messages");
const expoPushTokens = require("./routes/expoPushTokens");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const mongoose = require("mongoose")
const cloudinary = require('cloudinary').v2;
const app = express();
const fs = require('fs');
const path = require('path')



const port = process.env.PORT || config.get("port");

fs.readdir('/tmp/', async (err, files) => {
  if (err) {
    console.error(err);
  } else {
    for (const file of files) {
      console.log(path.parse(file).name);
    }
  }
}
);

mongoose.set('strictQuery', false);
// console.log(config.get('db'))
console.log(config.get("assetsBaseUrl"))


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.get('db'))
    console.log(`Connected to readysell mongodb :${conn.connection.host}`)

  } catch (error) {
    console.error(`Could not connect to readysell ${error}`)
    process.exit(1)
  }
}


cloudinary.config({
  cloud_name: config.get('cloudinary_name'),
  api_key: config.get('cloudinary_api_key'),
  api_secret: config.get('cloudinary_api_secret')
});


app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use("/api/categories", categories);
app.use("/api/listing", listing);
app.use("/api/listings", listings);
app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/my", my);
app.use("/api/expoPushTokens", expoPushTokens);
app.use("/api/messages", messages);


//Connect to the database before listening
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
  });

})
