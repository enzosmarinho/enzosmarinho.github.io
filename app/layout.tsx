import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Enzo Marinho — Boas histórias. No ritmo certo.', description: 'Criação e produção de conteúdo para quem quer começar e suporte para quem já produz. Conheça os trabalhos de Enzo Marinho.', icons:{icon:'/enzo-icon.svg'}, metadataBase:new URL('https://enzosmarinho.github.io'),alternates:{canonical:'/'},robots:{index:true,follow:true} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html>; }
