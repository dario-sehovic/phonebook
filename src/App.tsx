import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import * as Page from './pages';

import './styles';
import Theme from './services/Theme';

function App() {
  return (
    <Theme>
      <Router>
        <Routes>
          <Route path="/login" element={<Page.Login />} />
          <Route path="/" element={<Page.Home />} />
        </Routes>
      </Router>
    </Theme>
  );
}

export default App;
