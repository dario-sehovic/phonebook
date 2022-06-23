import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { v4 as uuid } from 'uuid';

export type SelectOption = Record<string, any> & { id: string };

export interface SelectProps {
  label: string;
  onChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  options: Array<SelectOption>;
  renderOption: (option: SelectOption) => JSX.Element;
  renderValue: (option: SelectOption) => JSX.Element;
  value: string;
}

function Select({
  label,
  onChange,
  options,
  renderOption,
  renderValue,
  value,
}: SelectProps) {
  const { current: id } = useRef(uuid());
  const selectWrapperRef = useRef<HTMLDivElement>(null);
  const selectInputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!selectWrapperRef.current?.contains(event.target as HTMLElement)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleFocus = useCallback(() => {
    setDropdownOpen(true);
  }, [setDropdownOpen]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onChange(event);
    setDropdownOpen(false);
  }, [setDropdownOpen, onChange]);

  const displayValue = useMemo(() => (
    options.find((option: SelectOption) => option.id === value)
  ), [options, value]);

  return (
    <div ref={selectWrapperRef} className="input__wrapper">
      <input
        ref={selectInputRef}
        type="text"
        id={id}
        className="input__field"
        value={value}
        readOnly
        onFocus={handleFocus}
      />
      {displayValue && <div className="input__value">{renderValue(displayValue)}</div>}
      <label htmlFor={id} className="input__label">{label}</label>
      {dropdownOpen && (
        <div className="input__dropdown__container">
          <ul className="input__dropdown">
            {options.map((option: SelectOption) => (
              <li key={option.id} className="input__option">
                <button
                  type="button"
                  onClick={handleClick}
                  value={option.id}
                >
                  {renderOption(option)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Select;
