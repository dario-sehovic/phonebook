import React, { useState } from 'react';
import { getCountryForTimezone } from 'countries-and-timezones';
import Phone from '../components/fields/Phone';
import Card from '../components/Card';
import Button from '../components/Button';

function Login() {
  const currentCountry = getCountryForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)?.id || 'EN';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCountry, setPhoneCountry] = useState(currentCountry);

  return (
    <div className="container container--center">
      <Card title="Login">
        <Phone
          label="Phone number"
          country={phoneCountry}
          value={phoneNumber}
          onChange={setPhoneNumber}
          onSelect={setPhoneCountry}
        />
        <Button text="Log in" />
      </Card>
    </div>
  );
}

export default Login;
