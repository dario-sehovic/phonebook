import React, { useCallback, useMemo, useState } from 'react';
import { getCountryForTimezone } from 'countries-and-timezones';
import { parsePhoneNumber } from 'libphonenumber-js';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import Alert from '../components/Alert';
import Card from '../components/Card';
import { db } from '../services/firebase';
import countries, { CountryCode } from '../localization/country-codes';
import Text from '../components/fields/Text';
import Phone from '../components/fields/Phone';
import Button from '../components/Button';

export interface EditProps {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  emailAddress?: string;
  photo: string;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit: (id: string, newContact: any) => any;
}

function Edit({
  id,
  firstName,
  lastName,
  phoneNumber,
  emailAddress,
  photo,
  onClose,
  onEdit,
}: EditProps) {
  const currentCountry = getCountryForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)?.id || 'EN';
  const newFormattedCountry = phoneNumber ? parsePhoneNumber(phoneNumber ?? '').country as string : currentCountry;
  const currentNumber = phoneNumber?.split(' ') ?? [];
  const [, ...newFormattedNumber] = currentNumber;
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [newPhoneNumber, setNewPhoneNumber] = useState(newFormattedNumber.join(' '));
  const [newPhoneCountry, setNewPhoneCountry] = useState(newFormattedCountry);
  const [newEmailAddress, setNewEmailAddress] = useState(emailAddress ?? '');
  const [newPhoto, setNewPhoto] = useState(photo);
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDelete = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    (async () => {
      await deleteDoc(doc(db, 'contacts', id));

      setLoading(false);
      setDeleteSuccess(true);
      setTimeout(onClose, 2000);
    })();
  }, [id, onClose]);

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
      const newContact = {
        firstName: newFirstName,
        lastName: newLastName,
        phoneNumber: newFullPhoneNumber,
        emailAddress: newEmailAddress,
        photo: newPhoto,
      };
      await setDoc(doc(db, 'contacts', id), newContact);

      onEdit(id, newContact);
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(onClose, 2000);
    })();
  }, [
    newFirstName,
    newLastName,
    newEmailAddress,
    newPhoneNumber,
    id,
    newPhoto,
    onClose,
    onEdit,
    newPhoneCountry,
  ]);

  const editForm = useMemo(() => (
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
        <Button text={!loading ? 'Save' : 'Saving...'} loading={loading} />
        <Button text="Delete" type="button" variant="error" onClick={handleDelete} />
      </fieldset>
    </form>
  ), [
    errorMessages,
    handleSubmit,
    handleDelete,
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
      <Card title="Edit Contact" onClose={onClose}>
        {!saveSuccess && !deleteSuccess && editForm}
        {saveSuccess && <Alert message="Contact saved successfully." variant="success" />}
        {deleteSuccess && <Alert message="Contacts deleted successfully." variant="success" />}
      </Card>
    </div>
  );
}

export default Edit;
