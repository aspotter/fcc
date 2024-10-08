const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// connect to mongoose cluster
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// assign and create user and exercise schema and models
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String
});
const userModel = mongoose.model('USER', userSchema);

const exerciseSchema = new Schema({
  userId: String,
  description: String,
  duration: Number,
  date: Date
});
const exerciseModel = mongoose.model('EXERCISE', exerciseSchema);


app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// parse request body data
app.use(express.urlencoded({ extended: false }));

// POST create new user from form
app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const newUser = userModel.create({
    username: username
  }, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      // return json username and id
      res.json({
        'username': user.username,
        '_id': user._id
      });
    };
  });
});

// GET request to return array of all users
app.get('/api/users', (req, res) => {
  const getUsers = userModel.find({}, (err, users) => {
    if (err) {
      console.error(err);
    } else {
      res.json(users);
    };
  });
});

// POST create new exercise record from form
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  // if no date is supplied, the current date will be used. format datestring
  const d = (!date) ? new Date() : new Date(date);

  const newExercise = exerciseModel.create({
    userId: _id,
    description: description,
    duration: duration,
    date: d
  }, (err, exercise) => {
    if (err) {
      console.error(err)
    };
  });

  // lookup username from _id in users db for return json
  const userLookup = userModel.findOne({ _id: _id }, (err, user) => {
    if (err) {
      console.error(err);
    } else if (!user) {
      console.log('User not found');
    } else {
      res.json({
        'username': user.username,
        'description': description,
        'duration': Number(duration),
        'date': d.toDateString(),
        '_id': _id
      });
    };
  });
});

// GET exercise logs for a user _id
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  // lookup username from _id
  const userLookup = userModel.findById(_id, (err, user) => {
    if (err) {
      console.error(err);
    } else if (!user) {
      console.log('User not found');
    } else {
      const username = user.username;

      // set up query filters
      let filter = {
        userId: _id
      };
      // add date ranges to filter if given
      if (from || to) {
        let dateQuery = {};
        if (from) {
          dateQuery['$gte'] = from;
        };
        if (to) {
          dateQuery['$lte'] = to;
        };
        filter.date = dateQuery;
      };

      // set up query for if a limit is provided
      const l = parseInt(limit);
      let query = exerciseModel.find(filter);
      if (l && l > 0) {
        query = query.limit(l);
      };

      // look up logs for user
      const logLookup = query.exec((err, logs) => {
        if (err) {
          console.error(err);
        } else {
          const exerciseCount = logs.length;
          const formattedLogs = logs.map(e => ({
            'description': e.description,
            'duration': e.duration,
            'date': e.date.toDateString()
          }));
          res.json({
            'username': username,
            'count': exerciseCount,
            '_id': _id,
            'log': formattedLogs
          });
        };
      });
    };
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
