import React from 'react';
import * as View from '../views';

function Home() {
  return (
    <div className="container">
      <View.Contacts />
      <View.ContactForm />
    </div>
  );
}

export default Home;
