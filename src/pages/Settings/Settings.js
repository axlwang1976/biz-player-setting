import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Divider,
  Input,
  Modal,
  message,
  Form,
  Radio,
  Select,
  Button,
  TimePicker,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import moment from 'moment';

import PageContent from '../../components/PageContent/PageContent';
import MiniDp from '../../components/MiniDp/MiniDp';
import timezones from '../../data/timezone';
import { subnetMaskCalc2, subnetMaskCalc1 } from '../../utils/subnetMaskCalc';

const format = 'HH:mm';

const Settings = ({
  userToken,
  deviceInfo,
  contentURL,
  history,
  playerRole,
  setPlayerRole,
  rebootTime,
}) => {
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newTimezone, setNewTimezone] = useState('');
  const [showHostModal, setShowHostModal] = useState(false);
  const [newContentUrl, setNewContentUrl] = useState(contentURL);
  const [newRotation, setNewRotation] = useState('');
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [showNTPModal, setShowNTPModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newEthernetInfo, setNewEthernetInfo] = useState(null);
  const [showEthernetModal, setShowEthernetModal] = useState(false);
  const [apList, setApList] = useState([]);
  const [newWifiInfo, setNewWifiInfo] = useState(null);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [newRebootTime, setNewRebootTime] = useState(null);
  const [showRebootModal, setShowRebootModal] = useState(false);
  const [rebootIsActived, setRebootIsActived] = useState(rebootTime !== '');
  const radioStyle = {
    display: 'flex',
    color: '#fff',
    width: '200px',
    height: '200px',
    alignItems: 'center',
  };

  const getApList = useCallback(async () => {
    try {
      const res = await axios.get('https://192.168.1.54/v1/wifi/scan_results', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setApList(res.data.map((el) => el.SSID));
    } catch (error) {
      console.log(error);
    }
  }, [userToken]);

  const handleSystemOk = async () => {
    try {
      const res = await axios.post(
        'https://192.168.1.54/v1/device_name',
        { value: newDeviceName },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (res.data.includes('OK')) {
        alert('Setting Changed');
        window.location.reload();
      } else {
        message.error('Server Error! Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleHostOk = async () => {
    try {
      const res1 = await axios.post(
        'https://192.168.1.54/v1/content_url',
        { value: newContentUrl },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      const res2 = await axios.post(
        'https://192.168.1.54/v1/player_role',
        { value: playerRole },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (res1.data.includes('OK') && res2.data.includes('OK')) {
        alert('Setting Changed');
        window.location.reload();
      } else {
        message.error('Server Error! Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOutputOk = async () => {
    try {
      const res1 = await axios.post(
        'https://192.168.1.54/v1/hdmi_rotation',
        { value: newRotation },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      const res2 = await axios.post(
        'https://192.168.1.54/v1/dp_rotation',
        { value: newRotation },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (res1.data.includes('OK') && res2.data.includes('OK')) {
        alert('Setting Changed');
        window.location.reload();
      } else {
        message.error('Server Error! Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNTPOk = async (vals) => {
    try {
      const res = await axios.post(
        'https://192.168.1.54/v1/time_zone',
        { value: newTimezone },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (res.data.includes('Finish')) {
        alert('Setting Changed');
        window.location.reload();
      } else {
        message.error('Server Error! Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEthernetOk = async () => {
    let newEthernetSetting;
    if (newEthernetInfo.ip_assignment === 'dhcp') {
      newEthernetSetting = {
        ip_assignment: 'dhcp',
        static_ip: '',
        gateway: '',
        network_prefix_length: 24,
        dns1: '',
        dns2: '',
      };
    } else {
      newEthernetSetting = {
        ip_assignment: newEthernetInfo.ip_assignment,
        static_ip: newEthernetInfo.static_ip,
        gateway: newEthernetInfo.gateway,
        network_prefix_length: newEthernetInfo.network_prefix_length,
        dns1: newEthernetInfo.dns1,
        dns2: newEthernetInfo.dns2,
      };
    }
    try {
      const res = await axios.post(
        'https://192.168.1.54/v1/eth/0/network',
        newEthernetSetting,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (res.data.includes('Re-connect')) {
        alert('Setting Changed');
        window.localStorage.removeItem('userToken');
        history.push('/');
      } else {
        message.error('Server Error! Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleWifiOk = async () => {
    let newWifiSetting;
    if (newWifiInfo.ip_assignment === 'dhcp') {
      newWifiSetting = {
        SSID: newWifiInfo.SSID,
        password: newWifiInfo.password,
        ip_assignment: 'dhcp',
        static_ip: '',
        gateway: '',
        network_prefix_length: 24,
        dns1: '',
        dns2: '',
      };
    } else {
      newWifiSetting = {
        SSID: newWifiInfo.SSID,
        password: newWifiInfo.password,
        ip_assignment: newWifiInfo.ip_assignment,
        static_ip: newWifiInfo.static_ip,
        gateway: newWifiInfo.gateway,
        network_prefix_length: newWifiInfo.network_prefix_length,
        dns1: newWifiInfo.dns1,
        dns2: newWifiInfo.dns2,
      };
    }
    try {
      const res = await axios.post(
        'https://192.168.1.54/v1/wifi/network',
        newWifiSetting,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (res.data.includes('Re-connect')) {
        alert('Setting Changed');
        window.localStorage.removeItem('userToken');
        history.push('/');
      } else {
        message.error('Server Error! Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountOk = async () => {
    try {
      const res = await axios.post('https://192.168.1.54/v1/user/register', {
        authoried_key: deviceInfo.eth_mac,
        username: newUsername,
        password: newPassword,
      });
      if (res.data.includes('Successfully')) {
        window.localStorage.removeItem('userToken');
        alert('Setting Changed');
        history.push('/settings/login');
      } else {
        message.success('Server error, Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRebootOk = async () => {
    try {
      const res = await axios.post(
        'https://192.168.1.54/v1/reboot_time',
        {
          value: rebootIsActived ? newRebootTime : '',
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (res.data.includes('OK')) {
        alert('Setting Changed');
        window.location.reload();
      } else {
        message.success('Server error, Please contact administrator!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (deviceInfo) {
      setNewDeviceName(deviceInfo.device_name);
      setNewRotation(deviceInfo.hdmi_rotation);
      setNewTimezone(deviceInfo.time_zone);
    }
  }, [deviceInfo]);

  useEffect(() => {
    if (deviceInfo && deviceInfo.ethernet_connect_state === 'enabled') {
      const getEthernetInfo = async () => {
        const res = await axios.get('https://192.168.1.54/v1/eth/0/network', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setNewEthernetInfo(res.data);
      };
      const getWifiInfo = async () => {
        const res = await axios.get('https://192.168.1.54/v1/wifi/network', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setNewWifiInfo(res.data);
      };
      getEthernetInfo();
      getWifiInfo();
    }
  }, [deviceInfo, userToken]);

  useEffect(() => {
    if (deviceInfo && !deviceInfo.wifi_mac.includes('error')) {
      getApList();
    }
  }, [deviceInfo, getApList]);

  return (
    deviceInfo && (
      <>
        <div className="background">
          <div className="device-info-container">
            <PageContent>
              <div className="device-info-title">
                <Typography.Title level={3}>
                  <FormattedMessage id="app.system" />
                </Typography.Title>
                <SettingOutlined
                  style={{ fontSize: 24, cursor: 'pointer', color: '#ed6c00' }}
                  onClick={() => setShowSystemModal(true)}
                />
              </div>
              <Divider />
              <div className="device-info-item-container">
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.playerName" />：
                    <span>{deviceInfo.device_name}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.model" />：
                    <span>{deviceInfo.model_id}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.sn" />：
                    <span>{deviceInfo.serial_number}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.ethernetMAC" />：
                    <span>{deviceInfo.eth_mac}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    Wi-Fi MAC：
                    <span>
                      {deviceInfo.wifi_mac.includes('error')
                        ? 'N/A'
                        : deviceInfo.wifi_mac}
                    </span>
                  </p>
                </div>
              </div>
            </PageContent>
            <PageContent>
              <div className="device-info-title">
                <Typography.Title level={3}>
                  <FormattedMessage id="app.operation" />
                </Typography.Title>
              </div>
              <Divider />
              <div className="device-info-item-container">
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.os" />：
                    <span>{deviceInfo.os_type}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.fw" />：
                    <span>{deviceInfo.fw_version}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.totalMemory" />：
                    <span>{deviceInfo.total_memory_size_mb}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.memory" />：
                    <span>{deviceInfo.available_memory_size_mb}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.totalStorage" />：
                    <span>{deviceInfo.total_storage_size_mb}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.storage" />：
                    <span>{deviceInfo.available_storage_size_mb}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.cpu" />：
                    <span>{deviceInfo.cpu_usage_percent}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.upTime" />：
                    <span>{deviceInfo.up_time}</span>
                  </p>
                </div>
              </div>
            </PageContent>
            <PageContent>
              <div className="device-info-title">
                <Typography.Title level={3}>
                  <FormattedMessage id="app.host" />
                </Typography.Title>
                <SettingOutlined
                  style={{ fontSize: 24, cursor: 'pointer', color: '#ed6c00' }}
                  onClick={() => setShowHostModal(true)}
                />
              </div>
              <Divider />
              <div className="device-info-item-container">
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.ip" />：
                    <span>
                      {deviceInfo.ethernet_connect_state === 'enabled'
                        ? deviceInfo.ethernet_ip
                        : deviceInfo.wifi_ip}
                    </span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.playerRole" />：
                    <span>{playerRole}</span>
                  </p>
                </div>
                {playerRole !== 'master' && (
                  <div className="device-info-item">
                    <p>
                      <FormattedMessage id="app.contentUrl" />：
                      <span>{deviceInfo.content_url}</span>
                    </p>
                  </div>
                )}
              </div>
            </PageContent>
            <PageContent>
              <div className="device-info-title">
                <Typography.Title level={3}>
                  <FormattedMessage id="app.output" />
                </Typography.Title>
                <SettingOutlined
                  style={{ fontSize: 24, cursor: 'pointer', color: '#ed6c00' }}
                  onClick={() => setShowOutputModal(true)}
                />
              </div>
              <Divider />
              <div className="device-info-item-container">
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.resolution" />：
                    <span>{deviceInfo.screen_resolution}</span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.rotation" />：
                    <span>{deviceInfo.hdmi_rotation}</span>
                  </p>
                </div>
              </div>
            </PageContent>
            <PageContent>
              <div className="device-info-title">
                <Typography.Title level={3}>NTP</Typography.Title>
                <SettingOutlined
                  style={{ fontSize: 24, cursor: 'pointer', color: '#ed6c00' }}
                  onClick={() => setShowNTPModal(true)}
                />
              </div>
              <Divider />
              <div className="device-info-item-container">
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.timezone" />：
                    <span>{newTimezone}</span>
                  </p>
                </div>
              </div>
            </PageContent>
            <PageContent>
              <div className="device-info-title">
                <Typography.Title level={3}>
                  <FormattedMessage id="app.ethernet" />
                </Typography.Title>
                <SettingOutlined
                  style={{ fontSize: 24, cursor: 'pointer', color: '#ed6c00' }}
                  onClick={() => setShowEthernetModal(true)}
                />
              </div>
              <Divider />
              <div className="device-info-item-container">
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.status" />：
                    <span>
                      {deviceInfo.ethernet_connect_state === 'enabled' ? (
                        <FormattedMessage id="app.enabled" />
                      ) : (
                        <FormattedMessage id="app.disabled" />
                      )}
                    </span>
                  </p>
                </div>
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.ethernetMAC" />：
                    <span>{deviceInfo.eth_mac}</span>
                  </p>
                </div>
              </div>
            </PageContent>
            {!deviceInfo.wifi_mac.includes('error') && (
              <PageContent>
                <div className="device-info-title">
                  <Typography.Title level={3}>Wi-Fi</Typography.Title>
                  <SettingOutlined
                    style={{
                      fontSize: 24,
                      cursor: 'pointer',
                      color: '#ed6c00',
                    }}
                    onClick={() => setShowWifiModal(true)}
                  />
                </div>
                <Divider />
                <div className="device-info-item-container">
                  <div className="device-info-item">
                    <p>
                      <FormattedMessage id="app.status" />：
                      <span>
                        {deviceInfo.wifi_connect_state === 'enabled' ? (
                          <FormattedMessage id="app.enabled" />
                        ) : (
                          <FormattedMessage id="app.disabled" />
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="device-info-item">
                    <p>
                      Wi-Fi MAC：
                      <span>{deviceInfo.wifi_mac}</span>
                    </p>
                  </div>
                </div>
              </PageContent>
            )}
            <PageContent>
              <div className="device-info-title">
                <Typography.Title level={3}>
                  <FormattedMessage id="app.account" />
                </Typography.Title>
                <SettingOutlined
                  style={{ fontSize: 24, cursor: 'pointer', color: '#ed6c00' }}
                  onClick={() => setShowAccountModal(true)}
                />
              </div>
              <Divider />
              <div className="device-info-item-container">
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.userName" />：
                    <span>{deviceInfo.user_name}</span>
                  </p>
                </div>
              </div>
            </PageContent>
            <PageContent>
              <div className="device-info-title">
                <Typography.Title level={3}>
                  <FormattedMessage id="app.reboot" />
                </Typography.Title>
                <SettingOutlined
                  style={{ fontSize: 24, cursor: 'pointer', color: '#ed6c00' }}
                  onClick={() => setShowRebootModal(true)}
                />
              </div>
              <Divider />
              <div className="device-info-item-container">
                <div className="device-info-item">
                  <p>
                    <FormattedMessage id="app.rebootStatus" />：
                    <span>
                      {rebootTime === '' ? (
                        <FormattedMessage id="app.disabled" />
                      ) : (
                        <FormattedMessage id="app.enabled" />
                      )}
                    </span>
                  </p>
                </div>
                {rebootIsActived && (
                  <div className="device-info-item">
                    <p>
                      <FormattedMessage id="app.rebootTime" />：
                      <span>{rebootTime === '' ? 'N/A' : rebootTime}</span>
                    </p>
                  </div>
                )}
              </div>
            </PageContent>
          </div>
          <p style={{ lineHeight: 3, color: '#fff', textAlign: 'center' }}>
            Version: 1.0.2
          </p>
        </div>
        <Modal
          title={
            <>
              <FormattedMessage id="app.edit" />
              <FormattedMessage id="app.system" />
            </>
          }
          visible={showSystemModal}
          onOk={handleSystemOk}
          onCancel={() => setShowSystemModal(false)}
        >
          <FormattedMessage id="app.playerName" />
          <Input
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
          />
        </Modal>
        <Modal
          title={
            <>
              <FormattedMessage id="app.edit" />
              <FormattedMessage id="app.host" />
            </>
          }
          visible={showHostModal}
          onOk={handleHostOk}
          onCancel={() => setShowHostModal(false)}
        >
          <FormattedMessage id="app.playerRole" />
          <div style={{ marginBottom: 20 }}>
            <Radio.Group
              onChange={(e) => setPlayerRole(e.target.value)}
              defaultValue={playerRole}
            >
              <Radio value="master">Master</Radio>
              <Radio value="client">Client</Radio>
            </Radio.Group>
          </div>
          {playerRole !== 'master' && (
            <>
              <FormattedMessage id="app.contentUrl" />
              <Form>
                <Form.Item
                  name="contentURL"
                  rules={[
                    {
                      message: <FormattedMessage id="app.urlRule" />,
                      pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/,
                    },
                  ]}
                >
                  <Input
                    value={newContentUrl}
                    onChange={(e) => setNewContentUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </Form.Item>
              </Form>
            </>
          )}
        </Modal>
        <Modal
          title={
            <>
              <FormattedMessage id="app.edit" />
              <FormattedMessage id="app.output" />
            </>
          }
          visible={showOutputModal}
          onOk={handleOutputOk}
          onCancel={() => setShowOutputModal(false)}
        >
          <div style={{ marginBottom: 10 }}>
            <FormattedMessage id="app.rotation" />
          </div>
          <Radio.Group
            style={{ display: 'flex', flexWrap: 'wrap' }}
            onChange={(e) => setNewRotation(e.target.value)}
            defaultValue={deviceInfo.hdmi_rotation}
          >
            <Radio value="normal" style={{ ...radioStyle, marginBottom: 50 }}>
              <MiniDp text="Normal" />
            </Radio>
            <Radio value="left" style={{ ...radioStyle, marginBottom: 85 }}>
              <MiniDp text="Left" />
            </Radio>
            <Radio value="right" style={{ ...radioStyle, marginBottom: 50 }}>
              <MiniDp text="Right" />
            </Radio>
            <Radio value="inverted" style={radioStyle}>
              <MiniDp text="Inverted" />
            </Radio>
          </Radio.Group>
        </Modal>
        <Modal
          title={
            <>
              <FormattedMessage id="app.edit" /> NTP
            </>
          }
          visible={showNTPModal}
          onOk={handleNTPOk}
          onCancel={() => setShowNTPModal(false)}
        >
          <div style={{ marginBottom: 10 }}>
            <FormattedMessage id="app.timezone" />
          </div>
          <Select
            style={{ width: 200 }}
            onChange={(val) => setNewTimezone(val)}
            defaultValue={deviceInfo.time_zone}
          >
            {timezones.map((el) => (
              <Select.OptGroup label={el.country} key={el.country}>
                {el.timezone.map((zone) => (
                  <Select.Option value={zone} key={zone}>
                    {zone}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </Modal>
        <Modal
          title={<FormattedMessage id="app.reSignup" />}
          visible={showAccountModal}
          onOk={handleAccountOk}
          onCancel={() => setShowAccountModal(false)}
        >
          <Form>
            <div style={{ marginBottom: 10 }}>
              <FormattedMessage id="app.userName" />
            </div>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="app.fieldRequired" />,
                },
              ]}
            >
              <Input onChange={(e) => setNewUsername(e.target.value)} />
            </Form.Item>
            <div style={{ marginBottom: 10 }}>
              <FormattedMessage id="app.changePwd" />
            </div>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="app.fieldRequired" />,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div style={{ marginBottom: 10 }}>
              <FormattedMessage id="app.passwordConfirm" />
            </div>
            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="app.fieldRequired" />,
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      <FormattedMessage id="app.passwordsNotMatch" />
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={
            <>
              <FormattedMessage id="app.edit" />
              <FormattedMessage id="app.ethernet" />
            </>
          }
          visible={showEthernetModal}
          onOk={handleEthernetOk}
          onCancel={() => setShowEthernetModal(false)}
        >
          <div style={{ marginBottom: 10 }}>
            <FormattedMessage id="app.ipSetting" />
          </div>
          <Radio.Group
            onChange={(e) =>
              setNewEthernetInfo({
                ...newEthernetInfo,
                ip_assignment: e.target.value,
              })
            }
            defaultValue={newEthernetInfo && newEthernetInfo.ip_assignment}
          >
            <Radio value="dhcp">DHCP</Radio>
            <Radio value="static">
              <FormattedMessage id="app.staticIp" />
            </Radio>
          </Radio.Group>
          {newEthernetInfo && newEthernetInfo.ip_assignment === 'static' && (
            <>
              <div style={{ margin: '20px 0 10px' }}>
                <FormattedMessage id="app.ip" />
              </div>
              <Form>
                <Form.Item
                  name="static_ip"
                  rules={[
                    {
                      message: <FormattedMessage id="app.staticIpRule" />,
                      pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
                    },
                  ]}
                >
                  <Input
                    placeholder="ex, 192.168.1.10"
                    defaultValue={newEthernetInfo && newEthernetInfo.static_ip}
                    onChange={(e) =>
                      setNewEthernetInfo({
                        ...newEthernetInfo,
                        static_ip: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <div style={{ margin: '20px 0 10px' }}>
                  <FormattedMessage id="app.gateway" />
                </div>
                <Form.Item
                  name="gateway"
                  rules={[
                    {
                      message: <FormattedMessage id="app.gatewayRule" />,
                      pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
                    },
                  ]}
                >
                  <Input
                    placeholder="ex, 192.168.1.254"
                    defaultValue={newEthernetInfo && newEthernetInfo.gateway}
                    onChange={(e) =>
                      setNewEthernetInfo({
                        ...newEthernetInfo,
                        gateway: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <div style={{ margin: '20px 0 10px' }}>
                  <FormattedMessage id="app.mask" />
                </div>
                <Form.Item
                  name="mask"
                  rules={[
                    {
                      message: <FormattedMessage id="app.maskRule" />,
                      pattern: /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/gm,
                    },
                  ]}
                >
                  <Input
                    placeholder="ex, 255.255.255.0"
                    defaultValue={
                      newEthernetInfo &&
                      subnetMaskCalc1(newEthernetInfo.network_prefix_length)
                    }
                    onChange={(e) =>
                      setNewEthernetInfo({
                        ...newEthernetInfo,
                        network_prefix_length: subnetMaskCalc2(e.target.value),
                      })
                    }
                  />
                </Form.Item>
              </Form>
            </>
          )}
          <div style={{ margin: '20px 0 10px' }}>DNS1</div>
          <Form>
            <Form.Item
              name="dns1"
              rules={[
                {
                  message: <FormattedMessage id="app.dnsRule" />,
                  pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
                },
              ]}
            >
              <Input
                placeholder="ex, 168.0.0.1"
                defaultValue={newEthernetInfo && newEthernetInfo.dns1}
                onChange={(e) =>
                  setNewEthernetInfo({
                    ...newEthernetInfo,
                    dns1: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Form>
          <div style={{ marginBottom: 10 }}>DNS2</div>
          <Form>
            <Form.Item
              name="dns2"
              rules={[
                {
                  message: <FormattedMessage id="app.dns2Rule" />,
                  pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
                },
              ]}
            >
              <Input
                placeholder="ex, 168.0.0.1"
                defaultValue={newEthernetInfo && newEthernetInfo.dns2}
                onChange={(e) =>
                  setNewEthernetInfo({
                    ...newEthernetInfo,
                    dns2: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={
            <>
              <FormattedMessage id="app.edit" /> Wi-Fi
            </>
          }
          visible={showWifiModal}
          onOk={handleWifiOk}
          onCancel={() => setShowWifiModal(false)}
        >
          <div style={{ marginBottom: 10 }}>SSID</div>
          <Form.Item>
            <Select
              onChange={(val) => setNewWifiInfo({ ...newWifiInfo, SSID: val })}
            >
              {apList.length &&
                apList.map((ap, i) => (
                  <Select.Option key={i} value={ap}>
                    {ap}
                  </Select.Option>
                ))}
            </Select>
            <Button
              type="primary"
              style={{ marginTop: 10 }}
              onClick={() => getApList()}
            >
              <FormattedMessage id="app.rescan" />
            </Button>
          </Form.Item>
          <div style={{ marginBottom: 10 }}>
            <FormattedMessage id="app.password" />
          </div>
          <Input.Password
            onChange={(e) =>
              setNewWifiInfo({ ...newWifiInfo, password: e.target.value })
            }
          />
          <div style={{ margin: '20px 0 10px' }}>
            <FormattedMessage id="app.ipSetting" />
          </div>
          <Radio.Group
            onChange={(e) =>
              setNewWifiInfo({
                ...newWifiInfo,
                ip_assignment: e.target.value,
              })
            }
            defaultValue={newWifiInfo && newWifiInfo.ip_assignment}
          >
            <Radio value="dhcp">DHCP</Radio>
            <Radio value="static">
              <FormattedMessage id="app.staticIp" />
            </Radio>
          </Radio.Group>
          {newWifiInfo && newWifiInfo.ip_assignment === 'static' && (
            <>
              <div style={{ margin: '20px 0 10px' }}>
                <FormattedMessage id="app.ip" />
              </div>
              <Form>
                <Form.Item
                  name="static_ip"
                  rules={[
                    {
                      message: <FormattedMessage id="app.staticIpRule" />,
                      pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
                    },
                  ]}
                >
                  <Input
                    placeholder="ex, 192.168.1.10"
                    defaultValue={newWifiInfo && newWifiInfo.static_ip}
                    onChange={(e) =>
                      setNewWifiInfo({
                        ...newWifiInfo,
                        static_ip: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <div style={{ margin: '20px 0 10px' }}>
                  <FormattedMessage id="app.gateway" />
                </div>
                <Form.Item
                  name="gateway"
                  rules={[
                    {
                      message: <FormattedMessage id="app.gatewayRule" />,
                      pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
                    },
                  ]}
                >
                  <Input
                    placeholder="ex, 192.168.1.254"
                    defaultValue={newWifiInfo && newWifiInfo.gateway}
                    onChange={(e) =>
                      setNewWifiInfo({
                        ...newWifiInfo,
                        gateway: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <div style={{ margin: '20px 0 10px' }}>
                  <FormattedMessage id="app.mask" />
                </div>
                <Form.Item
                  name="mask"
                  rules={[
                    {
                      message: <FormattedMessage id="app.maskRule" />,
                      pattern: /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/gm,
                    },
                  ]}
                >
                  <Input
                    placeholder="ex, 255.255.255.0"
                    defaultValue={
                      newWifiInfo &&
                      subnetMaskCalc1(newWifiInfo.network_prefix_length)
                    }
                    onChange={(e) =>
                      setNewWifiInfo({
                        ...newWifiInfo,
                        network_prefix_length: subnetMaskCalc2(e.target.value),
                      })
                    }
                  />
                </Form.Item>
              </Form>
            </>
          )}
          <div style={{ margin: '20px 0 10px' }}>DNS1</div>
          <Form>
            <Form.Item
              name="dns1"
              rules={[
                {
                  message: <FormattedMessage id="app.dnsRule" />,
                  pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
                },
              ]}
            >
              <Input
                placeholder="ex, 168.0.0.1"
                defaultValue={newWifiInfo && newWifiInfo.dns1}
                onChange={(e) =>
                  setNewWifiInfo({
                    ...newWifiInfo,
                    dns1: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Form>
          <div style={{ marginBottom: 10 }}>DNS2</div>
          <Form>
            <Form.Item
              name="dns2"
              rules={[
                {
                  message: <FormattedMessage id="app.dns2Rule" />,
                  pattern: /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm,
                },
              ]}
            >
              <Input
                placeholder="ex, 168.0.0.1"
                defaultValue={newWifiInfo && newWifiInfo.dns2}
                onChange={(e) =>
                  setNewWifiInfo({
                    ...newWifiInfo,
                    dns2: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={
            <>
              <FormattedMessage id="app.edit" />
              <FormattedMessage id="app.reboot" />
            </>
          }
          visible={showRebootModal}
          onOk={handleRebootOk}
          onCancel={() => setShowRebootModal(false)}
        >
          <div style={{ marginBottom: 20 }}>
            <FormattedMessage id="app.rebootStatus" />
            <br />
            <Radio.Group
              defaultValue={rebootTime === '' ? '' : 'enabled'}
              onChange={(e) => {
                if (e.target.value === '') {
                  setRebootIsActived(false);
                } else {
                  setRebootIsActived(true);
                }
              }}
            >
              <Radio value="">
                <FormattedMessage id="app.disabled" />
              </Radio>
              <Radio value="enabled">
                <FormattedMessage id="app.enabled" />
              </Radio>
            </Radio.Group>
          </div>
          {rebootIsActived && (
            <>
              <FormattedMessage id="app.rebootTime" />
              <br />
              <TimePicker
                defaultValue={
                  rebootTime === '' ? null : moment(rebootTime, format)
                }
                format={format}
                onChange={(time) =>
                  setNewRebootTime(moment(time).format('HH:mm'))
                }
              />
            </>
          )}
        </Modal>
      </>
    )
  );
};

export default Settings;
