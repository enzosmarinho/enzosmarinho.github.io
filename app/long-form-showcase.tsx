'use client';
import { useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import EmbeddedFilm from './embedded-film';
import { projects } from './portfolio-data';

const longFilms = projects.filter(project => ['nf-podcast', 'kayky'].includes(project.id));

export default function LongFormShowcase({ suspended, onInquire }: { suspended: boolean; onInquire: () => void }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const project = longFilms[selected];
  const film = project.films[0];
  return (
    <section id="filmes-completos" className="long-form-proof shell" aria-labelledby="long-form-title">
      <div className="long-form-intro">
        <span className="eyebrow">Vídeos longos & podcast</span>
        <h2 id="long-form-title">O assunto vai<br /><em>além de um corte.</em></h2>
        <p>Uma conversa inteira. Um treino explicado do começo ao fim. Também trabalho com vídeos que precisam de mais tempo para contar sua história.</p>
        <p>Conheça os filmes completos e veja minha participação em cada projeto.</p>
        <a className="link-arrow" href="#conversa" onClick={onInquire}>Vamos conversar sobre o seu vídeo <ArrowUpRight size={19} aria-hidden="true" /></a>
      </div>
      <div className="long-form-cinema">
        <div ref={screen} tabIndex={-1} className="long-form-screen" aria-label="Tela dos filmes completos">
          {playing ? (
            <EmbeddedFilm key={film.id} film={film} pauseWhenOffscreen suspended={suspended} focusFrom={screen} />
          ) : (
            <button className="long-form-cover" onClick={() => { screen.current?.focus(); setPlaying(true); }} aria-label={'Reproduzir aqui: ' + film.title}>
              <img src={'./posters/' + film.id + '.webp'} alt="" width={1280} height={720} loading="lazy" />
              <span className="long-form-play"><Play size={24} fill="currentColor" aria-hidden="true" /><span>Assistir ao filme completo</span></span>
              <span className="long-form-duration">{film.duration}</span>
            </button>
          )}
        </div>
        <div className="long-form-caption" aria-live="polite">
          <div><strong>{project.client}</strong><span>{film.title}</span></div>
          <span>{project.id === 'nf-podcast' ? 'Captação de podcast' : 'Estrutura, edição e cor'}</span>
        </div>
        <div className="long-form-picker" role="group" aria-label="Escolher filme completo">
          {longFilms.map((item, index) => (
            <button key={item.id} aria-pressed={index === selected} onClick={() => { if (index !== selected) { setPlaying(false); setSelected(index); } }}>
              <img src={'./posters/' + item.films[0].id + '.webp'} alt="" width={1280} height={720} loading="lazy" />
              <span><strong>{item.client}</strong><small>{item.id === 'nf-podcast' ? 'Podcast' : 'Vídeo de treino'} · {item.films[0].duration}</small></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
