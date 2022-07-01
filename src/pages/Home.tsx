import React, { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import {
  mdiAt,
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
import Contact from './Contact';
import Create from './Create';

function Home() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Array<ContactProps>>([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [filterEmptyEmails, setFilterEmptyEmails] = useState(false);
  const [filterEmptyPhones, setFilterEmptyPhones] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCreateContactModal, setShowCreateContactModal] = useState(false);

  const handleCreate = useCallback((newContact: any) => {
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      newContacts.push(newContact);

      return newContacts;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      const newContactIndex = newContacts.findIndex((contact) => contact.id === id);
      newContacts.splice(newContactIndex, 1);

      return newContacts;
    });
  }, []);

  const handleEdit = useCallback((id: string, newContact: any) => {
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      const newContactIndex = newContacts.findIndex((contact) => contact.id === id);
      newContacts[newContactIndex] = { id, ...newContact };

      return newContacts;
    });
  }, []);

  const sortContact = useCallback((prevContact: ContactProps, nextContact: ContactProps) => {
    const prevFullName = (prevContact.firstName + prevContact.lastName).toLowerCase();
    const nextFullName = (nextContact.firstName + nextContact.lastName).toLowerCase();

    if (prevFullName > nextFullName) return sortAscending ? 1 : -1;
    if (prevFullName < nextFullName) return sortAscending ? -1 : 1;

    return 0;
  }, [sortAscending]);

  const filterContact = useCallback((contact: ContactProps) => {
    if (filterEmptyEmails && !contact.emailAddress) return false;
    if (filterEmptyPhones && !contact.phoneNumber) return false;

    const haystack = (contact.firstName + contact.lastName).toLowerCase();
    const needle = searchTerm.toLowerCase();

    return haystack.includes(needle);
  }, [filterEmptyEmails, filterEmptyPhones, searchTerm]);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(query(collection(db, 'contacts')));
      const newContacts: Array<ContactProps> = [];
      querySnapshot.forEach((doc) => {
        newContacts.push({
          id: doc.id,
          ...doc.data(),
        } as ContactProps);
      });
      setContacts(newContacts);
      setLoading(false);
    })();
  }, []);

  const getContact = useCallback((contact: ContactProps) => (
    <Component.Contact
      key={contact.id}
      id={contact.id}
      firstName={contact.firstName}
      lastName={contact.lastName}
      phoneNumber={contact.phoneNumber}
      emailAddress={contact.emailAddress}
      photo={contact.photo}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ), [handleDelete, handleEdit]);

  if (loading) return null;

  const contactsToRender = contacts.filter(filterContact).sort(sortContact).map(getContact);

  return (
    <div className="container">
      <Component.Card sticky>
        <div className="action__group">
          <Component.Action
            icon={sortAscending ? mdiSortAlphabeticalAscending : mdiSortAlphabeticalDescending}
            onClick={() => setSortAscending((prevState) => !prevState)}
            helpText={sortAscending ? 'Sort descending' : 'Sort ascending'}
          />
          <Component.Action
            selected={filterEmptyPhones}
            icon={mdiPhoneOutline}
            onClick={() => setFilterEmptyPhones((prevState) => !prevState)}
            helpText="Show contacts with phone number"
          />
          <Component.Action
            selected={filterEmptyEmails}
            icon={mdiAt}
            onClick={() => setFilterEmptyEmails((prevState) => !prevState)}
            helpText="Show contacts with email"
          />
          <Component.Action
            icon={mdiLightbulbOutline}
            onClick={toggleTheme}
            selected={theme === ThemeValues.Light}
            helpText="Turn on the lights"
          />
          <Component.Action
            icon={mdiEmailOutline}
            onClick={() => setShowContactModal(true)}
            helpText="Get in touch"
          />
          <Component.Action
            icon={mdiPower}
            onClick={() => {}}
            helpText="Log out"
          />
        </div>
        <Component.Field.Text
          label="Search contacts"
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </Component.Card>
      <Component.Card title="Contacts" onAddNew={() => setShowCreateContactModal(true)}>
        {contactsToRender.length ? contactsToRender : <Component.Alert message="No results." />}
      </Component.Card>
      <Component.Modal open={showContactModal}>
        <Contact onClose={() => setShowContactModal(false)} />
      </Component.Modal>
      <Component.Modal open={showCreateContactModal}>
        <Create onCreate={handleCreate} onClose={() => setShowCreateContactModal(false)} />
      </Component.Modal>
    </div>
  );
}

export default Home;
