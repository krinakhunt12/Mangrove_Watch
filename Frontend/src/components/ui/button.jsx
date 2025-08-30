import React from "react";
import clsx from "clsx";

export function Button({
  children,
  className,
  variant = "default",
  ...props
}) {
  const baseStyles =
    "px-4 py-2 rounded-2xl font-medium transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    default:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
    