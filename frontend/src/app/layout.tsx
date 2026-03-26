import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';

export const metadata: Metadata = {
  title: 'Pokemon TCG Manager',
  description: 'Search cards, build decks, track rotation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
