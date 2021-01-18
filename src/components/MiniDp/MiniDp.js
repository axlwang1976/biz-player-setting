import React from 'react';
import { FormattedMessage } from 'react-intl';

const MiniDp = ({ text }) => {
  const renderRotate = (text) => {
    if (text === 'Left') {
      return 'rotate(-90deg)';
    }
    if (text === 'Right') {
      return 'rotate(90deg)';
    }
    if (text === 'Inverted') {
      return 'rotate(180deg)';
    }
  };
  return (
    <div
      style={{
        width: 160,
        height: 90,
        backgroundColor: '#333',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: renderRotate(text),
      }}
    >
      <FormattedMessage id={`app.${text}`} />
    </div>
  );
};

export default MiniDp;
