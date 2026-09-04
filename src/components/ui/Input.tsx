import type { InputHTMLAttributes } from "react";

import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;

  error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name ?? undefined;

  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={inputId}>
        {label}
      </label>

      <input
        id={inputId}
        className={["ui-field__input", error ? "ui-field__input--error" : ""]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {error && (
        <span className="ui-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
