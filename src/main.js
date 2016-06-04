/* @flow */

'use strict'

var readline = require('readline-sync');
var fs = require('fs');

import {parse_csv} from './parse'; /* parser for csv file, convert it to JSON */

import {Employee} from './employee'; /* Employee class holds info about individual employee(base_salary etc.) */

import {Rates} from './rates'; /* Rates is a pseudo-overloadded class to hold varies rates like insurance rates etc.,
                                * provides helper functions to make calculation easy */

type JSON = | string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key:string]: JSON };
type JSONArray = Array<JSON>;

const DS_PATH: string = './datasheets/';

var manual = false;

var average_salary: number;
var tax: Rates;
var bonus: Rates;
var insurances_rates: Rates;

console.log(
  '|====================================|\n\
|                                    |\n\
|       Salary Detail Calculator     |\n\
|                                    |\n\
|====================================|\n');
console.log('Welcome!\n');


parse_csv(DS_PATH + '个税税率.csv', (err, result: Array<JSONObject>) => {
  if (err) {
    return console.log(err);
  }
  tax = new Rates(result);
});

parse_csv(DS_PATH + '五险费率.csv', (err, result: Array<JSONObject>) => {
  if (err) {
    return console.log(err);
  }
  insurances_rates = new Rates(result);
});

parse_csv(DS_PATH + '绩效工资标准.csv', (err, result: Array<JSONObject>) => {
  if (err) {
    return console.log(err);
  }
  bonus = new Rates(result);
});

parse_csv(DS_PATH + '本市职工月平均工资.csv', (err, result: Array<JSONObject>) => {
  if (err) {
    return console.log(err);
  }
  average_salary = result[0]['本市职工月平均工资'];
  /*
   * all necessary files are being parsed before this point
   */
  var finished = false;
  while (!finished) {
    var flag = false;
    var mode = readline.question('Enter auto to automatically read csv file for employee info, or enter manual to manually input info, or exit to quit:\n');
    if (mode === 'exit') {
      finished = true;
      return console.log('\nTHank you for using!');
    }
    var to_csv = readline.question('Export to CSV(yes, no): ');
    if (to_csv === 'yes') {
      flag = true;
      // writing headers
      var insurances_fields = "'姓名','养老','医疗','失业','生育','工伤','住房','总计'\n";
      var income_fields = "'姓名','岗位工资','绩效工资','五险一金（个人）','五险一金（单位）','税前收入','扣税','税后收入'\n";
      fs.writeFileSync('datasheets/insurances_details.csv', insurances_fields);
      fs.writeFileSync('datasheets/income_details.csv', income_fields);
    }
    if (mode === 'manual') {
      var data = get_manual_employee_data();
      var employee = new Employee(data);
      employee.calculate_income_details(insurances_rates, tax, bonus, average_salary, flag);
    } else if (mode === 'auto') {
      /* all other files will be parsed before this because this is the last I/O request in the queue */
      parse_csv(DS_PATH + '员工名单.csv', (err, result: Array<JSONObject>) => {
        if (err) {
          return console.log(err);
        }
        result.forEach((data: JSONObject, index) => {
          var employee = new Employee(data);
          employee.calculate_income_details(insurances_rates, tax, bonus, average_salary, flag);
        });
        return console.log('\nThank you for using!');
      });
      finished = true;
    } else {
      console.log('\nError, mode not supported\n');
    }
  }
});

function get_manual_employee_data() {
  var re = RegExp('^[0-9]*\.[0-9]*$');
  var name = readline.question('姓名(Name): ');
  var base_salary = readline.question('基本工资(Base Salary): ');
  while (!re.test(base_salary)) {
    console.log('Base salary must be a valid number');
    base_salary = readline.question('基本工资(Base Salary): ');
  }
  re = RegExp('^[ABCD]$');
  var rating = readline.question('绩效评分(Rating): ');
  while (!re.test(rating)) {
    console.log('Rating must be one of A, B, C, D');
    rating = readline.question('绩效评分(Rating): ');
  }
  var housing_fund_rate = parseFloat(readline.question('公积金(Housing Fund Rate):  '), 10);
  while (housing_fund_rate > 0.08 || housing_fund_rate < 0) {
    console.log('Housing Fund Rate must in range 0 - 0.08');
    housing_fund_rate = parseFloat(readline.question('公积金(Housing Fund Rate):  '), 10);
  }

  return {
    '姓名': name,
    '基本工资': parseFloat(base_salary,10),
    '绩效评分': rating,
    '公积金': parseFloat(housing_fund_rate,10)
  };
}
