'use strict';

const Controller = require('egg').Controller;

class DictController extends Controller {
  async type() {
    const data = await this.app.mysql.query('SELECT * FROM type');
    this.ctx.body = { list: data };
  }
}

module.exports = DictController;
