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
    <div ref={selectWrapperRef} className="select-wrapper">
      <input
        ref={selectInputRef}
        type="text"
        id={id}
        className="select-input"
        value={value}
        readOnly
        onFocus={handleFocus}
      />
      {displayValue && <div className="select-value">{renderValue(displayValue)}</div>}
      <label htmlFor={id} className="select-label">{label}</label>
      {dropdownOpen && (
        <ul className="select-dropdown">
          {options.map((option: SelectOption) => (
            <li key={option.id} className="select-option">
              <button
                className="select-option-button"
                type="button"
                onClick={handleClick}
                value={option.id}
              >
                {renderOption(option)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
