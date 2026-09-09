import { votiFilms } from './voti-films';
export type Film = {
  id: string;
  title: string;
  duration: string;
  date: string;
  url: string;
  youtube?: boolean;
  landscape?: boolean;
  preview?: boolean;
};
export type Project = {
  id: string;
  client: string;
  number: string;
  title: string;
  kind: string;
  description: string;
  note: string;
  poster: string;
  films: Film[];
};

export const projects: Project[] = [
  {
    id: 'nf-podcast', client: 'O Negócio Sem Filtro', number: '06',
    title: 'Uma conversa inteira, registrada para continuar chegando a pessoas.',
    kind: 'Podcast · captação',
    description: 'Episódio com Gleydson Espíndula, apresentado por Bruno Teixeira. Captação realizada por Enzo; aqui você pode conhecer o programa completo.',
    note: 'Captação deste episódio informada por Enzo. Os créditos dos cortes continuam identificados separadamente.',
    poster: '564xdqJQ4Zc.webp',
    films: [{id: '564xdqJQ4Zc', title: 'Podcast com Gleydson Espíndula', duration: '51:18', date: '16 jul 2026', url: 'https://www.youtube.com/watch?v=564xdqJQ4Zc', youtube: true}],
  },
  {
    id: 'kayky', client: 'Kayky Pitondo', number: '07',
    title: 'Conteúdo que acompanha o treino do começo ao fim.',
    kind: 'Fitness · vídeo longo',
    description: 'Um treino de superiores explicado em vídeo longo. Estrutura, edição e cor para organizar o conteúdo ao longo de uma sessão completa.',
    note: 'Vídeo publicado no canal de Kayky Pitondo. Estrutura, edição e cor de Enzo, conforme o registro do trabalho.',
    poster: 'ADKpionmFiw.webp',
    films: [{id: 'ADKpionmFiw', title: 'Treino de superiores', duration: '40:47', date: '04 jun 2026', url: 'https://www.youtube.com/watch?v=ADKpionmFiw', youtube: true, landscape: true, preview: true}],
  },
  {
    id: 'ciclo',
    client: 'Ciclo Avenida',
    number: '01',
    title: 'Uma boa conversa também apresenta um produto.',
    kind: 'Produto · situações · campanha',
    description:
      'Da pergunta sobre a bateria ao preço revelado antes da hora. Três peças que combinam conversa, apresentação e detalhes da bicicleta.',
    note: 'Seleção de setembro de 2026. O vídeo do feirão registra uma campanha encerrada; as ofertas pertencem à época da publicação.',
    poster: 'DdCVprqpM7z.jpg',
    films: [
      {
        id: 'DdCVprqpM7z',
        title: 'E se a bateria acabar?',
        duration: '0:51',
        date: '08 set 2026',
        url: 'https://www.instagram.com/cicloavenida_mobi/reel/DdCVprqpM7z/',
      },
      {
        id: 'Dc32NvUO-MR',
        title: 'Os modelos em cena',
        duration: '0:27',
        date: '04 set 2026',
        url: 'https://www.instagram.com/ciclo_avenida/reel/Dc32NvUO-MR/',
      },
      {
        id: 'Dcy9QRuB2_m',
        title: 'O preço veio antes da gravação',
        duration: '0:41',
        date: '02 set 2026',
        url: 'https://www.instagram.com/ciclo_avenida/reel/Dcy9QRuB2_m/',
      },
    ],
  },
  {
    id: 'nf',
    client: 'O Negócio Sem Filtro',
    number: '02',
    title: 'Dentro de uma conversa, uma história que vale um corte.',
    kind: 'Edição · cortes · teaser',
    description:
      'Um trecho com começo, tensão e resposta. E um teaser que reúne momentos diferentes para apresentar o próximo episódio.',
    note: 'Edição dos cortes por Enzo. O teaser registra a chamada do episódio de maio de 2026.',
    poster: 'Da5jp47OB_u.jpg',
    films: [
      {
        id: 'Da5jp47OB_u',
        title: 'A proposta que era para dar errado',
        duration: '0:37',
        date: '17 jul 2026',
        url: 'https://www.instagram.com/onegociosemfiltro/reel/Da5jp47OB_u/',
      },
      {
        id: 'DYDiclAOSod',
        title: 'Teaser com Clayton',
        duration: '0:37',
        date: '07 mai 2026',
        url: 'https://www.instagram.com/onegociosemfiltro/reel/DYDiclAOSod/',
      },
    ],
  },
  {
    id: 'magnos',
    client: 'Magnos Steel',
    number: '03',
    title: 'O detalhe do produto. A presença de quem apresenta.',
    kind: 'Varejo · apresentação · produto',
    description:
      'Uma visita à loja, joias em detalhe e uma explicação com o produto nas mãos. Linguagens que aproximam a vitrine de quem está do outro lado.',
    note: 'Campanhas de maio e setembro de 2026. Condições comerciais e alegações presentes nos vídeos pertencem às publicações originais.',
    poster: 'magnos-produto.jpg',
    films: [
      {
        id: 'DYC7byPyEnW',
        title: 'Uma visita à Magnos',
        duration: '0:38',
        date: '07 mai 2026',
        url: 'https://www.instagram.com/reel/DYC7byPyEnW/',
      },
      {
        id: 'Dc_vrbiyUw-',
        title: 'A conversa sobre a aliança',
        duration: '0:44',
        date: '07 set 2026',
        url: 'https://www.instagram.com/reel/Dc_vrbiyUw-/',
      },
    ],
  },
  {
    id: 'voti', client: 'VOTI Software', number: '04',
    title: 'O assunto técnico ganha uma explicação que dá para acompanhar.',
    kind: 'Software · demonstração · conteúdo',
    description: 'Aplicativo, relatórios e gestão: presença em câmera, gravação de tela e edição para apresentar o produto na prática.',
    note: 'Conteúdo produzido durante vínculo CLT na VOTI. Os recursos demonstrados pertencem às versões da época de publicação.',
    poster: 'DZsNBgGR_-x.webp',
    films: ['DZsNBgGR_-x', 'DXiIx4_kQ-0', 'DZvck7voqcq', 'DaLWfmixIGb', 'DXpoe8Jkekw', 'DayTkUmodCs'].map(id => votiFilms.find(f => f.id === id)!),
  },
  {
    id: 'voti-visitas', client: 'VOTI Software', number: '08',
    title: 'A empresa em campo. A história no lugar onde acontece.',
    kind: 'Visita · captação · edição',
    description: 'Mercadão de Utilidades e Catvi: visitas que acompanham pessoas, ambientes e a operação de cada loja.',
    note: 'Trabalho para a VOTI, durante vínculo CLT. Mercadão de Utilidades é o local da visita.',
    poster: 'DZ-_aUUoUeH.webp',
    films: ['DZ-_aUUoUeH', 'DKkdTYyItAy'].map(id => votiFilms.find(f => f.id === id)!),
  },
  {
    id: 'voti-filmes', client: 'VOTI Software', number: '10',
    title: 'Luz, enquadramento e montagem a serviço de uma história.',
    kind: 'Filmes · cenas · campanhas',
    description: 'Uma mudança no escritório, uma consulta inesperada e uma história de Natal. Filmes que apresentam a marca através de situações e personagens.',
    note: 'Trabalhos para a VOTI durante vínculo CLT.',
    poster: 'DVjvzjvESOn.webp',
    films: ['DVjvzjvESOn', 'DTgXN2FiDV6', 'DSldztZCA9P'].map(id => votiFilms.find(f => f.id === id)!),
  },
  {
    id: 'voti-cenas', client: 'VOTI Software', number: '09',
    title: 'Personagens e situações para dar outra entrada ao assunto.',
    kind: 'Cena · narrativa · atuação',
    description: 'Uma conversa sobre a loja e o contador viram pequenas histórias.',
    note: 'Conteúdo produzido durante vínculo CLT na VOTI.',
    poster: 'DZDz8ygI4Pf.webp',
    films: ['DZDz8ygI4Pf', 'DY24DK8Ijor'].map(id => votiFilms.find(f => f.id === id)!),
  },
  {
    id: 'jiu',
    client: '8848 Jiu-Jitsu',
    number: '05',
    title: 'Às vezes, a história começa do lado de fora.',
    kind: 'Cena · atuação · humor',
    description:
      'A porta da academia vira cenário de uma pequena história sobre chegar para treinar. Um trabalho avulso que mostra outra linguagem.',
    note: 'Trabalho avulso de fevereiro de 2026.',
    poster: 'DUf-ODMDWqA.jpg',
    films: [
      {
        id: 'DUf-ODMDWqA',
        title: 'O medo de entrar na academia',
        duration: '1:12',
        date: '08 fev 2026',
        url: 'https://www.instagram.com/reel/DUf-ODMDWqA/',
      },
    ],
  },
];
