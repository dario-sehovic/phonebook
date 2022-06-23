import React, { useState, useCallback } from 'react';
import { getCountryForTimezone } from 'countries-and-timezones';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import Phone from '../components/fields/Phone';
import Card from '../components/Card';
import Button from '../components/Button';
import { auth } from '../services/firebase';
import countries, { CountryCode } from '../localization/country-codes';

function Login() {
  const currentCountry = getCountryForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)?.id || 'EN';
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCountry, setPhoneCountry] = useState(currentCountry);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const countryNumber = `+${countries.find((country: CountryCode) => country.code === phoneCountry)?.phone}`;
    const fullPhoneNumber = `${countryNumber} ${phoneNumber}`;

    const recaptchaVerifier = new RecaptchaVerifier('recaptcha', { size: 'invisible' }, auth);

    signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        console.log(confirmationResult);

        setTimeout(() => {
          setLoading(false);
        }, 500);
      }).catch((error) => {
        console.log(error);

        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }, [phoneCountry, phoneNumber]);

  return (
    <div className="container container--center">
      <Card title="Login">
        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            <Phone
              label="Phone number"
              country={phoneCountry}
              value={phoneNumber}
              onChange={setPhoneNumber}
              onSelect={setPhoneCountry}
            />
            <Button text={!loading ? 'Log in' : 'Logging in...'} loading={loading} />
          </fieldset>
        </form>
      </Card>
    </div>
  );
}

export default Login;
