import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

// TextField composes only the global ui_* classes (see global.scss), so it
// intentionally has no *.module.scss — there is nothing left to scope.
interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/** A labelled text input wired for react-hook-form via a forwarded ref. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, id, ...rest }, ref) {
    return (
      <div className="ui_field">
        <label className="ui_label" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className="ui_input"
          aria-invalid={Boolean(error)}
          {...rest}
        />
        {error ? <span className="ui_field_error">{error}</span> : null}
      </div>
    )
  },
)
