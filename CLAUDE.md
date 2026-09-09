# Portfólio oficial — Enzo Marinho

Fonte canônica: `D:/projetos/portfolio-live`. Endereço oficial: https://enzosmarinho.github.io/ . Em 09/09/2026, Enzo pediu retorno à hospedagem direta no GitHub Pages, sem encaminhamento para outra plataforma. Publicação e correções atuais autorizadas na conversa. Custos novos, mudanças de direção visual e intervenções criativas audiovisuais exigem combinação prévia.

## Arquitetura vigente

React/Vinext com exportação estática. `app/page.tsx` compõe a home; `app/hero-live.tsx` abre com cinco trabalhos. `app/portfolio-data.ts` organiza destaques por linguagem; `app/voti-films.ts` contém 57 vídeos da seleção VOTI, e `app/voti/page.tsx` apresenta o acervo com filtros. `app/long-form-showcase.tsx` apresenta podcast e treino completo no lugar solicitado pelo Enzo. `app/marca` é o guia visual. `public/media` guarda mídias e cópias leves; `public/posters` guarda capas.

`app/video-preview.tsx` inicia prévias silenciosas em loop quando estão visíveis. Não oferecer pausa manual ou modo de movimento: Enzo rejeitou esses controles. Fora da tela e com aba oculta, suspende decodificação automaticamente; retoma quando visível. Nenhuma prévia pode ficar sem capa de segurança. Os trabalhos abrem diretamente a publicação original por link nativo; não reintroduzir modais ou players internos com controles.

`npm run build` exporta `dist/client`. `node scripts/prepare-pages.mjs` exclui do artefato de hospedagem apenas os MP4 originais pesados, preservando os arquivos fonte e as prévias; adiciona 404 e `.nojekyll`. `.github/workflows/pages.yml` valida, exporta e publica via GitHub Actions. Não há dependência do plugin de hospedagem anterior nem HTML de encaminhamento. A fonte Pages deve ser GitHub Actions.

## Marca e proposta

Enzo ajuda quem ainda não produz e apoia quem já produz. Vídeos são a prova principal. Base aprovada: #221037, #8648FF e #F7F4FF; Inter Tight. O acento #EAFF87 foi rejeitado e ainda aguarda substituto; não tratar a manutenção temporária como nova aprovação. Priorizar serviços remotos e apoio à produção; captação seletiva. Sem preços públicos, resultados inventados ou promessas de crescimento.

VOTI mantém crédito de experiência CLT. NF distingue edição dos cortes e captação do episódio 564xdqJQ4Zc. Kayky ADKpionmFiw tem estrutura, edição e cor. Jiu-jitsu é trabalho avulso. Ademir DcyLnRzxRcv fica excluído. Não atribuir ao Enzo automaticamente todos os Reels de perfis de empresas: há publicações de agências e parceiros no inventário.

Serviços usam `production-services`: edição com prova audiovisual, roteiro, quatro famílias de apoio com entregas visíveis e gravação seletiva. O antigo acordeão e as barras decorativas foram rejeitados; não reintroduzir. O contato monta mensagem editável e não envia nada automaticamente.

## Validação e limites

Rodar tipos, build, preparação do artefato e verificar visualmente mudanças antes da publicação. Conferir capas, proporções, playback real, links originais, telas pequenas e ausência de encaminhamento no endereço público.

Em 09/09/2026 foram coletados os 126 Reels disponíveis no perfil VOTI e inspecionadas sequências de quadros a cada 2 segundos: isso não equivale a assistir e ouvir integralmente todos os vídeos. Seleção pública de 2026 e peças anteriores de interesse; confirmação do início do vínculo e do trio cinemático mencionado continua pendente. DSldztZCA9P, DVjvzjvESOn e DTgXN2FiDV6 são os candidatos selecionados. A prévia DVj usa cópia orientada corretamente e retira apenas a margem externa preta; o original continua preservado. O podcast conserva capa e link enquanto sua prévia não estiver disponível; não usar footage de outro episódio como substituto.

O repositório é público: nunca versionar credenciais, .env, contratos, dados internos ou preços de clientes. Stage por caminhos explícitos; preservar alterações alheias. Nada de serviços persistentes ou custos novos sem autorização. Evidência privada de pesquisa e curadoria vive em `D:/hub/ops/auditoria-ia-2026-09-06/provas-servicos/enzo-portfolio-editorial-20260909/quarta-revisao`, fora do site.
