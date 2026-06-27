export default function Textarea({
  id,
  label,
  className = '',
  textareaClassName = '',
  ...props
}) {
  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={id} className="ds-label block">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        name={id}
        className={['ds-textarea', textareaClassName].join(' ')}
        {...props}
      />
    </div>
  );
}
