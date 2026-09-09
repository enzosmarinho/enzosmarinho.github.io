# Portfólio oficial — Enzo Marinho

Fonte canônica deste projeto: `D:/projetos/portfolio-live`. Site principal: https://enzo-marinho.enzosmarinho.chatgpt.site . O endereço enzosmarinho.github.io encaminha ao principal. Identidade e composição aprovadas por Enzo em 09/09/2026; publicação pública autorizada na mesma conversa. Mudanças futuras de direção visual, intervenções audiovisuais e custos devem ser combinados.

## Arquitetura vigente

React/Vinext com exportação estática nativa. `app/page.tsx` compõe a home, `app/hero-live.tsx` controla as prévias, `app/portfolio-data.ts` contém os nove filmes/cinco projetos. `app/globals.css` define o visual. `app/marca` é o guia digital. `public/media` preserva os trabalhos e `public/posters` suas capas. `.openai/hosting.json` publica somente `dist/client` no Sites; nenhuma rotina Node ou Worker de aplicação é enviada. `index.html` e `404.html` da raiz só encaminham o endereço anterior.

## Marca e proposta

Enzo ajuda quem ainda não produz e apoia quem já produz. Vídeos são a prova principal. Roxo aprovado: #221037, #8648FF, #EAFF87 e #F7F4FF; Inter Tight. Cinco prévias verticais na abertura, biblioteca por linguagem, seis famílias de apoio; gravação seletiva. Sem tabela pública de preço, métricas inventadas ou promessas de crescimento. VOTI mantém crédito CLT; NF é edição; jiu-jitsu é trabalho avulso; Ademir DcyLnRzxRcv fica excluído.

## Operação

Use `npm run build` e `npm exec tsc -- --noEmit` antes de publicar alterações. Validar mudanças de interface com critérios proporcionais. Movimento tem pausa manual, respeita preferência reduzida e para fora de vista ou quando o player abre. O contato monta uma mensagem editável; nada é enviado automaticamente.

O repositório é público: nunca versionar credenciais, .env, contratos, dados internos ou preços de clientes. Faça stage por caminhos explícitos; preserve alterações de outras sessões. Nada de serviços persistentes ou novos custos sem autorização. Cada publicação exige autorização específica já existente ou nova quando necessária. Fontes comerciais e recebimentos vivem na operação privada do Enzo, não neste site.

## Limites conhecidos

Faixas de legendas acessíveis e curadoria audiovisual integral ainda pendentes. Teste de playback não equivale a assistir/ouvir todo o acervo. HTML portátil tem validação estática; o site-fonte foi testado por HTTP. O lint não está totalmente verde: imagens/links nativos e ausência de faixa de legenda continuam sinalizados. Não ocultar verificações para declarar sucesso.
