import React, { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import {
  mdiEmailOutline,
  mdiLightbulbOutline,
  mdiPhoneOutline,
  mdiPower, mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
} from '@mdi/js';
import { db } from '../services/firebase';
import * as Component from '../components';
import { useTheme, ThemeValues } from '../services/Theme';
import { ContactProps } from '../components/Contact';

export interface ContactObject extends ContactProps {
  id: string;
}

function Home() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Array<ContactObject>>([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [filterEmptyEmails, setFilterEmptyEmails] = useState(false);
  const [filterEmptyPhones, setFilterEmptyPhones] = useState(false);

  const sortContact = useCallback((prevContact: ContactObject, nextContact: ContactObject) => {
    const prevFullName = (prevContact.firstName + prevContact.lastName).toLowerCase();
    const nextFullName = (nextContact.firstName + nextContact.lastName).toLowerCase();

    if (prevFullName > nextFullName) return sortAscending ? 1 : -1;
    if (prevFullName < nextFullName) return sortAscending ? -1 : 1;

    return 0;
  }, [sortAscending]);

  const filterContact = useCallback((contact: ContactObject) => {
    if (filterEmptyEmails && !contact.emailAddress) return false;
    if (filterEmptyPhones && !contact.phoneNumber) return false;

    const haystack = (contact.firstName + contact.lastName).toLowerCase();
    const needle = searchTerm.toLowerCase();

    return haystack.includes(needle);
  }, [filterEmptyEmails, filterEmptyPhones, searchTerm]);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(query(collection(db, 'contacts')));
      const newContacts: Array<ContactObject> = [];
      querySnapshot.forEach((doc) => {
        newContacts.push({
          id: doc.id,
          ...doc.data(),
        } as ContactObject);
      });
      setContacts(newContacts);
      setLoading(false);
    })();
  }, []);

  const getContact = useCallback((contact: ContactObject) => (
    <Component.Contact
      key={contact.id}
      firstName={contact.firstName}
      lastName={contact.lastName}
      phoneNumber={contact.phoneNumber}
      emailAddress={contact.emailAddress}
      photo={contact.photo}
    />
  ), []);

  if (loading) return null;

  return (
    <div className="container">
      <Component.Card sticky>
        <div className="action__group">
          <Component.Action
            icon={sortAscending ? mdiSortAlphabeticalAscending : mdiSortAlphabeticalDescending}
            onClick={() => setSortAscending((prevState) => !prevState)}
          />
          <Component.Action
            selected={filterEmptyPhones}
            icon={mdiPhoneOutline}
            onClick={() => setFilterEmptyPhones((prevState) => !prevState)}
          />
          <Component.Action
            selected={filterEmptyEmails}
            icon={mdiEmailOutline}
            onClick={() => setFilterEmptyEmails((prevState) => !prevState)}
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
        {contacts.filter(filterContact).sort(sortContact).map(getContact)}
      </Component.Card>
    </div>
  );
}

export default Home;
