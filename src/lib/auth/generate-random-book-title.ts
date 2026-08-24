import { pick } from '@/lib/random';
import type { Locale } from '@/locales';

const ANIMALS: Record<Locale, readonly string[]> = {
  ko: ['고양이', '여우', '판다', '수달', '펭귄', '라마', '미어캣', '카피바라', '고슴도치', '물개'],
  en: [
    'Cat',
    'Fox',
    'Panda',
    'Otter',
    'Penguin',
    'Llama',
    'Meerkat',
    'Capybara',
    'Hedgehog',
    'Seal',
  ],
};

const ADJECTIVES: Record<Locale, readonly string[]> = {
  ko: [
    '멋진',
    '근사한',
    '귀여운',
    '행운의',
    '신비로운',
    '몽환적인',
    '아늑한',
    '화창한',
    '우아한',
    '행복한',
  ],
  en: ['Nice', 'Fancy', 'Cute', 'Lucky', 'Magical', 'Dreamy', 'Cozy', 'Sunny', 'Elegant', 'Happy'],
};

export function generateRandomBookTitle(locale: Locale): string {
  const animal = pick(ANIMALS[locale]);
  const adjective = pick(ADJECTIVES[locale]);

  return locale === 'en' ? `${animal}'s ${adjective} Book` : `${animal}의 ${adjective} 책`;
}
