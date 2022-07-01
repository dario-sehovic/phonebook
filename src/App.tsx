import React, { useState } from 'react';
import * as Page from './pages';

import './styles';
import Theme from './services/Theme';

function App() {
  const [login, setLogin] = useState(false);

  return (
    <Theme>
      {login && <Page.Home onLogOut={() => setLogin(false)} />}
      {!login && <Page.Login onLogIn={() => setLogin(true)} />}
    </Theme>
  );
}

export default App;
