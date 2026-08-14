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
| `404.html` | página de erro autocontida |

A home continua estática e sem framework. Não adicionar dependência de runtime
quando HTML, CSS e JavaScript nativos resolverem o problema.
Experimentos visuais aposentados permanecem recuperáveis no histórico do Git,
mas não fazem parte da árvore publicada.

## Processo de criação

1. Auditar conteúdo, autoria, links, mídia, conversão e restrições antes do layout.
2. Definir uma tese visual e uma hierarquia de provas, não uma coleção de componentes.
3. Explicar a consequência esperada antes de trocar arquitetura, dependência ou mídia.
4. Construir o caminho principal sem JavaScript; usar JavaScript para dados, movimento e melhoria progressiva.
5. Orçar performance junto com a direção de arte: poster primeiro, vídeo adiado e mídia no tamanho em que aparece.
6. Validar em navegador real, 390px e desktop, teclado, movimento reduzido, filtros e formulário.
7. Medir com testes e Lighthouse, corrigir causas verificadas e só então preparar publicação.

## Tese comercial

A categoria pública é **Roteirista e diretor de conteúdo em vídeo**. A frase
central é: **Ajudo quem ainda não produz a começar e quem já produz a fazer
melhor.** Toda comunicação organiza a oferta nesta ordem:

1. roteiro para quem ainda não produz;
2. direção para pessoas e equipes que já produzem;
3. captação e edição quando o projeto pede produção.

Enzo entra como apoio à pessoa ou equipe existente, não como substituto de
marketing nem como agência. Sites, sistemas, automações e inteligência artificial
podem apoiar o processo, mas não são oferta de primeira tela deste portfólio.

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
| Fundo | `#060011` |
| Superfícies | `#0b021d`, `#11042a`, `#1a083d` |
| Texto | `#ede9fe`; apoio `#9d8fc9` |
| Ação e sinal | `#8b5cf6`, `#a855f7`, `#d8b4fe` |
| Display | Instrument Serif |
| Corpo | Manrope |
| Metadados | DM Mono |

A direção combina estúdio cinematográfico com a identidade roxa V3, consolidada
em 14/08/2026. Instrument Serif dá voz humana; a parede viva usa o trabalho real
como textura e prova. Não usar glassmorphism, mockup falso, gradiente aplicado a
logo, sombra em logo ou card arredondado genérico.

## Movimento

- O hero usa dezoito peças no desktop e doze no mobile, mudas e sem áudio.
- Posters aparecem primeiro; os vídeos só recebem `src` depois do carregamento inicial.
- Não existe controle manual de movimento na página, e o teste barra a volta dele.
- Aba oculta e hero fora do viewport pausam todos os vídeos. As duas pausas são invisíveis para quem está olhando e existem para não gastar bateria à toa.
- O vídeo é o conteúdo do portfólio, então `prefers-reduced-motion: reduce` não impede o download nem a reprodução. Decisão do Enzo em 11/08/2026.
- Economia de dados (`saveData`) continua impedindo o download: ali o custo é a conta do visitante.
- Sob movimento reduzido, o que desliga é o deslocamento grande (peça atravessando a tela) e a rolagem suave; o ambiente segue vivo em passo mais lento.
- Vídeo hidrata a 75% de viewport de distância, para o movimento já estar pronto quando a peça aparece. A grade do arquivo fica fora desse adiantamento: são 25 peças e só seis tocam ao mesmo tempo.
- Toda peça com vídeo toca, inclusive na grade do arquivo. O teto de seis simultâneos vale só para a grade; hero e casos tocam inteiros porque são a vitrine.
- Apontar com o ponteiro promove a peça acima do teto. Não existe segundo vídeo criado no hover.
- A moldura toma a forma da mídia, nunca o contrário. `--media-ratio` vem de `heroWidth`/`heroHeight`, medidos com ffprobe e gravados em `cases.js`. Proporção nunca é chutada, e `orientation` é consequência da medida.
- O slot largo da grade pertence a quem é largo de verdade, não a cada sétima posição.
- Nada de `filter` em vídeo: refaz o passe de imagem a cada quadro. Escurecimento por camada opaca.
- Nada de `filter: blur()` em transição de revelação: força rasterização a cada quadro.
- Ponteiro fino pode inclinar o conjunto em até poucos graus; usar `requestAnimationFrame`, amortecimento e transformação direta.
- Durante a primeira descida, as peças atravessam um arco em torno do eixo central e terminam organizadas com identificação.
- A coreografia de scroll anima somente `transform` e `opacity`; nunca propriedades de layout.
- Revelações usam `IntersectionObserver`.
- Filtro usa View Transition quando houver suporte e tem fallback imediato.
- Movimento de scroll usa Scroll-driven Animations apenas como melhoria progressiva.
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
