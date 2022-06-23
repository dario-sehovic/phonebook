import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

type ButtonType = 'submit' | 'button' | 'link' | 'label';
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'tertiary';

interface ButtonProps {
  block?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  text?: React.ReactText,
  to?: string,
  type?: ButtonType,
  variant?: ButtonVariant,
}

function Button({
  block = false,
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

  if (type === 'link') return <Link to={to} className={buttonClassNames}>{text}</Link>;
  if (type === 'submit') return <button type="submit" className={buttonClassNames}>{text}</button>;
  if (type === 'label') return <span className={buttonClassNames}>{text}</span>;
  return <button type="button" className={buttonClassNames} onClick={onClick}>{text}</button>;
}

export default Button;
