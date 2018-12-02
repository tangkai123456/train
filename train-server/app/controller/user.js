'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { operatorName, operatorPwd } = this.ctx.request.body;
    const data = await this.app.mysql.get('operator', { operatorName, operatorPwd });
    if (data) {
      this.ctx.body = { code: 200, data };
    } else {
      this.ctx.body = { code: 403, data };
    }
  }
}

module.exports = UserController;
