import React from 'react';
import './Tomato.scss';

export default ({ value, time }) => (
  <figure className={`tomato ${value.toLowerCase()}`}>
    <div className="body" />
    <div className="stem" />
    <figcaption>{time || 'Done'}</figcaption>
  </figure>
);
