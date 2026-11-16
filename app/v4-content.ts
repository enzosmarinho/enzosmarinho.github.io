// Texto do portfólio v4. Fonte: negocio/portfolio/CONTEUDO.md e negocio/casos/phil.md (sistema do Enzo).
// Sem preço público, sem resultado inventado, sem promessa de crescimento.

export const hero = {
  title: ['A prova já está gravada.', 'Falta o formato.'],
  line: 'Eu encontro, no vídeo que você já gravou, o formato que vende.',
  action: 'Quero o meu formato',
};

// O caso usa o Reel do próprio Enzo (público). Nome e números do Phil dependem da autorização dele
// (negocio/PENDENCIAS-DO-ENZO.md, item 3) antes de qualquer publicação.
export const caseStudy = {
  reel: 'DemvMfTosmA',
  url: 'https://www.instagram.com/reel/DemvMfTosmA/',
  title: 'Vídeo de treino não vende treino.',
  story:
    'O Phil tinha dezenas de vídeos de barra. Rendiam “que monstro” e nenhum aluno. Mudamos o formato: o treino fica ao fundo, como prova, e ele aparece na frente explicando como planejar o próprio treino, igual previsão do tempo.',
  figures: [
    { value: '2.318', label: 'visualizações no primeiro vídeo do formato. Os vizinhos na grade tinham de 628 a 1.449.' },
    { value: '1 aluno', label: 'que chegou pelo vídeo, sem anúncio.' },
  ],
  footnote: 'Um caso, não uma promessa.',
};

export const method = [
  {
    verb: 'Achar',
    text: 'Leio seu perfil, seu material e seu nicho, com números reais, e encontro onde está o valor.',
  },
  {
    verb: 'Ensinar',
    text: 'Você recebe o formato num cartão, o primeiro vídeo com a fala pronta e um guia para gravar.',
  },
  {
    verb: 'Medir',
    text: 'Cada vídeo é comparado com o seu próprio perfil, não com quem viralizou.',
  },
];

// O cartão do formato do Phil (negocio/casos/phil.md). Convite: fala dele no Reel do caso.
export const formatCard = [
  { field: 'Formato', value: 'previsão do tempo' },
  { field: 'Prova ao fundo', value: 'o treino na barra' },
  { field: 'Quem fala', value: 'ele, ensinando a planejar' },
  { field: 'Convite', value: 'vem comigo que eu te ajudo' },
];

export type Offer = { name: string; who: string; gets: string; brief: string; anchor: string; door?: boolean };
export const offers: Offer[] = [
  {
    name: 'Diagnóstico',
    anchor: 'diagnostico',
    who: 'Para começar certo.',
    gets: 'Uma conversa e a leitura do seu perfil e do seu nicho. Você sai com o formato, o primeiro vídeo roteirizado e mais quatro ideias.',
    brief: 'o Diagnóstico',
    door: true,
  },
  {
    name: 'Direção de conteúdo',
    anchor: 'direcao',
    who: 'Se você grava e edita.',
    gets: 'Pautas no formato, conferência antes de postar, uma conversa por mês.',
    brief: 'a Direção de conteúdo',
  },
  {
    name: 'Planos de produção',
    anchor: 'planos',
    who: 'Se você só quer gravar.',
    gets: 'Você grava com o meu guia; eu roteirizo, edito e meço.',
    brief: 'um plano de produção',
  },
  {
    name: 'Peças avulsas',
    anchor: 'avulsas',
    who: 'Para uma necessidade só.',
    gets: 'Edição, roteiros, carrosséis, capas, pesquisa.',
    brief: 'uma peça avulsa',
  },
];

export const promise = {
  no: 'Não prometo views, seguidores, vendas nem viralização.',
  yes: 'Garanto o trabalho, o prazo e uma medição honesta.',
};

export const about = {
  title: 'Quem faz',
  text: 'Sou o Enzo, editor e roteirista em Araçatuba. Hoje atendo pequenos negócios de longe: você grava no celular, eu cuido do resto.',
  ai: 'Uso IA na pesquisa, nos roteiros e na edição. Quem aparece é sempre você.',
};

// Trabalhos em vídeo curto: cada um abre a publicação original. Créditos conforme CLAUDE.md do repositório.
export type Work = { id: string; client: string; did: string; url: string; title: string };
export const works: Work[] = [
  { id: 'DYC7byPyEnW', client: 'Magnos Steel', did: 'Produção de conteúdo', title: 'Uma visita à Magnos', url: 'https://www.instagram.com/reel/DYC7byPyEnW/' },
  { id: 'Dc32NvUO-MR', client: 'Ciclo Avenida', did: 'Produção de conteúdo', title: 'Os modelos em cena', url: 'https://www.instagram.com/ciclo_avenida/reel/Dc32NvUO-MR/' },
  { id: 'Da5jp47OB_u', client: 'O Negócio Sem Filtro', did: 'Edição de cortes', title: 'A proposta que era para dar errado', url: 'https://www.instagram.com/onegociosemfiltro/reel/Da5jp47OB_u/' },
  { id: 'Dc_vrbiyUw-', client: 'Magnos Steel', did: 'Produção de conteúdo', title: 'A conversa sobre a aliança', url: 'https://www.instagram.com/reel/Dc_vrbiyUw-/' },
  { id: 'DUf-ODMDWqA', client: '8848 Jiu-Jitsu', did: 'Produção avulsa', title: 'O medo de entrar na academia', url: 'https://www.instagram.com/reel/DUf-ODMDWqA/' },
  { id: 'DdCVprqpM7z', client: 'Ciclo Avenida', did: 'Produção de conteúdo', title: 'E se a bateria acabar?', url: 'https://www.instagram.com/cicloavenida_mobi/reel/DdCVprqpM7z/' },
  { id: 'DYDiclAOSod', client: 'O Negócio Sem Filtro', did: 'Edição do teaser', title: 'Teaser com Clayton', url: 'https://www.instagram.com/onegociosemfiltro/reel/DYDiclAOSod/' },
  { id: 'Dcy9QRuB2_m', client: 'Ciclo Avenida', did: 'Produção de conteúdo', title: 'O preço veio antes da gravação', url: 'https://www.instagram.com/ciclo_avenida/reel/Dcy9QRuB2_m/' },
];

export const longForm = [
  { id: '564xdqJQ4Zc', client: 'O Negócio Sem Filtro', did: 'Captação do episódio', title: 'Podcast com Gleydson Espíndula', length: '51 min', url: 'https://www.youtube.com/watch?v=564xdqJQ4Zc' },
  { id: 'ADKpionmFiw', client: 'Kayky Pitondo', did: 'Estrutura, edição e cor', title: 'Treino de superiores', length: '41 min', url: 'https://www.youtube.com/watch?v=ADKpionmFiw' },
];

export const contactOptions = ['o Diagnóstico', 'a Direção de conteúdo', 'um plano de produção', 'uma peça avulsa', 'outra coisa'];
export const messageFor = (choice: string) =>
  choice === 'outra coisa'
    ? 'Oi, Enzo! Vi seu portfólio. Meu trabalho é… e preciso de…'
    : 'Oi, Enzo! Quero ' + choice + '. Meu trabalho é… e hoje eu posto…';

// Página /servicos. Fonte: negocio/SERVICOS.md v4 (16/11/2026). Sem preço público.
// Fora do site de propósito: P4 (só depois de 2 clientes com 3 relatórios), cortes de vídeo longo
// (só depois do episódio de teste), motion, identidade e landing (pedem peça de portfólio antes), mentoria (fase 2). O Diagnóstico por escrito saiu do catálogo na v4.
export const servicesPage = {
  title: 'Quatro jeitos de trabalhar comigo.',
  lead: 'Todos começam no mesmo lugar: achar o formato que mostra o seu trabalho. Depois, você escolhe quanto quer fazer sozinho.',
};

export const diagnosis = {
  who: 'Para começar certo, ou para quem já posta e não sabe por que não vende.',
  steps: [
    { title: 'Você me conta', text: 'Preenche uma ficha curta sobre o seu trabalho e me manda o perfil.' },
    { title: 'Eu leio', text: 'Seu perfil, o material que você já tem e o seu nicho, com números reais.' },
    { title: 'A conversa', text: 'Por vídeo. Mostro o que achei e escolhemos o formato juntos.' },
    { title: 'Você grava', text: 'Com o cartão e a fala pronta. Eu confiro o primeiro vídeo antes de você postar.' },
  ],
  gets: [
    'O formato num cartão de uma página',
    'O primeiro vídeo roteirizado, com a fala pronta',
    'As ideias dos quatro vídeos seguintes',
    'Um guia para gravar no celular',
    'A conferência do primeiro vídeo, em até 14 dias',
  ],
  guarantee: 'Se você sair da conversa sem um formato escolhido e sem o cartão, eu devolvo o valor.',
};

export const direction = {
  who: 'Se você já grava e edita.',
  text: 'Você continua fazendo os vídeos. Eu trago as pautas, confiro antes de você postar e leio os números com você.',
  month: [
    { value: '8', label: 'pautas no seu formato' },
    { value: '4', label: 'conferências antes de postar' },
    { value: '1', label: 'conversa de 45 minutos' },
    { value: '1', label: 'relatório de uma página' },
  ],
  note: 'Mensal. Mensagens respondidas em até 2 dias úteis.',
};

export const plans = {
  who: 'Se você só quer gravar.',
  text: 'Você grava no celular com o meu guia e me manda o material bruto. Eu pesquiso, escrevo os roteiros, edito, faço as capas e meço.',
  tiers: ['Essencial', 'Constância', 'Presença'],
  rows: [
    { label: 'Para quem', values: ['Quem está começando a postar com regularidade', 'Quem quer dois vídeos por semana sem editar', 'Quem quer vídeo e carrossel toda semana'] },
    { label: 'Roteiros por mês', values: ['4', '8', '12'] },
    { label: 'Vídeos editados', values: ['4', '8', '12'] },
    { label: 'Capas', values: ['4', '8', '12'] },
    { label: 'Carrosséis', values: ['—', '—', '4'] },
    { label: 'Conversa comigo', values: ['30 min por mês', '45 min por mês', '2 de 30 min por mês'] },
    { label: 'Medição', values: ['Mensal', 'Mensal', 'Cada vídeo'] },
  ],
  note: 'Vídeo vertical de até 90 segundos, feito a partir de até 5 minutos de material. Os planos começam com um piloto de 3 meses.',
};

export const pieces = {
  who: 'Para uma necessidade só.',
  items: [
    { name: 'Edição de vídeo', text: 'Você grava, eu edito. Simples ou com apoio visual.' },
    { name: 'Roteiros', text: 'Pacotes de 4, 8 ou 12, com gancho, fala e o que aparece.' },
    { name: 'Pesquisa de nicho', text: 'Quem ganha atenção no seu mercado, por quê, e 10 pautas.' },
    { name: 'Abertura de perfil', text: 'Nome, bio, foto, capas de destaque e as 9 primeiras pautas.' },
    { name: 'Carrosséis e capas', text: 'No padrão do seu perfil.' },
    { name: 'Pacote de data', text: 'Black Friday, Dia das Mães, inauguração: 4 vídeos e 2 carrosséis em 10 dias.' },
  ],
};

export const howIWork = [
  { title: 'Quem aparece é você', text: 'A IA ajuda na pesquisa, no roteiro e na edição. Não substitui você.' },
  { title: 'Nada vai ao ar sem aprovação', text: 'Cada vídeo passa por mim e por você antes de postar.' },
  { title: 'Prazo por escrito', text: 'Pautas até o 3º dia útil. Edição em até 3 dias úteis.' },
  { title: 'Ajuste incluído', text: 'Uma rodada por vídeo. Ideia nova depois do roteiro vira peça nova.' },
  { title: 'Medição honesta', text: 'Cada vídeo comparado com o seu próprio perfil, 7 dias depois.' },
  { title: 'Tudo online', text: 'Atendo qualquer cidade. Você grava no celular; eu cuido do resto.' },
];

export const faq = [
  { q: 'Quanto custa?', a: 'Os valores ficam na conversa, porque dependem do serviço e do seu momento. Quem começa agora entra com preço de fundador.' },
  { q: 'Preciso ter muitos seguidores?', a: 'Não. Eu comparo cada vídeo com o seu próprio perfil, não com quem viralizou.' },
  { q: 'Eu não sei gravar.', a: 'O guia resolve a maior parte: luz, som, enquadramento e como me mandar o arquivo. O resto a gente ajusta no primeiro vídeo.' },
  { q: 'Em quanto tempo eu vejo resultado?', a: 'Não prometo prazo de resultado. O que dá para combinar: o primeiro vídeo no formato novo sai em até 14 dias, e um formato só é julgado depois de 3 vídeos publicados.' },
  { q: 'Atende fora de Araçatuba?', a: 'Sim. Tudo acontece online: a conversa por vídeo, o envio do material e as conferências.' },
  { q: 'Posso cancelar?', a: 'A Direção de conteúdo é mensal. Os planos de produção começam com um piloto de 3 meses e depois seguem mês a mês, com 30 dias de aviso.' },
  { q: 'Minha profissão tem conselho (advocacia, saúde).', a: 'Dá para trabalhar. A regra do seu conselho entra na ficha antes da primeira pauta, e a palavra final sobre o que vai ao ar é sua.' },
];
