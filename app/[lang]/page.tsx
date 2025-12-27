import { redirect } from 'next/navigation';
import { type Locale } from '@/i18n.config';

export default async function LangHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  // Redirect to scan page - users scan QR code to access menu
  redirect(`/${lang}/scan`);
}

