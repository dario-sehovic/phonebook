import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import classNames from 'classnames';

type ButtonType = 'submit' | 'button' | 'link' | 'label';
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'tertiary' | 'error';

interface ButtonProps {
  block?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  text?: string;
  to?: string;
  type?: ButtonType;
  variant?: ButtonVariant;
}

function Button({
  block = false,
  loading,
  onClick,
  text = 'Submit',
  to = '/',
  type = 'submit',
  variant = 'primary',
}: ButtonProps) {
  const buttonClassNames = classNames(
    'button',
    `button--${variant}`,
    { 'button--block': block },
  );

  if (loading) {
    return (
      <button type="button" className={buttonClassNames} disabled>
        <Icon size={1} path={mdiLoading} spin />
        {text}
      </button>
    );
  }

  if (type === 'link') return <Link to={to} className={buttonClassNames}>{text}</Link>;
  if (type === 'submit') return <button type="submit" className={buttonClassNames}>{text}</button>;
  if (type === 'label') return <span className={buttonClassNames}>{text}</span>;
  return <button type="button" className={buttonClassNames} onClick={onClick}>{text}</button>;
}

export default Button;
