import React from "react";
import clsx from "clsx";

export function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "bg-white border rounded-2xl shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, variant = "default", ...props }) {
  const variantStyles = {
    default: "text-lg font-semibold text-green-800",
    primary: "text-xl font-bold text-green-700",
    secondary: "text-md font-medium text-green-600",
  };
  
  return (
    <h3
      className={clsx(
        "flex items-center gap-2",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div
      className={clsx("p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}