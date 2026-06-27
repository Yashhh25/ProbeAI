import Input from '../ui/Input';

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  disabled = false,
  required = true,
}) {
  return (
    <Input
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      disabled={disabled}
      required={required}
    />
  );
}
