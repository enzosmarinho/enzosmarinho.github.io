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
| `portfolio.css`, `portfolio-core.js`, `portfolio.js` | composicao, dados de interface e comportamento da pagina publica |
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

## Design e movimento atuais (reconstrucao de 05/09/2026)

A instrucao atual de Enzo para refazer do zero substitui a paleta, a tipografia,
as quantidades de videos e a coreografia da versao Kinetic anterior.
A pagina principal usa `portfolio.css`, `portfolio-core.js` e `portfolio.js`.
`cases.js` continua como fonte de trabalhos. O laboratorio anterior permanece
recuperavel em `studio.html`, com armazenamento separado.

A composicao parte do Instagram: pessoa real em destaque, nome em Barlow
Condensed, texto de leitura em Manrope, trabalhos com contexto e demonstracao
por capitulos. Grafismo nativo, sem fundo raster decorativo. Acento e atmosfera
podem ser personalizados localmente, assim como os textos principais.

O hero tem uma apresentacao propria e tres previas de trabalhos. A proporcao
original da midia e preservada. A inicializacao adia os videos; os videos
completos pessoais so recebem fonte quando acionados pelo visitante. Teto de
quatro videos ambiente no desktop e tres no celular, com pausa fora da tela,
aba oculta, dialogo aberto ou video deliberado em reproducao. Economia de
dados impede autoplay e download ambiente. O controle manual pausa videos e
orbita. Movimento reduzido interrompe o deslocamento orbital e a entrada do
nome, mantendo o video conforme a preferencia anterior de Enzo; o controle de
pausa continua disponivel.

As imagens e videos do Instagram foram obtidos de publicacoes publicas do
proprio Enzo. Nao inventar retrato, autoria, patrocinios ou resultados. Os tres
projetos em destaque explicam participacao; o arquivo oferece todas as 31
pecas com origem, papel e relacao corretos. Previa sem audio nao e filme completo.

O pacote de midia tem teto de 28 MiB, incluindo dois videos pessoais completos
sob demanda (~13,4 MB). O loop inicial permanece abaixo de 1 MiB; cada arquivo
continua abaixo de 25 MiB. Isso substitui o antigo teto de 12 MiB do arquivo
inteiro e nao equivale ao custo do carregamento inicial.

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
