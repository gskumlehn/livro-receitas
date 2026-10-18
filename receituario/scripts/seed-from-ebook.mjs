// Converte as receitas do ebook (livro-receitas/ebook/build.mjs) para o formato do Receituário.
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync(process.argv[2], 'utf8');
const start = src.indexOf('const L =');
const end = src.indexOf('// ---------------------------------------------------------------- algoritmo');
const { recipes, parts } = new Function(src.slice(start, end) + '; return { recipes, parts };')();

let n = 0; const id = () => 'g' + (n++).toString(36);
const strip = (h) => h.replace(/<sup>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').trim();
function opParts(op) {
  const t = [...op.matchAll(/<span class="t">(.*?)<\/span>/g)].map((m) => strip(m[1]));
  const head = strip(op.split('<br>')[0]);
  return { op: head, t: t.join(' · ') };
}
function section(card) {
  const ings = [], steps = [];
  const walk = (node) => {
    if (!node.children) {
      const g = node.ref ? { id: id(), q: '', name: node.name, ref: true } : { id: id(), q: node.q === '—' ? '' : node.q, name: strip(node.name), ref: false };
      ings.push(g); return g.id;
    }
    const inputs = node.children.map(walk);
    const s = { id: id(), ...opParts(node.op), inputs }; steps.push(s); return s.id;
  };
  walk(card.tree);
  return { id: id(), label: card.label || '', pre: (card.pre || []).join('\n'), ings, steps };
}
const themes = Object.entries(parts).map(([name, p]) => ({
  id: id(), name, lede: p.lede,
  recipes: recipes.filter((r) => r.part === name).map((r) => ({
    id: r.id, title: r.title,
    meta: r.meta.map(([k, v]) => ({ k, v })),
    sections: r.cards.map(section),
    notes: (r.notes || []).join('\n'), tips: (r.tips || []).join('\n'),
  })),
}));
const book = {
  id: 'receitas-do-gabe', title: 'Receitas do Gabe', subtitle: 'Sete receitas testadas em casa', byline: 'Gabriel S. Kumlehn',
  intro: 'Do bolo de liquidificador à torta de maçã com massa trançada, cada receita aqui foi escrita como um algoritmo: o que entra, em que ordem, e o que sai.',
  published: true, cloth: '#6E2A1E', themes, updatedAt: Date.now(),
};
writeFileSync(process.argv[3], JSON.stringify(book));
console.log('recipes', themes.reduce((a, t) => a + t.recipes.length, 0), 'bytes', JSON.stringify(book).length);
