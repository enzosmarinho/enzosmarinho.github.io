# Portfólio publicado — enzosmarinho.github.io

Site estático servido por **GitHub Pages** a partir do repo
`enzosmarinho/enzosmarinho.github.io`. **É o que o mundo vê.**
`visibilidade: publico` no mapa — nunca versionar `.env`, chave ou dado de cliente aqui.

> Resgatado em 25/07/2026 de `Documents\Codex\2026-07-12\voc-vai-pegar-meu-portf-lio`.
> A cópia que estava lá tinha ficado **6 commits atrás** do publicado. Antes de tocar
> em qualquer coisa: `git fetch && git status`.

## Arquitetura — não é um site, são quatro

| Caminho | O que é |
|---|---|
| `index.html` | **A página no ar.** Carrega a versão *Fable* (`data-version="fable"`) |
| `versions/shared.css` · `shared.js` | base comum a todas as versões |
| `versions/fable/` | a versão **ativa** (`fable.css`, `fable.js`) |
| `versions/showreel/` · `direcao/` · `editorial/` | alternativas do laboratório |
| `versions/index.html` | chooser do laboratório — todas com `noindex` |
| `styles.css` (132 KB) | **legado** da versão escura antiga. Nada mais o carrega |
| `cases.js` · `render.js` | dados dos trabalhos e render |
| `404.html` | autocontido, sem dependência de CSS externo |

A raiz e a versão ativa andam juntas: mudar o design da home = mexer em
`versions/fable/` **e** conferir `index.html`.

## Design vigente (medido no ar em 25/07/2026)

| Token | Valor |
|---|---|
| Fundo | `#f1eee8` (papel, claro) |
| Texto | `#171719` |
| Acento | `#b13a33` |
| Display | **Anton** (h1, uppercase, `line-height` .92) |
| Corpo | **Manrope** |
| Mono | **IBM Plex Mono** (eyebrows, labels) |

**Atenção:** o `styles.css` legado descreve um sistema **escuro** (`#0b0b0b`, `#ff4d35`).
Não é mais o design do site. Copiar token de lá produz página inconsistente — foi
exatamente o que tinha acontecido com o `404.html`.

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
- Imagem decorativa dentro de link com `aria-label`, ou dentro de bloco com
  `aria-hidden="true"`, usa `alt=""` **de propósito**. São 53 no site e estão certas —
  preencher `alt` ali cria anúncio duplicado no leitor de tela.
- Os 46 `<video>` carregam sob demanda (sem `src` até ativar). Não dar `preload` neles:
  o custo em mobile é alto.
- `versions/*` mantém `noindex`. Só a raiz é indexável.
- Fonte nova entra como `woff2` local em `assets/fonts/` + `@font-face`. Nada de CDN.
- `styles.css` só some depois de conferir que nenhuma página o carrega.

## Entorno

Publicação por GitHub Pages (branch `main`, raiz). `.nojekyll` presente — o Pages serve
os arquivos como estão. O workflow `.github/workflows/sync-instagram-avatar.yml`
atualiza o avatar automaticamente.
