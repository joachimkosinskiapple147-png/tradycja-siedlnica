'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

const baseSchema = {
  name: z.string().trim().min(2, 'Podaj imię i nazwisko.').max(120),
  email: z.string().trim().email('Podaj poprawny adres e-mail.'),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Wiadomość jest zbyt krótka.').max(3000),
  consent: z.literal('on', { errorMap: () => ({ message: 'Wymagana zgoda na przetwarzanie danych.' }) }),
  // honeypot antyspamowy — musi być pusty
  company: z.string().max(0).optional().or(z.literal('')),
};

const contactSchema = z.object({
  ...baseSchema,
  subject: z.string().trim().max(160).optional().or(z.literal('')),
  country: z.string().trim().max(80).optional().or(z.literal('')),
});

const inquirySchema = z.object({
  ...baseSchema,
  country: z.string().trim().max(80).optional().or(z.literal('')),
  horse_slug: z.string().trim().max(200).optional().or(z.literal('')),
  horse_name: z.string().trim().max(200).optional().or(z.literal('')),
});

async function persist(payload: Record<string, unknown>): Promise<FormState> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('contact_messages').insert(payload);
      if (error) throw error;
    } catch (e) {
      console.error('[inquiries] błąd zapisu do bazy:', e);
      return {
        ok: false,
        message: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń: 881 293 333.',
      };
    }
  } else {
    // Tryb bez bazy — logujemy zgłoszenie i zwracamy sukces (do celów demonstracyjnych).
    console.info('[inquiries] (tryb demonstracyjny, brak bazy) zgłoszenie:', payload);
  }

  // Powiadomienie e-mail: patrz README → „Konfiguracja e-mail”. Wysyłkę realizuje
  // funkcja brzegowa / webhook Supabase lub dostawca (Resend). Hak w jednym miejscu:
  await notifyAdminEmail(payload).catch((e) => console.error('[email] pominięto:', e));

  return {
    ok: true,
    message: 'Dziękujemy — wiadomość została wysłana. Odezwiemy się najszybciej, jak to możliwe.',
  };
}

async function notifyAdminEmail(_payload: Record<string, unknown>) {
  // Miejsce na integrację e-mail (np. Resend). Aktywne po ustawieniu RESEND_API_KEY.
  if (!process.env.RESEND_API_KEY) return;
  // Przykład (do włączenia po dodaniu zależności 'resend' i klucza):
  // const { Resend } = await import('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ ... });
}

function zodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: 'Sprawdź zaznaczone pola.', errors: zodErrors(parsed.error) };
  }
  const d = parsed.data;
  return persist({
    name: d.name,
    email: d.email,
    phone: d.phone || null,
    country: d.country || null,
    subject: d.subject || 'Zapytanie ze strony',
    message: d.message,
    status: 'nowa',
  });
}

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: 'Sprawdź zaznaczone pola.', errors: zodErrors(parsed.error) };
  }
  const d = parsed.data;
  return persist({
    name: d.name,
    email: d.email,
    phone: d.phone || null,
    country: d.country || null,
    message: d.message,
    horse_slug: d.horse_slug || null,
    horse_name: d.horse_name || null,
    subject: d.horse_name ? `Zapytanie o konia: ${d.horse_name}` : 'Zapytanie o konia',
    status: 'nowa',
  });
}
