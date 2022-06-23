import React, { useRef, useMemo, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { CountryCode as PhoneCountryCode, AsYouType, validatePhoneNumberLength } from 'libphonenumber-js';
import Select, { SelectOption } from './Select';
import countries, { CountryCode } from '../../localization/country-codes';

export interface PhoneProps {
  label: string;
  country: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (country: string) => void;
}

function Phone({
  label,
  country,
  value,
  onChange,
  onSelect,
}: PhoneProps) {
  const { current: id } = useRef(uuid());

  const options = useMemo(() => countries.map((option: CountryCode) => ({
    ...option,
    id: option.code,
  })).sort((prevOption: CountryCode, nextOption: CountryCode) => {
    if (prevOption.label.toUpperCase() < nextOption.label.toUpperCase()) return -1;
    if (prevOption.label.toUpperCase() > nextOption.label.toUpperCase()) return 1;
    return 0;
  }), []);

  const handleSelect = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onSelect((event.target as HTMLButtonElement).value);
    onChange('');
  }, [onChange, onSelect]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = `${event.target.value.split('')?.[0] === '0' ? '' : '0'}${event.target.value.replace(/\D/g, '')}`;

    if (validatePhoneNumberLength(numberValue, country as PhoneCountryCode) === 'TOO_LONG') {
      return;
    }

    let formattedValue = (new AsYouType(country as PhoneCountryCode)).input(numberValue);
    const includesStart = event.target.value.includes('(');
    const includesEnd = event.target.value.includes(')');
    if ((includesStart && !includesEnd) || (!includesStart && includesEnd)) {
      formattedValue = formattedValue.replace('(', '').replace(')', '');
    }
    if (formattedValue.split('')?.[0] === '0') {
      formattedValue = formattedValue.substring(1);
    }
    onChange(formattedValue);
  }, [country, onChange]);

  const renderOption = useCallback((option: SelectOption) => (
    <>
      <img
        className="input__option-flag"
        loading="lazy"
        width="32"
        src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w80/${option.code.toLowerCase()}.png 2x`}
        alt={option.label}
      />
      <div className="input__option-label">
        {option.label}
      </div>
      <div className="input__option-code">
        {`+${option.phone}`}
      </div>
    </>
  ), []);

  const renderValue = useCallback((option: SelectOption) => (
    <>
      <img
        className="input__value-flag"
        loading="lazy"
        width="32"
        src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w80/${option.code.toLowerCase()}.png 2x`}
        alt={option.label}
      />
      <div className="input__value-label">
        {`+${option.phone}`}
      </div>
    </>
  ), []);

  return (
    <div className="input__wrapper">
      <Select
        label="Country code"
        value={country}
        options={options}
        renderOption={renderOption}
        renderValue={renderValue}
        onChange={handleSelect}
      />
      <div className="input__wrapper">
        <label htmlFor={id} className="input__label">{label}</label>
        <input
          id={id}
          className="input__field"
          value={value}
          onChange={handleChange}
          type="tel"
          autoComplete="new-password"
        />
      </div>
    </div>
  );
}

export default Phone;
