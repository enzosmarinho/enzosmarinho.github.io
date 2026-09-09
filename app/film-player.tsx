'use client';
import { useEffect, useState, type RefObject } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { Film } from './portfolio-data';

export default function FilmPlayer({ film, playerRef }: {
  film: Film;
  playerRef: RefObject<HTMLVideoElement | null>;
}) {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [failed, setFailed] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const poster = './posters/' + film.id + '.webp';
  useEffect(() => {
    if (!waiting || failed) return;
    const timer = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(timer);
  }, [waiting, failed, attempt]);
  function play() {
    setFailed(false);
    setSlow(false);
    setWaiting(true);
    setAttempt(value => value + 1);
    const video = playerRef.current;
    if (!video) return;
    if (video.error) video.load();
    void video.play().catch(() => setWaiting(false));
  }
  return <>
    <video
      ref={playerRef}
      src={'./media/' + film.id + '.mp4'}
      poster={poster}
      controls autoPlay playsInline preload="auto"
      aria-label={film.title}
      onLoadStart={() => { setWaiting(true); setSlow(false); }}
      onCanPlay={() => { setReady(true); setWaiting(false); }}
      onPlaying={() => { setStarted(true); setWaiting(false); setSlow(false); }}
      onWaiting={() => setWaiting(true)}
      onError={() => { setFailed(true); setWaiting(false); }}
    />
    {(!started || failed) && <img className="player-cover" src={poster} alt="" width={720} height={1280} />}
    {!started && !failed && <button className="player-start" onClick={play} aria-label={'Reproduzir ' + film.title}>
      <Play size={25} fill="currentColor" aria-hidden="true" />
      <span>{ready ? 'Reproduzir vídeo' : 'Preparando o vídeo'}</span>
    </button>}
    {started && waiting && !failed && <span className="player-buffering" role="status">Carregando…</span>}
    {(failed || slow) && <div className="player-recovery" role="status">
      <p>{failed ? 'Não foi possível carregar este vídeo.' : 'A conexão está demorando mais que o esperado.'}</p>
      <button onClick={play}><RotateCcw size={16} aria-hidden="true" /> Tentar novamente</button>
      <a href={film.url} target="_blank" rel="noreferrer">Assistir na publicação original ↗</a>
    </div>}
  </>;
}
