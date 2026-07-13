'use client';

import { useFormState } from 'react-dom';
import { submitContact, type FormState } from '@/actions/inquiries';
import { Field, TextArea, Consent, Honeypot, SubmitButton, FormResult } from './FormBits';

const initial: FormState = { ok: false, message: '' };

export default function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, action] = useFormState(submitContact, initial);

  if (state.ok) return <FormResult state={state} />;

  return (
    <form action={action} className="relative space-y-4">
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Imię i nazwisko" name="name" required autoComplete="name" error={state.errors?.name} />
        <Field label="E-mail" name="email" type="email" required autoComplete="email" error={state.errors?.email} />
        <Field label="Telefon" name="phone" type="tel" autoComplete="tel" error={state.errors?.phone} />
        <Field label="Temat" name="subject" error={state.errors?.subject} defaultValue={defaultSubject} />
      </div>
      <TextArea label="Wiadomość" name="message" required error={state.errors?.message} />
      <Consent error={state.errors?.consent} />
      <FormResult state={state.message ? state : null} />
      <SubmitButton />
    </form>
  );
}
