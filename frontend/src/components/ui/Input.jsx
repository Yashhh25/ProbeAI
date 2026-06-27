export default function Input({
  id,
  label,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={id} className="ds-label block">
          {label}
        </label>
      ) : null}
      <input id={id} name={id} className={['ds-input', inputClassName].join(' ')} {...props} />
    </div>
  );
}
