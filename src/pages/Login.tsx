import React, { useState } from 'react';
import { getCountryForTimezone } from 'countries-and-timezones';
import Phone from '../components/fields/Phone';

function Login() {
  const currentCountry = getCountryForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)?.id || 'EN';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCountry, setPhoneCountry] = useState(currentCountry);

  return (
    <div style={{ margin: 50 }}>
      <Phone
        label="Phone number"
        country={phoneCountry}
        value={phoneNumber}
        onChange={setPhoneNumber}
        onSelect={setPhoneCountry}
      />
    </div>
  );
}

export default Login;
