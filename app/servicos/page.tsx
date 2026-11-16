import '../v4.css';
import type { Metadata } from 'next';
import { servicesPage, diagnosis, direction, plans, pieces, howIWork, faq, promise } from '../v4-content';

export const metadata: Metadata = {
  title: 'Serviços · Enzo Marinho',
  description: 'Diagnóstico, Direção de conteúdo, planos de produção e peças avulsas: como cada serviço funciona, o que você recebe e como eu trabalho.',
  alternates: { canonical: '/servicos' },
};

const index = [
  { id: 'diagnostico', n: '01', name: 'Diagnóstico', who: 'Para começar' },
  { id: 'direcao', n: '02', name: 'Direção de conteúdo', who: 'Você grava e edita' },
  { id: 'planos', n: '03', name: 'Planos de produção', who: 'Você só grava' },
  { id: 'avulsas', n: '04', name: 'Peças avulsas', who: 'Uma necessidade só' },
];

export default function Servicos() {
  return (
    <main className="v4" id="inicio">
      <a href="#diagnostico" className="skip">Ir para o Diagnóstico</a>
      <header className="bar">
        <div className="wrap bar-in">
          <a href="/" className="mark">Enzo Marinho</a>
          <nav aria-label="Principal">
            <a href="/#trabalhos">Trabalhos</a>
            <a href="/servicos" aria-current="page">Serviços</a>
            <a href="/#contato" className="bar-cta">Contato</a>
          </nav>
        </div>
      </header>

      <section className="svc-head" aria-labelledby="svc-title">
        <div className="wrap">
          <h1 id="svc-title">{servicesPage.title}</h1>
          <p className="svc-lead">{servicesPage.lead}</p>
          <ol className="svc-index">
            {index.map((s) => (
              <li key={s.id}>
                <a href={'#' + s.id}>
                  <span className="svc-n">{s.n}</span>
                  <span className="svc-name">{s.name}</span>
                  <span className="svc-who">{s.who}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="svc-diag" id="diagnostico" aria-labelledby="diag-title">
        <div className="wrap">
          <div className="svc-top">
            <span className="svc-n">01</span>
            <h2 id="diag-title">Diagnóstico</h2>
            <p className="svc-who-big">{diagnosis.who}</p>
          </div>
          <ol className="diag-steps">
            {diagnosis.steps.map((st, i) => (
              <li key={st.title}>
                <span className="diag-num" aria-hidden="true">{i + 1}</span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
          <div className="diag-bottom">
            <div>
              <h3 className="svc-sub">Você recebe</h3>
              <ul className="ticks">
                {diagnosis.gets.map((g) => <li key={g}>{g}</li>)}
              </ul>
            </div>
            <div className="diag-side">
              <p className="guarantee"><strong>Garantia.</strong> {diagnosis.guarantee}</p>
              <a href="/?quero=diagnostico#contato" className="btn">Quero o Diagnóstico</a>
            </div>
          </div>
        </div>
      </section>

      <section className="svc-block" id="direcao" aria-labelledby="dir-title">
        <div className="wrap svc-split">
          <div className="svc-top">
            <span className="svc-n">02</span>
            <h2 id="dir-title">Direção de conteúdo</h2>
            <p className="svc-who-big">{direction.who}</p>
            <p className="svc-text">{direction.text}</p>
            <a href="/?quero=direcao#contato" className="btn-line">Quero a Direção</a>
          </div>
          <div>
            <h3 className="svc-sub">Por mês</h3>
            <dl className="month">
              {direction.month.map((m) => <div key={m.label}><dt>{m.value}</dt><dd>{m.label}</dd></div>)}
            </dl>
            <p className="svc-note">{direction.note}</p>
          </div>
        </div>
      </section>

      <section className="svc-block svc-tint" id="planos" aria-labelledby="plans-title">
        <div className="wrap">
          <div className="svc-split svc-split-tight">
            <div className="svc-top">
              <span className="svc-n">03</span>
              <h2 id="plans-title">Planos de produção</h2>
              <p className="svc-who-big">{plans.who}</p>
            </div>
            <p className="svc-text svc-text-wide">{plans.text}</p>
          </div>
          <div className="table-scroll" role="region" aria-label="Comparação dos planos" tabIndex={0}>
            <table className="plans">
              <thead>
                <tr><td /> {plans.tiers.map((t) => <th key={t} scope="col">{t}</th>)}</tr>
              </thead>
              <tbody>
                {plans.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {r.values.map((v, i) => <td key={plans.tiers[i]}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="plan-cards">
            {plans.tiers.map((t, i) => (
              <li key={t}>
                <h3>{t}</h3>
                <p>{plans.rows[0].values[i]}</p>
                <dl>
                  {plans.rows.slice(1).map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.values[i]}</dd></div>)}
                </dl>
              </li>
            ))}
          </ul>
          <div className="plans-foot">
            <p className="svc-note">{plans.note}</p>
            <a href="/?quero=planos#contato" className="btn-line">Quero um plano</a>
          </div>
        </div>
      </section>

      <section className="svc-block" id="avulsas" aria-labelledby="pieces-title">
        <div className="wrap svc-split">
          <div className="svc-top">
            <span className="svc-n">04</span>
            <h2 id="pieces-title">Peças avulsas</h2>
            <p className="svc-who-big">{pieces.who}</p>
            <a href="/?quero=avulsas#contato" className="btn-line">Pedir uma peça</a>
          </div>
          <dl className="pieces">
            {pieces.items.map((p) => <div key={p.name}><dt>{p.name}</dt><dd>{p.text}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="svc-rules" aria-labelledby="rules-title">
        <div className="wrap">
          <h2 id="rules-title">Como eu trabalho</h2>
          <ul className="rules">
            {howIWork.map((r) => <li key={r.title}><h3>{r.title}</h3><p>{r.text}</p></li>)}
          </ul>
          <p className="rules-promise"><span>{promise.no}</span> {promise.yes}</p>
        </div>
      </section>

      <section className="svc-faq" aria-labelledby="faq-title">
        <div className="wrap svc-split">
          <h2 id="faq-title">Perguntas que sempre aparecem</h2>
          <div className="faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="archive-end" aria-labelledby="end-title">
        <div className="wrap archive-end-in">
          <h2 id="end-title">Comece pelo Diagnóstico.</h2>
          <p>Uma conversa, o seu formato num cartão e o primeiro vídeo com a fala pronta.</p>
          <a href="/?quero=diagnostico#contato" className="btn">Montar a mensagem</a>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <a href="/" className="mark">Enzo Marinho</a>
          <span>Araçatuba e remoto</span>
          <a href="https://www.instagram.com/enzosmarinho/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>
    </main>
  );
}
