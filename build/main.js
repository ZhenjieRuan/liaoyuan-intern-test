

'use strict';

import { parseCSV } from './read.js';

const DS_PATH = './datasheets/';

var employee_list = parseCSV(DS_PATH + '员工名单.csv');
var tax_rate = parseCSV(DS_PATH + '个税税率.csv');
var five_insurance_rate = parseCSV(DS_PATH + '五险费率.csv');
var average_salary = parseCSV(DS_PATH + '本市职工月平均工资.csv');
var bonus_rate = parseCSV(DS_PATH + '绩效工资标准.csv');
// var average_salary: number = parseInt(parseCSV(DS_PATH + '本市职工月平均工资')[0]['本市职工月平均工资'], 10);