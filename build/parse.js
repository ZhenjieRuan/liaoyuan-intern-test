

'use strict';

var fs = require('fs');

import { Converter } from 'csvtojson';

module.exports.parse_csv = (path, callback) => {
  var converter = new Converter({
    ignoreEmpty: true
  });

  converter.fromFile(path, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};