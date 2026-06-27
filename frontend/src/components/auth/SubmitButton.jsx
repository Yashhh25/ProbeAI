import Button from '../ui/Button';

export default function SubmitButton({ children, isLoading, disabled }) {
  return (
    <Button type="submit" fullWidth isLoading={isLoading} disabled={disabled}>
      {children}
    </Button>
  );
}
