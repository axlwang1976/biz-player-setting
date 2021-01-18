import React, { useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import en from './i18n/en';
import tw from './i18n/tw';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Settings from './pages/Settings/Settings';

const tokenInLocalStorage = window.localStorage.getItem('userToken');

const btnPlayNow = document.querySelector('.play-now');

const App = () => {
  const [locale, setLocale] = useState('zh');
  const [token, setToken] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [userToken, setUserToken] = useState(tokenInLocalStorage);
  const [contentURL, setContentURL] = useState('');
  const [playerRole, setPlayerRole] = useState('master');
  const [rebootTime, setRebootTime] = useState('');
  let messages;

  if (locale === 'zh') {
    messages = tw;
    btnPlayNow.textContent = '立即播放';
  } else {
    messages = en;
    btnPlayNow.textContent = 'Play Now';
  }

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.post('https://192.168.1.54/v1/oauth2/token', {
          grant_type: 'password',
          username: 'Bizlution',
          password: '123456',
        });
        setToken(res.data.access_token);
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      const getDeviceInfo = async () => {
        try {
          const res = await axios.get('https://192.168.1.54/v1/device_info', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDeviceInfo(res.data);
          setLocale(res.data.language);
        } catch (error) {
          console.log(error);
        }
      };
      getDeviceInfo();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const getContentURL = async () => {
        try {
          const res = await axios.get('https://192.168.1.54/v1/content_url', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setContentURL(res.data.value);
        } catch (error) {
          console.log(error);
        }
      };
      getContentURL();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const getPlayerRole = async () => {
        try {
          const res = await axios.get('https://192.168.1.54/v1/player_role', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPlayerRole(res.data.value);
        } catch (error) {
          console.log(error);
        }
      };
      getPlayerRole();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const getRebootTime = async () => {
        try {
          const res = await axios.get('https://192.168.1.54/v1/reboot_time', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRebootTime(res.data.value);
        } catch (error) {
          console.log(error);
        }
      };
      getRebootTime();
    }
  }, [token]);

  useEffect(() => {
    if (deviceInfo) {
      btnPlayNow.addEventListener('click', async () => {
        try {
          const res = await axios.post(
            'https://192.168.1.54/v1/close_browser',
            { value: deviceInfo.eth_mac },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          alert(res.data);
          window.close();
        } catch (error) {
          console.log(error);
        }
      });
    }
  }, [deviceInfo, token]);

  return (
    <IntlProvider
      locale={locale}
      key={locale}
      defaultLocale="en"
      messages={messages}
    >
      <Switch>
        <Route
          exact
          path="/"
          render={(routeProps) => (
            <Home
              deviceInfo={deviceInfo}
              token={token}
              locale={locale}
              setLocale={setLocale}
              messages={messages}
              playerRole={playerRole}
              {...routeProps}
            />
          )}
        />
        <Route
          exact
          path="/settings"
          render={(routeProps) => (
            <Settings
              {...routeProps}
              userToken={userToken}
              deviceInfo={deviceInfo}
              contentURL={contentURL}
              playerRole={playerRole}
              setPlayerRole={setPlayerRole}
              rebootTime={rebootTime}
            />
          )}
        />
        <Route
          exact
          path="/settings/login"
          render={(routeProps) => (
            <Login
              {...routeProps}
              setUserToken={setUserToken}
              path="settings"
            />
          )}
        />
        <Redirect to="/" />
      </Switch>
    </IntlProvider>
  );
};

export default App;
