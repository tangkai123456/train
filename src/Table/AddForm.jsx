import React, { Component } from 'react';
import { Form, Button, Select, Input, message } from 'antd';

const { Item: FormItem } = Form;
const { Option } = Select;

class AddForm extends Component {
  state = {
    type: [],
  }

  componentDidMount() {
    this.fetchType();
  }

  fetchType = () => {
    window.fetch('http://localhost:7001/api/dict/type', {
      method: 'get',
      type: 'json',
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const { list } = res;
        this.setState({
          type: list,
        })
        return res;
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, selectedRow } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let method = selectedRow ? "put" : "post";
        window.fetch('http://localhost:7001/api/train', {
          method: method,
          type: 'json',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.code === 200) {
              message.success("保存成功");
              this.props.onSubmit();
            }
            if (res.sqlState === "23000") {
              message.warning("车号重复");
            }
          })
      }
    })
  }
  render() {
    const { selectedRow = {}, form } = this.props;
    const { getFieldDecorator } = form;
    const { type } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="车号"
        >
          {getFieldDecorator('code', {
            rules: [{
              required: true, message: '必填',
            }],
            initialValue: selectedRow.code,
          })(
            <Input disabled={!!selectedRow.code} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="车型"
        >
          {getFieldDecorator('type', {
            initialValue: selectedRow.type,
          })(
            <Select>
              {
                type.map(({ name }) => (<Option value={name} key={name}>{name}</Option>))
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="厂修"
        >
          {getFieldDecorator('cx', {
            initialValue: selectedRow.cx,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="段修"
        >
          {getFieldDecorator('dx', {
            initialValue: selectedRow.dx,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="辅修"
        >
          {getFieldDecorator('fx', {
            initialValue: selectedRow.fx,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="故障信息"
        >
          {getFieldDecorator('hitch', {
            initialValue: selectedRow.hitch,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(AddForm);
