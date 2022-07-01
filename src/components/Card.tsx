import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { mdiClose, mdiPlus } from '@mdi/js';
import Action from './Action';

interface CardProps {
  children: React.ReactNode;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onAddNew?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  sticky?: boolean;
  title?: string;
}

function Card({
  children,
  onClose,
  onAddNew,
  sticky,
  title,
}: CardProps) {
  const cardRef = useRef(null);
  const [magnified, setMagnified] = useState(false);

  const cardClassNames = classNames(
    'card',
    { 'card--sticky': sticky, 'card--magnified': magnified },
  );

  useEffect(() => {
    const handleScroll = () => {
      if (sticky && cardRef.current) {
        const rectangle = (cardRef.current as Element).getBoundingClientRect();
        if (rectangle.top <= 0 !== magnified) {
          setMagnified(rectangle.top <= 0);
        }
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, [magnified, sticky]);

  return (
    <div ref={cardRef} className={cardClassNames}>
      {title && (
        <div className="card__header">
          <h2 className="card__title">
            {title}
          </h2>
          {onClose && <Action onClick={onClose} icon={mdiClose} helpText="Close" />}
          {onAddNew && <Action onClick={onAddNew} icon={mdiPlus} helpText="Add new" />}
        </div>
      )}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
}

export default Card;
