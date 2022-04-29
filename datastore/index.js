const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const util = require('util');
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

var readdir = util.promisify(fs.readdir);
var readFile = util.promisify(fs.readFile);

exports.readAll = (callback) => {
  return readdir(exports.dataDir)
    .then((files) => {
      Promise.all(files.map((file) => {
        return readFile(exports.dataDir + '/' + file, 'utf-8');
      }))
        .then((promises) => {
          Promise.all(promises)
            .then((texts) => {
              callback(null, files.map((file, index) => {
                return { id: file.slice(0, 5), text: texts[index] };
              }));
            });
        });
    });

};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf-8', (err, text) => {
    callback(err, {id, text}); //{id: 00001, text: 'dosomething'}
  });
};

exports.update = (id, text, callback) => {
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
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    callback(err);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
