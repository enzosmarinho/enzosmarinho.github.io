# Design QA — sistema editorial completo

- Fonte visual aprovada: `C:\Users\Usuario\AppData\Local\Temp\codex-clipboard-766e36ca-5eef-4eaa-869a-8818e8eae992.png`
- Implementação desktop: `C:\Users\Usuario\Documents\Codex\2026-07-17\fa-a-meu-portif-lio-como\work\portfolio\.qa\implementation-desktop.png`
- Implementação mobile: `C:\Users\Usuario\Documents\Codex\2026-07-17\fa-a-meu-portif-lio-como\work\portfolio\.qa\implementation-mobile.png`
- Comparação conjunta mais recente: `C:\Users\Usuario\Documents\Codex\2026-07-17\fa-a-meu-portif-lio-como\work\portfolio\.qa\comparison-latest.png`
- Estado comparado: topo da página, showreel pausado, viewport desktop de `1440 × 1000`; mobile em `390 × 844`.

## Evidência de fidelidade

1. Tipografia — passed. A fonte Anton, hospedada localmente sob OFL, reproduz a presença condensada e vertical da referência. Manrope continua no texto corrido e IBM Plex Mono nos dados e rótulos.
2. Paleta — passed. Preto `#08080a`, marfim `#f2eee6`, coral `#ff5b4f` e azul-cobalto `#293fbd` aparecem como tokens reutilizáveis no site inteiro.
3. Composição — passed. O hero preserva o nome monumental, a assinatura com pontos corais e a divisão vertical. O círculo azul foi substituído intencionalmente por uma colagem assimétrica de seis trabalhos reais, mantendo a função visual do bloco direito e aumentando a força da prova.
4. Ritmo editorial — passed. Títulos condensados, linhas finas, cantos retos, grandes áreas de respiro e alternância preto/marfim/cobalto foram aplicados a serviços, cases, método, sobre, FAQ e contato.
5. Conteúdo e conversão — passed. Proposta, formatos, provas e CTAs permanecem legíveis antes da parte longa do portfólio. Preços foram retirados do hero conforme orientação expressa; a colagem agora é exclusivamente formada por trabalhos realizados.
6. Fidelidade factual — passed. Catvi aparece somente como local de uma visita gravada para a VOTI; 8848 Jiu-Jitsu aparece uma única vez e sem associação com a Catvi; os novos cortes do Negócio Sem Filtro usam publicações e pôsteres reais.

## Interação, responsividade e acessibilidade

- Faixa de projetos: pausa e retomada verificadas; a ordem editorial começa por long-form, campanha VOTI, direção, conteúdo B2B e cortes de podcast.
- Serviços: tabs verificadas por clique; `Sites e páginas` atualizou o painel e o estado `aria-selected`.
- Trabalhos: filtro `Cortes e séries` exibiu cinco projetos e atualizou o status acessível.
- Trabalhos adicionais: o painel abriu corretamente e carregou quinze imagens sem quebra, incluindo três novos cortes do Negócio Sem Filtro.
- FAQ: abertura exclusiva verificada; abrir a segunda pergunta fechou a primeira.
- Responsividade: `360`, `390`, `768`, `1024`, `1440`, `1920` e `2560` px sem overflow horizontal.
- Mobile: nome, argumento, texto e CTAs continuam visíveis no primeiro fluxo de rolagem; a colagem vira uma galeria horizontal com snap e trabalhos reais.
- Imagens carregadas: zero arquivos quebrados após o carregamento.
- Fonte: `document.fonts.check("100px Anton")` retornou `true`.
- Contraste dos pares centrais: marfim/preto `17.29:1`; preto/coral `6.54:1`; marfim/cobalto profundo `7.14:1`; coral suave/cobalto profundo `4.91:1`; vermelho de texto/marfim `5.31:1`.
- Movimento reduzido, foco visível e alvos interativos têm regras explícitas.
- Testes automatizados: `npm run check` com `10/10` testes aprovados; `git diff --check` sem erro.

## Histórico de correções

- P0/P1: nenhum problema remanescente.
- P2 corrigido: o nome estava quebrando em duas linhas no desktop; agora acompanha a composição horizontal da referência.
- P2 corrigido: acentos corais pequenos sobre marfim/cobalto receberam variações de contraste acessível.
- P2 corrigido: CTAs destacados e estados de hover usam cobalto profundo para manter contraste AA.
- P3 corrigido: links de navegação, playlist, currículo e assinatura do rodapé receberam áreas de interação maiores.
- Correção factual: os antigos blocos comerciais do hero foram substituídos por `Funcionário perfeito` e `Sistema de Natal`.
- Correção factual: o bloco `Catvi` foi renomeado para `Captação na Catvi`, deixando explícito que se trata de gravação em visita da VOTI, não de relação de cliente.
- Curadoria ampliada: sete trabalhos do Negócio Sem Filtro e oito exemplos VOTI agora aparecem entre a seleção principal e os trabalhos adicionais, sem métricas inventadas.

final result: passed
