const mongoose = require('mongoose');

function connectDB(callback) {
  const mongoURL = 'mongodb://localhost/is-the-matrix-on';
  mongoose.connect(mongoURL);
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'Connection Error:'));
  db.once('open', function() {
    callback(db);
  });
}

function createModel() {
  const Schema = mongoose.Schema;
  const modelSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Show name is required.'],
    },
    channel: {
      type: String,
      required: [true, 'Channel name is required.'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required.'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required.'],
    },
    current: {
      type: Boolean,
      required: [true, 'Current status is required.'],
    },
  });
  const model = mongoose.model('Shows', modelSchema);

  return model;
}

function retrieveCurrentShows(model, db, callback) {
  model.find({ 'current': true }), function(err, docs) {
    if (err) {
      console.error('Error with retrieving current shows:', err);
    }

    callback(docs);
  }
}

function retrieveAllShowsForStartTime(time, model, db, callback) {
  model.find({ 'startTime': time }, function(err, docs) {
    if (err) {
      console.error('Error with retrieving shows by time:', err);
    }

    callback(docs);
  });
}

function addShow(show, model, db, callback) {
  const newShow = new model({
    show: show.showName,
    channel: show.channel,
    startTime: show.startTime,
    endTime: show.endTime,
  });

  newShow.save(function(err) {
    if (err) {
      console.error('Error with writing data:', err);
    }

    callback(null);
  });
}

function disconnectDB() {
  mongoose.disconnect();
}

module.exports.connectDB = connectDB;
module.exports.createModel = createModel;
module.exports.addShow = addShow;
module.exports.retrieveCurrentShows = retrieveCurrentShows;
module.exports.retrieveAllShowsForStartTime = retrieveAllShowsForStartTime;
module.exports.disconnectDB = disconnectDB;
