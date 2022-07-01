import React, {
  useState, useCallback, useMemo, useRef,
} from 'react';
import { getCountryForTimezone } from 'countries-and-timezones';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../services/firebase';
import countries, { CountryCode } from '../localization/country-codes';
import * as Component from '../components';

interface LoginProps {
  onLogIn: () => void;
}

function Login({ onLogIn }: LoginProps) {
  const recaptchaRef = useRef<any>(null);

  const currentCountry = getCountryForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)?.id || 'EN';
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCountry, setPhoneCountry] = useState(currentCountry);
  const [verificationCode, setVerificationCode] = useState('');

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
          setSuccess(true);
        }, 500);
      }).catch((error) => {
        console.log(error);

        setTimeout(() => {
          setLoading(false);
          recaptchaVerifier.clear();
          (recaptchaRef.current as any).innerHTML = '<div id="recaptcha"></div>';
        }, 500);
      });
  }, [phoneCountry, phoneNumber]);

  const handleLogin = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLogIn();
    }, 500);
  }, [onLogIn]);

  const loginForm = useMemo(() => (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        <Component.Field.Phone
          label="Phone number"
          country={phoneCountry}
          value={phoneNumber}
          onChange={setPhoneNumber}
          onSelect={setPhoneCountry}
        />
        <Component.Button text={!loading ? 'Submit' : 'Submitting...'} loading={loading} />
      </fieldset>
    </form>
  ), [handleSubmit, loading, phoneCountry, phoneNumber]);

  const verifyForm = useMemo(() => (
    <form onSubmit={handleLogin}>
      <Component.Alert message="A text message with a verification code has been sent to your phone number." />
      <fieldset disabled={loading}>
        <Component.Field.Text
          label="Verification code"
          value={verificationCode}
          onChange={setVerificationCode}
        />
        <Component.Button text={!loading ? 'Verify' : 'Verifying...'} loading={loading} />
      </fieldset>
    </form>
  ), [handleLogin, loading, verificationCode]);

  return (
    <div className="container container--center">
      <Component.Card title="Login">
        {!success ? loginForm : verifyForm}
      </Component.Card>
      <div ref={recaptchaRef}>
        <div id="recaptcha" />
      </div>
    </div>
  );
}

export default Login;
