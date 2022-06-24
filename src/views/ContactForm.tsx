import React, { useCallback, useState, useMemo } from 'react';
import * as Component from '../components';

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    const newErrorMessages: Record<string, string> = {};

    if (name.replace(/[^a-z0-9]/gi, '').length < 8) {
      newErrorMessages.name = 'Name is too short.';
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrorMessages.email = 'Invalid email address.';
    }

    if (!subject) {
      newErrorMessages.subject = 'Subject is required.';
    }

    if (!message) {
      newErrorMessages.message = 'Message is required.';
    }

    setErrorMessages(newErrorMessages);

    if (Object.keys(newErrorMessages).length) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      console.table({
        name,
        email,
        subject,
        message,
      });

      setLoading(false);
      setSuccess(true);
    }, 500);
  }, [email, message, name, subject]);

  const contactForm = useMemo(() => (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <Component.Field.Text
          label="Name"
          value={name}
          onChange={setName}
          error={errorMessages.name}
        />
        <Component.Field.Text
          label="Email"
          value={email}
          onChange={setEmail}
          error={errorMessages.email}
        />
        <Component.Field.Text
          label="Subject"
          value={subject}
          onChange={setSubject}
          error={errorMessages.subject}
        />
        <Component.Field.TextArea
          label="Message"
          value={message}
          onChange={setMessage}
          error={errorMessages.message}
        />
        <Component.Button text={!loading ? 'Send' : 'Sending...'} loading={loading} />
      </fieldset>
    </form>
  ), [email, errorMessages, handleSubmit, loading, message, name, subject]);

  const successAlert = useMemo(() => (
    <Component.Alert variant="success" message="Message sent successfully." />
  ), []);

  return (
    <Component.Card title="Get in Touch">
      {!success ? contactForm : successAlert}
    </Component.Card>
  );
}

export default ContactForm;
