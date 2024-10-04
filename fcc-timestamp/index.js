// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// timestamp API
app.get("/api/:input?", (req, res) => {
  const { input } = req.params;

  let datetime;
  // check if no datetime is provided, if so return current datetime
  if (!input) {
    datetime = new Date();
  } else {
    // check if provided unix timestamp or date
    const timestamp = input * 1000;
    const unixCheck = new Date(timestamp);
    datetime = isNaN(Date.parse(unixCheck)) ? new Date(input) : new Date(timestamp / 1000);
  };

  // format output values
  const unixString = Date.parse(datetime);
  const timeString = new Date(datetime).toUTCString();

  // check if datetime is a valid date
  if (datetime == "Invalid Date") {
    // return invalid response
    res.json({ error: "Invalid Date" });
  } else {
    // return formatted json timestamp response
    res.json({
      "unix": unixString,
      "utc": timeString
    });
  };
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
