'use client';

import { useFormState } from 'react-dom';
import { submitInquiry, type FormState } from '@/actions/inquiries';
import { Field, TextArea, Consent, Honeypot, SubmitButton, FormResult } from './FormBits';

const initial: FormState = { ok: false, message: '' };

export default function InquiryForm({ horseSlug, horseName }: { horseSlug: string; horseName: string }) {
  const [state, action] = useFormState(submitInquiry, initial);

  if (state.ok) {
    return <FormResult state={state} />;
  }

  return (
    <form action={action} className="relative space-y-4">
      <Honeypot />
      <input type="hidden" name="horse_slug" value={horseSlug} />
      <input type="hidden" name="horse_name" value={horseName} />

      <p className="text-sm text-charcoal/70">
        Zapytanie dotyczy konia: <span className="font-semibold text-navy">{horseName}</span>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Imię i nazwisko" name="name" required autoComplete="name" error={state.errors?.name} />
        <Field label="E-mail" name="email" type="email" required autoComplete="email" error={state.errors?.email} />
        <Field label="Telefon" name="phone" type="tel" autoComplete="tel" error={state.errors?.phone} />
        <Field label="Kraj" name="country" autoComplete="country-name" />
      </div>
      <TextArea
        label="Wiadomość"
        name="message"
        required
        error={state.errors?.message}
        defaultValue={`Dzień dobry, jestem zainteresowany/a koniem ${horseName}. Proszę o kontakt.`}
      />
      <Consent error={state.errors?.consent} />
      <FormResult state={state.message ? state : null} />
      <SubmitButton label="Wyślij zapytanie" />
    </form>
  );
}
