import React, { useState } from 'react';
import { mdiDotsVertical } from '@mdi/js';
import Action from './Action';
import Edit from '../pages/Edit';
import Modal from './Modal';

export interface ContactProps {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  emailAddress?: string;
  photo: string;
  onEdit: (id: string, newContact: any) => any;
  onDelete: (id: string) => any;
}

function Contact({
  id,
  firstName,
  lastName,
  phoneNumber,
  emailAddress,
  photo,
  onEdit,
  onDelete,
}: ContactProps) {
  const [showEditModal, setShowEditModal] = useState(false);

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
        <Edit
          id={id}
          firstName={firstName}
          lastName={lastName}
          photo={photo}
          phoneNumber={phoneNumber}
          emailAddress={emailAddress}
          onClose={() => setShowEditModal(false)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Modal>
    </div>
  );
}

export default Contact;
