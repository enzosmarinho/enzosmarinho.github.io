'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Copy,
  X,
  Menu,
} from 'lucide-react';
import HeroLive from './hero-live';
import VideoPreview from './video-preview';
import LongFormShowcase from './long-form-showcase';
import { projects } from './portfolio-data';
const groups = [
  {
    id: 'cinematicos', number: '01', label: 'Filmes & narrativas',
    title: 'Uma ideia.\nUm pequeno filme.',
    text: 'Cenas, luz e montagem para transformar uma mensagem em história. Três maneiras de colocar uma marca em cena.',
    projects: ['voti-filmes'],
  },
  {
    id: 'produto',
    number: '02',
    label: 'Produto & presença',
    title: 'O que você faz,\nbem apresentado.',
    text: 'O produto em detalhe. A pessoa por trás da marca. Uma conversa que dá vontade de acompanhar.',
    projects: ['ciclo', 'magnos', 'voti-visitas'],
  },
  {
    id: 'cortes',
    number: '03',
    label: 'Edição & cortes',
    title: 'Uma boa conversa.\nUm bom recorte.',
    text: 'A edição encontra a história dentro da gravação. Um corte para acompanhar; um teaser para abrir a conversa.',
    projects: ['nf'],
  },
  {
    id: 'longos',
    number: '04',
    label: 'Vídeos longos & podcast',
    title: 'Da conversa inteira\nao conteúdo que permanece.',
    text: 'Podcasts e vídeos de conhecimento. Captação, estrutura e edição para quem tem mais para compartilhar.',
    projects: ['nf-podcast', 'kayky'],
  },
  {
    id: 'software', number: '05', label: 'Software & tutoriais',
    title: 'É técnico.\nE pode ser claro.',
    text: 'Presença em câmera e demonstração na tela. Conteúdo que apresenta como o produto entra na rotina de quem usa.',
    projects: ['voti'],
  },
  {
    id: 'humor',
    number: '06',
    label: 'Histórias & humor',
    title: 'Tem assunto que\npede outra entrada.',
    text: 'Uma situação reconhecível, um personagem, uma virada. O humor também pode apresentar o que um negócio faz.',
    projects: ['voti-cenas', 'jiu'],
  },
];
const services = [
  {
    title: 'Ideias & roteiros',
    line: 'Do “o que eu posto?” ao que você vai falar.',
    input: 'Seu trabalho, sua voz, seu público e o objetivo da peça.',
    delivery:
      'Pesquisa do assunto, pautas, roteiro falado e indicações para gravar. Você pode contratar só a preparação.',
    examples: [
      'Pautas para o mês',
      'Roteiros de vídeos curtos',
      'Feedback de conteúdo',
    ],
    brief: 'ideias e roteiros',
  },
  {
    title: 'Edição & cortes',
    line: 'Você grava. Eu ajudo a dar forma.',
    input: 'Gravações e referências do resultado que você quer.',
    delivery:
      'Montagem, cortes, legendas e versões nos formatos combinados. Animações de texto e elementos gráficos entram conforme a direção do projeto.',
    examples: [
      'Reels e vídeos verticais',
      'Cortes de entrevistas',
      'Teasers e desdobramentos',
    ],
    brief: 'edição dos meus vídeos',
  },
  {
    title: 'Design para sua comunicação',
    line: 'A mesma marca, em cada ponto de contato.',
    input: 'Sua identidade, suas fotos e o que precisa comunicar.',
    delivery:
      'Carrosséis, capas e peças de apoio. Para uma identidade nova, definimos direção, assinaturas, cores, tipografia e aplicações em um projeto próprio.',
    examples: [
      'Carrosséis e capas',
      'Identidade visual',
      'Aplicações da marca',
    ],
    brief: 'design e identidade visual',
  },
  {
    title: 'Portfólios & páginas',
    line: 'Um lugar próprio para mostrar seu valor.',
    input: 'Seu trabalho, suas ofertas e o caminho de contato.',
    delivery:
      'Organização do conteúdo, design e desenvolvimento de uma página adaptada ao celular, com mídias, navegação e interações pensadas para o seu trabalho.',
    examples: [
      'Portfólio profissional',
      'Página de serviço',
      'Página de campanha',
    ],
    brief: 'um portfólio ou uma página',
  },
  {
    title: 'Materiais para apresentar e vender',
    line: 'Uma boa explicação também merece design.',
    input: 'Informações, oferta e materiais reais do seu negócio.',
    delivery:
      'Apresentações, propostas visuais, catálogos e documentos editáveis. Conteúdo e estrutura feitos para a conversa que você precisa ter.',
    examples: [
      'Apresentação comercial',
      'Catálogo de serviços',
      'Materiais institucionais',
    ],
    brief: 'uma apresentação ou material comercial',
  },
  {
    title: 'Pesquisa & organização da produção',
    line: 'Menos coisa solta. Mais clareza para criar.',
    input: 'O que sua equipe produz, como trabalha e onde precisa de apoio.',
    delivery:
      'Pesquisa com fontes, organização de referências, calendário, bibliotecas de conteúdo e acompanhamento em Notion ou planilhas. Indicadores a partir dos dados que você já tem.',
    examples: [
      'Pesquisa de conteúdo',
      'Organização no Notion',
      'Planilhas e relatórios',
    ],
    brief: 'pesquisa e organização da minha produção',
  },
];
const credits: Record<string, string> = {
  'nf-podcast': 'Captação de podcast',
  kayky: 'Estrutura, edição e cor',
  ciclo: 'Produção de conteúdo',
  magnos: 'Produção de conteúdo',
  nf: 'Edição de cortes e teaser',
  voti: 'Experiência CLT · demonstração e edição',
  'voti-visitas': 'Experiência CLT · produção em campo',
  'voti-cenas': 'Experiência CLT · cenas e narrativas',
  'voti-filmes': 'Experiência CLT · filmes e campanhas',
  jiu: 'Produção avulsa',
};
const allFilms = groups.flatMap((g) =>
  g.projects.flatMap((id) => {
    const p = projects.find((x) => x.id === id)!;
    return p.films.map((f) => ({ p, f }));
  }),
);
export default function Home() {
  const [filter, setFilter] = useState('todos'),
    [menu, setMenu] = useState(false);
  const [need, setNeed] = useState('ideias e roteiros'),
    [message, setMessage] = useState(
      'Oi, Enzo! Preciso de ajuda com ideias e roteiros. Meu trabalho é... e quero produzir...',
    ),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false);
  const messageField = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 3500);
    return () => clearTimeout(t);
  }, [copied]);
  function chooseNeed(value: string) {
    setNeed(value);
    setMessage(
      'Oi, Enzo! Preciso de ajuda com ' +
        value +
        '. Meu trabalho é... e quero produzir...',
    );
    setCopied(false);
    setCopyError(false);
  }
  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
      messageField.current?.focus();
      messageField.current?.select();
    }
  }
  const shown = groups.filter((g) => filter === 'todos' || filter === g.id);
  return (
    <main className="enzo-site">
      <a href="#trabalhos" className="skip">
        Ir para os trabalhos
      </a>
      <header className="site-header">
        <div className="shell nav-inner">
          <a
            href="#inicio"
            className="wordmark"
            aria-label="Enzo Marinho, início"
          >
            Enzo Marinho
            <span className="brand-tick" aria-hidden="true" />
          </a>
          <nav aria-label="Navegação principal">
            <a href="#trabalhos">Trabalhos</a>
            <a href="#servicos">O que eu faço</a>
            <a href="#enzo">Sobre</a>
            <a href="#conversa" className="nav-contact">
              Vamos conversar <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </nav>
          <button
            className="menu-toggle"
            aria-expanded={menu}
            aria-controls="mobile-navigation"
            aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        {menu && (
          <nav
            id="mobile-navigation"
            className="mobile-navigation"
            aria-label="Navegação no celular"
          >
            {[
              ['Trabalhos', 'trabalhos'],
              ['O que eu faço', 'servicos'],
              ['Sobre', 'enzo'],
              ['Vamos conversar', 'conversa'],
            ].map(([label, id]) => (
              <a key={id} href={'#' + id} onClick={() => setMenu(false)}>
                {label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ))}
          </nav>
        )}
      </header>
      <HeroLive />
      <section
        id="trabalhos"
        className="work-library shell"
        aria-labelledby="work-title"
      >
        <div className="section-top">
          <span className="eyebrow">Portfólio / trabalhos em vídeo</span>
          <span className="section-counter">{new Set(projects.map((p) => p.client)).size} marcas e projetos · {allFilms.length} filmes</span>
        </div>
        <div className="work-heading">
          <h2 id="work-title">
            Cada história,
            <br />
            <em>um jeito de contar.</em>
          </h2>
          <p>
            Varejo, tecnologia, fitness e conversas.
            <br />
            Veja para quem produzi e qual foi a minha participação.
          </p>
        </div>
        <div
          className="work-filters"
          aria-label="Filtrar trabalhos por linguagem"
        >
          <button
            aria-pressed={filter === 'todos'}
            onClick={() => setFilter('todos')}
          >
            Todos <sup>{allFilms.length}</sup>
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              aria-pressed={filter === g.id}
              onClick={() => setFilter(g.id)}
            >
              {g.label}
              <sup>
                {allFilms.filter((x) => g.projects.includes(x.p.id)).length}
              </sup>
            </button>
          ))}
        </div>
        <output className="sr-only">
          {filter === 'todos'
            ? 'Todos os ' + allFilms.length + ' filmes'
            : allFilms.filter((x) => shown[0].projects.includes(x.p.id))
                .length + ' filmes nesta linguagem'}
        </output>
        <div className="chapters">
          {shown.map((group) => (
            <section
              className={'chapter chapter-' + group.id}
              key={group.id}
              aria-labelledby={'chapter-' + group.id}
            >
              <div className="chapter-intro">
                <span className="chapter-number">/{group.number}</span>
                <span className="eyebrow">{group.label}</span>
                <h3 id={'chapter-' + group.id}>{group.title}</h3>
                <p>{group.text}</p>
                <a
                  className="link-arrow"
                  href="#conversa"
                  onClick={() =>
                    chooseNeed(
                      group.id === 'cortes'
                        ? 'edição dos meus vídeos'
                        : 'conteúdo para meu negócio',
                    )
                  }
                >
                  Quero criar algo assim{' '}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
              <div className="chapter-projects">
                {group.projects.map((id) => {
                  const p = projects.find((x) => x.id === id)!;
                  return (
                    <article className="project-row" key={id}>
                      <div className="project-heading">
                        <h4>{p.client}</h4>
                        <span>{credits[id]}</span>
                      </div>
                      <div className={'project-films count-' + p.films.length}>
                        {p.films.map((f) => (
                          <a
                            key={f.id}
                            className={'film-tile' + (f.youtube || f.landscape ? ' film-landscape' : '')}
                            aria-label={
                              'Assistir: ' + f.title + ' — ' + p.client
                            }
                            href={f.url}
                            target="_self"
                            rel="noopener noreferrer"
                          >
                            <span className="film-image">
                              {f.youtube && !f.preview ? <img src={'./posters/' + f.id + '.webp'} alt="" width={1280} height={720} loading="lazy" /> : <VideoPreview id={f.id} landscape={f.landscape} />}
                              <span className="tile-play"><ArrowUpRight size={19} aria-hidden="true" /></span>
                              <span className="film-duration">
                                {f.duration}
                              </span>
                            </span>
                            <span className="tile-title">
                              {f.title}
                              <ArrowUpRight size={16} aria-hidden="true" />
                            </span>
                            <span className="tile-format">
                              {f.youtube ? 'Vídeo completo · ' : f.landscape ? 'Vídeo horizontal · ' : 'Vídeo vertical · '}{f.date}
                            </span>
                          </a>
                        ))}
                      </div>
                      <p className="project-context">{p.title}</p>
                      {p.id === 'voti' && <a className="link-arrow archive-link" href="/voti">Ver o acervo da VOTI <ArrowUpRight size={18} /></a>}
                      {['ciclo', 'magnos'].includes(p.id) && <p className="project-note">{p.note}</p>}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
      <section id="servicos" className="production-services" aria-labelledby="services-title">
        <div className="shell">
          <div className="production-heading">
            <div><span className="eyebrow">O que podemos criar juntos</span><h2 id="services-title">Sua próxima ideia.<br /><em>Vamos fazer.</em></h2></div>
            <div className="production-audiences">
              <div><h3>Para quem quer começar.</h3><p>Da escolha do assunto à primeira entrega. Eu ajudo você a tirar a produção do papel.</p></div>
              <div><h3>Para quem já produz.</h3><p>Roteiro, edição, design ou organização. Eu entro na etapa em que você precisa de apoio.</p></div>
            </div>
          </div>
          <div className="production-features">
            <article className="production-edit">
              <div className="production-card-copy"><span className="eyebrow">01 / Edição & cortes</span><h3>Você grava.<br />Eu dou forma.</h3><p>{services[1].delivery}</p><ul>{services[1].examples.map(example => <li key={example}>{example}</li>)}</ul><a href="#conversa" className="production-cta" onClick={() => chooseNeed(services[1].brief)}>Quero apoio na edição <ArrowUpRight size={20} aria-hidden="true" /></a></div>
              <a className="production-evidence" href={projects.find(p => p.id === 'nf')!.films[0].url} target="_self" rel="noopener noreferrer" aria-label="Ver o corte de O Negócio Sem Filtro no Instagram"><VideoPreview id="Da5jp47OB_u" /><span>O Negócio Sem Filtro <ArrowUpRight size={18} aria-hidden="true" /></span></a>
            </article>
            <article className="production-ideas"><span className="eyebrow">02 / Ideias & roteiros</span><h3>Antes do REC,<br />uma boa ideia.</h3><p>{services[0].delivery}</p><ul>{services[0].examples.map(example => <li key={example}>{example}</li>)}</ul><a href="#conversa" className="production-cta" onClick={() => chooseNeed(services[0].brief)}>Vamos preparar seu conteúdo <ArrowUpRight size={20} aria-hidden="true" /></a></article>
          </div>
          <div className="production-support-heading"><h3>Seu conteúdo também precisa de uma boa apresentação.</h3><p>Outras formas de somar ao seu projeto.</p></div>
          <div className="production-support">
            {services.slice(2).map((s, i) => <article key={s.title}><span className="eyebrow">0{i + 3}</span><h3>{s.title}</h3><p>{s.delivery}</p><ul>{s.examples.map(example => <li key={example}>{example}</li>)}</ul><a href="#conversa" className="production-cta" onClick={() => chooseNeed(s.brief)}>Conversar sobre este serviço <ArrowUpRight size={18} aria-hidden="true" /></a></article>)}
          </div>
          <div className="production-filming"><div><span className="eyebrow">Projetos presenciais selecionados</span><h3>Precisa de alguém por trás da câmera?</h3><p>Também fazemos direção e captação em Araçatuba e região. Preparação, local e entregas combinados antes da gravação.</p></div><a href="#conversa" className="production-cta" onClick={() => chooseNeed('direção e gravação presencial')}>Vamos planejar a gravação <ArrowUpRight size={20} aria-hidden="true" /></a></div>
        </div>
      </section>
      <LongFormShowcase onInquire={() => chooseNeed('edição dos meus vídeos')} />
      <section
        id="enzo"
        className="about-section shell"
        aria-labelledby="about-title"
      >
        <div className="about-image">
          <img
            src="./posters/enzo-em-cena.webp"
            alt="Enzo Marinho durante uma gravação na Magnos Steel"
            width={720}
            height={1280}
            loading="lazy"
          />
          <span>Em cena e nos bastidores.</span>
        </div>
        <div className="about-content">
          <span className="eyebrow">Enzo Marinho / criação e produção</span>
          <h2 id="about-title">
            Eu ajudo pessoas
            <br />
            <em>
              a colocar ideias
              <br />
              em movimento.
            </em>
          </h2>
          <p>
            Meu trabalho passa pela câmera, pelo roteiro, pela edição e pelo
            design. O que conecta tudo isso é entender o que você faz e
            encontrar um jeito de mostrar.
          </p>
          <p>
            Posso construir com quem está começando ou somar ao trabalho de quem
            já produz. Com conversa direta e uma entrega que faz sentido para a
            sua rotina.
          </p>
          <a
            className="link-arrow"
            href="https://www.instagram.com/enzosmarinho/"
            target="_blank"
            rel="noreferrer"
          >
            Me encontre no Instagram{' '}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section
        className="process-section shell"
        aria-labelledby="process-title"
      >
        <div className="section-top">
          <h2 id="process-title">Como a gente tira do papel.</h2>
          <span className="eyebrow">Clareza em cada etapa</span>
        </div>
        <ol className="process-steps">
          <li>
            <span>
              01 <ArrowRight size={20} aria-hidden="true" />
            </span>
            <h3>A gente conversa.</h3>
            <p>
              Seu momento, o que você precisa e os materiais que já tem. Daqui
              sai uma proposta com entregas, prazo e valor.
            </p>
          </li>
          <li>
            <span>
              02 <ArrowRight size={20} aria-hidden="true" />
            </span>
            <h3>Eu preparo e crio.</h3>
            <p>
              Com a direção combinada, o trabalho ganha forma. Você acompanha o
              que precisa decidir ao longo do caminho.
            </p>
          </li>
          <li>
            <span>
              03 <Check size={20} aria-hidden="true" />
            </span>
            <h3>Você revisa. A gente fecha.</h3>
            <p>
              Os ajustes previstos entram antes da entrega. Os arquivos chegam
              organizados, nos formatos que combinamos.
            </p>
          </li>
        </ol>
      </section>
      <footer id="conversa" className="contact-section">
        <div className="shell">
          <div className="contact-top">
            <span className="eyebrow">Seu próximo projeto</span>
            <a href="#inicio" aria-label="Voltar ao início">
              <ArrowUpRight size={25} aria-hidden="true" />
            </a>
          </div>
          <div className="contact-layout">
            <div>
              <h2>
                O próximo
                <br />
                <em>“vamos fazer?”</em>
                <br />
                pode ser o seu.
              </h2>
              <p>
                Me conte o que você faz.
                <br />
                Vamos descobrir onde eu posso entrar.
              </p>
              <a
                className="contact-link"
                href="https://www.instagram.com/enzosmarinho/"
                target="_blank"
                rel="noreferrer"
              >
                @enzosmarinho <ArrowUpRight size={25} aria-hidden="true" />
              </a>
            </div>
            <div className="contact-brief">
              <label htmlFor="need">Por onde começamos?</label>
              <select
                id="need"
                value={need}
                onChange={(e) => chooseNeed(e.target.value)}
              >
                {[
                  ...services.map((s) => s.brief),
                  'conteúdo para meu negócio',
                  'direção e gravação presencial',
                ].map((v) => (
                  <option key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
              <label htmlFor="message">Um primeiro papo</label>
              <textarea
                id="message"
                ref={messageField}
                value={message}
                rows={4}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setCopied(false);
                }}
              />
              <div className="brief-actions">
                <button onClick={copyMessage} disabled={!message.trim()}>
                  {copied ? (
                    <Check size={17} aria-hidden="true" />
                  ) : (
                    <Copy size={17} aria-hidden="true" />
                  )}
                  {copied ? 'Mensagem copiada' : 'Copiar mensagem'}
                </button>
                <a
                  href="https://www.instagram.com/enzosmarinho/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir Instagram <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
              <output className="brief-note">
                {copyError
                  ? 'Selecione e copie o texto acima para enviar.'
                  : copied
                    ? 'Pronto. Cole a mensagem na conversa com @enzosmarinho.'
                    : 'Edite e copie para começar a conversa. Nada é enviado por esta página.'}
              </output>
            </div>
          </div>
          <div className="footer-bottom">
            <a className="wordmark" href="#inicio">
              Enzo Marinho
              <span className="brand-tick" aria-hidden="true" />
            </a>
            <span>Araçatuba + remoto</span>
            <span>© 2026</span>
            <a href="./marca">Guia da marca</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
