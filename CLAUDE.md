# Portfólio publicado — enzosmarinho.github.io

Site estático servido por **GitHub Pages** a partir do repo
`enzosmarinho/enzosmarinho.github.io`. **É o que o mundo vê.**
`visibilidade: publico` no mapa — nunca versionar `.env`, chave ou dado de cliente aqui.

> Resgatado em 25/07/2026 de `Documents\Codex\2026-07-12\voc-vai-pegar-meu-portf-lio`.
> A cópia que estava lá tinha ficado **6 commits atrás** do publicado. Antes de tocar
> em qualquer coisa: `git fetch && git status`.

## Arquitetura

| Caminho | O que é |
|---|---|
| `index.html` | **A página no ar.** Versão **Kinetic** (`data-version="kinetic"`) |
| `versions/kinetic/` | a versão **oficial** — `kinetic.css`, `kinetic.js`, autossuficiente |
| `versions/fable/` · `showreel/` · `direcao/` · `editorial/` | laboratório, todas `noindex` |
| `versions/shared.css` · `shared.js` | base das versões de laboratório (a Kinetic **não** depende) |
| `versions/index.html` | chooser do laboratório — travado em 4 cartões por teste |
| `cases.js` | **fonte única** de projetos, propostas, métodos e continuidade |
| `404.html` | autocontido, sem dependência de CSS externo |

A Kinetic é autossuficiente: a home carrega só `kinetic.css` + `kinetic.js` + `cases.js`.
Mudar o design da home = mexer em `versions/kinetic/`.

## Design vigente — Kinetic (oficial desde 26/07/2026)

| Token | Valor |
|---|---|
| Papel | `#f1eee8` · fundo alternativo `#e7e3da` |
| Tinta | `#141416` · suave `#5c5a55` |
| Acento | `#b13a33` (único) |
| Display | **Anton** (uppercase, `line-height` .86–.96) |
| Corpo | **Manrope** — 17px / 26px no desktop |
| Mono | **IBM Plex Mono** (kickers, labels, meta) |

**Proporção é regra, não gosto.** A escala tipográfica usa razão fixa **1.333** (quarta
justa): `--t--1` a `--t-5`, cada degrau é o anterior × 1.333. Ritmo vertical em múltiplos
de 8 (`--s-1` a `--s-7`). Grade de 12 colunas. Não introduzir tamanho fora da escala —
é o que mantém o equilíbrio sem ajuste no olho.

## Movimento — quatro linhas vivas, nenhum botão

| Peça | O que faz |
|---|---|
| `.runner` | filete que corre em loop pela régua (5,5s) |
| `.ticker` | nomes de cliente em marquee contínuo (38s), com contagem real |
| `.rule` | régua que se desenha da esquerda ao entrar em cena |
| `.spine` | linha vertical fixa que preenche com o progresso da leitura |

**Playback é automático e não tem controle.** `IntersectionObserver` marca o que está
visível; a cada quadro de scroll, a peça mais próxima do centro da tela toca e as outras
pausam, soltam o `src` e liberam o decodificador. Aba escondida para tudo. O teste
`assert.doesNotMatch(html, /data-motion-toggle|<button/)` impede que um botão volte.

## Comandos

```bash
git fetch && git status
```

```bash
python -m http.server 8080
```

## Definição de pronto

1. `git status` limpo e alinhado com `origin/main`.
2. Sem erro no console do navegador.
3. Sem overflow horizontal em 375px e em desktop.
4. Contraste texto/fundo ≥ 4.5:1 (o par atual dá 15.46).
5. Alvo de toque ≥ 44px em botão e link de ação.
6. Nada novo em `sitemap.xml` além da raiz — o laboratório fica `noindex`.

## Guardrails

- **Push publica.** `git push` sobe direto para o ar. Não pushar sem pedido explícito.
- **Nenhum `<button>` na home.** Playback é automático por decisão de design; o teste
  falha se um controle voltar.
- **Nada de preço no HTML.** Os valores vêm de `cases.js` via JS — o teste bloqueia
  `R$` no markup. Preço é dado, não copy.
- **Narrativa em primeira pessoa.** Proibido "você", "seu", "o cliente", "o Enzo".
  Os verbos-âncora *Transformo · Organizo · Construo · Entrego · Leio* precisam existir.
  Teto de 500 palavras visíveis na home.
- **Três compromissos comerciais são obrigatórios** no texto: "Deixo os valores para
  depois", "sem criar dependência", "reduzo o escopo antes de começar". Não são enfeite —
  são a posição comercial que diferencia a proposta.
- Imagem decorativa dentro de link com `aria-label` ou bloco `aria-hidden="true"` usa
  `alt=""` **de propósito**. Preencher ali cria anúncio duplicado no leitor de tela.
- Vídeo nunca leva `preload` no markup: o `kinetic.js` cria o elemento só quando a peça
  entra no centro e o destrói ao sair.
- `versions/*` mantém `noindex`. Só a raiz é indexável.
- Fonte nova entra como `woff2` local em `assets/fonts/` + `@font-face`. Nada de CDN.
- Tamanho de texto novo sai da escala 1.333 (`--t-*`). Valor solto quebra a proporção.

## Entorno

Publicação por GitHub Pages (branch `main`, raiz). `.nojekyll` presente — o Pages serve
os arquivos como estão. O workflow `.github/workflows/sync-instagram-avatar.yml`
atualiza o avatar automaticamente.
