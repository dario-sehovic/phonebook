import React, { useCallback, useState } from 'react';
import { mdiDotsVertical } from '@mdi/js';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getCountryForTimezone } from 'countries-and-timezones';
import Alert from './Alert';
import Action from './Action';
import Card from './Card';
import Modal from './Modal';
import Button from './Button';
import Text from './fields/Text';
import Phone from './fields/Phone';

export interface ContactProps {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  emailAddress?: string;
  photo: string;
}

function Contact({
  firstName,
  lastName,
  phoneNumber,
  emailAddress,
  photo,
}: ContactProps) {
  const currentCountry = getCountryForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)?.id || 'EN';
  const newFormattedCountry = phoneNumber ? parsePhoneNumber(phoneNumber ?? '').country as string : currentCountry;
  const currentNumber = phoneNumber?.split(' ') ?? [];
  const [, ...newFormattedNumber] = currentNumber;
  const [showEditModal, setShowEditModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [newPhoneNumber, setNewPhoneNumber] = useState(newFormattedNumber.join(' '));
  const [newPhoneCountry, setNewPhoneCountry] = useState(newFormattedCountry);
  const [newEmailAddress, setNewEmailAddress] = useState(emailAddress ?? '');
  const [newPhoto, setNewPhoto] = useState(photo);
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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

    setTimeout(() => {
      console.table(newErrorMessages);

      setLoading(false);
      // setSuccess(true);
    }, 500);
  }, [newPhoneNumber, newEmailAddress, newLastName, newFirstName]);

  return (
    <div className="contact">
      <div className="contact__image">
        <img src={photo} alt={`${firstName} ${lastName}`} />
      </div>
      <div className="contact__content">
        <div className="contact__name">
          {`${firstName} ${lastName}`}
        </div>
        {phoneNumber && (
          <div className="contact__details">
            {phoneNumber}
          </div>
        )}
        {emailAddress && (
          <div className="contact__details">
            {emailAddress}
          </div>
        )}
      </div>
      <div className="contact__actions">
        <Action
          onClick={() => setShowEditModal(true)}
          icon={mdiDotsVertical}
        />
      </div>
      <Modal open={showEditModal}>
        <div className="container">
          <Card title="Edit Contact" onClose={() => setShowEditModal(false)}>
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
                <Button text="Delete" type="button" variant="error" />
              </fieldset>
            </form>
          </Card>
        </div>
      </Modal>
    </div>
  );
}

export default Contact;
