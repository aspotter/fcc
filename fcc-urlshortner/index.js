require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dns = require('dns');
const { read } = require('fs');
const url = require('url');

// connect to mongoose cluster
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// assign and create URL schema
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  url: String,
  index: Number
});

// convert schema to model
const urlModel = mongoose.model("URL", urlSchema);


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// parse request body data
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Shortcut URL API POST
app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  // isolate hostname from URL for DNS check
  const u = new URL(url);
  const hostname = u.hostname;

  // check if URL is valid via DNS lookup
  const dnsLookUp = dns.lookup(hostname, (err, address) => {
    // return error json if url is invalid
    if (!address) {
      res.json({ error: 'invalid url' });
    } else {
      // check if db collection is empty
      const urlCount = urlModel.countDocuments({}, (err, count) => {
        if (err) {
          console.error(err);
        } else if (count === 0) {
          // create first entry into db
          const firstURL = urlModel.create({
            url: url,
            index: 0
          });
          res.json({
            original_url: url,
            short_url: 0
          });
        } else {
          // check if url is already in db
          const urlQuery = urlModel.findOne({ url: url }, (err, doc) => {
            if (err) {
              console.error(err);
            } else if (doc) {
              // return url details from db
              res.json({
                original_url: doc.url,
                short_url: doc.index
              });
            } else {
              // find current max value for short_url/index
              const maxIndex = urlModel.findOne({}, { index: 1 })
                .sort({ index: -1 })
                .exec((err, doc) => {
                  if (err) {
                    console.error(err);
                  } else {
                    const newIndex = doc.index + 1
                    // add url to db, increment current max index
                    const newURL = urlModel.create({
                      url: url,
                      index: newIndex
                    });
                    res.json({
                      original_url: url,
                      short_url: newIndex
                    })
                  };
                });
            };
          })
        };
      });
    };
  });
});

// ShortURL redirect API
app.get('/api/shorturl/:number', (req, res) => {
  const findURL = urlModel.findOne({index: req.params.number}, (err, url) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect(url.url);
    };
  })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
