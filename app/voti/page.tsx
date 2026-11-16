'use client';
import '../v4.css';
import { useState } from 'react';
import VideoPreview from '../video-preview';
import { votiFilms, type VotiFilm } from '../voti-films';

const categories = ['Todos', 'Cenas & campanhas', 'Demonstrações', 'Visitas', 'Apresentação'];
// Destaques já selecionados no CLAUDE.md do repositório.
const featured = ['DVjvzjvESOn', 'DTgXN2FiDV6', 'DSldztZCA9P'];

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const when = (film: VotiFilm) => {
  const [d, m, y] = film.date.split(' ');
  return Number(y) * 10000 + (months.indexOf(m) + 1) * 100 + Number(d);
};
const ordered = [...votiFilms].sort((a, b) =>
  categories.indexOf(a.category) - categories.indexOf(b.category) || when(b) - when(a));

function Card({ film }: { film: VotiFilm }) {
  return (
    <a href={film.url} target="_blank" rel="noreferrer">
      <VideoPreview id={film.id} landscape={film.landscape} mode="hover" />
      <span className="work-cap"><strong>{film.title}</strong> {film.category}, {film.date}</span>
    </a>
  );
}

export default function VotiArchive() {
  const [category, setCategory] = useState('Todos');
  const films = ordered.filter((film) => !featured.includes(film.id) && (category === 'Todos' || film.category === category));
  const top = featured.map((id) => votiFilms.find((f) => f.id === id)).filter((f): f is VotiFilm => Boolean(f));
  return (
    <main className="v4" id="inicio">
      <header className="bar">
        <div className="wrap bar-in">
          <a href="/" className="mark">Enzo Marinho</a>
          <nav aria-label="Principal">
            <a href="/#trabalhos">Voltar aos trabalhos</a>
            <a href="/#contato" className="bar-cta">Contato</a>
          </nav>
        </div>
      </header>

      <section className="archive-head">
        <div className="wrap">
          <h1>VOTI Software</h1>
          <p>Vídeos que fiz como videomaker CLT na VOTI: câmera, roteiro, atuação e edição. Cada um abre a publicação original.</p>
        </div>
      </section>

      <section className="archive-top" aria-labelledby="top-title">
        <div className="wrap">
          <h2 id="top-title">Para começar</h2>
          <ul className="works-grid archive-grid">
            {top.map((film) => <li key={film.id} className={film.landscape ? 'is-landscape' : undefined}><Card film={film} /></li>)}
          </ul>
        </div>
      </section>

      <section className="archive" aria-labelledby="all-title">
        <div className="wrap">
          <h2 id="all-title">O acervo</h2>
          <div className="filters" role="group" aria-label="Linguagem do vídeo">
            {categories.map((value) => (
              <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>
                {value} <span>{ordered.filter((f) => !featured.includes(f.id) && (value === 'Todos' || f.category === value)).length}</span>
              </button>
            ))}
          </div>
          <p className="archive-count" aria-live="polite">{films.length} vídeos, do mais novo ao mais antigo</p>
          <ul className="works-grid archive-grid">
            {films.map((film) => <li key={film.id} className={film.landscape ? 'is-landscape' : undefined}><Card film={film} /></li>)}
          </ul>
        </div>
      </section>

      <section className="archive-end" aria-labelledby="end-title">
        <div className="wrap archive-end-in">
          <h2 id="end-title">Hoje atendo pequenos negócios.</h2>
          <p>Você grava no celular; eu encontro o formato e cuido do resto.</p>
          <a href="/#contato" className="btn">Montar a mensagem</a>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <a href="/" className="mark">Enzo Marinho</a>
          <span>Araçatuba e remoto</span>
          <a href="/#contato">Contato</a>
        </div>
      </footer>
    </main>
  );
}
