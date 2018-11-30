'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async get() {
    const data = await this.app.mysql.query('select * from user'); // 单实例可以直接通过 app.mysql 访问
    this.ctx.body = 'hi, egg' + data;
    this.ctx.body = { list: data, totalRecord: 25 };
  }
}

module.exports = HomeController;
