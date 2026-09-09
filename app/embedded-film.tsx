'use client';
import { useEffect, useRef, useState } from 'react';
import type { Film } from './portfolio-data';

type Player = { pauseVideo(): void; destroy(): void; getIframe(): HTMLIFrameElement };
type YouTube = { Player: new (element: HTMLElement, options: {
  host: string; videoId: string; playerVars: Record<string, string | number>;
  events: { onReady(event: { target: Player }): void; onError(): void; onStateChange(event: { data: number; target: Player }): void };
}) => Player };
declare global { interface Window { YT?: YouTube; onYouTubeIframeAPIReady?: () => void } }
let apiPromise: Promise<YouTube> | undefined;
function loadApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) apiPromise = new Promise<YouTube>((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => reject(new Error('YouTube unavailable')), 12000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      if (window.YT) resolve(window.YT);
    };
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => { clearTimeout(timer); reject(new Error('YouTube unavailable')); };
    document.head.appendChild(script);
  }).catch(error => { apiPromise = undefined; throw error; });
  return apiPromise;
}

export default function EmbeddedFilm({film}: {film: Film}) {
  const host = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false;
    let player: Player | undefined;
    const timer = setTimeout(() => { if (!disposed) setFailed(true); }, 15000);
    const pauseHidden = () => { if (document.hidden) player?.pauseVideo(); };
    document.addEventListener('visibilitychange', pauseHidden);
    loadApi().then(YT => {
      if (disposed || !host.current) return;
      // The API owns this child; React owns only its persistent outer container.
      const target = document.createElement('div');
      host.current.appendChild(target);
      player = new YT.Player(target, {
        host: 'https://www.youtube-nocookie.com', videoId: film.id,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady(event) {
            if (disposed) return;
            clearTimeout(timer);
            event.target.getIframe().title = film.title;
            setFailed(false); setLoaded(true); pauseHidden();
          },
          onError() { if (!disposed) { clearTimeout(timer); setFailed(true); } },
          onStateChange(event) { if (event.data === 1 && document.hidden) event.target.pauseVideo(); },
        },
      });
    }).catch(() => { if (!disposed) { clearTimeout(timer); setFailed(true); } });
    return () => {
      disposed = true; clearTimeout(timer);
      document.removeEventListener('visibilitychange', pauseHidden);
      player?.destroy();
    };
  }, [film.id, film.title]);
  return <div className="embedded-player">
    <div ref={host} className="embedded-host" />
    {(!loaded || failed) && <img src={'./posters/' + film.id + '.webp'} alt="" width={1280} height={720} />}
    {!loaded && !failed && <span className="embedded-status" role="status">Abrindo o vídeo completo…</span>}
    {failed && <div className="player-recovery" role="status">
      <p>Este vídeo não carregou aqui. Você pode assistir ao episódio no YouTube.</p>
      <a href={film.url} target="_blank" rel="noreferrer">Assistir no YouTube ↗</a>
    </div>}
  </div>;
}
