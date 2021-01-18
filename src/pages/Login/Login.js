import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = ({ setUserToken, history, path }) => {
  const onFinish = async ({ username, password }) => {
    try {
      const res = await axios.post('https://192.168.1.54/v1/oauth2/token', {
        grant_type: 'password',
        username,
        password,
      });
      setUserToken(res.data.access_token);
      window.localStorage.setItem('userToken', res.data.access_token);
      history.push(`/${path}`);
    } catch (error) {
      message.error('Username or password not correct, please try again');
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
          style={{ width: 500 }}
        >
          <Form.Item
            label={
              <span>
                <FormattedMessage id="app.userName" />
              </span>
            }
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <FormattedMessage id="app.password" />
              </span>
            }
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="app.login" />
            </Button>
          </Form.Item>
        </Form>
      </div>
      <p style={{ lineHeight: 3, color: '#fff', textAlign: 'center' }}>
        Version: 1.0.2
      </p>
    </div>
  );
};

export default Login;
