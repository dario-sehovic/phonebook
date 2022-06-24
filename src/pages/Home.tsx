import React, { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import {
  mdiEmailOutline,
  mdiLightbulbOutline,
  mdiPhoneOutline,
  mdiPower,
  mdiSortAscending,
} from '@mdi/js';
import { db } from '../services/firebase';
import * as Component from '../components';
import { useTheme, ThemeValues } from '../services/Theme';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  emailAddress?: string;
  photo: string;
}

function Home() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    })();
  }, []);

  const getContact = useCallback((contact: Contact) => (
    <div className="contact" key={contact.id}>
      <div className="contact__image">
        <img src={contact.photo} alt={`${contact.firstName} ${contact.lastName}`} />
      </div>
      <div className="contact__content">
        <div className="contact__name">
          {`${contact.firstName} ${contact.lastName}`}
        </div>
        {contact.phoneNumber && (
        <div className="contact__details">
          {contact.phoneNumber}
        </div>
        )}
        {contact.emailAddress && (
        <div className="contact__details">
          {contact.emailAddress}
        </div>
        )}
      </div>
      <div className="contact__actions" />
    </div>
  ), []);

  if (loading) return null;

  return (
    <div className="container">
      <Component.Card>
        <div className="action__group">
          <Component.Action
            icon={mdiSortAscending}
            onClick={() => {}}
          />
          <Component.Action
            icon={mdiPhoneOutline}
            onClick={() => {}}
          />
          <Component.Action
            icon={mdiEmailOutline}
            onClick={() => {}}
          />
          <Component.Action
            icon={mdiLightbulbOutline}
            onClick={toggleTheme}
            selected={theme === ThemeValues.Light}
          />
          <Component.Action
            icon={mdiPower}
            onClick={() => {}}
          />
        </div>
        <Component.Field.Text
          label="Search contacts"
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </Component.Card>
      <Component.Card title="Contacts">
        {contacts.map(getContact)}
      </Component.Card>
    </div>
  );
}

export default Home;
