import { ArrowUpRight } from 'lucide-react';
import { projects } from './portfolio-data';
import VideoPreview from './video-preview';
const longFilms = projects.filter(project => ['nf-podcast', 'kayky'].includes(project.id));
export default function LongFormShowcase({ onInquire }: { onInquire: () => void }) {
  return <section id="filmes-completos" className="long-films shell" aria-labelledby="long-form-title">
    <div className="long-films-heading">
      <div><span className="eyebrow">Vídeos longos & podcast</span><h2 id="long-form-title">Tem história que<br /><em>merece mais tempo.</em></h2></div>
      <p>Do treino completo à conversa inteira. Conheça os projetos e minha participação em cada um.</p>
    </div>
    <div className="long-films-grid">
      {longFilms.map(project => {
        const film = project.films[0];
        return <a key={project.id} className="long-film-link" href={film.url} target="_self" rel="noopener noreferrer" aria-label={'Assistir no YouTube: ' + film.title}>
          <div className="long-film-picture">{film.preview ? <VideoPreview id={film.id} landscape /> : <img src={'./posters/' + film.id + '.webp'} alt="" width={1280} height={720} loading="lazy" />}<span className="long-film-duration">{film.duration}</span></div>
          <div className="long-film-meta"><span>{project.id === 'nf-podcast' ? 'Captação de podcast' : 'Estrutura, edição e cor'}</span><span>YouTube <ArrowUpRight size={16} aria-hidden="true" /></span></div>
          <h3>{project.client}</h3><p>{film.title}</p>
        </a>;
      })}
    </div>
    <a className="link-arrow" href="#conversa" onClick={onInquire}>Quero produzir um vídeo longo <ArrowUpRight size={19} aria-hidden="true" /></a>
  </section>;
}
