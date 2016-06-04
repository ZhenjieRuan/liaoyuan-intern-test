/* @flow */

'use strict'

var fs = require('fs');

import {Converter} from 'csvtojson';

type JSON = | string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key:string]: JSON };
type JSONArray = Array<JSON>;

module.exports.parse_csv = (path: string, callback: Function) => {
  var converter: Object = new Converter({
    ignoreEmpty: true
  });

  converter.fromFile(path, (err, result: JSONArray) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });

}
