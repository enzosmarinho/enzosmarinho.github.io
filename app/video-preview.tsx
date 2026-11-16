'use client';
import { useEffect, useRef, useState } from 'react';

// A decorative, silent preview. The containing anchor owns the destination.
// mode "auto": plays while on screen (the hero). mode "hover": shows the clean poster at rest and
// plays only while the link is hovered or focused, so grids stay clean and light.
export default function VideoPreview({ id, eager = false, landscape = false, mode = 'auto' }: { id: string; eager?: boolean; landscape?: boolean; mode?: 'auto' | 'hover' }) {
  const root = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (mode === 'auto') {
      const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: '200px' });
      const playback = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio >= .3), { threshold: [0, .3] });
      preload.observe(el); playback.observe(el);
      return () => { preload.disconnect(); playback.disconnect(); };
    }
    const link = el.closest('a');
    if (!link) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => { if (still.matches) return; setNear(true); setActive(true); };
    const off = () => setActive(false);
    link.addEventListener('pointerenter', on);
    link.addEventListener('pointerleave', off);
    link.addEventListener('focus', on);
    link.addEventListener('blur', off);
    return () => {
      link.removeEventListener('pointerenter', on);
      link.removeEventListener('pointerleave', off);
      link.removeEventListener('focus', on);
      link.removeEventListener('blur', off);
    };
  }, [mode]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const sync = () => {
      if (active && !document.hidden && !failed) {
        el.muted = true;
        void el.play().catch(() => { /* The poster stays visible when autoplay is blocked. */ });
      } else {
        el.pause();
        if (mode === 'hover') setPlaying(false);
      }
    };
    sync();
    el.addEventListener('canplay', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { el.pause(); el.removeEventListener('canplay', sync); document.removeEventListener('visibilitychange', sync); };
  }, [near, active, failed, mode]);

  return <span ref={root} className="video-preview" aria-hidden="true">
    <img src={'/posters/' + id + '.webp'} alt="" width={landscape ? 1280 : 720} height={landscape ? 720 : 1280} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} />
    {!failed && <video ref={video} className={playing ? 'is-playing' : ''} src={near ? '/media/preview-' + id + '.mp4' : undefined} poster={'/posters/' + id + '.webp'} muted loop playsInline preload="none" controls={false} disablePictureInPicture tabIndex={-1} onPlaying={() => setPlaying(true)} onError={() => { setFailed(true); setPlaying(false); }} />}
  </span>;
}
