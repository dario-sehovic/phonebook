import React, { useRef, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames';

export interface TextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function Text({
  label,
  value,
  onChange,
  error,
}: TextProps) {
  const { current: id } = useRef(uuid());

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  }, [onChange]);

  const inputClassNames = classNames(
    'input__field',
    { 'input__field--error': error },
  );

  return (
    <div className="input__wrapper">
      <label htmlFor={id} className="input__label">{label}</label>
      <input
        id={id}
        className={inputClassNames}
        value={value}
        onChange={handleChange}
        type="text"
        autoComplete="new-password"
      />
      {error && <span className="input__error">{error}</span>}
    </div>
  );
}

export default Text;
