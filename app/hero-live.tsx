'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Pause,
  Play,
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
    id: 'Dc_vrbiyUw-',
    project: 'magnos',
    name: 'Magnos Steel',
    kind: 'Conversa & detalhe',
  },
];
function LiveFilm({
  clip,
  enabled,
  onOpen,
}: {
  clip: (typeof clips)[number];
  enabled: boolean;
  onOpen: (project: string, id: string) => void;
}) {
  const root = useRef<HTMLButtonElement>(null),
    video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false),
    [loaded, setLoaded] = useState(false),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting && e.intersectionRatio > 0.35),
      { threshold: [0, 0.35] },
    );
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const sync = () => {
      if (enabled && visible && !document.hidden) {
        setLoaded(true);
        if (el.getAttribute('src')) {
          el.muted = true;
          void el.play().catch(() => {});
        }
      } else el.pause();
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      document.removeEventListener('visibilitychange', sync);
      el.pause();
    };
  }, [enabled, visible, loaded]);
  return (
    <button
      ref={root}
      className="live-film"
      onClick={() => onOpen(clip.project, clip.id)}
      aria-label={'Assistir: ' + clip.name + ' — ' + clip.kind}
    >
      <span className="live-picture">
        <img className="live-cover" src={'./posters/' + clip.id + '.webp'} alt="" width={720} height={1280} loading="eager" decoding="async" fetchPriority={clip.id === clips[0].id ? 'high' : 'auto'} />
        <video
          className={playing ? 'preview-playing' : ''}
          ref={video}
          src={loaded ? './media/preview-' + clip.id + '.mp4' : undefined}
          poster={'./posters/' + clip.id + '.webp'}
          loop
          muted
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          onError={() => setPlaying(false)}
          aria-hidden="true"
          tabIndex={-1}
        />
        <span className="live-play">
          <Play size={19} fill="currentColor" aria-hidden="true" />
        </span>
      </span>
      <span className="live-caption">
        <strong>{clip.name}</strong>
        <ArrowUpRight size={16} aria-hidden="true" />
        <small>{clip.kind}</small>
      </span>
    </button>
  );
}
export default function HeroLive({
  motion,
  overlayOpen,
  onOpen,
  onToggle,
}: {
  motion: boolean;
  overlayOpen: boolean;
  onOpen: (project: string, id: string) => void;
  onToggle: () => void;
}) {
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
    el.scrollTo({ left: target, behavior: motion ? 'smooth' : 'auto' });
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
            enabled={motion && !overlayOpen}
            onOpen={onOpen}
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
        <button onClick={onToggle} aria-pressed={!motion}>
          {motion ? (
            <Pause size={13} aria-hidden="true" />
          ) : (
            <Play size={13} aria-hidden="true" />
          )}
          {motion ? 'Pausar prévias' : 'Reproduzir prévias'}
        </button>
        <a href="#trabalhos">
          Explore os projetos <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
