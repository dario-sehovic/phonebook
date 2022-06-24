import React, { useState, useEffect } from 'react';
import {
  collection, query, getDocs,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import * as Component from '../components';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  emailAddress?: string;
  photo: string;
}

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Array<Contact>>([]);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(query(collection(db, 'contacts')));
      const newContacts: Array<Contact> = [];
      querySnapshot.forEach((doc) => {
        newContacts.push({
          id: doc.id,
          ...doc.data(),
        } as Contact);
      });
      setContacts(newContacts);
    })();
  }, []);

  return (
    <div className="container">
      <Component.Card>
        <Component.Field.Text
          label="Search contacts"
          value={searchTerm}
          onChange={setSearchTerm}
        />
        {contacts.map((contact: Contact) => (
          <div className="contact" key={contact.id}>
            <div className="contact__image">
              <img src={contact.photo} alt={`${contact.firstName} ${contact.lastName}`} />
            </div>
            <div className="contact__content">
              <div className="contact__name">
                {`${contact.firstName} ${contact.lastName}`}
              </div>
              {(contact.phoneNumber || contact.emailAddress) && (
              <div className="contact__details">
                {contact.phoneNumber || contact.emailAddress}
              </div>
              )}
            </div>
            <div className="contact__actions" />
          </div>
        ))}
      </Component.Card>
    </div>
  );
}

export default Home;
