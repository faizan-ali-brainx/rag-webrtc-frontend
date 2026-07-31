// Spinner uses Tailwind utilities only — nothing to scope, so no *.module.scss.

/** A small inline loading spinner. */
export function Spinner() {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  )
}
