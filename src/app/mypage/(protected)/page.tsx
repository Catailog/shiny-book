import { defaultLocale, locales } from '@/locales';

export default function MypagePage() {
  const t = locales[defaultLocale];

  return (
    <div className="flex flex-1 flex-col gap-2 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.mypage.title}</h1>
    </div>
  );
}
