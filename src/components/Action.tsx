import React from 'react';
import Icon from '@mdi/react';
import classNames from 'classnames';

interface ActionProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon: string;
  helpText?: string;
  selected?: boolean;
}

function Action({
  onClick,
  icon,
  helpText,
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
      {helpText && (
        <div className="action__tooltip">
          {helpText}
        </div>
      )}
    </button>
  );
}

export default Action;
