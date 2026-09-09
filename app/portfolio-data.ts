export type Film = {
  id: string;
  title: string;
  duration: string;
  date: string;
  url: string;
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
    id: 'voti',
    client: 'VOTI Gestão',
    number: '04',
    title: 'Assunto de sistema. Conversa de gente.',
    kind: 'Software · explicação · humor',
    description:
      'A relação com o contador vira o ponto de partida para apresentar uma função do sistema. Um assunto técnico contado a partir de uma situação reconhecível.',
    note: 'Trabalho realizado durante a experiência CLT de Enzo na VOTI, publicado em julho de 2026. A peça apresenta o Portal do Contador; não é uma demonstração de operação da interface.',
    poster: 'Da6FTw_IqTm.jpg',
    films: [
      {
        id: 'Da6FTw_IqTm',
        title: 'O contador que sumiu',
        duration: '0:32',
        date: '17 jul 2026',
        url: 'https://www.instagram.com/votigestao/reel/Da6FTw_IqTm/',
      },
    ],
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
