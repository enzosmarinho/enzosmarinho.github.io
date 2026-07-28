# Portfólio público: enzosmarinho.github.io

Site estático servido por GitHub Pages a partir de
`enzosmarinho/enzosmarinho.github.io`. O repositório é público e a branch `main`
é o que o mundo vê.

Nunca versionar `.env`, chave, material privado, escopo contratual ou dado interno
de cliente. Antes de editar: `git fetch --prune`, `git status` e `npm run check`.

## Arquitetura

| Caminho | Responsabilidade |
|---|---|
| `index.html` | página pública, indexável e selecionada |
| `versions/kinetic/` | CSS e JS exclusivos da página pública |
| `cases.js` | fonte única de perfil, papéis e trabalhos verificáveis |
| `versions/fable/`, `showreel/`, `direcao/`, `editorial/` | laboratório `noindex` |
| `versions/shared.css`, `shared.js` | base do laboratório, sem dependência da home |
| `404.html` | página de erro autocontida |

A home continua estática e sem framework. Não adicionar dependência de runtime
quando HTML, CSS e JavaScript nativos resolverem o problema.

## Tese comercial

A conversão principal é `Pedir análise`, não comprar um pacote.

- Não existe tabela pública de preço.
- A proposta nasce de resultado, porte, volume, velocidade e complexidade.
- Porte sozinho não define valor.
- O formulário apenas monta uma mensagem; não armazena e não envia nada.
- A mensagem abre no WhatsApp para revisão humana antes do envio.

`cases.js` não pode ter campos `price` ou `payment`. Os três itens em
`PROFILE.services` existem para compatibilidade com o laboratório e precisam
continuar genéricos, sem quantidade ou valor fechado.

## Provas e autoria

- VOTI é experiência CLT, nunca cliente independente ou receita de agência.
- Lumiar é histórico encerrado e precisa aparecer com essa etiqueta.
- Negócio Sem Filtro é edição e curadoria; não classificar os cortes como automação.
- Toda peça pública precisa de permalink original e imagem local existente.
- Inventário sem autoria demonstrada não entra no portfólio.
- Métrica só aparece quando a fonte pública ou um registro verificável sustenta o número.

## Design vigente

| Papel | Valor |
|---|---|
| Fundo | `#0b0c0e` |
| Superfícies | `#141619`, `#1b1d21` |
| Texto | `#f2efe7` |
| Ação | `#d9ff55` |
| Sinal | `#ff5d2d` |
| Display | Anton |
| Corpo | Manrope |
| Metadados | IBM Plex Mono |

A direção é editorial e cinematográfica. A mídia real é a textura. Não usar
gradiente decorativo, glassmorphism, mockup falso, brilho roxo ou card arredondado
genérico.

## Movimento

- Um único vídeo real pode tocar no hero, mudo e sem áudio.
- O controle `data-motion-toggle` pausa e retoma o vídeo.
- Aba oculta e hero fora do viewport pausam o vídeo.
- `prefers-reduced-motion: reduce` remove movimento não essencial e esconde o controle.
- Revelações usam `IntersectionObserver`.
- Filtro usa View Transition quando houver suporte e tem fallback imediato.
- Não adicionar listener de `scroll`.
- Não criar marquee, pulso infinito, parallax amplo ou scroll hijacking.

## Acessibilidade

- Link de pular conteúdo obrigatório.
- Foco visível em toda ação.
- Alvo interativo mínimo de 44px.
- Formulários usam `fieldset`, `legend`, `label` e status `aria-live`.
- Imagem decorativa dentro de link rotulado usa `alt=""` de propósito.
- Texto normal precisa de contraste mínimo 4.5:1.
- Conteúdo e controles funcionam com teclado e em 390px sem overflow horizontal.

## Comandos

```bash
npm run check
```

```bash
python -m http.server 4173 --bind 127.0.0.1
```

## Definição de pronto

1. `npm run check` com todos os testes verdes.
2. Zero erro no console do navegador.
3. Zero overflow horizontal em 390px, 1280px e 1440px.
4. Trinta e um trabalhos renderizados e links originais preservados.
5. Filtros, pausa, movimento reduzido e montagem do pedido testados.
6. Revisão visual do hero, casos, diagnóstico, arquivo e rodapé.
7. Performance medida com mídia adiada e sem nova dependência.
8. Nenhum push sem autorização explícita.

## Publicação

Push em `main` publica. Não fazer `git push`, merge em `main` ou alteração de
GitHub Pages sem confirmação humana.
