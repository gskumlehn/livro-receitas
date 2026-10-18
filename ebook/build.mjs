// Gera ebook/livro-de-receitas.html com as receitas em formato de cartão algorítmico:
// ingredientes à esquerda, cada operação é uma coluna que abraça as linhas que ela combina.
// Uso: node ebook/build.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const L = (q, name) => ({ q, name });                 // ingrediente (folha)
const R = (name) => ({ ref: true, name });            // preparo de outro quadro
const O = (op, ...children) => ({ op, children });    // operação (nó)

// ---------------------------------------------------------------- receitas
const recipes = [
  {
    id: 'bolo-de-cenoura', part: 'Bolos', title: 'Bolo de Cenoura',
    meta: [['Forno', '180 °C'], ['Tempo', '40 min'], ['Forma', 'untada']],
    cards: [{
      pre: ['Untar uma forma', 'Preaquecer o forno a 180 °C'],
      tree: O('assar<br><span class="t">180 °C</span><span class="t">40 min</span>',
        O('misturar',
          O('dobrar aos poucos',
            O('bater no liquidificador',
              L('3', 'ovos'), L('1 xícara', 'de azeite'), L('1 xícara', 'de açúcar'), L('2', 'cenouras médias')),
            L('2 xícaras', 'de farinha, peneirada')),
          L('1 xícara', 'de água morna'), L('1 colher de sopa', 'de fermento'))),
    }],
    tips: ['Substituir cerca de 30% do açúcar comum por mascavo.', 'Bater as claras em neve separadamente.', 'Adicionar ½ colher de sopa de vinagre depois de misturar o fermento.'],
  },
  {
    id: 'bolo-de-chocolate', part: 'Bolos', title: 'Bolo de Chocolate',
    meta: [['Forno', '180 °C'], ['Tempo', '40 min'], ['Forma', 'untada']],
    cards: [{
      pre: ['Untar uma forma', 'Preaquecer o forno a 180 °C'],
      tree: O('assar<br><span class="t">180 °C</span><span class="t">40 min</span>',
        O('misturar',
          O('dobrar aos poucos',
            O('bater no liquidificador',
              L('3', 'ovos'), L('1 xícara', 'de azeite'), L('1 xícara', 'de açúcar'), L('1 xícara', 'de achocolatado em pó')),
            L('2 xícaras', 'de farinha, peneirada')),
          L('1 xícara', 'de água morna'), L('1 colher de sopa', 'de fermento'))),
    }],
    tips: ['Substituir cerca de 30% do açúcar comum por mascavo.', 'Bater as claras em neve separadamente.', 'Adicionar ½ colher de sopa de vinagre depois de misturar o fermento.'],
  },
  {
    id: 'brownie', part: 'Chocolate', title: 'Brownie',
    meta: [['Forno', '180 °C'], ['Tempo', '20–25 min'], ['Forma', 'quadrada']],
    cards: [{
      pre: ['Separar uma forma quadrada', 'Preaquecer o forno a 180 °C'],
      tree: O('transferir para a forma e assar<br><span class="t">180 °C</span><span class="t">20–25 min</span>',
        O('incorporar em pedaços',
          O('dobrar',
            O('misturar<sup>2</sup>',
              O('bater até ficar fofo<br><span class="t">1–2 min</span>',
                O('bater na batedeira', L('200 g', 'de manteiga'), L('1 xícara', 'de açúcar')),
                L('2', 'ovos pequenos'), L('1 ½ colher de sopa', 'de extrato de baunilha')),
              O('derreter no micro-ondas<sup>1</sup>', L('90 g', 'de chocolate meio amargo'))),
            L('10 colheres', 'de farinha de trigo'), L('3 colheres de sopa', 'de cacau em pó'), L('1 pitada', 'de sal')),
          L('90 g', 'de chocolate ao leite'))),
    }],
    notes: ['Em intervalos de 20 s.', 'O chocolate não pode estar quente, para não cozinhar os ovos.'],
    tips: ['Servir com sorvete de creme.'],
  },
  {
    id: 'mousse-de-chocolate', part: 'Chocolate', title: 'Mousse de Chocolate',
    meta: [['Fogo', 'baixo'], ['Geladeira', '2 h']],
    cards: [{
      pre: [],
      tree: O('refrigerar<br><span class="t">2 h</span>',
        O('misturar com cuidado',
          O('bater até o ponto de merengue',
            O('bater em fogo baixo<sup>1</sup><br><span class="t">3 min</span>', L('2', 'claras'), L('¼ xícara', 'de açúcar'))),
          O('misturar',
            O('derreter', L('1 barra', 'de chocolate meio amargo'), L('1 barra', 'de chocolate ao leite')),
            L('100 g', 'de creme de leite')))),
    }],
    notes: ['Tirar do fogo por 5 s a cada 30 s, sem parar de bater.'],
  },
  {
    id: 'petit-gateau', part: 'Chocolate', title: 'Petit Gâteau',
    meta: [['Forno', '200 °C'], ['Tempo', '10–15 min'], ['Forma', 'ramequins']],
    cards: [{
      pre: ['Untar os ramequins com cacau', 'Preaquecer o forno a 200 °C'],
      tree: O('assar<sup>2</sup><br><span class="t">200 °C</span><span class="t">10–15 min</span>',
        O('encher os ramequins até ¾',
          O('misturar bem',
            O('misturar bem',
              O('misturar bem',
                O('derreter até ficar bem líquido', L('150 g', 'de chocolate meio amargo'), L('100 g', 'de manteiga')),
                L('—', 'de açúcar<sup>1</sup>')),
              L('4', 'ovos')),
            L('¾ xícara', 'de trigo'), L('2 colheres de sopa', 'de cacau em pó'), L('1 pitada', 'de sal')))),
    }],
    notes: ['A receita original pede açúcar no preparo mas não informa a quantidade.', 'Sem deixar muito líquido nem muito seco.'],
  },
  {
    id: 'massa-de-pizza', part: 'Massas', title: 'Massa de Pizza',
    meta: [['Forno', '200 °C'], ['Tempo', '30–40 min'], ['Descanso', '1 h+'], ['Rende', '2 massas']],
    cards: [{
      pre: ['Untar 2 tigelas com azeite'],
      tree: O('montar na assadeira e assar<br><span class="t">200 °C</span><span class="t">30–40 min</span>',
        O('abrir sobre os punhos<sup>3</sup>',
          O('dividir em 2 bolas e descansar nas tigelas, cobertas<br><span class="t">1 h+</span>',
            O('sovar<br><span class="t">~15 min</span>',
              O('juntar no centro<sup>2</sup>',
                O('peneirar e juntar', L('3 xícaras', 'de farinha de trigo'), L('1 colher de chá', 'de sal')),
                O('misturar e deixar espumar<sup>1</sup>', L('1 colher de sopa', 'de fermento biológico seco'), L('1 colher de chá', 'de açúcar'), L('1 ¼ xícara', 'de água morna')),
                L('1 colher de sopa', 'de azeite de oliva')))),
          L('a gosto', 'farinha para polvilhar'))),
    }],
    notes: ['Misturar o fermento com o açúcar numa tigela pequena, depois a água.', 'Abrir um buraco no centro da farinha e despejar o fermento ativado e o azeite.', 'Sem amassar, polvilhando com farinha.'],
    tips: ['Trocar ⅓ da farinha por integral ou outros grãos.', 'Molho de tomate rápido: bater 1 tomate maduro e 1 cenoura com um pouco de azeite.'],
  },
  {
    id: 'torta-de-maca', part: 'Massas', title: 'Torta de Maçã',
    meta: [['Forno', '220 → 180 °C'], ['Tempo', '1 h'], ['Geladeira', '1 h'], ['Descanso', '1 h']],
    cards: [
      {
        label: 'Massa',
        pre: [],
        tree: O('dividir em 2 discos, envolver em filme e gelar<br><span class="t">1 h</span>',
          O('adicionar aos poucos até dar ponto<sup>2</sup>',
            O('esfarelar até virar ervilhas<sup>1</sup>',
              O('misturar', L('2 ¼ xícaras', 'de farinha de trigo'), L('½ colher de sopa', 'de açúcar'), L('½ colher de chá', 'de sal')),
              L('200 g', 'de manteiga gelada, em cubos')),
            L('5 a 6 colheres de sopa', 'de água gelada (com gelo)'))),
      },
      {
        label: 'Recheio',
        pre: [],
        tree: O('misturar bem',
          O('ferver, cozinhar e reservar até esfriar<br><span class="t">3 min</span>',
            O('bater com fouet<br><span class="t">1 min</span>',
              O('derreter na frigideira', L('8 colheres de sopa', 'de manteiga')),
              L('3 colheres de sopa', 'de farinha de trigo')),
            L('¼ xícara', 'de água'), L('1 xícara', 'de açúcar')),
          O('misturar',
            O('descascar, tirar o miolo e fatiar fino', L('6', 'maçãs verdes grandes (Granny Smith)')),
            L('2 ½ colheres de sopa', 'de canela'), L('½ colher de sopa', 'de gengibre'), L('1', 'limão, em suco'), L('1 pitada', 'de sal'))),
      },
      {
        label: 'Montagem e forno',
        pre: ['Preaquecer o forno a 220 °C'],
        tree: O('descansar antes de cortar<br><span class="t">1 h</span>',
          O('assar<sup>5</sup><br><span class="t">220 °C · 15 min</span><span class="t">180 °C · 45 min</span>',
            O('pincelar',
              O('trançar por cima; fazer a borda com as sobras<sup>4</sup>',
                O('rechear em cúpula<sup>3</sup>',
                  O('abrir em superfície enfarinhada e forrar a forma', R('1 disco de massa')),
                  R('recheio')),
                O('abrir e cortar em tiras', R('1 disco de massa'))),
              O('bater', L('1', 'ovo'), L('1 colher generosa', 'de açúcar'))))),
      },
    ],
    notes: ['Tocar o mínimo possível com as mãos, para não derreter a manteiga.', 'Ponto: dois pedaços de massa grudam ao serem juntados.', 'Menos recheio nas bordas.', 'Borda sem pontas, para não queimar.', 'Baixar a temperatura sem abrir o forno. Está pronta quando o recheio borbulha pelos furos e a maçã fica macia.'],
    tips: ['Servir com sorvete de creme.'],
  },
];

const parts = {
  Bolos: { n: 'I', lede: 'Mesma base, dois sabores. Tudo começa no liquidificador e termina dobrado à mão.' },
  Chocolate: { n: 'II', lede: 'Meio amargo e ao leite, em três texturas: denso, aerado e com o centro mole.' },
  Massas: { n: 'III', lede: 'As receitas de paciência: sova, descanso, geladeira e forno em duas temperaturas.' },
};

// ---------------------------------------------------------------- algoritmo do cartão
function layout(tree) {
  const leaves = [];
  const walk = (n) => {
    if (!n.children) { n.r0 = n.r1 = leaves.length; leaves.push(n); n.col = 0; return; }
    n.children.forEach(walk);
    n.r0 = n.children[0].r0; n.r1 = n.children.at(-1).r1;
    n.col = Math.max(...n.children.map((c) => c.col)) + 1;
  };
  walk(tree);
  const rects = [];
  const collect = (n) => {
    rects.push({ r: n.r0, c: n.col, rs: n.r1 - n.r0 + 1, cs: 1, node: n });
    (n.children || []).forEach((ch) => {
      if (ch.col + 1 < n.col) rects.push({ r: ch.r0, c: ch.col + 1, rs: ch.r1 - ch.r0 + 1, cs: n.col - ch.col - 1, fill: true });
      collect(ch);
    });
  };
  collect(tree);
  return { rows: leaves.length, cols: tree.col + 1, rects, root: tree };
}

function card(cardData) {
  const { rows, cols, rects, root } = layout(cardData.tree);
  const byStart = new Map(rects.map((x) => [`${x.r},${x.c}`, x]));
  let html = `<div class="card-wrap"><table class="card" style="--ops:${cols - 1}">`;
  html += `<colgroup><col class="c-ing">${'<col class="c-op">'.repeat(cols - 1)}</colgroup>`;
  for (const p of cardData.pre) html += `<tr><td class="pre" colspan="${cols}">${p}</td></tr>`;
  for (let r = 0; r < rows; r++) {
    html += '<tr>';
    for (let c = 0; c < cols; c++) {
      const x = byStart.get(`${r},${c}`);
      if (!x) continue;
      const span = `${x.rs > 1 ? ` rowspan="${x.rs}"` : ''}${x.cs > 1 ? ` colspan="${x.cs}"` : ''}`;
      if (x.fill) { html += `<td class="fill"${span}></td>`; continue; }
      const n = x.node;
      if (!n.children) {
        html += n.ref
          ? `<td class="ing ref"${span}>${n.name}</td>`
          : `<td class="ing"${span}><span class="q">${n.q}</span> ${n.name}</td>`;
      } else {
        html += `<td class="op${n === root ? ' final' : ''}"${span}>${n.op.replace(/(\d) (°C|min|h\b)/g, '$1&nbsp;$2')}</td>`;
      }
    }
    html += '</tr>';
  }
  return html + '</table></div>';
}

// ---------------------------------------------------------------- páginas
const esc = (s) => s;
const metaHtml = (m) => `<ul class="meta">${m.map(([k, v]) => `<li><b>${k}</b>${v}</li>`).join('')}</ul>`;
const total = recipes.length;

function recipePage(rec, i) {
  const num = String(i + 1).padStart(2, '0');
  const cards = rec.cards.map((c) => `
      <section class="card-block">
        ${c.label ? `<h3 class="card-label">${c.label}</h3>` : ''}
        ${card(c)}
      </section>`).join('');
  const notes = rec.notes ? `<ol class="notes">${rec.notes.map((n) => `<li>${n}</li>`).join('')}</ol>` : '';
  const tips = rec.tips ? `<aside class="tips"><h3>${rec.tips.length > 1 ? 'Dicas' : 'Dica'}</h3><ul>${rec.tips.map((t) => `<li>${t}</li>`).join('')}</ul></aside>` : '';
  return `
  <article class="sheet recipe" id="${rec.id}">
    <header class="recipe-head">
      <div class="eyebrow"><span>Receita ${num} / ${String(total).padStart(2, '0')}</span><span>${rec.part}</span></div>
      <h2>${rec.title}</h2>
      ${metaHtml(rec.meta)}
    </header>
    <div class="cards">${cards}</div>
    ${notes}
    ${tips}
    <a class="back" href="#sumario">↑ Sumário</a>
  </article>`;
}

function partPage(name) {
  const p = parts[name];
  return `
  <section class="sheet part" id="parte-${name.toLowerCase()}">
    <div class="eyebrow">Parte ${p.n}</div>
    <h2>${name}</h2>
    <p>${p.lede}</p>
  </section>`;
}

const tocMeta = (rec) => rec.meta.filter(([k]) => ['Forno', 'Tempo', 'Geladeira'].includes(k)).slice(0, 2).map(([, v]) => v).join(' · ');

let body = '';
let lastPart = null;
recipes.forEach((rec, i) => {
  if (rec.part !== lastPart) { body += partPage(rec.part); lastPart = rec.part; }
  body += recipePage(rec, i);
});

const toc = Object.keys(parts).map((pn) => `
    <div class="toc-part">
      <h3>Parte ${parts[pn].n} · ${pn}</h3>
      <ol>${recipes.map((r, i) => [r, i]).filter(([r]) => r.part === pn).map(([r, i]) => `
        <li><a href="#${r.id}"><span class="toc-num">${String(i + 1).padStart(2, '0')}</span><span class="toc-name">${r.title}</span><span class="toc-meta">${tocMeta(r)}</span></a></li>`).join('')}
      </ol>
    </div>`).join('');

// ---------------------------------------------------------------- mini cartão da capa (decorativo, ilustra o método)
const coverDemo = card({
  pre: [],
  tree: O('assar', O('dobrar', O('bater', L('', 'ovos'), L('', 'azeite'), L('', 'açúcar')), L('', 'farinha')), L('', 'fermento')),
});

const html = `<title>Receitas do Gabe</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<style>
/* Layout: folhas de caderno empilhadas; cada receita é um cartão algorítmico (ingredientes à esquerda,
   operações em colunas que abraçam o que combinam), lido da esquerda para a direita. */
:root {
  --brand-ink: #17181C;
  --brand-background: #EFF0F2;
  --brand-accent: #7C1B0F;
  --brand-muted: #686B72;
  --paper: #FBFBFC;
  --rule: #C9CCD2;
  --grid: #17181C;
  --tint: #F4E9E6;
  --pre: #E6E8EC;
  --fill: #F3F4F6;
  --on-accent: #FBFBFC;
  --shadow: 0 1px 2px rgba(23,24,28,.06), 0 12px 32px rgba(23,24,28,.08);
  --font-heading: 'Fraunces', 'Iowan Old Style', Georgia, serif;
  --font-body: 'Geist', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --brand-ink: #ECEDF0; --brand-background: #101114; --brand-accent: #E07A66; --brand-muted: #9A9DA5;
    --paper: #1A1C21; --rule: #3A3D45; --grid: #C9CCD2; --tint: #2A1D1B; --pre: #24272D; --fill: #1F2126; --on-accent: #17181C;
    --shadow: 0 1px 2px rgba(0,0,0,.4), 0 12px 32px rgba(0,0,0,.35);
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --brand-ink: #ECEDF0; --brand-background: #101114; --brand-accent: #E07A66; --brand-muted: #9A9DA5;
  --paper: #1A1C21; --rule: #3A3D45; --grid: #C9CCD2; --tint: #2A1D1B; --pre: #24272D; --fill: #1F2126; --on-accent: #17181C;
  --shadow: 0 1px 2px rgba(0,0,0,.4), 0 12px 32px rgba(0,0,0,.35);
  color-scheme: dark;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body {
  background: var(--brand-background); color: var(--brand-ink);
  font-family: var(--font-body); font-size: 16px; line-height: 1.6;
  padding-block: 32px 64px;
  padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px));
  overflow-wrap: break-word; hyphens: auto;
}
a { color: inherit; }
a:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 3px; border-radius: 2px; }

.book { display: grid; gap: 32px; max-width: 860px; margin: 0 auto; }
.sheet { background: var(--paper); box-shadow: var(--shadow); padding: clamp(24px, 6vw, 60px) clamp(18px, 5.5vw, 60px); min-width: 0; }
.eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--brand-muted); }

/* capa */
.cover { display: grid; gap: 48px; align-content: space-between; }
.cover h1 { font-family: var(--font-heading); font-variation-settings: 'opsz' 144; font-weight: 340; font-size: clamp(56px, 14vw, 124px); line-height: .92; letter-spacing: -.02em; margin: 0; text-wrap: balance; }
.cover h1 em { font-style: italic; color: var(--brand-accent); font-weight: 300; }
.cover-lede { font-size: 18px; max-width: 40ch; color: var(--brand-muted); margin: 20px 0 0; }
.cover-demo { display: grid; gap: 10px; max-width: 520px; }
.cover-demo .card td { font-size: 13px; }
.cover-demo figcaption { font-size: 13px; color: var(--brand-muted); }
.cover-foot { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px 24px; }

/* sumário */
.toc h2, .howto h2 { font-family: var(--font-heading); font-weight: 400; font-size: 40px; line-height: 1.1; margin: 8px 0 28px; text-wrap: balance; }
.toc-part { margin-top: 28px; }
.toc-part:first-of-type { margin-top: 0; }
.toc-part h3 { font-family: var(--font-mono); font-weight: 500; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--brand-accent); margin: 0 0 4px; }
.toc ol { list-style: none; margin: 0; padding: 0; }
.toc li a { display: grid; grid-template-columns: 2.5em minmax(0, 1fr) auto; gap: 12px; align-items: baseline; padding: 12px 0; border-bottom: 1px solid var(--rule); text-decoration: none; }
.toc li a:hover .toc-name { color: var(--brand-accent); }
.toc-num { font-family: var(--font-mono); font-size: 13px; color: var(--brand-muted); font-variant-numeric: tabular-nums; }
.toc-name { font-family: var(--font-heading); font-size: 22px; line-height: 1.25; transition: color .15s; }
.toc-meta { font-family: var(--font-mono); font-size: 12px; color: var(--brand-muted); text-align: right; }
@media (max-width: 480px) { .toc li a { grid-template-columns: 2em minmax(0, 1fr); } .toc-meta { grid-column: 2; text-align: left; } }

/* como ler */
.howto ol { margin: 0; padding-left: 1.2em; display: grid; gap: 10px; max-width: 62ch; }
.howto li::marker { font-family: var(--font-mono); color: var(--brand-accent); }

/* parte */
.part { display: grid; align-content: end; min-height: 300px; background: var(--brand-ink); color: var(--paper); }
.part .eyebrow { color: var(--brand-accent); }
.part h2 { font-family: var(--font-heading); font-size: clamp(44px, 10vw, 72px); font-style: italic; font-weight: 300; line-height: 1; margin: 8px 0 12px; }
.part p { margin: 0; max-width: 42ch; opacity: .72; }

/* receita */
.recipe-head { display: grid; gap: 16px; padding-bottom: 24px; }
.recipe-head .eyebrow { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.recipe-head h2 { font-family: var(--font-heading); font-variation-settings: 'opsz' 144; font-weight: 360; font-size: clamp(40px, 9vw, 68px); line-height: 1; letter-spacing: -.015em; margin: 0; text-wrap: balance; }
.meta { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; margin: 0; padding: 0; }
.meta li { font-family: var(--font-mono); font-size: 12px; padding: 4px 10px; border: 1px solid var(--rule); border-radius: 999px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.meta li b { font-weight: 500; color: var(--brand-accent); margin-right: 4px; }

.cards { display: grid; gap: 28px; }
.card-label { font-family: var(--font-heading); font-style: italic; font-weight: 400; font-size: 22px; color: var(--brand-accent); margin: 0 0 10px; }

/* o cartão algorítmico */
.card-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.card { width: 100%; border-collapse: collapse; border: 2px solid var(--grid); table-layout: fixed; }
.card col.c-ing { width: 34%; }
@media (max-width: 700px) { .card { min-width: calc(12rem + var(--ops) * 5.5rem); } }
.card td { border: 1px solid var(--grid); padding: 8px 10px; vertical-align: middle; font-size: 14.5px; line-height: 1.35; }
.card td.ing { overflow-wrap: anywhere; }
.card td.ing .q { font-family: var(--font-mono); font-size: 12.5px; font-weight: 500; font-variant-numeric: tabular-nums; }
.card td.ref { font-family: var(--font-heading); font-style: italic; color: var(--brand-accent); }
.card td.pre { text-align: center; background: var(--pre); font-weight: 500; }
.card td.op { text-align: center; font-size: 13.5px; padding: 8px 6px; hyphens: auto; overflow-wrap: break-word; }
.card td.op .t { display: block; font-family: var(--font-mono); font-size: 12px; color: var(--brand-accent); margin-top: 4px; font-variant-numeric: tabular-nums; }
.card td.op.final { background: var(--brand-accent); color: var(--on-accent); font-weight: 600; }
.card td.op.final .t { color: var(--on-accent); font-weight: 400; }
.card td.fill { background: var(--fill); }
.card sup { font-family: var(--font-mono); font-size: 10px; color: var(--brand-accent); margin-left: 1px; }
.card td.op.final sup { color: var(--on-accent); }

.notes { margin: 20px 0 0; padding-left: 1.4em; font-size: 14px; color: var(--brand-muted); display: grid; gap: 4px; max-width: 70ch; }
.notes li::marker { font-family: var(--font-mono); font-size: 11px; color: var(--brand-accent); }

.tips { margin-top: 28px; padding: 18px 22px; background: var(--tint); break-inside: avoid; }
.tips h3 { font-family: var(--font-heading); font-style: italic; font-weight: 400; font-size: 20px; margin: 0 0 6px; color: var(--brand-accent); }
.tips ul { margin: 0; padding-left: 1.1em; }
.tips li { padding: 2px 0; font-size: 15px; }

.back { display: inline-block; margin-top: 28px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--brand-muted); text-decoration: none; }
.back:hover { color: var(--brand-accent); }

.colophon { display: grid; gap: 12px; }
.colophon p { margin: 0; color: var(--brand-muted); font-size: 14px; max-width: 56ch; }
.colophon .mark { font-family: var(--font-heading); font-style: italic; font-size: 28px; }

/* impressão / PDF */
@page { size: A4; margin: 16mm 14mm 18mm; }
@media print {
  :root { --paper: #fff; --brand-background: #fff; }
  body { padding: 0; background: #fff; font-size: 10.5pt; }
  .book { display: block; max-width: none; }
  .sheet { box-shadow: none; padding: 0; break-before: page; }
  .sheet:first-child { break-before: auto; }
  .part { min-height: 240mm; padding: 16mm; }
  .card-wrap { overflow: visible; }
  .card { min-width: 0 !important; }
  .card td { font-size: 9.5pt; padding: 5px 7px; }
  .card td.op { font-size: 9pt; padding: 5px 4px; }
  .card tr, .card-block { break-inside: avoid; }
  .back { display: none; }
  h2, h3 { break-after: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>

<main class="book" lang="pt-BR">
  <section class="sheet cover" id="capa">
    <div class="eyebrow">Caderno de cozinha · edição 02</div>
    <div>
      <h1>Receitas<br>do <em>Gabe</em></h1>
      <p class="cover-lede">Sete receitas testadas em casa, escritas como algoritmos: o que entra, em que ordem, e o que sai.</p>
    </div>
    <figure class="cover-demo" style="margin:0">
      ${coverDemo}
      <figcaption>Cada coluna é uma operação. Ela junta tudo o que abraça à esquerda.</figcaption>
    </figure>
    <div class="cover-foot eyebrow"><span>Gabriel S. Kumlehn</span><span>Atta Studio · 2026</span></div>
  </section>

  <section class="sheet howto" id="como-ler">
    <div class="eyebrow">Antes de começar</div>
    <h2>Como ler os cartões</h2>
    <ol>
      <li>As faixas cinza no topo são preparativos: forma, forno, tigelas.</li>
      <li>A coluna da esquerda lista os ingredientes, já na ordem em que entram.</li>
      <li>Leia da esquerda para a direita. Cada célula é uma operação aplicada a todos os ingredientes que ela cobre na vertical.</li>
      <li>Células sombreadas significam espera: aquele ingrediente só entra na próxima operação à direita.</li>
      <li>A última coluna, em destaque, é o passo final. Temperaturas e tempos aparecem logo abaixo de cada operação.</li>
      <li>Números sobrescritos remetem às notas logo abaixo do cartão.</li>
    </ol>
  </section>

  <section class="sheet toc" id="sumario">
    <div class="eyebrow">Sumário</div>
    <h2>O que tem aqui</h2>
    ${toc}
  </section>
${body}
  <section class="sheet colophon" id="colofao">
    <div class="eyebrow">Colofão</div>
    <div class="mark">Bom apetite.</div>
    <p>Receitas reunidas por Gabriel Sprotte Kumlehn a partir do repositório livro-receitas. Cartões no formato algorítmico popularizado pelo Cooking for Engineers. Projeto gráfico Atta Studio, composto em Fraunces, Geist e Geist Mono.</p>
  </section>
</main>
`;

const out = join(dirname(fileURLToPath(import.meta.url)), 'livro-de-receitas.html');
writeFileSync(out, html);
console.log('ok', out, html.length);
