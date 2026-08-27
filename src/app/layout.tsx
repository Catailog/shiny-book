import type { Metadata } from 'next';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';

import { Toaster } from 'sonner';

import { AnimationPauseObserver } from '@/components/animation-pause-observer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TOAST_DURATION_MS } from '@/constants/toast';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shiny Book',
  description: '나만의 책을 만들어 인쇄하는 서비스',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script>
          {`(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`}
        </script>
        <AnimationPauseObserver />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster duration={TOAST_DURATION_MS} />
      </body>
    </html>
  );
}
