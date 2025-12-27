import { i18n, type Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div lang={lang}>
      {children}
    </div>
  );
}

