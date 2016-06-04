

'use strict';

/* the amount of tax that each stage will minimumly need to give */
const OVER_1500 = 45;
const OVER_4500 = 345;
const OVER_9000 = 1245;
const OVER_35000 = 7745;
const OVER_55000 = 13745;
const OVER_80000 = 22495;

module.exports.Rates = class Rates {

  constructor(data) {
    this.rates = {};
    if (data.length === 1) {
      /* tax rates */
      this.rates = data[0];
    } else if (data.length === 2) {
      /* insurances rates */
      data.forEach((elem, index) => {
        /* read in all the rates first */
        var tmp = {
          'pension': elem['养老保险'],
          'medical': elem['医疗保险'],
          'unemployment': elem['失业保险'],
          'maternity': elem['生育保险'],
          'injury': elem['工伤保险']
        };
        if (elem['类型'] === '公司') {
          this.rates['company'] = tmp;
        } else if (elem['类型'] === '个人') {
          this.rates['individual'] = tmp;
        } else {
          console.log('Rates: Invalid data (type error for five insurance)');
        }
      });
    } else {
      console.log('Rates: Invalid data');
    }
  }

  get_pension_rate(type) {
    if (typeof this.rates[type] === 'object') {
      return this.rates[type]['pension'];
    } else {
      return console.log('Wrong type');
    }
  }

  get_medical_rate(type) {
    if (typeof this.rates[type] === 'object') {
      return this.rates[type]['medical'];
    } else {
      return console.log('Wrong type');
    }
  }

  get_unemployment_rate(type) {
    if (typeof this.rates[type] === 'object') {
      return this.rates[type]['unemployment'];
    } else {
      return console.log('Wrong type');
    }
  }

  get_maternity_rate(type) {
    if (typeof this.rates[type] === 'object') {
      return this.rates[type]['maternity'];
    } else {
      return console.log('Wrong type');
    }
  }

  get_injury_rate(type) {
    if (typeof this.rates[type] === 'object') {
      return this.rates[type]['injury'];
    } else {
      return console.log('Wrong type');
    }
  }

  get_bonus(level) {
    if (typeof this.rates[level] === 'number') {
      return this.rates[level];
    } else {
      console.log('Bonus level not exist(you sure you are in our company?)');
    }
  }

  /* helper function to check if a number is in range (lower, upper] */
  between(num, lower, upper) {
    return num > lower && num <= upper;
  }

  get_tax_amount(salary) {
    /* lots of if statements */
    var result = 0;
    if (salary < 0) {
      return console.log('Invalid Salary Amount(Do you pay people to work for them???)');
    }
    /* The Rabbit said: let there only be tax for people earning over 3500 a month! */
    salary -= 3500;
    if (this.between(salary, 0, 1500)) {
      result = salary * 0.03;
    } else if (this.between(salary, 1500, 4500)) {
      result = OVER_1500 + (salary - 1500) * this.rates['1500'];
    } else if (this.between(salary, 4500, 9000)) {
      result = OVER_4500 + (salary - 4500) * this.rates['4500'];
    } else if (this.between(salary, 9000, 35000)) {
      result = OVER_9000 + (salary - 9000) * this.rates['9000'];
    } else if (this.between(salary, 35000, 55000)) {
      result = OVER_35000 + (salary - 35000) * this.rates['35000'];
    } else if (this.between(salary, 55000, 80000)) {
      result = OVER_55000 + (salary - 55000) * this.rates['55000'];
    } else {
      /* monthly salary over 80000, rich guy lol */
      result = OVER_80000 + (salary - 80000) * this.rates['80000'];
    }
    return result;
  }

  calculate_insurances_details(salary, housing_fund_rate, type) {
    var insurances_details = {};
    insurances_details = {
      /* limit the number to decimal place 2 */
      'pension': salary * this.get_pension_rate(type),
      'medical': salary * this.get_medical_rate(type),
      'unemployment': salary * this.get_unemployment_rate(type),
      'maternity': salary * this.get_maternity_rate(type),
      'injury': salary * this.get_injury_rate(type),
      'housing_fund': salary * housing_fund_rate
    };
    return insurances_details;
  }
  get_insurances_details(salary, average_salary, housing_fund_rate) {
    var insurances_total = {};
    if (salary >= 3 * average_salary) {
      insurances_total['company'] = this.calculate_insurances_details(3 * average_salary, housing_fund_rate, 'company');
      insurances_total['individual'] = this.calculate_insurances_details(3 * average_salary, housing_fund_rate, 'individual');
    } else if (salary <= 0.6 * average_salary) {
      insurances_total['company'] = this.calculate_insurances_details(0.6 * average_salary, housing_fund_rate, 'company');
      insurances_total['individual'] = this.calculate_insurances_details(0.6 * average_salary, housing_fund_rate, 'individual');
    } else {
      insurances_total['company'] = this.calculate_insurances_details(salary, housing_fund_rate, 'company');
      insurances_total['individual'] = this.calculate_insurances_details(salary, housing_fund_rate, 'individual');
    }
    return insurances_total;
  }
};