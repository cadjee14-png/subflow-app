"use client";

import React, { useState, useCallback } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Use "white" for gradient/dark buttons, "violet" for light/outline buttons */
  rippleVariant?: "white" | "violet";
}

export function RippleButton({
  children,
  className = "",
  style,
  onClick,
  rippleVariant = "white",
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setRipples((prev) => [
        ...prev,
        { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
      ]);
      // Clean up after animation ends
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 750);
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <button
      {...props}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onClick={handleClick}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className={`ripple-circle ${rippleVariant === "violet" ? "" : "ripple-circle-white"}`}
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </button>
  );
}
