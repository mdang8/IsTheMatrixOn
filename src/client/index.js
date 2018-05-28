import 'bootstrap';
import React from 'react';
import { render } from 'react-dom';
import Main from './components/Main.jsx';

import './scss/app.scss';

// only renders the main React component if the "root" element is present
if (document.getElementById('root')) {
  render(<Main />, document.getElementById('root'));
}
