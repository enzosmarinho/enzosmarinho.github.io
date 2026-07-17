# Design QA — sistema editorial completo

- Fonte visual aprovada: `C:\Users\Usuario\AppData\Local\Temp\codex-clipboard-766e36ca-5eef-4eaa-869a-8818e8eae992.png`
- Implementação desktop: `C:\Users\Usuario\Documents\Codex\2026-07-17\fa-a-meu-portif-lio-como\work\portfolio\.qa\implementation-desktop.png`
- Implementação mobile: `C:\Users\Usuario\Documents\Codex\2026-07-17\fa-a-meu-portif-lio-como\work\portfolio\.qa\implementation-mobile.png`
- Comparação conjunta: `C:\Users\Usuario\Documents\Codex\2026-07-17\fa-a-meu-portif-lio-como\work\portfolio\.qa\comparison-reference-implementation.png`
- Estado comparado: topo da página, showreel pausado, viewport desktop de `1440 × 1000`; mobile em `390 × 844`.

## Evidência de fidelidade

1. Tipografia — passed. A fonte Anton, hospedada localmente sob OFL, reproduz a presença condensada e vertical da referência. Manrope continua no texto corrido e IBM Plex Mono nos dados e rótulos.
2. Paleta — passed. Preto `#08080a`, marfim `#f2eee6`, coral `#ff5b4f` e azul-cobalto `#293fbd` aparecem como tokens reutilizáveis no site inteiro.
3. Composição — passed. O hero preserva o nome em uma linha, a assinatura espaçada com pontos corais e a divisão vertical. O círculo azul foi substituído intencionalmente por prova real em movimento, mantendo a função visual do bloco direito e aumentando a função comercial.
4. Ritmo editorial — passed. Títulos condensados, linhas finas, cantos retos, grandes áreas de respiro e alternância preto/marfim/cobalto foram aplicados a serviços, cases, método, sobre, FAQ e contato.
5. Conteúdo e conversão — passed. Proposta, preços, provas, escopo e CTAs permanecem legíveis antes da parte longa do portfólio.

## Interação, responsividade e acessibilidade

- Showreel: pausa/retomada, anterior/próximo, playlist e anúncio `aria-live` verificados.
- Serviços: tabs verificadas por clique e teclado; `Sites e páginas` exibiu duas ofertas e `Direção e automação` exibiu duas ofertas.
- Trabalhos: filtro VOTI exibiu seis projetos e atualizou o status acessível.
- FAQ: abertura exclusiva verificada; abrir a segunda pergunta fechou a primeira.
- Responsividade: `360`, `390`, `768`, `1024`, `1440` e `1920` px sem overflow horizontal.
- Mobile: nome, argumento, texto e CTAs continuam visíveis no primeiro fluxo de rolagem; showreel decorativo é removido para proteger leitura e dados.
- Imagens carregadas: zero arquivos quebrados após o carregamento.
- Fonte: `document.fonts.check("100px Anton")` retornou `true`.
- Contraste dos pares centrais: marfim/preto `17.29:1`; preto/coral `6.54:1`; marfim/cobalto profundo `7.14:1`; coral suave/cobalto profundo `4.91:1`; vermelho de texto/marfim `5.31:1`.
- Movimento reduzido, foco visível e alvos interativos têm regras explícitas.
- Testes automatizados: `npm run check` com `8/8` testes aprovados; `git diff --check` sem erro.

## Histórico de correções

- P0/P1: nenhum problema remanescente.
- P2 corrigido: o nome estava quebrando em duas linhas no desktop; agora acompanha a composição horizontal da referência.
- P2 corrigido: acentos corais pequenos sobre marfim/cobalto receberam variações de contraste acessível.
- P2 corrigido: CTAs destacados e estados de hover usam cobalto profundo para manter contraste AA.
- P3 corrigido: links de navegação, playlist, currículo e assinatura do rodapé receberam áreas de interação maiores.

final result: passed
