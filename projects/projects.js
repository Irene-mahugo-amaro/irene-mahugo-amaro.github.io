// projects/projects.js
// Lightweight renderer focused on imagery & tag-led discovery.

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error('Failed to load ' + path);
  return r.json();
}

function createEl(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k, v);
  }
  for (const c of children) e.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return e;
}

function makeCard(p) {
  const link = createEl('a', {href: `./${p.slug}/`, class: 'card-link', 'aria-label': p.title});
  const fig = createEl('figure', {class: 'card'});
  const img = createEl('img', {src: p.thumbnail, alt: p.title, loading: 'lazy'});
  const overlay = createEl('figcaption', {class: 'card-caption'});
  const title = createEl('h2', {}, p.title);
  const meta = createEl('p', {class: 'meta'}, (p.tags || []).join(' · '));
  const excerpt = createEl('p', {class: 'excerpt'}, p.summary || p.methods || '');
  overlay.append(title, meta, excerpt);
  fig.append(img, overlay);
  link.append(fig);
  return link;
}

function renderMasonry(list) {
  const m = document.getElementById('masonry');
  m.innerHTML = '';
  list.forEach(p => m.appendChild(makeCard(p)));
  document.getElementById('last-updated').textContent = new Date().toLocaleDateString();
}

function buildTagBar(projects) {
  const bar = document.getElementById('tag-bar');
  bar.innerHTML = '';
  const tags = new Set();
  projects.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
  Array.from(tags).sort().forEach(t => {
    const b = createEl('button', {class: 'chip'}, t);
    b.addEventListener('click', () => {
      // toggle active state
      const active = b.classList.toggle('active');
      applyTagFilter();
    });
    bar.appendChild(b);
  });
}

let all = [];
async function init() {
  all = await loadJSON('./projects.json');
  buildTagBar(all);
  renderMasonry(all);
}

function getActiveTags() {
  const nodes = Array.from(document.querySelectorAll('#tag-bar .chip.active'));
  return nodes.map(n => n.textContent.trim().toLowerCase());
}

function applyTagFilter() {
  const active = getActiveTags();
  if (!active.length) return renderMasonry(all);
  const filtered = all.filter(p => {
    const ptags = (p.tags || []).map(t => t.toLowerCase());
    return active.every(a => ptags.includes(a));
  });
  renderMasonry(filtered);
  document.getElementById('no-results').hidden = filtered.length > 0;
}

init().catch(e => {
  console.error(e);
  document.getElementById('masonry').textContent = 'Could not load projects.';
});
