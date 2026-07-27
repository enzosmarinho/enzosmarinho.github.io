# Kinetic — versão oficial do portfólio

**No ar desde 26/07/2026** em `https://enzosmarinho.github.io`.
A raiz (`index.html`) carrega `kinetic.css` + `kinetic.js` + `cases.js`. Nada mais.

Este diretório **não** é protótipo. Para o laboratório, ver `versions/fable/`,
`showreel/`, `direcao/` e `editorial/` — todos `noindex` e fora do ar.

## O que esta versão resolve

| Decisão | Como |
|---|---|
| Linhas que se mexem de verdade | `.runner` (filete em loop, 5,5s) · `.ticker` (marquee de clientes, 38s) · `.rule` (régua que se desenha) · `.spine` (progresso vertical da leitura) |
| Zero controle de playback | `IntersectionObserver` + `rAF`: toca a peça mais próxima do centro, pausa as outras e solta o decodificador. Aba escondida para tudo |
| Projetos com inteligência | Capítulos por cliente ordenados por volume — VOTI 13 · Negócio Sem Filtro 07 · Lumiar 05 · Kayky 03 · Magnos 02 · 8848 01 |
| Proporção previsível | Escala tipográfica de razão 1.333, ritmo em múltiplos de 8, grade de 12 colunas |
| Estratégia de venda | Objetivos (3 rotas) → Trabalhos (prova) → Propostas (6 ofertas com preço + 4 planos) → Método (4 decisões) → Contato |

## Estrutura de arquivos

| Arquivo | Papel |
|---|---|
| `kinetic.css` | sistema completo: tokens, escala, grade, linhas vivas, seções, responsivo, reduced-motion |
| `kinetic.js` | render (ticker, palco, capítulos, objetivos, propostas, planos, método) + playback automático + espinha + reveal |
| `index.html` | cópia de laboratório com `noindex`. **A página pública é a raiz do repo** |

Toda a copy e todos os dados vêm de `cases.js` — não escrever conteúdo direto no JS.

## Verificado em 26/07/2026

- `node --test` **18/18**
- 1 `<h1>` · **0 `<button>`** · 6 seções na ordem contratada
- 6 capítulos de cliente · 6 propostas com preço · 4 planos · 4 passos · 3 objetivos
- 14 peças no palco · 12 itens no ticker
- Desktop 1425px: **overflow 0** · h1 134px / entrelinha 115px (.86) · corpo 17/26 (1.53)
- Mobile 375px: **overflow 0** · h1 58px e cabe · botão 54px (alvo ≥44) · 2 colunas ·
  espinha e nav colapsam
- Keyframes `runner` e `ticker` ativos; clipe carrega em 720×1280
- `prefers-reduced-motion` desliga ticker, runner, reveal, espinha e playback

**Não observado rodando:** o painel desta máquina tem `prefers-reduced-motion: reduce`
e não compõe frames, então o movimento foi provado por declaração e por carga de vídeo,
não por observação visual. Conferir num navegador normal após publicar.

## Ao mexer aqui

Os testes em `tests/portfolio-quality.test.mjs` são o contrato da página pública:
sem botão, sem preço no HTML, primeira pessoa, verbos-âncora, três compromissos
comerciais, ordem das seções, `skip-link`. Eles existem para impedir regressão
acidental — mudar o contrato é decisão consciente, não conveniência.
