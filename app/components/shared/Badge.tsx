import React from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "gray"
  | "primary";

interface BadgeProps {
  text: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "default",
  className = "",
}) => {
  // Define color variants
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-indigo-100 text-indigo-800",
    gray: "bg-gray-100 text-gray-800",
    primary: "bg-indigo-600 text-white",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {text}
    </span>
  );
};

export default Badge;
