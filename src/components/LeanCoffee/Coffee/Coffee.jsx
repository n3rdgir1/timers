import React from 'react';
import './Coffee.scss';

export default ({ value, time }) => (
  <figure className={`coffee ${value.toLowerCase()}`}>
    <figcaption>{time}</figcaption>
  </figure>
);
