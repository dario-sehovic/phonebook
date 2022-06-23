import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
}

function Card({
  children,
  title,
}: CardProps) {
  return (
    <div className="card">
      {title && (
        <div className="card__header">
          <h2 className="card__title">
            {title}
          </h2>
        </div>
      )}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
}

export default Card;
