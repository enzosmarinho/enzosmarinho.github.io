import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enzo Marinho — Identidade visual',
  alternates: { canonical: '/marca' },
};

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return children;
}
