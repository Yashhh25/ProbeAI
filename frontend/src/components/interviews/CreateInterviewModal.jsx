import { useCallback, useEffect, useState } from 'react';
import FormField from '../auth/FormField';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import useCreateInterview from '../../hooks/useCreateInterview';

const initialFormState = {
  title: '',
  topic: '',
  description: '',
};

export default function CreateInterviewModal({
  isOpen,
  onClose,
}) {
  const [form, setForm] = useState(initialFormState);

  const createInterviewMutation = useCreateInterview();

  const handleClose = useCallback(() => {
    setForm(initialFormState);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () =>
      document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  function handleChange(field) {
    return (event) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await createInterviewMutation.mutateAsync(form);

      handleClose();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-void/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-label="Close modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-interview-title"
        className="ds-glass-strong relative w-full max-w-lg rounded-2xl p-6 shadow-elevated sm:p-8"
      >
        <div className="mb-6">
          <h2
            id="create-interview-title"
            className="ds-title text-xl"
          >
            Create research interview
          </h2>

          <p className="ds-body mt-1">
            Set up a new AI-powered interview to collect
            customer insights.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <FormField
            id="interview-title"
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            disabled={createInterviewMutation.isPending}
          />

          <FormField
            id="interview-topic"
            label="Topic"
            value={form.topic}
            onChange={handleChange('topic')}
            disabled={createInterviewMutation.isPending}
          />

          <Textarea
            id="interview-description"
            label="Description"
            rows={4}
            value={form.description}
            onChange={handleChange('description')}
            disabled={createInterviewMutation.isPending}
            required
            placeholder="What customer insights are you trying to uncover?"
          />

          {createInterviewMutation.isError && (
            <p className="text-sm text-red-400">
              Failed to create interview.
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={createInterviewMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={createInterviewMutation.isPending}
            >
              Create Interview
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}