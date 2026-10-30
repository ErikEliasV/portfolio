# Redesign Pixel + Dither — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar o portfólio no visual pixel / grade / verde‑limão, com fundo dither animado em WebGL, mantendo a intro do terminal que "dá boot" e vira o site, e todo o conteúdo atual.

**Architecture:**
- **Lógica pura sem dependências** (timeline da intro, Bayer, paleta, limite de fps, config das seções) mora em `src/lib/**` e é testada com `node:test`.
- **Fundo:** um canvas WebGL fixo (`DitherBackground`) desenha planeta + ondas num único fragment shader. Ele lê o progresso da intro de um `MotionValue` do framer-motion.
- **Home:** é um componente cliente (`HomeExperience`) que compõe a intro (sticky, guiada pelo scroll) e as seções em fluxo normal.

**Tech Stack:**
- Next.js 16.2 (App Router, `output: "export"`), React 19.2, TypeScript 5, Tailwind CSS 4, framer-motion 12, next-intl 4.
- WebGL 1 / GLSL ES 1.00, sem bibliotecas.
- Testes com `node:test` (Node 24 roda `.ts` com type stripping, já verificado).

**Spec:** `docs/superpowers/specs/2026-10-30-portfolio-redesign-design.md`.
- Leia inteira antes de começar. Ela tem a descrição da imagem de referência, as decisões do usuário e o que é decisão de quem constrói.
- Os mockups aprovados ficam em `.superpowers/brainstorm/1404-1793332955/content/` (`primeira-tela.html` opção B, `rolagem.html` caminho 1, `secoes.html`). São locais e gitignored: se ainda existirem, abra no navegador para referência visual; se não, a spec basta.

**Idioma:** o usuário fala português. Responda e reporte em português.

## Global Constraints

- **Dependências:**
  - nenhuma dependência nova de runtime (nada de three.js, ogl e afins) e nenhum framework de teste;
  - testes só com `node:test`, rodados por `npm test`.
- **Módulos testados pelo Node** (`src/lib/**`):
  - só sintaxe TS apagável (sem `enum`, `namespace` ou parameter properties);
  - sem imports, ou apenas imports relativos com extensão `.ts` explícita;
  - nunca o alias `@/`.
- **Export estático:**
  - sem APIs de servidor;
  - `basePath` `/portfolio`;
  - URL de dev: `http://localhost:3000/portfolio/pt-BR` (e `/portfolio/en`).
- **i18n:**
  - todo texto visível vem do next-intl, em `messages/pt-BR.json` **e** `messages/en.json`;
  - `pt-BR` é o padrão;
  - os dois arquivos têm sempre o mesmo conjunto de chaves.
- **Tokens de cor** (Tailwind 4, `@theme` em `src/app/globals.css`):
  - `--color-ink: #0d0d0d`, `--color-panel: #1a1a1a`, `--color-line: #2c2c2c`;
  - `--color-accent: #b5f562`, `--color-accent-dim: #6f9a3a`;
  - `--color-fg: #e8e8e0`, `--color-cream: #f1f1e8`, `--color-copy: #b9b9b0`, `--color-muted: #8a8a82`;
  - nenhuma classe `emerald-*`/`teal-*` sobra no fim.
- **Fontes:**
  - Silkscreen (pesos 400 e 700, subsets `latin` + `latin-ext`) como `font-pixel`, para títulos, CTAs e números grandes;
  - Geist Mono como `font-mono`, para todo o resto (fonte padrão do `body`);
  - a classe `font-geist-mono` usada hoje **não existe** no CSS compilado e não deve ser usada.
- **Caixa alta:** só em rótulos, datas, menus e títulos pixel. Descrições ficam em caixa normal.
- **Legibilidade:** texto longo só sobre superfícies ≥ 92% opacas (`bg-panel/95`, `bg-ink/90`).
- **Celular:** `(max-width: 767px)`.
- **Movimento reduzido:**
  - dither estático (um quadro, redesenhado só quando o scroll muda o planeta);
  - framer-motion sob `<MotionConfig reducedMotion="user">`;
  - cursor piscando parado.
- **Git:**
  - não fazer commit de nada em `.design-sync/`: é da sincronização com o Claude Design, que está pausada;
  - commits sempre com caminhos explícitos, nunca `git add -A`.

## Review Focus

1. **WebGL indisponível ou contexto perdido:** a página continua usável com o fundo `ink` + grade CSS, sem loop de erros no console. Verificado na Task 7.
2. **Celular de 390px, PT e EN:** nenhuma rolagem horizontal da página. Títulos pixel enormes, como "HABILIDADES/" e "EXPERIENCE/", e o nome no hero quebram ou encolhem, não vazam. Verificado nas Tasks 5, 6 e 8.
3. **Link direto ou recarregar no meio da página** (`#projects`, ou F5 com a página rolada até Contato): a barra de navegador aparece, o planeta não aparece, sem pulo. Verificado na Task 8.
4. **Redimensionar a janela atravessando 768px no meio da intro:** o terminal se reposiciona, sem ficar travado ou fora do lugar. Verificado nas Tasks 4 e 8.
5. **Teclado:** Tab passa por menu, CTA, cards do hero e cards de projeto com anel de foco verde visível. Enter num link de seção para com o título visível abaixo da barra fixa. Verificado nas Tasks 1 e 8.

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `tests/*.test.mjs` | Testes `node:test` (i18n, seções, dither, timeline) |
| `src/lib/sections.ts` | `SECTIONS`: ordem, ids, número e comando‑enfeite de cada seção |
| `src/lib/dither/bayer.ts` | Limiares Bayer 8×8 |
| `src/lib/dither/palette.ts` | Paletas (ondas, planeta) + `hexToRgb01` |
| `src/lib/frame-throttle.ts` | Limite de fps do loop |
| `src/lib/intro/timeline.ts` | Estado da intro em função do progresso (planeta, terminal, linhas, barra) |
| `src/lib/use-media-query.ts` | Hook `useMediaQuery` (cliente; único arquivo de `src/lib` sem teste Node) |
| `src/components/ui/{PixelCard,PixelIcon,Chip}.tsx` | Primitivas visuais |
| `src/components/sections/*.tsx` | `SectionHeader`, as cinco seções e `SiteSections` |
| `src/components/dither/{shaders.ts,DitherBackground.tsx}` | Shader e canvas WebGL |
| `src/components/nav/{NavLinks,MobileMenu,BrowserBar}.tsx` | Menu claro, menu compacto e barra de navegador fixa |
| `src/components/intro/{BootTerminal,HeroCards,IntroSequence}.tsx` | Hero opção B + terminal + intro |
| `src/components/home/HomeExperience.tsx` | Compõe fundo + intro + seções (cliente) |
| Modificar: `src/app/globals.css`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`, `src/components/ui/MouseFollower.tsx`, `messages/*.json`, `package.json` | |
| Apagar (Task 10): `src/components/ui/{ScrollBootSequence,PerpetualBento,ProjectsShowcase,TerminalFooter}.tsx` | |

---

### Task 1: Branch, harness de testes e fundação visual

**Files:**
- Modify: `package.json` (scripts), `src/app/globals.css`, `src/app/[locale]/layout.tsx`
- Test: `tests/i18n.test.mjs`

**Interfaces:**
- Produces: script `npm test`; classes Tailwind `bg-ink`, `bg-panel`, `border-line`, `text-accent`, `border-accent-dim`, `text-fg`, `text-cream`, `text-copy`, `text-muted`, `font-pixel`, `font-mono`; utilitário `bg-grid`; anel de foco global.

- [ ] **Step 1: Criar a branch e commitar a spec e o plano**

```bash
git checkout -b feat/pixel-dither-redesign
git add docs/superpowers .gitignore
git commit -m "docs: add pixel/dither redesign spec and plan"
```

- [ ] **Step 2: Escrever `tests/i18n.test.mjs`**

Ler os dois JSONs com `fs`, achatar as chaves em caminhos `"Hero.title"`. Testes:
- `locales have identical key sets`: `assert.deepEqual(keys(ptBR).sort(), keys(en).sort())`;
- `no empty strings`: todo valor folha é string com `trim().length > 0`.

- [ ] **Step 3: Adicionar `"test": "node --test \"tests/**/*.test.mjs\""` ao `package.json` e rodar**

Run: `npm test`
Expected: PASS, 2 testes. Hoje a paridade já vale; o teste é a guarda para as tasks seguintes.

- [ ] **Step 4: Tema em `src/app/globals.css`**

Manter `@import "tailwindcss"`. No `@theme`:
- `--font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;`
- `--font-pixel: var(--font-silkscreen), ui-monospace, monospace;`
- os tokens de cor das Global Constraints.

Adicionar:
- `@utility bg-grid` com duas `linear-gradient` de linhas `#ffffff09` de 1px e `background-size: 36px 36px`;
- `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`;
- `html { scroll-behavior: smooth }`, com `auto` sob `prefers-reduced-motion: reduce`;
- `body` com fundo `--color-ink`, cor `--color-fg` e fonte `--font-mono`.

Remover `--background`/`--foreground` antigos. Manter `.glass-panel` (o MouseFollower usa).

- [ ] **Step 5: Fontes em `src/app/[locale]/layout.tsx`**

- Trocar `Geist` + `Geist_Mono` por `Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] })` e `Silkscreen({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--font-silkscreen" })`.
- Classes do `body`: as duas variáveis + `font-mono antialiased bg-ink text-fg min-h-[100dvh]`.
- Manter o `NextIntlClientProvider` e o `MouseFollower` como estão.

- [ ] **Step 6: Verificar**

Run: `npm test && npm run build`
Expected: testes passam; o build termina com `✓ Created out/index.html redirect → /pt-BR`. A página antiga ainda aparece (as cores podem mudar), o que é esperado.

- [ ] **Step 7: Commit**

```bash
git add package.json tests/i18n.test.mjs src/app/globals.css "src/app/[locale]/layout.tsx"
git commit -m "feat: add pixel theme tokens, Silkscreen font and test harness"
```

---

### Task 2: Config das seções + textos novos (PT/EN)

**Files:**
- Create: `src/lib/sections.ts`
- Modify: `messages/pt-BR.json`, `messages/en.json`
- Test: `tests/sections.test.mjs`

**Interfaces:**
- Produces:
  - `export type SectionId = "experience" | "skills" | "education" | "projects" | "contact"`
  - `export interface SectionMeta { id: SectionId; number: string; command: string }`
  - `export const SECTIONS: readonly SectionMeta[]`
  - chaves `Nav.*`, `Sections.<id>.{title,label,blurb}`, `Sections.skills.{frontend,backend,tools}`, `Sections.contact.eof`, `HeroCards.{experience,skills}`, `Hero.boot_ready`

- [ ] **Step 1: Escrever `tests/sections.test.mjs`**

```js
test("sections follow the spec order", () => {
  assert.deepEqual(SECTIONS.map((s) => s.id), ["experience", "skills", "education", "projects", "contact"]);
  assert.deepEqual(SECTIONS.map((s) => s.number), ["01", "02", "03", "04", "05"]);
  assert.deepEqual(SECTIONS.map((s) => s.command), [
    "whoami --history", "system_info --tools", "cat education.txt", "ls ~/projects --showcase", "contact --links",
  ]);
});
```

Mais o teste `every section has nav, title, label and blurb in both locales`: para cada locale e cada `id`, `Nav[id]`, `Sections[id].title`, `.label` e `.blurb` são strings não vazias. Também checa `Nav.about`, `Sections.skills.frontend/backend/tools`, `Sections.contact.eof`, `HeroCards.experience/skills` e `Hero.boot_ready`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (`Cannot find module .../src/lib/sections.ts`).

- [ ] **Step 3: Criar `src/lib/sections.ts`** com os valores do teste (sem imports).

- [ ] **Step 4: Adicionar os textos exatos aos dois JSONs**

| Chave | pt-BR | en |
|---|---|---|
| `Nav.about` | Sobre | About |
| `Nav.experience` | Experiência | Experience |
| `Nav.skills` | Habilidades | Skills |
| `Nav.education` | Formação | Education |
| `Nav.projects` | Projetos | Projects |
| `Nav.contact` | Contato | Contact |
| `Sections.experience.title/label/blurb` | EXPERIÊNCIA · Onde já trabalhei · Da startup ao atendimento: front-end, mobile e API em equipe. | EXPERIENCE · Where I've worked · From startup to customer support: front-end, mobile and APIs as part of a team. |
| `Sections.skills.title/label/blurb` | HABILIDADES · Com o que eu trabalho · Front-end, back-end e as ferramentas do dia a dia. | SKILLS · What I work with · Front-end, back-end and my everyday tools. |
| `Sections.skills.frontend/backend/tools` | Frontend / Mobile · Backend / DevOps · Ferramentas / IA | Frontend / Mobile · Backend / DevOps · Tools / AI |
| `Sections.education.title/label/blurb` | FORMAÇÃO · Onde estudo · Graduação e cursos em andamento. | EDUCATION · Where I study · Degree and ongoing courses. |
| `Sections.projects.title/label/blurb` | PROJETOS · O que construí · Clique em um projeto para ver galeria, stack e links. | PROJECTS · What I've built · Click a project to see its gallery, stack and links. |
| `Sections.contact.title/label/blurb` | CONTATO · Vamos conversar · Estou aberto a oportunidades como desenvolvedor Full Stack. | CONTACT · Let's talk · I'm open to opportunities as a Full Stack developer. |
| `Sections.contact.eof` | [ PROCESSO FINALIZADO ] | [ PROCESS COMPLETED ] |
| `HeroCards.experience` | Full Stack na i9systemas · 2025–2026 | Full Stack at i9systemas · 2025–2026 |
| `HeroCards.skills` | Next.js · React · Node.js · Docker | Next.js · React · Node.js · Docker |
| `Hero.boot_ready` | pronto em 1250ms | ready in 1250ms |

(Os títulos são renderizados com `/` no final; a barra não entra no JSON.)

- [ ] **Step 5: Rodar**

Run: `npm test`
Expected: PASS (i18n + sections).

- [ ] **Step 6: Commit**

```bash
git add src/lib/sections.ts messages/pt-BR.json messages/en.json tests/sections.test.mjs
git commit -m "feat: add section config and new pt/en copy"
```

---

### Task 3: Bibliotecas puras do dither e do loop

**Files:**
- Create: `src/lib/dither/bayer.ts`, `src/lib/dither/palette.ts`, `src/lib/frame-throttle.ts`
- Test: `tests/dither.test.mjs`

**Interfaces:**
- Produces:
  - `bayerThresholds(): number[]`: 64 valores row‑major 8×8, cada um `(rank + 0.5) / 64`.
  - `hexToRgb01(hex: string): [number, number, number]`: lança `Error` se não casar `/^#[0-9a-f]{6}$/i`.
  - `WAVE_PALETTE: readonly string[]` = `["#0d0d0d", "#151d0e", "#34501b", "#b5f562"]`.
  - `PLANET_PALETTE` (objeto, nesta ordem de chaves) = `{ oceanDeep: "#12233a", oceanMid: "#1f5f8c", shallows: "#3fb5b0", landDark: "#2f6b2f", landMid: "#4f9a3c", landLight: "#a8d65a", cloud: "#efe6c8", rim: "#e8dcb5" }`. São valores iniciais; a sintonia fina é de quem constrói, conforme a spec.
  - `shouldRenderFrame(now: number, last: number, maxFps: number): boolean`: `true` quando `now - last >= 1000 / maxFps - 1`.

- [ ] **Step 1: Escrever `tests/dither.test.mjs`**

- `bayer has 64 unique ranks`: `bayerThresholds().map((v) => Math.round(v * 64 - 0.5))` ordenado é `0..63`.
- `bayer first row`: os ranks de `[0..8)` são `[0, 32, 8, 40, 2, 34, 10, 42]`.
- `hexToRgb01`: `hexToRgb01("#b5f562")` ≈ `[181/255, 245/255, 98/255]` (tolerância 1e-9); `assert.throws(() => hexToRgb01("#zzz"))`.
- `frame throttle`: `shouldRenderFrame(1000, 966, 30) === true`, `shouldRenderFrame(1000, 990, 30) === false`, `shouldRenderFrame(1000, 983.3, 60) === true`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (módulos inexistentes).

- [ ] **Step 3: Implementar os três módulos**

A matriz é a Bayer recursiva padrão: `M(2n) = [[4M, 4M+2], [4M+3, 4M+1]]` a partir de `M(1) = [0]`.

- [ ] **Step 4: Rodar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/dither src/lib/frame-throttle.ts tests/dither.test.mjs
git commit -m "feat: add bayer, palette and frame throttle helpers"
```

---

### Task 4: Timeline da intro

**Files:**
- Create: `src/lib/intro/timeline.ts`
- Test: `tests/intro-timeline.test.mjs`

**Interfaces:**
- Produces:

```ts
export const INTRO_SCROLL_VH = { desktop: 400, mobile: 200 } as const;
export const BOOT_LINES = { desktop: 8, mobile: 4 } as const;
export interface Insets { top: number; right: number; bottom: number; left: number } // px a partir das bordas da viewport
export interface IntroState {
  heroOpacity: number;                 // 0..1
  typedLines: number;                  // inteiro 1..BOOT_LINES
  planet: { x: number; y: number; radius: number; opacity: number }; // x,y em fração da viewport (a partir da esquerda/topo); radius em fração da ALTURA
  terminal: Insets & { radius: number }; // radius em px
  browserBar: number;                  // 0..1
  done: boolean;                       // browserBar === 1
}
export function getIntroState(progress: number, viewport: { width: number; height: number }, isMobile: boolean): IntroState;
```

Valores fixados. `p` é limitado a `[0, 1]` e todas as interpolações são lineares; quem chama suaviza com `useSpring`.

| Grandeza | Regra |
|---|---|
| `heroOpacity` | 1 até p = 0.05, depois linear até 0 em p = 0.35 |
| `typedLines` | `1 + floor((N - 1) * clamp(p / 0.55))`, com N = `BOOT_LINES[desktop/mobile]` |
| `planet` desktop p=0 | `{ x: 0.72, y: 0.42, radius: 0.55, opacity: 1 }` |
| `planet` mobile p=0 | `{ x: 0.5, y: 0.3, radius: 0.4, opacity: 1 }` |
| `planet` 0.15 → 0.60 | x, y e radius vão até `{ x: 0.5, y: -0.1, radius: 0.2 }`; opacity 1 → 0 entre 0.50 e 0.60 |
| `terminal` hero (p ≤ 0.15) | desktop `top 0.38h, right 0.06w, bottom 0.30h, left 0.60w`; mobile `top 0.58h, right 0.05w, bottom 0.08h, left 0.05w` |
| `terminal` centro (0.40 ≤ p ≤ 0.55) | desktop `top 0.18h, right 0.16w, bottom 0.18h, left 0.16w`; mobile `top 0.20h, right 0.05w, bottom 0.20h, left 0.05w` |
| `terminal` 0.15 → 0.40 | hero → centro |
| `terminal` 0.55 → 0.85 | centro → tudo 0 |
| `terminal.radius` | 12 até 0.55, depois 0 em 0.85 |
| `browserBar` | 0 até 0.85, depois 1 em 0.95 |

- [ ] **Step 1: Escrever `tests/intro-timeline.test.mjs`** (viewport desktop `{ width: 1440, height: 900 }`, mobile `{ width: 390, height: 844 }`)

- `p=0 desktop`: `heroOpacity === 1`, `typedLines === 1`, `terminal` ≈ `{ top: 342, right: 86.4, bottom: 270, left: 864, radius: 12 }`, `browserBar === 0`, `planet.opacity === 1`.
- `p=0.55 desktop`: `typedLines === 8`, `terminal` ≈ `{ top: 162, right: 230.4, bottom: 162, left: 230.4 }`.
- `p=0.85`: `terminal` todos 0 e `radius === 0`.
- `p=1`: `browserBar === 1`, `done === true`, `heroOpacity === 0`, `planet.opacity === 0`.
- `mobile p=0.55`: `typedLines === 4`.
- `clamps`: `getIntroState(-1, …)` deepEqual `getIntroState(0, …)`; `2` deepEqual `1`.
- `scales with viewport` (Review Focus 4): o mesmo p em `{ width: 720, height: 450 }` dá insets exatamente na metade dos de `1440×900`.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (módulo inexistente).

- [ ] **Step 3: Implementar `getIntroState`** com um helper local `lerp`/`clamp`, sem imports.

- [ ] **Step 4: Rodar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/intro/timeline.ts tests/intro-timeline.test.mjs
git commit -m "feat: add scroll intro timeline"
```

---

### Task 5: Primitivas visuais + Experiência, Habilidades e Formação

**Files:**
- Create: `src/components/ui/PixelCard.tsx`, `src/components/ui/PixelIcon.tsx`, `src/components/ui/Chip.tsx`
- Create: `src/components/sections/SectionHeader.tsx`, `ExperienceSection.tsx`, `SkillsSection.tsx`, `EducationSection.tsx`, `SiteSections.tsx`
- Modify: `src/app/[locale]/page.tsx`. Temporariamente ele renderiza só `<SiteSections />`; o `nav` e o `ScrollBootSequence` antigos saem da página, mas o arquivo só é apagado na Task 10.

**Interfaces:**
- Consumes: `SECTIONS`, `SectionMeta` (Task 2); tokens (Task 1).
- Produces:
  - `PixelCard({ highlight?: boolean; className?: string; children: React.ReactNode })`:
    - `bg-panel/95 border border-line p-5`;
    - `highlight` → `border-accent-dim`;
    - hover: `-translate-y-[3px]` + `border-accent-dim`, com `transition`.
  - `PixelIcon({ variant: "plus" | "corner" | "cross"; className?: string })`:
    - quadrado de 18px `bg-accent` recortado por `clip-path`;
    - `plus` = `polygon(0 30%,30% 30%,30% 0,70% 0,70% 30%,100% 30%,100% 70%,70% 70%,70% 100%,30% 100%,30% 70%,0 70%)`;
    - `corner` = `polygon(0 0,100% 0,100% 100%,0 100%,0 70%,70% 70%,70% 30%,0 30%)`;
    - `cross` = `polygon(40% 0,60% 0,60% 40%,100% 40%,100% 60%,60% 60%,60% 100%,40% 100%,40% 60%,0 60%,0 40%,40% 40%)`.
  - `Chip({ children })`: `text-[11.5px] px-2.5 py-1 border border-line bg-ink`, com um marcador `::before` de 6×6 `bg-accent`.
  - `SectionHeader({ section: SectionMeta })`:
    - linha `erik@local ~/portfolio $ {command}` (prompt em `text-accent`, resto `text-muted`, 12px);
    - título `{t("title")}/` em `font-pixel font-bold leading-[0.88] tracking-[-0.03em] text-cream text-[clamp(28px,8.4vw,96px)] [overflow-wrap:anywhere]`;
    - bloco lateral (máx. 300px, 11px, caixa alta, `text-muted`) com `{number} — {label}` em `text-fg`, `✕✕✕` em `text-accent` e o `blurb`.
  - `SiteSections()`: `<section id={id} className="scroll-mt-20 px-6 md:px-9 pt-18">` por seção, na ordem de `SECTIONS`.

- [ ] **Step 1: Implementar as primitivas e o `SectionHeader`** conforme acima (`useTranslations("Sections")` com `t(\`${id}.title\`)` etc.).

- [ ] **Step 2: Implementar as três seções**

Grid `grid gap-3.5 md:grid-cols-3`. Formação usa `md:grid-cols-2`. Entrada com `whileInView` (opacity 0→1, y 30→0, `viewport={{ once: true, margin: "-100px" }}`).
- **Experiência:** cards na ordem i9 (`highlight`), senac, claro. Cada card tem:
  - `h3` com `PixelIcon` + `{role}` (13px, caixa alta, `tracking-widest`);
  - empresa em `text-muted` 11px caixa alta;
  - `[ {date} ]` em `text-accent` 11px caixa alta;
  - descrição em `text-copy text-[12.5px] leading-[1.65]`, caixa normal.
  - Chaves `Experience.*_role|_company|_date|_desc`.
- **Habilidades:** três cards (`Sections.skills.frontend/backend/tools`), cada um com `Chip`s de `t("Skills.<grupo>").split(", ")`. Sem os logos do `react-icons`.
- **Formação:**
  - card `highlight` com `Education.course`, `institution` e `[ date ]`;
  - card com `Education.certs_label` e a lista `Education.certs.split(", ")`, cada item prefixado com `✔` em `text-accent`.

- [ ] **Step 3: Verificar build e testes**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa.

- [ ] **Step 4: Verificação visual**

Run: `npm run dev` e abrir `http://localhost:3000/portfolio/pt-BR`.
Expected (1440px): três seções como em `secoes.html`, com títulos pixel acentuados ("EXPERIÊNCIA/", "FORMAÇÃO/") renderizados na Silkscreen, sem cair em fonte de fallback.
Review Focus 2: em 390px, em `/pt-BR` e `/en`, rodar `document.documentElement.scrollWidth <= innerWidth` no console. Esperado: `true`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/PixelCard.tsx src/components/ui/PixelIcon.tsx src/components/ui/Chip.tsx src/components/sections "src/app/[locale]/page.tsx"
git commit -m "feat: add pixel primitives and experience/skills/education sections"
```

---

### Task 6: Projetos e Contato

**Files:**
- Create: `src/components/sections/ProjectsSection.tsx`, `src/components/sections/ContactSection.tsx`
- Modify: `src/components/sections/SiteSections.tsx`

**Interfaces:**
- Consumes: `PixelCard`, `PixelIcon`, `Chip`, `SectionHeader` (Task 5); `projects` de `@/data/projects`; `Link` de `@/i18n/routing`.

- [ ] **Step 1: `ProjectsSection`**

Grid `md:grid-cols-2`. Cada projeto é um `Link href={\`/projects/${slug}\`}` envolvendo um `PixelCard` sem padding. Dentro:
- `<img src={\`${process.env.NEXT_PUBLIC_BASE_PATH || ""}${thumbnail}\`} alt={t(titleKey)}>` com `aspect-video object-cover bg-panel border-b border-line` (o box mantém a proporção se a imagem falhar);
- título `font-pixel font-bold text-xl uppercase`;
- até 4 tags (`tech.slice(0, 4)`, 10.5px, `border-line text-muted`);
- CTA `{${t("view_project")}}` em caixa alta `font-pixel text-accent`.

- [ ] **Step 2: `ContactSection`**

Grid `grid-cols-2 md:grid-cols-4`. Quatro links, cada um com ícone do `react-icons` em `text-cream` e `group-hover:text-accent`, o nome em `font-pixel` e o texto curto em `text-muted`:

| Nome | href | Texto curto | Ícone |
|---|---|---|---|
| GitHub | `https://github.com/ErikEliasV` | `github.com/ErikEliasV` | `FaGithub` |
| LinkedIn | `https://www.linkedin.com/in/erik-elias-varela-de-sousa-731363310` | `in/erik-elias-varela-de-sousa` | `FaLinkedin` |
| Instagram | `https://instagram.com/Erik_Elias1` | `@Erik_Elias1` | `FaInstagram` |
| Email | `mailto:erik100.eliasv@gmail.com` | `erik100.eliasv@gmail.com` | `SiGmail` |

- Links http usam `target="_blank" rel="noopener noreferrer"`.
- Depois vem o bloco centralizado: `Sections.contact.eof` em `text-accent` e, embaixo, `EOF` (11px, `tracking-[0.14em]`).

- [ ] **Step 3: Adicionar as duas seções ao `SiteSections`**

Run: `npm test && npm run lint && npm run build`
Expected: passa.

- [ ] **Step 4: Verificação visual + Review Focus 2**

Dev em `/pt-BR` e `/en`, em 1440px e 390px.
Expected:
- thumbnails reais aparecem e o card leva à página do projeto;
- links de contato abrem;
- `scrollWidth <= innerWidth` dá `true`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections
git commit -m "feat: add projects and contact sections"
```

---

### Task 7: Fundo dither em WebGL

**Files:**
- Create: `src/components/dither/shaders.ts`, `src/components/dither/DitherBackground.tsx`
- Modify: `src/app/[locale]/page.tsx` (montar `<DitherBackground />` antes de `<SiteSections />`, temporário até a Task 8)

**Interfaces:**
- Consumes: `bayerThresholds`, `hexToRgb01`, `WAVE_PALETTE`, `PLANET_PALETTE` (Task 3); `shouldRenderFrame` (Task 3); `getIntroState` (Task 4).
- Produces:
  - `DitherBackground({ introProgress?: MotionValue<number> })`;
  - `shaders.ts` exporta `VERTEX_SHADER: string` e `FRAGMENT_SHADER: string`.
  - Sem `introProgress`, o estado do planeta é o de `getIntroState(1, …)`, ou seja, invisível.

- [ ] **Step 1: Shaders (`shaders.ts`)**

WebGL 1. Vertex: triângulo de tela cheia. Uniforms com estes nomes exatos:
- `uResolution` (vec2, px do alvo de render);
- `uTime` (float, s);
- `uPlanet` (vec4: x, y, radius, opacity; y medido a partir do topo, radius em fração da altura);
- `uMouse` (vec3: x, y em [0, 1] a partir do canto superior esquerdo, força 0..1);
- `uBayer[64]` (float);
- `uWave[4]` (vec3);
- `uPlanetPal[8]` (vec3, na ordem de chaves de `PLANET_PALETTE`).

Algoritmo do fragment shader (a matemática exata é de quem constrói; o alvo é a referência descrita na spec):
1. **Ondas:** `w = pow((sin(x·k1 + t·0.6) + sin(y·k2 − t·0.45 + x) + sin((x+y)·k3 + t·0.3) + 3) / 6, 2.8) · 3`, mais `força · exp(−d²/σ²)` do mouse. Quantizado em `uWave` comparando a parte fracionária com `uBayer[(y mod 8)·8 + (x mod 8)]`. Majoritariamente escuro, com cristas verde‑limão ocasionais.
2. **Planeta** (dentro do círculo, com correção de aspecto, e `opacity > 0`):
   - normal da esfera;
   - luz de cima à esquerda;
   - continentes procedurais em longitude/latitude girando devagar (`lon += t·0.25`);
   - nuvens em aglomerados;
   - borda `rim` para `d² > 0.9` no lado iluminado.
   - Escolher entre as duas cores vizinhas da paleta pelo limiar Bayer. A `opacity` vira um fade "dithered", também pelo limiar.

- [ ] **Step 2: Componente (`DitherBackground.tsx`, `"use client"`)**

**Estrutura:**
- `<canvas>` `fixed inset-0 -z-10 w-full h-full [image-rendering:pixelated]`;
- por cima, `<div className="fixed inset-0 -z-10 bg-grid pointer-events-none" />`.

**Tamanho do pixel:**
- `pixel = clamp(round(planetDiameterPx / 70), 4, 12)` no desktop e `clamp(…, 3, 8)` no celular;
- `planetDiameterPx = 2 · getIntroState(0, vp, isMobile).planet.radius · innerHeight`;
- recalculado no resize. O alvo de render tem `ceil(cssW / pixel) × ceil(cssH / pixel)`, então o DPR não importa.

**Loop:**
- `requestAnimationFrame` com `shouldRenderFrame(now, last, isMobile ? 30 : 60)`;
- pausa com `document.hidden` (`visibilitychange`) e retoma sem salto (`uTime` não conta tempo oculto).

**Planeta:** a cada quadro, `getIntroState(introProgress.get(), vp, isMobile).planet` → `uPlanet`.

**Mouse:**
- só com `(pointer: fine)`: `pointermove` leva a força a 1;
- a força decai a 0 após 1,5s parado;
- com toque, fica 0.

**Movimento reduzido** (`(prefers-reduced-motion: reduce)`):
- sem loop;
- um quadro com `uTime = 0`, redesenhado no resize e em `introProgress.on("change")`.

**Falhas** (Review Focus 1):
- `getContext("webgl")` nulo → não renderiza o canvas (fica só a grade + `bg-ink` do body);
- `webglcontextlost` → `preventDefault`, para o loop e esconde o canvas;
- `webglcontextrestored` → reinicializa.

- [ ] **Step 3: Verificar build**

Run: `npm test && npm run lint && npm run build`
Expected: passa (o canvas só é criado em `useEffect`, então é seguro no export estático).

- [ ] **Step 4: Verificação visual e de falhas**

Dev em `/portfolio/pt-BR`:
- **Ondas:** ondas em dither verde animadas atrás das seções, com textos legíveis.
- **Review Focus 1:** no console, `document.querySelector("canvas").getContext("webgl").getExtension("WEBGL_lose_context").loseContext()`. Esperado: o canvas some, a grade continua, a página rola, sem erros repetidos no console.
- **Movimento reduzido:** em DevTools › Rendering, emular `prefers-reduced-motion: reduce` e recarregar. Duas capturas com 2s de intervalo devem ser idênticas.
- **Aba oculta:** trocar de aba e voltar. A animação continua de onde parou.

- [ ] **Step 5: Commit**

```bash
git add src/components/dither "src/app/[locale]/page.tsx"
git commit -m "feat: add WebGL dither background"
```

---

### Task 8: Intro (hero opção B), barra de navegador e montagem da home

**Files:**
- Create: `src/lib/use-media-query.ts`, `src/components/nav/NavLinks.tsx`, `src/components/nav/MobileMenu.tsx`, `src/components/nav/BrowserBar.tsx`
- Create: `src/components/intro/BootTerminal.tsx`, `src/components/intro/HeroCards.tsx`, `src/components/intro/IntroSequence.tsx`, `src/components/home/HomeExperience.tsx`
- Modify: `src/app/[locale]/page.tsx`. Passa a renderizar só `<HomeExperience />` (mantém `setRequestLocale`) e sai a montagem temporária da Task 7.

**Interfaces:**
- Consumes: `getIntroState`, `INTRO_SCROLL_VH`, `BOOT_LINES` (Task 4); `SECTIONS` (Task 2); `DitherBackground` (Task 7); `SiteSections` (Tasks 5–6); `PixelCard`, `PixelIcon`.
- Produces:
  - `useMediaQuery(query: string): boolean`: `false` no servidor, depois `matchMedia` com listener.
  - `NavLinks({ onNavigate?: () => void; className?: string })`:
    - `<a href="#top">{Nav.about}</a>` + âncoras `#<id>` com `Nav.<id>` (11px, caixa alta, `tracking-[0.12em]`);
    - seletor `PT / EN` com `Link` do `@/i18n/routing` (`locale="pt-BR"` / `"en"`, `href="/"`).
  - `MobileMenu()`: botão "MENU" (visível só abaixo de `md`) que abre um painel `bg-ink/95` de largura total com `NavLinks` em coluna; fecha ao navegar e com `Esc`.
  - `BrowserBar({ visible: MotionValue<number> | number; showBack?: boolean })`:
    - `fixed top-0 inset-x-0 z-50 h-14 bg-ink/90 backdrop-blur border-b border-line`;
    - três quadradinhos de 10px (o primeiro `bg-accent`);
    - pílula de URL `🔒 localhost:3000`;
    - à direita, `NavLinks` (md+) ou `MobileMenu` (mobile);
    - `showBack` troca a navegação por `← {Projects.back}` (`Link href="/"`);
    - `opacity = visible`, com `pointer-events: none` quando `visible < 1`.
  - `BootTerminal({ typedLines: number; mobile: boolean })`: renderiza as primeiras `typedLines` linhas do script do modo. O cursor‑bloco pisca na última linha (`animation: blink 1s steps(1)`, parado com movimento reduzido).
  - `HeroCards()`: `hidden md:grid grid-cols-3 gap-3.5`. Os cards são links para `#experience`, `#skills` e `#projects`:
    - título `Nav.<id>` com `PixelIcon`;
    - texto `HeroCards.experience`, `HeroCards.skills` e os títulos dos projetos (`t(titleKey)` de `projects`) unidos por ` · `.
  - `IntroSequence({ containerRef: React.RefObject<HTMLDivElement | null>; progress: MotionValue<number> })`.
  - `HomeExperience()` (`"use client"`).

- [ ] **Step 1: Scripts do terminal (`BootTerminal`)**

O prompt é `erik@local ~/portfolio $` com `erik@local` em `text-accent`. O número de linhas deve bater com `BOOT_LINES`.

- **Desktop (8 linhas):**
  1. `cd ~/projects`
  2. `ls` → `portfolio/  api/  mobile-app/`
  3. `cd portfolio`
  4. `git log -1` → `commit 8f2a1b9c` / `feat: build premium portfolio for awesome recruiters`
  5. `npm install`
  6. `✔ react@19.2  ✔ next@16.2  ✔ framer-motion  ✔ webgl`
  7. `npm run dev`
  8. `▲ Next.js 16.2 · {Hero.boot_ready}`
- **Mobile (4 linhas):**
  1. `cd ~/portfolio`
  2. `npm install` + a linha de `✔`
  3. `npm run dev`
  4. `▲ Next.js 16.2 · {Hero.boot_ready}`

- [ ] **Step 2: `IntroSequence`**

**Container e cálculo:**
- container `id="top"` com `ref={containerRef}`, `relative` e altura `${INTRO_SCROLL_VH[mode]}vh`;
- filho `sticky top-0 h-[100dvh] overflow-hidden`;
- `isMobile = useMediaQuery("(max-width: 767px)")`; viewport atualizada no resize;
- estilos dirigidos por `useTransform(progress, p => getIntroState(p, vp, isMobile).<campo>)`. Nada de `setState` por quadro, exceto `typedLines`, via `useMotionValueEvent`.

**Hero, conteúdo de cima para baixo:**
- **barra do topo** (opacity = `heroOpacity`): linha `border-t border-accent-dim`; marca `ERIK ELIAS` + `✕✕✕` em `text-accent`; `NavLinks` (md+) ou `MobileMenu`.
- **coluna esquerda:**
  - rótulo `Hero.role` com a bolinha `bg-accent animate-pulse`;
  - nome `Hero.title`, com a primeira palavra numa linha e o resto + `/` na outra, em `font-pixel font-bold text-cream text-[clamp(44px,7.2vw,120px)] leading-[0.9]`;
  - `Hero.heroRole` em `text-muted`;
  - `Hero.subtitle` 11–12px, caixa alta;
  - CTA `<a href="#projects">{${Hero.cta}}</a>` em `font-pixel text-accent`.
- **`HeroCards`** no rodapé da tela.
- **Terminal** `absolute`, com insets e radius do estado. O cabeçalho tem os quadradinhos e `ERIK@LOCAL`; a opacidade do terminal é `1 − browserBar`.
- **Celular:** nome em cima e terminal embaixo (insets da timeline); cards ocultos.

- [ ] **Step 3: `HomeExperience`**

```tsx
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
```

- O `visible` da `BrowserBar` é `useTransform(progress, p => getIntroState(p, vp, isMobile).browserBar)`.
- Renderiza, dentro de `<MotionConfig reducedMotion="user">`: `DitherBackground introProgress={progress}`, `BrowserBar visible={…}`, `IntroSequence`, `SiteSections`.

- [ ] **Step 4: Verificar build e testes**

Run: `npm test && npm run lint && npm run build`
Expected: passa.

- [ ] **Step 5: Percorrer a intro no desktop (1440×900, `/pt-BR` e `/en`)**

Expected:
- na abertura: planeta à direita, nome à esquerda, terminal digitando a 1ª linha e três cards embaixo (como em `primeira-tela.html`, opção B);
- ao rolar: o planeta sobe e encolhe, o hero some, o terminal vai ao centro e completa as 8 linhas, cresce até a tela cheia e a barra de navegador aparece;
- depois disso, as seções rolam nativamente;
- rolar de volta desfaz a intro, e "Sobre" volta ao hero.

- [ ] **Step 6: Percorrer no celular (390×844)**

Expected:
- cards do hero ocultos;
- MENU funcionando já na abertura;
- 4 linhas de boot;
- intro com cerca de 2 telas de rolagem, sem engasgo visível.

- [ ] **Step 7: Review Focus 2–5**

- **2:** em 390px, `/pt-BR` e `/en`, `scrollWidth <= innerWidth` dá `true` também no hero.
- **3:** abrir `http://localhost:3000/portfolio/pt-BR#projects` e dar F5 com a página rolada até Contato. A barra de navegador aparece, o planeta não, sem pulo.
- **4:** com a intro em p ≈ 0.5, redimensionar de 1440 para 600px de largura e voltar. O terminal se reposiciona e nada fica travado ou fora do lugar.
- **5:** dar Tab desde o carregamento. Menu, CTA, cards do hero e cards de projeto mostram anel verde; Enter em "Projetos" para com o título visível abaixo da barra (`scroll-mt-20`).

- [ ] **Step 8: Commit**

```bash
git add src/lib/use-media-query.ts src/components/nav src/components/intro src/components/home "src/app/[locale]/page.tsx"
git commit -m "feat: add terminal intro, browser bar and home assembly"
```

---

### Task 9: Página de projeto no visual novo

**Files:**
- Modify: `src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx`

**Interfaces:**
- Consumes: `DitherBackground` (sem `introProgress`, só ondas), `BrowserBar` (`visible={1} showBack`), `PixelCard`, `Chip`.

- [ ] **Step 1: Reestilizar**

Mesmo conteúdo e ordem de hoje, dentro de `<MotionConfig reducedMotion="user">`:
- **topo:** a barra antiga sai e entra a `BrowserBar`;
- **cabeçalho:**
  - linha de comando `erik@local ~/projects $ cat {slug}/README.md`;
  - título `font-pixel font-bold uppercase text-cream text-[clamp(28px,6vw,72px)] [overflow-wrap:anywhere]`;
  - descrição `text-copy` em caixa normal;
- **corpo:**
  - tech stack em `Chip`s;
  - links github/live como `PixelCard`s ou botões com `text-accent`;
  - galeria com cada screenshot num `PixelCard` sem padding (`aspect-video object-cover`);
- **troca de cor:** todas as classes `emerald`/`teal`/`slate` e `font-geist-mono` saem, em favor dos tokens.

- [ ] **Step 2: Verificar**

Run: `npm run lint && npm run build`
Expected: passa.

Dev em `/portfolio/pt-BR/projects/kiresaile-website` e `/portfolio/en/projects/bmw-website`, em 1440px e 390px.
Expected:
- fundo de ondas e barra fixa com "← Voltar ao Portfólio" (EN: "Back to Portfolio"), que leva à home;
- galeria completa;
- `scrollWidth <= innerWidth` dá `true` em 390px.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/projects/[slug]/ProjectDetailClient.tsx"
git commit -m "feat: restyle project detail page"
```

---

### Task 10: Limpeza e verificação final

**Files:**
- Delete: `src/components/ui/ScrollBootSequence.tsx`, `PerpetualBento.tsx`, `ProjectsShowcase.tsx`, `TerminalFooter.tsx`
- Modify: `src/components/ui/MouseFollower.tsx`, `messages/pt-BR.json`, `messages/en.json`, `package.json` / `package-lock.json` (se dependências ficarem sem uso)

- [ ] **Step 1: Apagar os componentes antigos**

Run: `git rm src/components/ui/ScrollBootSequence.tsx src/components/ui/PerpetualBento.tsx src/components/ui/ProjectsShowcase.tsx src/components/ui/TerminalFooter.tsx`

- [ ] **Step 2: Recolorir o `MouseFollower`**

Todo `rgba(16, 185, 129, a)` vira `rgba(181, 245, 98, a)`, com os mesmos alfas. Continua só no desktop.

- [ ] **Step 3: Tirar chaves de mensagem sem uso**

Candidatas (confirmar com `grep` antes): `Experience.title`, `Experience.subtitle`, `Skills.title`, `Skills.subtitle`, `Education.title`, `Projects.title`. Remover dos **dois** arquivos.

- [ ] **Step 4: Tirar dependências sem uso**

Se `grep -rn "@phosphor-icons/react" src` não encontrar nada, rodar `npm uninstall @phosphor-icons/react`. O mesmo vale para `react-icons`, se nada mais o importar.

- [ ] **Step 5: Varredura de restos**

Run: `grep -rnE "emerald|teal-|slate-|className=.*font-geist" src`
Expected: nenhuma saída. A variável `--font-geist-mono` em `globals.css`/`layout.tsx` é esperada; só a *classe* `font-geist-mono` não pode sobrar.

- [ ] **Step 6: Verificação completa**

Run: `npm test && npm run lint && npm run build`
Expected: tudo passa e o build cria `out/` com o redirect.

Depois, repetir os passeios dos Steps 5–7 da Task 8 e o Step 4 da Task 7: desktop e celular, PT e EN, movimento reduzido e Review Focus 1–5.

- [ ] **Step 7: Commit**

```bash
git add -u src messages package.json package-lock.json
git commit -m "chore: remove legacy terminal components and unused copy"
```

---

### Task 11: Passagem de bastão — retomar o sync do Claude Design

Não é código e não é feito nesta execução.

- [ ] **Step 1:** Ao terminar, use superpowers:finishing-a-development-branch para decidir merge/PR com o usuário.

- [ ] **Step 2:** Avise o usuário que o próximo passo é rodar `/design-sync`. Ele retoma a sincronização com o projeto "Erik Elias Portfolio DS", já criado e vazio. O estado e o que ficou desatualizado pelo redesign estão em `.design-sync/NOTES.md`. Não faça commit de `.design-sync/` neste plano.
