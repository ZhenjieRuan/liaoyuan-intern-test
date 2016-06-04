

'use strict';

var fs = require('fs');
import { Rates } from './rates';

module.exports.Employee = class Employee {
  constructor(data) {
    if (data !== {}) {
      if (typeof data['姓名'] === 'string' && typeof data['基本工资'] === 'number' && typeof data['绩效评分'] === 'string' && typeof data['公积金'] === 'number') {
        this.name = data['姓名'];
        this.base_salary = data['基本工资'];
        this.rating = data['绩效评分'];
        this.housing_fund_rate = data['公积金'];
      } else {
        console.log('Data type error!');
      }
    } else {
      console.log('Data is null!');
    }
  }

  get_name() {
    return this.name;
  }

  get_base_salary() {
    return this.base_salary;
  }

  get_rating() {
    return this.rating;
  }

  get_housing_fund_rate() {
    return this.housing_fund_rate;
  }

  /* round number to specific decimal place */
  round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  calculate_income_details(insurances_rates, tax, bonus, average_salary, csv) {
    // console.log(insurances_rates);
    var _bonus = bonus.get_bonus(this.get_rating());
    var insurances_details = insurances_rates.get_insurances_details(this.get_base_salary(), average_salary, this.get_housing_fund_rate());
    var insurances_total_individual = 0;
    var insurances_total_company = 0;
    var name = this.get_name();
    var insurances = {};

    for (var key in insurances_details['individual']) {
      insurances_total_individual += insurances_details['individual'][key];
    }
    for (var key in insurances_details['company']) {
      insurances_total_company += insurances_details['company'][key];
    }

    var before_tax = this.get_base_salary() + _bonus - insurances_total_individual;
    var _tax = tax.get_tax_amount(this.get_base_salary() + _bonus - insurances_total_individual);

    // console.log(insurances_details);

    insurances[name] = {
      '养老': insurances_details['individual']['pension'],
      '医疗': insurances_details['individual']['medical'],
      '失业': insurances_details['individual']['unemployment'],
      '生育': insurances_details['individual']['maternity'],
      '工伤': insurances_details['individual']['injury'],
      '住房': this.round(insurances_details['individual']['housing_fund'], 2),
      '总计': this.round(insurances_total_individual, 2)
    };

    insurances['company'] = {
      '养老': insurances_details['company']['pension'],
      '医疗': insurances_details['company']['medical'],
      '失业': insurances_details['company']['unemployment'],
      '生育': insurances_details['company']['maternity'],
      '工伤': insurances_details['company']['injury'],
      '住房': this.round(insurances_details['company']['housing_fund'], 2),
      '总计': this.round(insurances_total_company, 2)
    };

    var income_details = {
      '姓名': name,
      '岗位工资': this.get_base_salary(),
      '绩效工资': _bonus,
      '五险一金（个人）': this.round(insurances_total_individual, 2),
      '五险一金（单位）': this.round(insurances_total_company, 2),
      '税前收入': this.round(before_tax, 2),
      '扣税': this.round(_tax, 2),
      '税后收入': this.round(before_tax - _tax, 2)
    };

    console.log('=====================================\n');
    console.log('%s五险一金:\n', name);
    console.log(insurances[name]);
    console.log();
    console.log('公司五险一金:\n');
    console.log(insurances['company']);
    console.log();
    console.log('%s工资条:', name);
    console.log();
    console.log(income_details);
    console.log();

    if (csv) {
      var data_insurance_individual = '';
      var data_insurance_company = '';
      var data_income = '';
      data_insurance_individual += name + ',';
      data_insurance_company += '公司（' + name + '）' + ',';
      for (var key in insurances[name]) {
        data_insurance_individual += insurances[name][key] + ',';
      }
      for (var key in insurances['company']) {
        data_insurance_company += insurances['company'][key] + ',';
      }
      for (var key in income_details) {
        data_income += income_details[key] + ',';
      }
      fs.appendFileSync('datasheets/insurances_details.csv', data_insurance_individual + '\n');
      fs.appendFileSync('datasheets/insurances_details.csv', data_insurance_company + '\n');
      fs.appendFileSync('datasheets/income_details.csv', data_income + '\n');

      console.log('Finished writing CSV files datasheets/insurances_details.csv and datasheets/income_details.csv\n');
    }
  }
};