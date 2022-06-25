import React from 'react';
import { mdiDotsVertical } from '@mdi/js';
import Action from './Action';

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
          onClick={() => {}}
          icon={mdiDotsVertical}
        />
      </div>
    </div>
  );
}

export default Contact;
