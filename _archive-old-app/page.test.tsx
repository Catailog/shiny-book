import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { defaultLocale, locales } from '@/locales';

import Home from './page';

vi.mock('@/lib/announcements/get-announcements', () => ({
  getAnnouncements: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/reviews/get-reviews', () => ({
  getReviews: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/orders/get-sold-book-count', () => ({
  getSoldBookCount: vi.fn().mockResolvedValue(0),
}));

describe('Home', () => {
  it('renders without crashing', async () => {
    const t = locales[defaultLocale];
    render(await Home());
    expect(screen.getByText(t.site.home.steps.title)).toBeInTheDocument();
  });
});
