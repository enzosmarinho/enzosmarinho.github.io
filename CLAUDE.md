# Portfólio oficial — Enzo Marinho

Fonte canônica deste projeto: `D:/projetos/portfolio-live`. Site principal: https://enzo-marinho.enzosmarinho.chatgpt.site . O endereço enzosmarinho.github.io encaminha ao principal. Identidade e composição aprovadas por Enzo em 09/09/2026; publicação pública autorizada na mesma conversa. Mudanças futuras de direção visual, intervenções audiovisuais e custos devem ser combinados.

## Arquitetura vigente

React/Vinext com exportação estática nativa. `app/page.tsx` compõe a home, `app/hero-live.tsx` controla as prévias, `app/portfolio-data.ts` contém onze filmes de seis marcas/projetos. Nove vídeos são locais; dois longos usam o player oficial do YouTube sob demanda. `app/film-player.tsx` mantém capa e recuperação nos vídeos locais; `app/embedded-film.tsx` controla os embeds e sua pausa ao ocultar a página. `app/globals.css` define o visual. `app/marca` é o guia digital. `public/media` preserva os trabalhos e `public/posters` suas capas locais em WebP. `.openai/hosting.json` publica somente `dist/client` no Sites; nenhuma rotina Node ou Worker de aplicação é enviada. O desenvolvimento usa Vinext diretamente, sem um worker de assets interceptando a home. `index.html` e `404.html` da raiz só encaminham o endereço anterior.

## Marca e proposta

Enzo ajuda quem ainda não produz e apoia quem já produz. Vídeos são a prova principal. Base aprovada: #221037, #8648FF e #F7F4FF; Inter Tight. O acento #EAFF87 foi rejeitado na revisão de 09/09/2026; permanece na publicação anterior até escolha de substituto, sem nova aprovação implícita. Cinco prévias verticais na abertura; a nova abertura com compilado horizontal depende da direção combinada e dos arquivos de origem. Biblioteca por linguagem, seis famílias de apoio; gravação seletiva. Sem tabela pública de preço, métricas inventadas ou promessas de crescimento. VOTI mantém crédito CLT; NF distingue edição dos cortes e captação do episódio 564xdqJQ4Zc; Kayky ADKpionmFiw tem estrutura, edição e cor; jiu-jitsu é trabalho avulso; Ademir DcyLnRzxRcv fica excluído.

## Operação

Na revisão seguinte de 09/09/2026, Enzo esclareceu que o espaço após os serviços deve mostrar filmes longos, substituindo a arte estática. `app/long-form-showcase.tsx` é essa seção: podcast e Kayky com capa local, seleção e player inline sob demanda. Não confundir essa entrega com um novo compilado ou com a abertura da home. O guia da marca continua em `/marca`, com acesso pelo rodapé. O relato de duas barras na seção de serviços aguarda identificação exata: não declarar esse relato resolvido com a correção anterior de foco.

Use `npm run build` e `npm exec tsc -- --noEmit` antes de publicar alterações. Validar mudanças de interface com critérios proporcionais. Movimento tem pausa manual, respeita preferência reduzida e para fora de vista ou quando o player abre. O contato monta uma mensagem editável; nada é enviado automaticamente.

O repositório é público: nunca versionar credenciais, .env, contratos, dados internos ou preços de clientes. Faça stage por caminhos explícitos; preserve alterações de outras sessões. Nada de serviços persistentes ou novos custos sem autorização. Cada publicação exige autorização específica já existente ou nova quando necessária. Fontes comerciais e recebimentos vivem na operação privada do Enzo, não neste site.

## Limites conhecidos

Faixas de legendas acessíveis e curadoria audiovisual integral ainda pendentes. Teste de playback não equivale a assistir/ouvir todo o acervo. HTML portátil tem validação estática; o site-fonte foi testado por HTTP. O lint não está totalmente verde: imagens/links nativos e ausência de faixa de legenda continuam sinalizados. Não ocultar verificações para declarar sucesso.
