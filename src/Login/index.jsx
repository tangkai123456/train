import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { createBrowserHistory  } from 'history';
import styles from './index.scss';

const FormItem = Form.Item;

const history = createBrowserHistory();

function handleSubmit() {
  history.push("/table");
}

function Login(props) {
  const { getFieldDecorator } = props.form;
  return (
    <div className={styles.root}>
      <Form onSubmit={handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
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
