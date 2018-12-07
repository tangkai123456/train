'use strict';

const Controller = require('egg').Controller;

const model = {
  code: String,
  type: String,
  cx: String,
  dx: String,
  fx: String,
  hitch: String,
};

class ListController extends Controller {
  async list() {
    const { search, page, pageSize } = this.ctx.query;
    const where = Object.keys(model).map(item => `\`${item}\` like '%${search}%'`).join(' or ');
    let selectSql = 'select * from ksc';
    let countSql = 'select count(*) from ksc';
    if (search) {
      selectSql += ` where ${where}`;
      countSql += ` where ${where}`;
    }
    selectSql += ` order by \`create_time\` DESC limit ${(page - 1) * pageSize},${page * pageSize}`;
    const [{ 'count(*)': count }] = await this.app.mysql.query(countSql);
    const data = await this.app.mysql.query(selectSql);
    this.ctx.body = { list: data, total: count };
  }
  async add() {
    const { body } = this.ctx.request;
    const data = await this.app.mysql.insert('ksc', { ...body, create_time: new Date() });
    this.ctx.body = { code: 200, data };
  }
  async update() {
    const { id, ...extra } = this.ctx.request.body;
    const data = await this.app.mysql.update('ksc', extra, { where: { id } });
    this.ctx.body = { code: 200, data };
  }
  async delete() {
    const { codeList } = this.ctx.request.body;
    const sql = `DELETE FROM KSC WHERE id in (${codeList.map(item => `'${item}'`).join(',')})`;
    const data = await this.app.mysql.query(sql);
    this.ctx.body = { code: 200, data };
  }
}

module.exports = ListController;
