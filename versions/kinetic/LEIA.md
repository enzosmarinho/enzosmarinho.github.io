# Kinetic — protótipo de redesign (não publicado)

Abrir: `versions/kinetic/index.html`. **Não está no ar** e não está no chooser —
o teste `four complete portfolio versions and one comparison page exist` trava o
chooser em exatamente 4 cartões.

## O que este protótipo responde

| Pedido | Como foi resolvido |
|---|---|
| "as linhas realmente se mexessem" | `.runner` (filete que corre em loop, 5.5s) · `.ticker` (nomes de cliente em marquee, 38s) · `.rule` (régua que se desenha ao entrar em cena) · `.spine` (linha vertical que preenche com o progresso da leitura) |
| "não tem botões de ativação/desativação" | **Zero `<button>` na página.** `IntersectionObserver` + `requestAnimationFrame` escolhem a peça mais próxima do centro da tela; ela toca, as outras pausam e soltam o decodificador |
| "projetos organizados de forma mais inteligente" | Capítulos por cliente, ordenados por volume: VOTI 13 · Negócio Sem Filtro 07 · Lumiar 05 · Kayky 03 · Magnos 02 · 8848 01 |
| "proporções perfeitas" | Escala tipográfica de razão fixa 1.333 (quarta justa), ritmo vertical em múltiplos de 8, grade de 12 colunas |

## Verificado

- 31 peças, 6 clientes, 45 tiles renderizados; 0 erro de console
- **0 botões** na página
- Overflow horizontal: **0px** em 1265px de viewport
- Grade resolve 12 colunas; 4 peças por linha nos capítulos
- Keyframes `runner` e `ticker` declarados e ativos
- Clipe de vídeo carrega (720×1280) pelo mesmo caminho de asset do site
- `prefers-reduced-motion` desliga ticker, runner, reveal, espinha e playback

## Não verificado

O painel de preview desta máquina roda com `prefers-reduced-motion: reduce` e não
compõe frames, então **o movimento em si não foi observado rodando** — só provado
que está declarado e que o mecanismo de vídeo funciona. Antes de promover, abrir
num navegador normal.

## O que falta para virar a página pública

O contrato em `tests/portfolio-quality.test.mjs` fixa a raiz na Fable:

```
<body data-version="fable" data-asset-prefix="">
versions/shared.css?v=20260720-5 · versions/fable/fable.css?v=20260720-5
versions/shared.js?v=20260720-5  · versions/fable/fable.js?v=20260720-5
```

E exige: 1 único `<h1>`, menos de 500 palavras visíveis, primeira pessoa
(Transformo/Organizo/Construo/Entrego/Leio), **sem segunda pessoa** ("você",
"seu") e **sem preço** na home.

Dois caminhos:

1. **Portar o design para dentro da Fable** — reescrever `fable.css` e `fable.js`
   mantendo os nomes de arquivo fixados. Nada quebra e a home muda de cara.
   É o caminho recomendado.
2. **Trocar a raiz e atualizar os testes** — só se a decisão de aposentar a Fable
   for consciente; os testes existem para impedir troca acidental.

Este protótipo dropou as seções comerciais (objetivos, propostas, método). Elas
convertem e precisam voltar em qualquer versão que vá ao ar.
