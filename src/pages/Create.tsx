import React, { useCallback, useMemo, useState } from 'react';
import { getCountryForTimezone } from 'countries-and-timezones';
import { addDoc, collection } from 'firebase/firestore';
import Alert from '../components/Alert';
import Card from '../components/Card';
import { db } from '../services/firebase';
import countries, { CountryCode } from '../localization/country-codes';
import Text from '../components/fields/Text';
import Phone from '../components/fields/Phone';
import Button from '../components/Button';

export interface CreateProps {
  onClose: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onCreate: (newContact: any) => any;
}

function Create({
  onClose,
  onCreate,
}: CreateProps) {
  const currentCountry = getCountryForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)?.id || 'EN';
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newPhoneCountry, setNewPhoneCountry] = useState(currentCountry);
  const [newEmailAddress, setNewEmailAddress] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    const newErrorMessages: Record<string, string> = {};

    if (newFirstName.replace(/[^a-z0-9]/gi, '').length < 1) {
      newErrorMessages.firstName = 'Name is too short.';
    }

    if (newLastName.replace(/[^a-z0-9]/gi, '').length < 1) {
      newErrorMessages.lastName = 'Name is too short.';
    }

    if (newEmailAddress && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newEmailAddress)) {
      newErrorMessages.emailAddress = 'Invalid email address.';
    }

    if (!newEmailAddress && !newPhoneNumber) {
      newErrorMessages.noContact = 'You must specify an email address or a phone number.';
    }

    setErrorMessages(newErrorMessages);

    if (Object.keys(newErrorMessages).length) {
      setLoading(false);
      return;
    }

    (async () => {
      const countryNumber = `+${countries.find((country: CountryCode) => country.code === newPhoneCountry)?.phone}`;
      const newFullPhoneNumber = `${countryNumber} ${newPhoneNumber}`;
      const newContact: Record<string, string> = {
        firstName: newFirstName,
        lastName: newLastName,
        emailAddress: newEmailAddress,
        photo: newPhoto,
      };

      if (newPhoneNumber) newContact.phoneNumber = newFullPhoneNumber;
      const docRef = await addDoc(collection(db, 'contacts'), newContact);

      onCreate({ id: docRef.id, ...newContact });
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(onClose, 2000);
    })();
  }, [
    newFirstName,
    newLastName,
    newEmailAddress,
    newPhoneNumber,
    newPhoto,
    onClose,
    onCreate,
    newPhoneCountry,
  ]);

  const createForm = useMemo(() => (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        {errorMessages.noContact && <Alert variant="danger" message={errorMessages.noContact} />}
        <Text
          label="First name"
          value={newFirstName}
          onChange={setNewFirstName}
          error={errorMessages.firstName}
        />
        <Text
          label="Last name"
          value={newLastName}
          onChange={setNewLastName}
          error={errorMessages.lastName}
        />
        <Phone
          label="Phone number"
          value={newPhoneNumber}
          onChange={setNewPhoneNumber}
          country={newPhoneCountry}
          onSelect={setNewPhoneCountry}
        />
        <Text
          label="Email address"
          value={newEmailAddress}
          onChange={setNewEmailAddress}
          error={errorMessages.emailAddress}
        />
        <Text
          label="Avatar link"
          value={newPhoto}
          onChange={setNewPhoto}
          error={errorMessages.photo}
        />
        <Button text={!loading ? 'Create' : 'Creating...'} loading={loading} />
      </fieldset>
    </form>
  ), [
    errorMessages,
    handleSubmit,
    loading,
    newEmailAddress,
    newFirstName,
    newLastName,
    newPhoneCountry,
    newPhoneNumber,
    newPhoto,
  ]);

  return (
    <div className="container">
      <Card title="Create Contact" onClose={onClose}>
        {!saveSuccess && createForm}
        {saveSuccess && <Alert message="Contact created successfully." variant="success" />}
      </Card>
    </div>
  );
}

export default Create;
