import React from 'react';
import Icon from '@mdi/react';
import classNames from 'classnames';

interface ActionProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon: string;
  selected?: boolean;
}

function Action({
  onClick,
  icon,
  selected,
}: ActionProps) {
  const actionClassNames = classNames(
    'action',
    { 'action--selected': selected },
  );

  return (
    <button
      type="button"
      className={actionClassNames}
      onClick={onClick}
    >
      <Icon size={1} path={icon} />
    </button>
  );
}

export default Action;
