import React, { useState } from 'react';

function Login() {
  const [phone, setPhone] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhone(event.target.value)}
      />
      <button type="submit">Login</button>
    </div>
  );
}

export default Login;
