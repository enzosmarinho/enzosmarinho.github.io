'use client';
import { useEffect, useRef, useState } from 'react';

// A decorative, silent preview. The containing anchor owns the destination.
export default function VideoPreview({ id, eager = false, landscape = false }: { id: string; eager?: boolean; landscape?: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: '200px' });
    const playback = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .3), { threshold: [0, .3] });
    if (root.current) { preload.observe(root.current); playback.observe(root.current); }
    return () => { preload.disconnect(); playback.disconnect(); };
  }, []);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const sync = () => {
      if (visible && !document.hidden && !failed) {
        el.muted = true;
        void el.play().catch(() => { /* The poster stays visible when autoplay is blocked. */ });
      } else el.pause();
    };
    sync();
    el.addEventListener('canplay', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { el.pause(); el.removeEventListener('canplay', sync); document.removeEventListener('visibilitychange', sync); };
  }, [near, visible, failed]);
  return <span ref={root} className="video-preview" aria-hidden="true">
    <img src={'/posters/' + id + '.webp'} alt="" width={landscape ? 1280 : 720} height={landscape ? 720 : 1280} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} />
    {!failed && <video ref={video} className={playing ? 'is-playing' : ''} src={near ? '/media/preview-' + id + '.mp4' : undefined} poster={'/posters/' + id + '.webp'} muted loop playsInline preload="none" controls={false} disablePictureInPicture tabIndex={-1} onPlaying={() => setPlaying(true)} onError={() => { setFailed(true); setPlaying(false); }} />}
  </span>;
}
