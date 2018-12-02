import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import sha1 from 'sha1';
import styles from './index.scss';

const FormItem = Form.Item;

function handleSubmit(props) {
  return (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        window.fetch('http://localhost:7001/api/user/login', {
          method: 'post',
          type: 'json',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...values,
            operatorPwd: sha1(values.operatorPwd),
          }),
        })
          .then(res => res.json())
          .then(res => {
            if (res.code === 200) {
              props.history.push('/table')
            } else {
              message.warning("登录失败");
            }
          })
      }
    })
  }
}

function Login(props) {
  const { getFieldDecorator } = props.form;
  return (
    <div className={styles.root}>
      <Form onSubmit={handleSubmit(props)} className="login-form">
        <FormItem>
          {getFieldDecorator('operatorName', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('operatorPwd', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />,
          )}
        </FormItem>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
          </Button>
      </Form>
    </div>
  );
}

export default Form.create()(Login);
