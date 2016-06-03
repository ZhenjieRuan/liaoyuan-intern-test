/* @flow */

'use strict'

import {parseCSV} from './read.js';

type JSON = | string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key:string]: JSON };
type JSONArray = Array<JSON>;

const DS_PATH: string = './datasheets/';

var employee_list: JSONObject = parseCSV(DS_PATH + '员工名单.csv');
var tax_rate: JSONObject = parseCSV(DS_PATH + '个税税率.csv');
var five_insurance_rate: JSONObject = parseCSV(DS_PATH + '五险费率.csv');
var average_salary: JSONObject = parseCSV(DS_PATH + '本市职工月平均工资.csv');
var bonus_rate: JSONObject = parseCSV(DS_PATH + '绩效工资标准.csv');
// var average_salary: number = parseInt(parseCSV(DS_PATH + '本市职工月平均工资')[0]['本市职工月平均工资'], 10);
