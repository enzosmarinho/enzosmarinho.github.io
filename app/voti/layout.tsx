import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'VOTI Software — trabalhos de Enzo Marinho',
  description: 'Filmes, demonstrações, visitas e conteúdo para software. Conheça a seleção de trabalhos de Enzo Marinho para a VOTI.',
  alternates: { canonical: '/voti' },
};
export default function VotiLayout({ children }: { children: React.ReactNode }) { return children; }
