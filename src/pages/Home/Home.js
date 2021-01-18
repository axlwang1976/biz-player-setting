import React, { useState, useEffect } from 'react';
import { Divider, Typography, Form, Select, notification } from 'antd';
import { FormattedMessage, IntlProvider } from 'react-intl';
import moment from 'moment';
import { SettingOutlined, RightCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

import logo from '../../assets/images/biz-logo.png';

const Home = ({
  deviceInfo,
  history,
  token,
  setLocale,
  locale,
  messages,
  playerRole,
}) => {
  const [now, setNow] = useState('');
  const { Title } = Typography;
  const { Item } = Form;
  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const renderNetworkStatus = () => {
    if (deviceInfo.ethernet_connect_state === 'enabled') {
      return (
        <>
          <FormattedMessage id="app.connected" />
          {', '}
          <FormattedMessage id="app.ethernet" />
        </>
      );
    }
    if (deviceInfo.wifi_connect_state === 'enabled') {
      return 'Wi-Fi';
    }
    return <FormattedMessage id="app.noConnection" />;
  };

  const openNotification = () => {
    notification.open({
      message: (
        <IntlProvider
          locale={locale}
          key={locale}
          defaultLocale="en"
          messages={messages}
        >
          <FormattedMessage id="app.notification" />
        </IntlProvider>
      ),
      description: (
        <IntlProvider
          locale={locale}
          key={locale}
          defaultLocale="en"
          messages={messages}
        >
          <FormattedMessage id="app.notSignup" />
        </IntlProvider>
      ),
    });
  };

  useEffect(() => {
    if (token) {
      const getTime = async () => {
        try {
          const res = await axios.get('https://192.168.1.54/v1/system_time', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNow(moment(res.data.value).format('YYYY-MM-DD HH:mm:ss'));
        } catch (error) {
          console.log(error);
        }
      };
      const current = setInterval(() => {
        getTime();
      }, 1000);
      return () => clearInterval(current);
    }
  }, [token]);

  return (
    <div className="background">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <Divider style={{ borderColor: '#666', borderWidth: 3 }} />
        {deviceInfo && (
          <div className="basic-info">
            <div
              className="basic-info-item"
              onClick={() => history.push('/settings/login')}
            >
              <Title level={3} style={{ textAlign: 'center', color: '#fff' }}>
                <FormattedMessage id="app.basic" />
              </Title>
              <Divider style={{ borderColor: '#fff' }} />
              <Form {...formLayout} className="home-label">
                <Item label={<FormattedMessage id="app.currentTime" />}>
                  {now}
                </Item>
                <Item label={<FormattedMessage id="app.networkStatus" />}>
                  {renderNetworkStatus()}
                </Item>
                <Item label={<FormattedMessage id="app.ip" />}>
                  {deviceInfo.ethernet_ip}
                </Item>
                <Item label={<FormattedMessage id="app.playerName" />}>
                  {deviceInfo.device_name ? (
                    deviceInfo.device_name
                  ) : (
                    <FormattedMessage id="app.na" />
                  )}
                </Item>
                <Item label={<FormattedMessage id="app.playerRole" />}>
                  {playerRole}
                </Item>
                {playerRole !== 'master' && (
                  <Item label={<FormattedMessage id="app.contentUrl" />}>
                    {deviceInfo.content_url}
                  </Item>
                )}
              </Form>
              <SettingOutlined
                style={{
                  color: '#fff',
                  position: 'absolute',
                  right: 20,
                  bottom: 20,
                  fontSize: '3em',
                }}
              />
            </div>
            <div
              className="basic-info-item"
              onClick={() => {
                if (deviceInfo.has_config === 'false') {
                  openNotification();
                } else {
                  history.push('/cms/login');
                }
              }}
            >
              <div className="home-setting">
                <div className="btn">
                  <FormattedMessage id="app.cms" />
                  <RightCircleOutlined style={{ marginLeft: 10 }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <span style={{ color: '#fff' }}>
          <FormattedMessage id="app.language" />:{' '}
        </span>
        <Select
          style={{ width: 100 }}
          defaultValue={locale}
          onChange={async (val) => {
            try {
              setLocale(val);
              await axios.post(
                'https://192.168.1.54/v1/language',
                { value: val },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="zh">正體中文</Select.Option>
        </Select>
      </div>
      <p style={{ lineHeight: 3, color: '#fff', textAlign: 'center' }}>
        Version: 1.0.2
      </p>
    </div>
  );
};

export default Home;
