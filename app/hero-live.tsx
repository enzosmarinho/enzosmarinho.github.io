'use client';
import { useRef } from 'react';
import VideoPreview from './video-preview';
import { projects } from './portfolio-data';
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
const clips = [
  {
    id: 'DYC7byPyEnW',
    project: 'magnos',
    name: 'Magnos Steel',
    kind: 'Presença & produto',
  },
  {
    id: 'Dc32NvUO-MR',
    project: 'ciclo',
    name: 'Ciclo Avenida',
    kind: 'Produto em movimento',
  },
  {
    id: 'DYDiclAOSod',
    project: 'nf',
    name: 'O Negócio Sem Filtro',
    kind: 'Edição & cortes',
  },
  {
    id: 'DUf-ODMDWqA',
    project: 'jiu',
    name: '8848 Jiu-Jitsu',
    kind: 'Uma história com humor',
  },
  {
    id: 'DSldztZCA9P',
    project: 'voti-filmes',
    name: 'VOTI Software',
    kind: 'Uma ideia vira filme',
  },
];
function LiveFilm({
  clip,
}: {
  clip: (typeof clips)[number];
}) {
  return (
    <a
      className="live-film"
      href={projects.find(p => p.id === clip.project)!.films.find(f => f.id === clip.id)!.url}
      target="_self" rel="noopener noreferrer"
      aria-label={'Assistir: ' + clip.name + ' — ' + clip.kind}
    >
      <span className="live-picture">
        <VideoPreview id={clip.id} eager={clip.id === clips[0].id} />
        <span className="live-play">
          <ArrowUpRight size={19} aria-hidden="true" />
        </span>
      </span>
      <span className="live-caption">
        <strong>{clip.name}</strong>
        <ArrowUpRight size={16} aria-hidden="true" />
        <small>{clip.kind}</small>
      </span>
    </a>
  );
}
export default function HeroLive() {
  const strip = useRef<HTMLDivElement>(null);
  function browse(direction: number) {
    const el = strip.current;
    if (!el) return;
    const edge = el.scrollWidth - el.clientWidth;
    const target =
      direction > 0 && el.scrollLeft >= edge - 5
        ? 0
        : direction < 0 && el.scrollLeft <= 5
          ? edge
          : el.scrollLeft + direction * el.clientWidth * 0.9;
    el.scrollTo({ left: target, behavior: 'smooth' });
  }
  return (
    <section className="opening" id="inicio" aria-labelledby="opening-title">
      <div className="opening-heading shell">
        <div>
          <span className="eyebrow">Vídeo, criação e apoio à produção</span>
          <h1 id="opening-title">
            Boas histórias.
            <br />
            No <em>ritmo</em> certo.
          </h1>
        </div>
        <div className="opening-intro">
          <p>
            Roteiros, edição, design e vídeos para empresas e criadores.
            Do primeiro conteúdo ao apoio na sua próxima produção.
          </p>
          <a href="#trabalhos" className="link-arrow">
            Conheça meu trabalho <ArrowDown size={19} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div
        ref={strip}
        className="film-strip shell"
        aria-label="Cinco trabalhos em movimento"
      >
        {clips.map((clip) => (
          <LiveFilm
            key={clip.id}
            clip={clip}
          />
        ))}
      </div>
      <div className="strip-navigation shell">
        <span>Mais trabalhos</span>
        <button onClick={() => browse(-1)} aria-label="Ver filmes anteriores">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button onClick={() => browse(1)} aria-label="Ver próximos filmes">
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="opening-foot shell">
        <span>
          Araçatuba, SP <span className="dot-separator">/</span> Atendimento
          remoto
        </span>
        <a href="#trabalhos">
          Explore os projetos <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
