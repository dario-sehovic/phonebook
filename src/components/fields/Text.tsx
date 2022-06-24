import React, { useRef, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

export interface TextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function Text({
  label,
  value,
  onChange,
}: TextProps) {
  const { current: id } = useRef(uuid());

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <div className="input__wrapper">
      <label htmlFor={id} className="input__label">{label}</label>
      <input
        id={id}
        className="input__field"
        value={value}
        onChange={handleChange}
        type="text"
        autoComplete="new-password"
      />
    </div>
  );
}

export default Text;
