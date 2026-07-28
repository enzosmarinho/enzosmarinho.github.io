# Design QA: portfólio orientado por diagnóstico

Data da verificação: 28/07/2026.

## Tese validada

A página funciona como uma sala de diagnóstico:

1. O hero rejeita o pacote genérico e abre com trabalho real em vídeo.
2. Quatro casos explicam problema, decisão, papel e prova original.
3. A análise coleta contexto sem calcular ou prometer preço.
4. O arquivo preserva os 31 trabalhos catalogados.
5. Capacidade, método e papéis de IA aparecem depois da prova.
6. A ação principal é sempre pedir uma análise.

VOTI aparece como experiência CLT. Projetos independentes e o histórico encerrado
da Lumiar usam etiquetas diferentes. Os cortes do Negócio Sem Filtro aparecem
como edição e curadoria, não como automação.

## Auditoria visual

- Direção: editorial, cinematográfica, fundo quase preto, ação lima e sinal laranja.
- Mídia: apenas trabalho real já presente no repositório.
- Hero: CTA e prova visíveis no desktop; CTA, promessa e números visíveis no mobile.
- Casos: altura limitada a 800px no desktop para evitar rolagem inflada.
- Diagnóstico: fundo claro cria uma mudança de ritmo e deixa o formulário legível.
- Arquivo: duas colunas em mobile, três em tablet e quatro em desktop.
- Sem gradiente decorativo, glassmorphism, mockup falso ou brilho genérico.

## Matriz responsiva

Verificado no Chrome real em:

- 320 x 800
- 390 x 844
- 768 x 1024
- 1024 x 768
- 1280 x 720
- 1440 x 900
- 1920 x 1080

Resultado: zero overflow horizontal, hero e CTA dentro do viewport e 31 trabalhos
renderizados em todas as resoluções.

## Interação e acessibilidade

- Skip link é o primeiro foco e entra completamente no viewport.
- Alvos de ação têm no mínimo 44px; radios invisíveis usam labels de 52px.
- Formulário usa `fieldset`, `legend`, labels e status `aria-live`.
- Pedido preenchido gera a URL correta do WhatsApp e não envia automaticamente.
- Filtro `Edição` mostra exatamente 7 trabalhos e atualiza `aria-pressed`.
- Movimento reduzido pausa o vídeo, remove revelações e desativa o progresso animado.
- Movimento normal tem controle de pausa; aba oculta e hero fora da tela pausam o vídeo.
- Zero listener de `scroll`; revelações usam `IntersectionObserver`.
- Contraste mínimo corrigido para mais de 4.5:1 em texto normal.
- Lighthouse de acessibilidade: 100.

## Mídia e proveniência

- 31 permalinks: 28 respostas HTTP 200 e 3 redirecionamentos YouTube 303 válidos.
- 36 imagens carregadas após rolagem completa.
- Zero imagem quebrada.
- Um vídeo no hero, mudo, com poster, controle e pausa por visibilidade.
- Inventário interno sem autoria demonstrada continua fora da página pública.

## Performance

Lighthouse local, perfil padrão:

- Performance: 99
- Acessibilidade: 100
- Boas práticas: 100
- SEO: 100
- FCP: 0,9s
- LCP: 2,0s
- TBT: 0ms
- CLS: 0

Medição adicional em navegador local:

- 9 recursos na primeira dobra
- 1,38MB transferidos com o vídeo em reprodução
- 0 long tasks
- 0 layout shift

## Gates de código

- `npm run check`: 20 de 20 testes aprovados.
- `git diff --check`: sem erro de whitespace.
- Console do navegador: zero erros no desktop e no mobile.
- Nenhum preço fixo ou campo `price`/`payment` em dados comerciais.
- Nenhuma dependência de runtime adicionada.

## Publicação

O resultado está numa worktree e branch local. Nenhum push, merge em `main` ou
alteração do GitHub Pages foi feito.

Resultado do QA do portfólio: aprovado para revisão humana antes de publicar.
