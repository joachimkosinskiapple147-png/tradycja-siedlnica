'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

export function Field({
  label,
  name,
  type = 'text',
  required,
  error,
  autoComplete,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-[0.72rem] font-medium uppercase tracking-wide2 text-charcoal/70">
        {label} {required && <span className="text-brass-deep">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        className={cn(
          'mt-2 w-full border bg-white px-4 py-3 text-navy outline-none transition-colors placeholder:text-charcoal/35 focus:border-brass',
          error ? 'border-red-400' : 'border-navy/20'
        )}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  required,
  error,
  rows = 5,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-[0.72rem] font-medium uppercase tracking-wide2 text-charcoal/70">
        {label} {required && <span className="text-brass-deep">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        className={cn(
          'mt-2 w-full resize-y border bg-white px-4 py-3 text-navy outline-none transition-colors placeholder:text-charcoal/35 focus:border-brass',
          error ? 'border-red-400' : 'border-navy/20'
        )}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Consent({ error }: { error?: string }) {
  return (
    <label className="flex items-start gap-3 text-sm text-charcoal/75">
      <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-forest" />
      <span>
        Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie zgodnie z{' '}
        <a href="/polityka-prywatnosci" className="link-underline text-navy">polityką prywatności</a>. *
        {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      </span>
    </label>
  );
}

/** Honeypot — ukryte pole; boty je wypełnią, ludzie nie. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
      <label>
        Firma
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ label = 'Wyślij wiadomość' }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto disabled:opacity-60">
      {pending ? 'Wysyłanie…' : label}
    </button>
  );
}

export function FormResult({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state?.message) return null;
  return (
    <p
      role="status"
      className={cn(
        'border px-4 py-3 text-sm',
        state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'
      )}
    >
      {state.message}
    </p>
  );
}
