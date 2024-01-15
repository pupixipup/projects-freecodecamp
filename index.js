require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Url = require("./Model/Url")

// Basic Configuration
const port = process.env.PORT || 3000;

const connection = mongoose.connect(process.env.MONGO_URL);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", async function(req, res) {
  const url = req.body.url;
  if (!isValidUrl(url)) {
    res.json({error: "invalid url"});
    return;
  }
  const existingUrl = await Url.findOne( {original_url: url }).exec();
  if (existingUrl) {
    res.json({ original_url: existingUrl.original_url, short_url: existingUrl.position});
    return;
  }
  const createdUrl = await Url.create({original_url: url});
  res.json({ original_url: createdUrl.original_url, short_url: createdUrl.position});
})

app.get("/api/shorturl/:id", async function(req, res) {
  const id = req.params.id;
  const url = await Url.findOne({position: id}).exec();
  if (url) {
    res.redirect(url.original_url);
    return;
  }
  res.json({error: "Url not found"});
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function isValidUrl(url) {
  const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/\S*)?$/;
  return urlRegex.test(url);
}
