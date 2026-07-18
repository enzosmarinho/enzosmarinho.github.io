# Design QA — proporção e movimento multirresolução

- Referência editorial escolhida: `.qa/selected-option-2-refined.png`
- Defeitos reportados: `codex-clipboard-67c0cf2a-70ce-427a-abcb-505b8b992af6.png`, `codex-clipboard-ba6ac3d3-fa6a-42b1-89ba-5c6a9696dff9.png` e `codex-clipboard-95524960-9924-4545-9daf-652e7fc8d0b6.png`
- Implementação desktop: `.qa/implementation-desktop.png`
- Implementação mobile: `.qa/implementation-mobile.png`
- Faixa de trabalhos: `.qa/implementation-proof-tape.png`
- Serviços e contraste: `.qa/implementation-services.png`
- Comparação conjunta normalizada: `.qa/comparison-final.png`
- Estado anterior à revisão tipográfica: `.qa/typography-before.png`
- Implementação após ajuste óptico: `.qa/typography-after-v1.jpg`
- Comparação tipográfica lado a lado: `.qa/typography-comparison-final.jpg`

## Comparação visual

1. Nome e hero — passed. `ENZO` e `MARINHO` têm respiro próprio, não invadem a colagem e mantêm uma escala editorial coerente. A divisão usa `40/60` no desktop, uma pilha em tablet e fluxo vertical com galeria horizontal no mobile.
2. Colagem — passed. Os seis quadrados usam trabalhos reais, separadores constantes de `2–4px`, cópia marfim sobre base escura e recortes independentes por formato. A composição continua assimétrica, mas cada bloco tem área legível.
3. Faixa — passed. Título, explicação, controle e cards formam três zonas claras. Os dez projetos escolhidos têm MP4 local verificado e a faixa percorre o viewport continuamente.
4. Serviços — passed. O sistema marfim/preto/coral/cobalto foi preservado; a faixa `Sem surpresa / Sem fidelidade / Sem caixa-preta` passou de branco invisível para texto escuro sobre marfim.
5. Fidelidade — passed. Catvi permanece descrita como local de uma visita da VOTI, não como cliente. Negócio Sem Filtro, VOTI, 8848 Jiu-Jitsu e os projetos independentes mantêm seus créditos reais.
6. Tipografia — passed. O nome usa Anton com kerning nativo e `letter-spacing: .012em` em desktop e mobile; “MARINHO” deixa de formar blocos colados sem perder a densidade editorial. Títulos de seção recebem o mesmo ajuste óptico, enquanto Manrope permanece na argumentação e IBM Plex Mono nos sinais operacionais.
7. Estratégia da primeira dobra — passed. A promessa explica a transformação, a ação principal ajuda o visitante a encontrar a oferta adequada, a ação secundária leva à prova em movimento e os três sinais de confiança reduzem risco antes do primeiro scroll.

## Movimento e controle

- Hero desktop: `6/6` vídeos simultaneamente em reprodução.
- Faixa: `10/10` cards principais têm preview em movimento; a cópia duplicada é usada apenas para continuidade.
- Pausar: o botão altera `aria-pressed`, nome acessível, texto visível, estado da animação e pausa todos os vídeos observados.
- Retomar: a faixa volta a avançar e os vídeos visíveis voltam a tocar.
- Estabilidade: o transform permanece igual durante a pausa; a correção removeu o salto causado por regras concorrentes de `prefers-reduced-motion`.
- Eficiência: vídeos fora do viewport são pausados por `IntersectionObserver`; a preferência de movimento reduzido continua respeitada até o visitante pedir movimento explicitamente.

## Matriz responsiva

Verificado no navegador real em:

- `320 × 800`
- `360 × 800`
- `390 × 844`
- `768 × 1024`
- `1024 × 768`
- `1280 × 720`
- `1440 × 900`
- `1920 × 1080`
- `2560 × 1440`
- `3840 × 2160`

Resultado em todas as resoluções: sem overflow horizontal, sem interseção entre texto e colagem e com cards maiores que a área mínima de leitura. Em 4K, o palco cresce para `3200 × 1440` em vez de ficar preso à escala 2K.

Na revisão tipográfica final, `ENZO MARINHO` manteve tracking positivo em toda a matriz: `0.9984px` em `320px`, `1.1232px` em `390px`, `1.776px` em `1920px` e `2.304px` em `3840px`.

## Qualidade técnica

- Console após rolagem completa: zero erros.
- Imagens após rolagem completa: zero arquivos quebrados.
- Contraste crítico corrigido: texto da faixa de segurança em `rgba(10, 10, 12, .68)` sobre `#f2eee6`.
- Foco visível, skip link, tabs com setas, status vivo e alvos interativos permanecem preservados.
- `npm run check`: `11/11` testes aprovados.
- `git diff --check`: sem erro.

## Histórico de correções

- P1 corrigido: nome comprimido e sobreposto à colagem.
- P1 corrigido: colagem estreita, alta e mal distribuída em 2K.
- P1 corrigido: faixa com animação declarada, porém parada pela cascata de movimento reduzido.
- P1 corrigido: vídeos dependentes de hover e cards imóveis no primeiro contato.
- P1 corrigido: texto branco sobre fundo marfim nos argumentos de segurança.
- P2 corrigido: palco subdimensionado em 4K.
- P2 corrigido: seleção da faixa incluía cards sem preview local.
- P1 corrigido: tracking negativo unia visualmente as letras do nome, principalmente em “MARINHO”.
- P2 corrigido: títulos internos usavam espaçamentos ópticos diferentes entre seções.
- P2 corrigido: a primeira dobra descrevia capacidades antes de deixar claro o próximo passo do cliente.

final result: passed
