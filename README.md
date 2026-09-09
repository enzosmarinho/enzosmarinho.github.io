# Enzo Marinho

Portfólio oficial: https://enzosmarinho.github.io/

Vídeo, criação e apoio para quem quer produzir. Aplicação estática independente de plataforma de criação, publicada no GitHub Pages.

## Desenvolvimento e publicação

`npm ci` instala as dependências. `npm run dev` inicia a prévia local. `npm exec tsc -- --noEmit` verifica tipos. `npm run build` gera o site em `dist/client`; `node scripts/prepare-pages.mjs` prepara essa pasta para hospedagem estática.

A publicação é feita por `.github/workflows/pages.yml` após push autorizado para `main`. GitHub Pages deve usar **GitHub Actions** como fonte. A mesma pasta final pode ser hospedada em outro servidor de arquivos estáticos.

`app/portfolio-data.ts` organiza os destaques; `app/voti-films.ts` contém a seleção da VOTI. Prévia local silenciosa em loop, capa permanente de segurança e link direto para cada publicação original. A reprodução economiza recursos fora da tela; não há botão de pausa nem modal.

O GitHub Pages possui limites de tamanho e tráfego: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits . Não há contrato de hospedagem ilimitada.
