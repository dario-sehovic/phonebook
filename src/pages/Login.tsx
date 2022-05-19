import React from 'react';
import { useFormik } from 'formik';

function Login() {
  const formik = useFormik({
    initialValues: {
      phone: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Phone"
        name="phone"
        value={formik.values.phone}
        onChange={formik.handleChange}
      />
      <button type="submit">Login</button>
    </div>
  );
}

export default Login;
