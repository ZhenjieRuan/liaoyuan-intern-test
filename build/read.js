

'use strict';

var fs = require('fs');

import { Converter } from 'csvtojson';

export function parseCSV(path) {
  var parsed = {};
  var converter = new Converter({});

  converter.fromFile(path, (err, result) => {
    if (err) {
      console.log(err);
    }
    parsed = result;
    console.log(parsed);
  });

  return parsed;
}