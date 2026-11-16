'use client';
import { useEffect, useRef, useState } from 'react';
import VideoPreview from './video-preview';
import {
  hero, caseStudy, method, formatCard, offers, promise, about, works, longForm, contactOptions, messageFor,
} from './v4-content';

// Miniaturas do rolo: 20 momentos dos vídeos de clientes (outros quadros, não as capas de Trabalhos),
// recortados acima da legenda queimada. 5 colunas × 4 linhas.
const roll = Array.from({ length: 20 }, (_, k) => 'rolo-' + String(k).padStart(2, '0'));

export default function V4Home() {
  const [choice, setChoice] = useState(contactOptions[0]);
  const [message, setMessage] = useState(messageFor(contactOptions[0]));
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);

  // /servicos manda o visitante para cá com ?quero=<serviço>; a mensagem já chega escolhida.
  useEffect(() => {
    const wanted = new URLSearchParams(location.search).get('quero');
    const match = offers.find((o) => o.anchor === wanted);
    if (match) choose(match.brief);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 3500);
    return () => clearTimeout(t);
  }, [copied]);

  function choose(value: string) {
    setChoice(value);
    setMessage(messageFor(value));
    setCopied(false);
    setCopyError(false);
  }
  function startWith(value: string) {
    choose(value);
    document.getElementById('contato')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
      field.current?.focus();
      field.current?.select();
    }
  }

  return (
    <main className="v4" id="inicio">
      <a href="#trabalhos" className="skip">Ir para os trabalhos</a>

      <header className="bar">
        <div className="wrap bar-in">
          <a href="#inicio" className="mark">Enzo Marinho</a>
          <nav aria-label="Principal">
            <a href="#trabalhos">Trabalhos</a>
            <a href="./servicos">Serviços</a>
            <a href="#contato" className="bar-cta">Contato</a>
          </nav>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-in">
          <div className="hero-text">
            <h1 id="hero-title">{hero.title.map((line) => <span key={line}>{line}</span>)}</h1>
            <p>{hero.line}</p>
            <div className="hero-actions">
              <a href="#contato" className="btn" onClick={(e) => { e.preventDefault(); startWith(contactOptions[0]); }}>{hero.action}</a>
              <a href="#trabalhos" className="text-link">Ver os trabalhos</a>
            </div>
          </div>
          <div className="roll" aria-label="O vídeo do caso Phil, em destaque no meio de outros trabalhos">
            <ul className="roll-grid" aria-hidden="true">
              {roll.map((id) => <li key={id}><img src={'/posters/mini/' + id + '.webp'} alt="" width={270} height={480} decoding="async" /></li>)}
            </ul>
            <a className="roll-pick" href={caseStudy.url} target="_blank" rel="noreferrer" aria-label="Abrir no Instagram o Reel do caso Phil">
              <VideoPreview id={caseStudy.reel} eager />
            </a>
          </div>
        </div>
      </section>

      <section className="case" aria-labelledby="case-title">
        <div className="wrap case-in">
          <figure className="case-proof">
            <img src="/posters/caso-grade.webp" alt="Grade do perfil do Phil: o vídeo no formato novo com 2.318 visualizações, entre vizinhos com 1.449 e 1.288." width={1080} height={640} loading="lazy" decoding="async" />
            <figcaption>A grade do perfil dele, no dia 15/10. Quadro do Reel em que eu conto o caso.</figcaption>
          </figure>
          <div className="case-text">
            <h2 id="case-title">{caseStudy.title}</h2>
            <p>{caseStudy.story}</p>
            <dl className="figures">
              {caseStudy.figures.map((f) => <div key={f.value}><dt>{f.value}</dt><dd>{f.label}</dd></div>)}
            </dl>
            <p className="case-foot">{caseStudy.footnote} <a href={caseStudy.url} target="_blank" rel="noreferrer" className="text-link">Ver o Reel do caso</a></p>
          </div>
        </div>
      </section>

      <section className="how" id="como" aria-labelledby="how-title">
        <div className="wrap how-in">
          <div>
            <h2 id="how-title">Como funciona</h2>
            <ol className="steps">
              {method.map((m) => <li key={m.verb}><h3>{m.verb}</h3><p>{m.text}</p></li>)}
            </ol>
          </div>
          <figure className="format">
            <div className="format-stage">
              <img src="/posters/caso-formato.webp" alt="Quadro do Reel do Phil: ele na frente, falando; atrás, o treino na barra." width={720} height={1280} loading="lazy" decoding="async" />
              <dl className="format-card">
                {formatCard.map((row) => <div key={row.field}><dt>{row.field}</dt><dd>{row.value}</dd></div>)}
              </dl>
              <svg className="format-pen" viewBox="0 0 1044 1280" aria-hidden="true" focusable="false">
                <defs><marker id="tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" /></marker></defs>
                <path d="M392 912 C300 860 300 660 352 590" markerEnd="url(#tip)" />
                <path d="M392 1006 C362 1010 340 998 322 978" markerEnd="url(#tip)" />
              </svg>
            </div>
            <figcaption>O formato do Phil no cartão, sobre um Reel dele de 13/10.</figcaption>
          </figure>
        </div>
      </section>

      <section className="works" id="trabalhos" aria-labelledby="works-title">
        <div className="wrap">
          <div className="works-head">
            <h2 id="works-title">Trabalhos</h2>
            <p>Cada vídeo abre a publicação original.</p>
          </div>
          <ul className="works-grid">
            {works.map((w) => (
              <li key={w.id}>
                <a href={w.url} target="_blank" rel="noreferrer">
                  <VideoPreview id={w.id} mode="hover" />
                  <span className="work-cap"><strong>{w.client}</strong> {w.title}<em>{w.did}</em></span>
                </a>
              </li>
            ))}
          </ul>
          <ul className="long">
            {longForm.map((f) => (
              <li key={f.id}>
                <a href={f.url} target="_blank" rel="noreferrer">
                  <img src={'/posters/' + f.id + '.webp'} alt="" width={1280} height={720} loading="lazy" decoding="async" />
                  <span className="work-cap"><strong>{f.client}</strong> {f.title}, {f.length}. {f.did}.</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="voti">Antes de atender por conta própria, fui videomaker CLT na VOTI Software. <a href="./voti" className="text-link">Ver o acervo da VOTI</a></p>
        </div>
      </section>

      <section className="offers" id="servicos" aria-labelledby="offers-title">
        <div className="wrap">
          <div className="offers-head">
            <h2 id="offers-title">Serviços</h2>
            <a href="./servicos" className="text-link">Ver como cada serviço funciona</a>
          </div>
          {offers.filter((o) => o.door).map((o) => (
            <div key={o.name} className="door">
              <p className="door-tag">Por onde começar</p>
              <h3>{o.name}</h3>
              <p className="who">{o.who}</p>
              <p className="gets">{o.gets}</p>
              <div className="door-act">
                <button type="button" className="btn" onClick={() => startWith(o.brief)}>Quero o Diagnóstico</button>
                <a href={'./servicos#' + o.anchor} className="text-link">Como funciona</a>
              </div>
            </div>
          ))}
          <h3 className="also-title">Depois do Diagnóstico</h3>
          <ul className="also">
            {offers.filter((o) => !o.door).map((o) => (
              <li key={o.name}>
                <a href={'./servicos#' + o.anchor}>
                  <span className="also-name">{o.name}</span>
                  <span className="also-who">{o.who}</span>
                  <span className="also-gets">{o.gets}</span>
                  <span className="also-go" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="offers-note">Valores na conversa.</p>
        </div>
      </section>

      <section className="about" aria-labelledby="about-title">
        <div className="wrap about-in">
          <img src="/posters/enzo-vitrine.webp" alt="Enzo Marinho em cena, diante de uma vitrine" width={720} height={840} loading="lazy" decoding="async" />
          <div>
            <h2 id="about-title">{about.title}</h2>
            <p>{about.text}</p>
            <p>{about.ai}</p>
            <p className="promise"><span>{promise.no}</span> {promise.yes}</p>
          </div>
        </div>
      </section>

      <section className="contact" id="contato" aria-labelledby="contact-title">
        <div className="wrap contact-in">
          <div>
            <h2 id="contact-title">Me conte o que você faz.</h2>
            <p>Monte a mensagem aqui, copie e mande no Instagram. Nada é enviado por esta página.</p>
          </div>
          <form className="brief" onSubmit={(e) => { e.preventDefault(); void copy(); }}>
            <label htmlFor="choice">Quero falar sobre</label>
            <select id="choice" value={choice} onChange={(e) => choose(e.target.value)}>
              {contactOptions.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
            <label htmlFor="message">Mensagem</label>
            <textarea id="message" ref={field} rows={4} value={message} onChange={(e) => { setMessage(e.target.value); setCopied(false); }} />
            <div className="brief-act">
              <button type="submit" className="btn" disabled={!message.trim()}>{copied ? 'Mensagem copiada' : 'Copiar mensagem'}</button>
              <a href="https://www.instagram.com/enzosmarinho/" target="_blank" rel="noreferrer" className="text-link">Abrir o Instagram</a>
            </div>
            <output className="brief-note" aria-live="polite">
              {copyError ? 'Selecione e copie o texto acima.' : copied ? 'Pronto. Cole na conversa com @enzosmarinho.' : ''}
            </output>
          </form>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <a href="#inicio" className="mark">Enzo Marinho</a>
          <span>Araçatuba e remoto</span>
          <a href="https://www.instagram.com/enzosmarinho/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>
    </main>
  );
}
