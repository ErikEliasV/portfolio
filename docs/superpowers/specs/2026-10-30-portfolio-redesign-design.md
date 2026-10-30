# Redesign do portfólio: visual pixel + fundo dither em WebGL

Data: 2026-10-30 · Repositório: `Portifolio` (Next.js 16, export estático para GitHub Pages)

Mockups aprovados (abrem no navegador, ficam fora do git):
`.superpowers/brainstorm/1404-1793332955/content/` → `primeira-tela.html` (opção B), `rolagem.html` (caminho 1), `secoes.html`.

## Intenção e porquê

O portfólio é a prova do nível do Erik. Quem abrir o site, principalmente um recrutador, tem que perceber nos primeiros segundos, sem ler nada, que ele domina WebGL, animação e direção visual. O fundo dither animado é a assinatura técnica, e o resto do site precisa estar à altura: criativo e bonito.

A ideia atual do terminal que "dá boot" com o scroll e vira o site **continua** (pedido explícito). Ela tem dois problemas que o redesign precisa resolver:

1. **Parece vazio.** Hoje a primeira tela é um título e uma janelinha de terminal sobre um fundo liso.
2. **Confunde recrutadores menos técnicos.** Os atalhos `whoami`, `system_info` e `education` não dizem o que são. Além disso, o conteúdo desliza *dentro* do terminal com a rolagem travada (`h-[1000vh]` e um buffer animado), e a pessoa demora a entender onde as coisas estão.

O visual segue a referência que o usuário mandou: fundo escuro com grade, verde‑limão de destaque, títulos enormes em fonte pixelada, rótulos pequenos em mono e caixa alta, cards cinza‑escuros com ícone + título + texto e imagens em pixel/dither (a Terra pixelada). Só o estilo é aproveitado. Nada do conteúdo ou da marca da referência entra no site.

### Referência visual

A imagem foi enviada na conversa e não está no repositório. Esta descrição, junto com os mockups, é o alvo visual.

- **Fundo:**
  - quase preto (`~#141414`), com uma linha fina verde‑limão no topo da página;
  - grade de quadrados com linhas cinza bem escuras;
  - "ruído" de quadradinhos cinza em 2–3 tons, espalhados e mais densos na parte de cima, sumindo aos poucos.
- **Planeta:**
  - Terra em pixel art, enorme, ocupando a largura central, e cortada pela borda inferior da faixa escura (só ~55% de cima aparece);
  - pixels grossos, com ~55–65 blocos no diâmetro;
  - paleta com 2 azuis de oceano (fundo e médio), ciano/turquesa nos rasos, 3 verdes de terra (floresta escuro, médio e verde‑amarelado claro) e nuvens em aglomerados brancos/creme;
  - borda de atmosfera creme/bege clara no lado iluminado (topo e direita), lado esquerdo mais escuro;
  - é quantização em blocos (pixel art), não um padrão de dither fino. O nosso dither ordenado deve usar pixel grande o bastante para ler como blocos assim.
- **Interface:**
  - título gigante em fonte bitmap branca, cortado na borda da tela ("COMMUNITY/(");
  - rótulos pequenos em mono e caixa alta (ex.: "COMMUNITY ✕✕✕" no canto superior esquerdo e um parágrafo curto alinhado à direita no canto oposto);
  - cards cinza (`~#262626`) com ícone pixelado verde pequeno + título em caixa alta e texto descritivo pequeno em mono cinza;
  - CTA em fonte pixel verde‑limão entre chaves ("{JOIN DISCORD}").
- **Moldura de apresentação:** o fundo verde‑limão em volta dos aparelhos é só a moldura do mockup da referência, não faz parte do site.

No nosso site, o planeta fica à direita e parcialmente cortado (opção B), mas segue essa paleta, essa luz e esse tamanho de pixel.

## Objetivos

- Primeira tela cheia e marcante: planeta em dither, nome em pixel, terminal digitando e cards das seções.
- O terminal continua sendo o fio da experiência: boot, depois expande e vira o site.
- Navegação e títulos em linguagem clara. Os comandos de terminal ficam só como enfeite.
- Fundo dither animado em WebGL atrás do site inteiro.
- Funcionar bem no celular, com a mesma experiência em versão mais curta e leve.

## Não‑objetivos

- Mudar o conteúdo (experiências, skills, formação, projetos, contatos e `src/data/projects.ts` continuam iguais). Só entram os textos curtos novos listados abaixo.
- Novas seções, blog, CMS, analytics ou formulário de contato.
- A sincronização com o Claude Design. Ela está pausada e é retomada **depois** do redesign, num trabalho separado.

## Anti‑objetivos (fracasso mesmo que "funcione")

- Site travando, esquentando ou drenando bateria no celular.
- Texto difícil de ler por estar em cima de dither claro.
- Recrutador sem achar os projetos em até um clique/toque a partir da primeira tela.
- Perder a ideia do terminal ou deixar a experiência genérica.
- Conteúdo de novo "preso" dentro do terminal com a rolagem sequestrada.

## Restrições

- **Export estático:** Next.js 16 com `output: "export"`, `basePath: "/portfolio"` e deploy no GitHub Pages (`.github/workflows/deploy.yml`). Nada que precise de servidor. `scripts/post-build.mjs` (redirect para `/pt-BR`) continua funcionando.
- **i18n:** `next-intl` com `pt-BR` (padrão) e `en`. Todo texto novo entra em `messages/pt-BR.json` e `messages/en.json`, e o seletor PT/EN continua.
- **Rotas:** permanecem `/[locale]` e `/[locale]/projects/[slug]` (`generateStaticParams` já existe).
- **Imagens:** usam `NEXT_PUBLIC_BASE_PATH` (`.env.production`) como hoje.
- **Stack mantida:** Next.js 16, React 19, Tailwind CSS 4 e framer-motion 12. Nenhuma biblioteca nova de WebGL (three.js, ogl e afins).

## O que o usuário decidiu

1. **Estilo:** o da referência (descrito acima).
2. **Dither:** animado em WebGL, como **fundo do site inteiro**.
3. **Primeira tela, opção B:**
   - Planeta em dither girando à direita, parcialmente cortado, como a Terra da referência.
   - Nome em pixel à esquerda em duas linhas ("ERIK" / "ELIAS/"), com o cargo, a stack e o CTA `{VER PROJETOS}`.
   - Janela de terminal por cima do planeta, já digitando.
   - Três cards de seção no rodapé da tela: Experiência, Habilidades, Projetos.
   - Barra superior com a marca e o menu.
4. **Rolagem, caminho 1 ("o terminal vira o site"):**
   - O planeta se afasta (sobe e diminui), o terminal vai ao centro e digita o boot.
   - O terminal cresce até ocupar a tela e o topo dele vira uma barra de navegador (URL `localhost:3000` + menu).
   - Daí em diante a página **rola normalmente**, com as seções por cima do fundo dither.
5. **Menu:** Sobre · Experiência · Habilidades · Formação · Projetos · Contato · PT/EN.
6. **Seções:** como no mockup `secoes.html` (detalhes abaixo). O usuário aprovou com "gostei".
7. **Celular:** a mesma experiência, mais curta e leve:
   - layout empilhado;
   - boot que exige bem menos rolagem;
   - shader em resolução menor, pausado quando a aba não está visível;
   - menu funcional desde a primeira tela.
8. **Escolhas técnicas** (propostas por Claude e aceitas pelo usuário):
   - shader WebGL escrito à mão num único canvas fixo atrás da página;
   - fonte pixelada **Silkscreen** via `next/font/google`;
   - **Geist Mono** continua nos textos;
   - com `prefers-reduced-motion`, o dither fica num quadro estático.

### Propostas do Claude que o usuário aprovou ao ver o mockup

- **Destaque:** o verde‑limão (`#b5f562` no mockup) substitui o verde‑esmeralda atual. Fundo base `#0d0d0d`, cards `#1a1a1a` com borda `#2c2c2c`.
- **Textos novos:** frases curtas ao lado de cada título de seção, escritas pelo Claude (texto abaixo). Precisam de versão EN. O usuário **confirmou** que está procurando trabalho: o site deve dizer "Estou aberto a oportunidades como desenvolvedor Full Stack" no contato e mostrar a i9systemas como emprego anterior.
- **Leitura:** as descrições ficam em caixa normal. A caixa alta fica só para rótulos, datas e menus.
- **Habilidades:** os logos coloridos (`react-icons`) viram chips com um marcador verde quadrado.
- **Página de projeto:** `/projects/[slug]` ganha o mesmo visual.
- **Cursor:** o `MouseFollower` continua, recolorido para verde‑limão.
- **"Sobre":** no menu, leva ao topo (hero). Não existe seção "Sobre" separada.

## A experiência em detalhe

### Fundo WebGL (um canvas, um shader)

Um `<canvas>` fixo cobrindo a viewport, atrás de todo o conteúdo, desenhado por um único fragment shader:

- **Dither ordenado:** matriz Bayer 8×8, quantizando para uma paleta curta. Fundo `#0d0d0d`, verdes escuros, verde‑limão e, no planeta, azuis de oceano, verdes de terra e um creme na borda (atmosfera), como na referência.
- **Pixel grande:** o shader renderiza em resolução baixa e é ampliado sem suavização (`image-rendering: pixelated`), para o pixel ficar visível como na referência. Uma grade fina de linhas (CSS) fica por cima.
- **Planeta:** esfera com continentes procedurais girando devagar, luz vinda de cima à esquerda e borda creme.
  - No hero ele fica grande, à direita.
  - Durante a intro, um uniform de progresso do scroll faz o planeta subir e encolher (mockup `rolagem.html`, passo 2).
  - Quando o terminal vira o site, ele sai de cena.
- **Campo de ondas:** depois da intro, o fundo é um campo de ondas em dither, majoritariamente escuro, com cristas verde‑limão ocasionais. Ele é calmo o bastante para não competir com o conteúdo.
- **Mouse:** no desktop, uma reação sutil perto do cursor. No toque não há reação.
- **Legibilidade:** cards e textos longos ficam sobre superfícies quase opacas (~92%). Texto nunca fica direto sobre dither claro.
- **Desempenho:**
  - limite de DPR, resolução ainda menor no celular;
  - o fundo anima continuamente enquanto a aba está visível, limitado a ~30 fps no celular;
  - `requestAnimationFrame` parado com a aba oculta (`visibilitychange`);
  - com `prefers-reduced-motion`, um único quadro estático.
- **Sem WebGL:** fundo escuro com a grade em CSS. O site continua 100% usável.

### Primeira tela (hero) e intro

- Layout da opção B (`primeira-tela.html`).
- **Textos do hero:** usam as chaves que já existem, sem texto novo de apresentação.
  - acima do nome, com a bolinha pulsando de hoje: `Hero.role` ("Anterior: Full Stack na i9systemas (Jul 2025 - Fev 2026)"), para ficar claro que é emprego anterior;
  - o nome: `Hero.title`, em duas linhas;
  - `Hero.heroRole` e `Hero.subtitle`;
  - CTA: `Hero.cta`, renderizado entre chaves (`{EXPLORAR PROJETOS}`).
- **Cards do hero:** ganham chaves novas nos dois idiomas.
  - Experiência: "Full Stack na i9systemas · 2025–2026", com as datas deixando claro que terminou;
  - Habilidades: "Next.js · React · Node.js · Docker";
  - Projetos: nomes dos projetos de `src/data/projects.ts`.
- O terminal digita o boot conforme a rolagem. Mantenha o espírito das linhas atuais de `ScrollBootSequence.tsx` (`cd ~/projects`, `ls`, `git log`, `npm install`, dependências, `npm run dev`, "Next.js pronto") com o novo visual.
- Os três cards do rodapé da tela levam à seção correspondente.
- Os atalhos de hoje (`whoami | system_info | education | projects | contact`) saem e são substituídos pelo menu claro.
- **Transição:**
  1. o terminal cresce até a tela cheia;
  2. a barra do terminal se transforma na barra de navegador (bolinhas quadradas, uma verde; URL `🔒 localhost:3000`; menu à direita);
  3. essa barra fica fixa no topo durante o resto da página.
- Depois da transição, o conteúdo é fluxo normal de página. Âncoras de menu usam rolagem nativa (`scroll-margin` para não ficar atrás da barra fixa).
- **Celular:**
  - nome em cima, planeta atrás e terminal embaixo;
  - **os três cards do hero não aparecem**: não cabem numa tela de ~390×700 sem apertar tudo, e o menu compacto já dá navegação em um toque;
  - menos linhas de boot e muito menos distância de rolagem até a transição;
  - o menu (em forma compacta) funciona desde o início.
- **Rolar de volta para cima:** desfaz a intro. Ao clicar em "Sobre", o hero volta como era.

### Seções (ordem e conteúdo)

**Padrão de toda seção** (ver `secoes.html`):

- Acima do título, a linha pequena de comando como enfeite: `erik@local ~/portfolio $ <comando>`.
- Título enorme em Silkscreen terminado em `/`.
- À direita, um bloco pequeno em caixa alta: número + nome ("01 — Onde já trabalhei"), `✕✕✕` em verde‑limão e uma frase curta.
- Os cards entram com animação suave ao aparecer (framer-motion, já usado).

| # | Título (pt / en) | Comando‑enfeite | Conteúdo |
|---|---|---|---|
| 01 | EXPERIÊNCIA/ · EXPERIENCE/ | `whoami --history` | 3 cards (i9systemas em destaque com borda verde; Senac Labs; Claro). Cada card: cargo, empresa, data `[ JUL 2025 — FEV 2026 ]` em verde, descrição completa. |
| 02 | HABILIDADES/ · SKILLS/ | `system_info --tools` | 3 cards: Frontend/Mobile, Backend/DevOps, Ferramentas/IA, cada um com os chips das skills (listas de `Skills.*`). |
| 03 | FORMAÇÃO/ · EDUCATION/ | `cat education.txt` | Card do curso (UNP, em destaque) + card com a lista de cursos/certificações com `✔`. |
| 04 | PROJETOS/ · PROJECTS/ | `ls ~/projects --showcase` | Cards grandes com thumbnail real, título, até 4 tags de tecnologia e `{VER PROJETO}` levando a `/projects/[slug]`. |
| 05 | CONTATO/ · CONTACT/ | `contact --links` | 4 cards de link (GitHub, LinkedIn, Instagram, Email), com os mesmos links de `TerminalFooter.tsx`. Fecha com `[ PROCESSO FINALIZADO ] EOF`. |

**Frases laterais** (texto novo; o EN é a tradução direta):

- **01 — Onde já trabalhei:** "Da startup ao atendimento: front-end, mobile e API em equipe."
- **02 — Com o que eu trabalho:** "Front-end, back-end e as ferramentas do dia a dia."
- **03 — Onde estudo:** "Graduação e cursos em andamento."
- **04 — O que construí:** "Clique em um projeto para ver galeria, stack e links."
- **05 — Vamos conversar:** "Estou aberto a oportunidades como desenvolvedor Full Stack."

**Ícones dos cards:** pequenos ícones pixelados em verde‑limão. As formas ficam a critério de quem construir.

### Página de projeto (`/[locale]/projects/[slug]`)

- Mesmo conteúdo e estrutura de hoje (`ProjectDetailClient.tsx`: voltar, título, descrição, tech stack, links, galeria).
- Visual novo:
  - mesma barra de navegador fixa no topo, com "voltar";
  - título em Silkscreen;
  - chips e cards no estilo das seções;
  - galeria em cards;
  - o mesmo fundo dither, só com o campo de ondas, sem planeta.

### Global

- **Fontes:** Silkscreen (títulos, CTAs, números grandes) e Geist Mono (todo o resto), via `next/font/google`. A Silkscreen precisa cobrir os acentos do português (Ê, Ç, Ã, Õ, É). Confirmar na build e escolher os subsets de acordo.
- **`MouseFollower`:** mantido, em verde‑limão, só no desktop (como hoje).
- **Fim do código antigo:** o mecanismo atual de `h-[1000vh]` + buffer animado dentro do terminal é removido.

## O que fica a critério de quem construir

- A matemática do shader, a sintonia fina da paleta, a densidade das ondas e o tamanho do pixel. O alvo é o look dos mockups e da referência.
- Distâncias e tempos da intro, tanto no desktop quanto no celular. O celular tem que ser claramente mais curto.
- A estrutura de componentes e os nomes de arquivos. Componentes autocontidos ajudam a sincronização futura com o Claude Design.
- Como implementar a transformação terminal → barra de navegador.
- As formas dos ícones pixelados e as curvas de animação.
- Se a dependência `react-icons` sai ou fica (os ícones de contato podem continuar vindo dela, em verde/creme).

## Como saber que deu certo

- `npm run build` passa (export estático + redirect) e `npm run lint` fica limpo.
- **Desktop:** a primeira tela mostra planeta, nome, terminal e cards, sem área vazia. A intro termina no terminal virando o site, e daí a rolagem é nativa.
- **Celular** (viewport ~390px): a mesma sequência mais curta, sem travar, com conteúdo legível e menu funcional desde o início.
- Projetos alcançáveis em um clique a partir da primeira tela (menu, card do hero ou `{VER PROJETO}`).
- PT e EN completos, inclusive nos textos novos.
- Com movimento reduzido, o dither fica estático e as animações são mínimas. Sem WebGL, o site continua usável.
