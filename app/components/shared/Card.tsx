import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  header,
  footer,
}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 ${className}`}
    >
      {header && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">{header}</div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">{footer}</div>
      )}
    </div>
  );
};

export default Card;
