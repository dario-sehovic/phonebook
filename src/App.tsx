import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import * as Page from './pages';

import './styles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Page.Login />} />
        <Route path="/" element={<Page.Home />} />
      </Routes>
    </Router>
  );
}

export default App;
