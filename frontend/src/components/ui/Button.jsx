const variants = {
  primary: 'ds-btn-primary',
  secondary: 'ds-btn-secondary',
  ghost: 'ds-btn-ghost',
};

const sizes = {
  default: '',
  sm: 'ds-btn-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={[
        variants[variant],
        sizes[size],
        fullWidth ? 'ds-btn-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className={[
              'ds-spinner',
              variant === 'primary' ? 'ds-spinner-light' : '',
            ].join(' ')}
            aria-hidden="true"
          />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
