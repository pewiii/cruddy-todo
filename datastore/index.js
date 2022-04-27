const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, id) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        callback(err, {id, text});
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      var data = _.map(files, (file) => { //file is 00001.txt
        var id = file.slice(0, 5); //id is 00001
        return { id, text: id }; // {id: 00001, text: 00001}
      });
    }
    callback(err, data);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf-8', (err, text) => {
    callback(err, {id, text}); //{id: 00001, text: 'dosomething'}
  });
};

exports.update = (id, text, callback) => {
  // make sure file exists
    //if theres an error then callback the error
    //overwrite the file with the updated file
    //callback error object

  fs.access(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        callback(err, {id: id, text: text});
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
