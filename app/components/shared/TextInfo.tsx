import React from "react";

interface TextInfoProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

const TextInfo: React.FC<TextInfoProps> = ({
  label,
  value,
  valueClassName = "font-medium",
}) => {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
};

export default TextInfo;
