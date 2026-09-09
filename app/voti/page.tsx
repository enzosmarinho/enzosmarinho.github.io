'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import VideoPreview from '../video-preview';
import { votiFilms } from '../voti-films';

const categories = ['Todos', 'Cenas & campanhas', 'Demonstrações', 'Visitas', 'Apresentação'];
export default function VotiArchive() {
  const [category, setCategory] = useState('Todos');
  const films = votiFilms.filter(film => category === 'Todos' || film.category === category);
  return <main className="enzo-site client-archive">
    <header className="shell archive-nav"><a href="/" className="wordmark">Enzo Marinho</a><a href="/#trabalhos"><ArrowLeft size={17} /> Voltar ao portfólio</a></header>
    <section className="shell archive-intro">
      <span className="eyebrow">Acervo de trabalhos · experiência CLT</span>
      <h1>VOTI Software.<br /><em>Várias formas de contar.</em></h1>
      <p>Da cena com personagens à explicação na tela. Vídeos produzidos durante minha experiência na VOTI, organizados pela linguagem de cada peça.</p>
      <a className="link-arrow" href="/#conversa">Quero conteúdo para minha empresa <ArrowUpRight size={18} /></a>
    </section>
    <section className="shell archive-library" aria-label="Vídeos da VOTI">
      <div className="work-filters" aria-label="Linguagem do vídeo">{categories.map(value => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}<sup>{votiFilms.filter(f => value === 'Todos' || f.category === value).length}</sup></button>)}</div>
      <p className="archive-count" aria-live="polite">{films.length} trabalhos · clique para assistir à publicação original</p>
      <div className="archive-grid">{films.map(film => <a key={film.id} className={'film-tile' + (film.landscape ? ' film-landscape' : '')} href={film.url} aria-label={'Assistir: ' + film.title}>
        <span className="film-image"><VideoPreview id={film.id} landscape={film.landscape} /><span className="tile-play"><ArrowUpRight size={19} aria-hidden="true" /></span><span className="film-duration">{film.duration}</span></span>
        <span className="tile-title">{film.title}<ArrowUpRight size={16} aria-hidden="true" /></span><span className="tile-format">{film.category} · {film.date}</span>
      </a>)}</div>
    </section>
    <footer className="shell archive-footer"><span>Enzo Marinho · vídeo, criação e apoio</span><a className="link-arrow" href="/#conversa">Vamos conversar <ArrowUpRight size={18} /></a></footer>
  </main>;
}
