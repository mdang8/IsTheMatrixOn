import 'bootstrap';
import React from 'react';
import { render } from 'react-dom';
import Main from './components/Main.jsx';

import './scss/app.scss';

if (document.getElementById('root')) {
  render(<Main />, document.getElementById('root'));
}
