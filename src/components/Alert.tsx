import React, { useCallback } from 'react';
import Icon from '@mdi/react';
import { mdiInformation, mdiCheck, mdiAlertCircleOutline } from '@mdi/js';
import classNames from 'classnames';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

export interface AlertProps {
  message: string;
  variant?: AlertVariant;
}

function Alert({
  message,
  variant = 'info',
}: AlertProps) {
  const alertClassNames = classNames(
    'alert',
    `alert--${variant}`,
  );

  const getIconPath = useCallback(() => {
    if (variant === 'success') return mdiCheck;
    if (variant === 'warning') return mdiAlertCircleOutline;
    if (variant === 'danger') return mdiAlertCircleOutline;

    return mdiInformation;
  }, [variant]);

  return (
    <div className={alertClassNames}>
      <div className="alert__icon">
        <Icon size={1} path={getIconPath()} />
      </div>
      <div className="alert__message">{message}</div>
    </div>
  );
}

export default Alert;
