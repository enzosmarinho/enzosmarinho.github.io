# Portfólio oficial — Enzo Marinho

Fonte canônica deste projeto: `D:/projetos/portfolio-live`. Site principal: https://enzo-marinho.enzosmarinho.chatgpt.site . O endereço enzosmarinho.github.io encaminha ao principal. Identidade e composição aprovadas por Enzo em 09/09/2026; publicação pública autorizada na mesma conversa. Mudanças futuras de direção visual, intervenções audiovisuais e custos devem ser combinados.

## Arquitetura vigente

React/Vinext com exportação estática nativa. `app/page.tsx` compõe a home, `app/hero-live.tsx` a abertura e `app/portfolio-data.ts` contém onze filmes. `app/video-preview.tsx` controla nove prévias locais, silenciosas e com capa: reproduzem somente na área visível, param ao ocultar a página e respeitam pausa manual/preferência reduzida. Todo clique de trabalho é um link nativo para a publicação original, sem modal ou player interno. Os dois filmes longos usam capas locais e links diretos ao YouTube; prévias próprias deles dependem dos arquivos originais. `app/long-form-showcase.tsx` apresenta ambos após serviços, sem seleção intermediária. `app/globals.css` define o visual; `app/marca` é o guia. `public/media` preserva os trabalhos e suas cópias leves; `public/posters` contém as capas WebP. `.openai/hosting.json` publica somente `dist/client` no Sites. A raiz `index.html`/`404.html` encaminha visitas ao domínio oficial; o endereço anterior não deve ser divulgado como principal.

## Marca e proposta

Enzo ajuda quem ainda não produz e apoia quem já produz. Vídeos são a prova principal. Base aprovada: #221037, #8648FF e #F7F4FF; Inter Tight. O acento #EAFF87 foi rejeitado na revisão de 09/09/2026; permanece na publicação anterior até escolha de substituto, sem nova aprovação implícita. Cinco prévias verticais na abertura; a nova abertura com compilado horizontal depende da direção combinada e dos arquivos de origem. Biblioteca por linguagem, seis famílias de apoio; gravação seletiva. Sem tabela pública de preço, métricas inventadas ou promessas de crescimento. VOTI mantém crédito CLT; NF distingue edição dos cortes e captação do episódio 564xdqJQ4Zc; Kayky ADKpionmFiw tem estrutura, edição e cor; jiu-jitsu é trabalho avulso; Ademir DcyLnRzxRcv fica excluído.

## Operação

Na terceira revisão de 09/09/2026, Enzo rejeitou expressamente janelas de vídeo e pediu links diretos e prévias automáticas. A seção de serviços foi recomposta como `production-services`: edição com prova audiovisual, roteiro e quatro famílias de apoio com entregas visíveis, além de gravação seletiva. A antiga lista e suas divisórias horizontais saíram do DOM; não reintroduzir o acordeão. Nenhum plano de fundo com barras ou faixas nessa seção. A reformulação não aprova um substituto de cor para a marca inteira. O domínio fixo oficial é https://enzo-marinho.enzosmarinho.chatgpt.site/ .

Use `npm run build` e `npm exec tsc -- --noEmit` antes de publicar alterações. Validar mudanças de interface com critérios proporcionais. Movimento tem pausa manual, respeita preferência reduzida e para fora de vista . O contato monta uma mensagem editável; nada é enviado automaticamente.

O repositório é público: nunca versionar credenciais, .env, contratos, dados internos ou preços de clientes. Faça stage por caminhos explícitos; preserve alterações de outras sessões. Nada de serviços persistentes ou novos custos sem autorização. Cada publicação exige autorização específica já existente ou nova quando necessária. Fontes comerciais e recebimentos vivem na operação privada do Enzo, não neste site.

## Limites conhecidos

Curadoria audiovisual integral ainda pendente. As prévias são decorativas e sem áudio; a reprodução completa acontece nas publicações originais. Teste de playback não equivale a assistir/ouvir todo o acervo. HTML portátil tem validação estática; o site-fonte foi testado por HTTP. O lint não está totalmente verde: imagens/links nativos e ausência de faixa de legenda continuam sinalizados. Não ocultar verificações para declarar sucesso.
