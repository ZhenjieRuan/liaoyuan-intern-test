/* @flow */

'use strict'

var fs = require('fs');

import {Converter} from 'csvtojson';

type JSON = | string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key:string]: JSON };
type JSONArray = Array<JSON>;

export function parseCSV(path: string): JSONObject {
  var parsed : JSONObject = {};
  var converter: Object = new Converter({});

  converter.fromFile(path, (err, result: JSONObject) => {
    if (err) {
      console.log(err);
    }
    parsed = result;
    console.log(parsed);
  });

  return parsed;
}
