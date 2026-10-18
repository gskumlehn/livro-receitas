# Receituário

App para montar e publicar livros de receitas no formato de cartão algorítmico.

- `index.html` — protótipo do app (artifact do claude.ai com banco de dados compartilhado).
- `docs/system-design.html` — design de sistema para colocar o app em produção.
- `scripts/seed-from-ebook.mjs` — converte as receitas de `ebook/build.mjs` para o formato do app:
  `node receituario/scripts/seed-from-ebook.mjs ebook/build.mjs seed.json`
