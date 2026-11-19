'use strict';
// Tricoté — общ скрипт за всички страници:
// данни за продуктите, плетени илюстрации, количка, наличност, форми.

// ---------- помощни функции ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => n.toFixed(2).replace('.', ',') + ' €';
const PAGE = document.body.dataset.page;
const params = new URLSearchParams(location.search);

function store(key, val) {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) { return null; }
}
// смесва цвят към черно (amt < 0) или бяло (amt > 0)
function mix(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ---------- плетени илюстрации (SVG) ----------
let uid = 0;
const EYE = '#3B0F1F', METAL = '#B7A3AB';
function stitch(id, base) {
  const d = mix(base, -.2), l = mix(base, .18);
  return `<pattern id="${id}" width="10" height="9" patternUnits="userSpaceOnUse"><rect width="10" height="9" fill="${base}"/><path d="M1 1.2 L5 7 L9 1.2" fill="none" stroke="${d}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.4 1.6 L5 5.2" stroke="${l}" stroke-width="1" stroke-linecap="round"/></pattern>`;
}
function rib(id, base) {
  const d = mix(base, -.22);
  return `<pattern id="${id}" width="8" height="12" patternUnits="userSpaceOnUse"><rect width="8" height="12" fill="${base}"/><path d="M1 0 Q4 6 1 12 M5 0 Q8 6 5 12" fill="none" stroke="${d}" stroke-width="1.5"/></pattern>`;
}
const ART = {
  tote(c, a) {
    const s = `s${uid++}`, t = `s${uid++}`, d = mix(c, -.38);
    return { defs: stitch(s, c) + rib(t, a), body: `
      <path d="M68 74 Q68 26 100 26 Q132 26 132 74" fill="none" stroke="${d}" stroke-width="12" stroke-linecap="round"/>
      <path d="M68 74 Q68 26 100 26 Q132 26 132 74" fill="none" stroke="${mix(c, -.15)}" stroke-width="6" stroke-linecap="round" stroke-dasharray="3 5"/>
      <path d="M42 72 H158 L150 164 Q149 172 141 172 H59 Q51 172 50 164 Z" fill="url(#${s})" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="40" y="64" width="120" height="18" rx="6" fill="url(#${t})" stroke="${d}" stroke-width="3"/>
      <g transform="translate(100 122)">${[0, 60, 120, 180, 240, 300].map(r => `<ellipse rx="9" ry="14" cy="-13" transform="rotate(${r})" fill="${a}" stroke="${d}" stroke-width="2"/>`).join('')}<circle r="8" fill="#F4D58D" stroke="${d}" stroke-width="2"/></g>` };
  },
  moon(c, a) {
    const s = `s${uid++}`, t = `s${uid++}`, d = mix(c, -.38);
    return { defs: stitch(s, c) + stitch(t, a), body: `
      <path d="M44 108 Q40 22 100 22 Q160 22 156 108" fill="none" stroke="${d}" stroke-width="8" stroke-linecap="round"/>
      <path d="M34 102 H166 Q166 176 100 176 Q34 176 34 102 Z" fill="url(#${s})" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 102 H166 Q154 138 100 142 Q46 138 34 102 Z" fill="url(#${t})" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="100" cy="140" r="8" fill="${mix(a, -.1)}" stroke="${d}" stroke-width="2.5"/><circle cx="100" cy="140" r="2.5" fill="${d}"/>` };
  },
  granny(c, a) {
    const s = `s${uid++}`, d = mix(c, -.4), cream = '#FBF3EA', cols = [c, a, '#F4D58D', a, c, a, '#F4D58D', a, c];
    let sq = '', i = 0;
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) {
      const x = 46 + k * 36, y = 70 + r * 34, col = cols[i++];
      sq += `<rect x="${x}" y="${y}" width="36" height="34" fill="${cream}" stroke="${d}" stroke-width="2"/><rect x="${x + 5}" y="${y + 5}" width="26" height="24" rx="3" fill="${col}"/><circle cx="${x + 18}" cy="${y + 17}" r="6" fill="${col === c ? a : c}" stroke="${mix(col, -.3)}" stroke-width="1.5"/>`;
    }
    return { defs: stitch(s, c), body: `
      <path d="M72 72 Q72 34 100 34 Q128 34 128 72" fill="none" stroke="${d}" stroke-width="11" stroke-linecap="round"/>
      ${sq}<rect x="46" y="70" width="108" height="102" rx="4" fill="none" stroke="${d}" stroke-width="3"/>
      <rect x="44" y="62" width="112" height="12" rx="5" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>` };
  },
  pouch(c, a) {
    const s = `s${uid++}`, d = mix(c, -.38);
    return { defs: stitch(s, c), body: `
      <circle cx="150" cy="70" r="13" fill="none" stroke="${METAL}" stroke-width="4"/>
      <path d="M44 88 Q44 72 60 72 H140 Q156 72 156 88 V146 Q156 166 136 166 H64 Q44 166 44 146 Z" fill="url(#${s})" stroke="${d}" stroke-width="3"/>
      <path d="M52 84 H148" stroke="${mix(c, -.5)}" stroke-width="4" stroke-dasharray="2 3"/>
      <path d="M146 84 L150 98" stroke="${METAL}" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="102" r="5" fill="${a}" stroke="${d}" stroke-width="2"/>
      <path d="M100 118 C92 106 76 110 78 124 C80 134 100 146 100 146 C100 146 120 134 122 124 C124 110 108 106 100 118Z" fill="${a}" stroke="${d}" stroke-width="2.5"/>` };
  },
  bunny(c, a) {
    const s = `s${uid++}`, d = mix(c, -.35);
    return { defs: stitch(s, c), body: `
      <ellipse cx="80" cy="44" rx="13" ry="32" fill="url(#${s})" stroke="${d}" stroke-width="2.5" transform="rotate(-8 80 44)"/><ellipse cx="80" cy="48" rx="6" ry="22" fill="${a}" transform="rotate(-8 80 48)"/>
      <ellipse cx="120" cy="44" rx="13" ry="32" fill="url(#${s})" stroke="${d}" stroke-width="2.5" transform="rotate(8 120 44)"/><ellipse cx="120" cy="48" rx="6" ry="22" fill="${a}" transform="rotate(8 120 48)"/>
      <ellipse cx="100" cy="148" rx="38" ry="32" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <ellipse cx="66" cy="140" rx="10" ry="18" fill="url(#${s})" stroke="${d}" stroke-width="2.5" transform="rotate(20 66 140)"/><ellipse cx="134" cy="140" rx="10" ry="18" fill="url(#${s})" stroke="${d}" stroke-width="2.5" transform="rotate(-20 134 140)"/>
      <ellipse cx="82" cy="176" rx="14" ry="9" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/><ellipse cx="118" cy="176" rx="14" ry="9" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <circle cx="100" cy="96" r="38" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <circle cx="86" cy="94" r="4.5" fill="${EYE}"/><circle cx="114" cy="94" r="4.5" fill="${EYE}"/>
      <ellipse cx="78" cy="106" rx="7" ry="4" fill="${a}" opacity=".8"/><ellipse cx="122" cy="106" rx="7" ry="4" fill="${a}" opacity=".8"/>
      <path d="M96 104 L104 104 L100 108Z" fill="${EYE}"/><path d="M100 108 Q96 113 92 111 M100 108 Q104 113 108 111" fill="none" stroke="${EYE}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M86 132 l14 8 l14 -8 l-2 12 l-12 -4 l-12 4z" fill="${a}" stroke="${d}" stroke-width="2"/>` };
  },
  bear(c, a) {
    const s = `s${uid++}`, d = mix(c, -.4), muzzle = mix(c, .45);
    return { defs: stitch(s, c), body: `
      <circle cx="68" cy="60" r="16" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/><circle cx="68" cy="60" r="8" fill="${a}"/>
      <circle cx="132" cy="60" r="16" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/><circle cx="132" cy="60" r="8" fill="${a}"/>
      <ellipse cx="100" cy="150" rx="40" ry="32" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/><ellipse cx="100" cy="154" rx="22" ry="18" fill="${muzzle}"/>
      <ellipse cx="64" cy="142" rx="11" ry="19" fill="url(#${s})" stroke="${d}" stroke-width="2.5" transform="rotate(25 64 142)"/><ellipse cx="136" cy="142" rx="11" ry="19" fill="url(#${s})" stroke="${d}" stroke-width="2.5" transform="rotate(-25 136 142)"/>
      <circle cx="80" cy="178" r="12" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/><circle cx="120" cy="178" r="12" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <circle cx="100" cy="94" r="40" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <ellipse cx="100" cy="108" rx="17" ry="13" fill="${muzzle}" stroke="${d}" stroke-width="2"/>
      <ellipse cx="100" cy="102" rx="6" ry="4.5" fill="${EYE}"/><path d="M100 106 V112 M100 112 Q95 116 91 113 M100 112 Q105 116 109 113" fill="none" stroke="${EYE}" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="84" cy="88" r="4.5" fill="${EYE}"/><circle cx="116" cy="88" r="4.5" fill="${EYE}"/>
      <ellipse cx="74" cy="104" rx="6" ry="3.5" fill="${a}" opacity=".7"/><ellipse cx="126" cy="104" rx="6" ry="3.5" fill="${a}" opacity=".7"/>` };
  },
  octo(c, a) {
    const s = `s${uid++}`, d = mix(c, -.4);
    const leg = (x, i) => {
      const L = i < 3;
      const path = `M${x} 120 Q${x + (L ? -10 : 10)} 150 ${x + (L ? -4 : 4)} 166 Q${x + (L ? 6 : -6)} 178 ${x + (L ? 14 : -14)} 168`;
      return `<path d="${path}" fill="none" stroke="${d}" stroke-width="17" stroke-linecap="round"/><path d="${path}" fill="none" stroke="url(#${s})" stroke-width="12" stroke-linecap="round"/>`;
    };
    return { defs: stitch(s, c), body: `${[48, 68, 88, 112, 132, 152].map(leg).join('')}
      <path d="M50 122 Q46 40 100 38 Q154 40 150 122 Z" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <circle cx="84" cy="94" r="5" fill="${EYE}"/><circle cx="116" cy="94" r="5" fill="${EYE}"/>
      <path d="M92 106 Q100 113 108 106" fill="none" stroke="${EYE}" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="74" cy="106" rx="7" ry="4" fill="${a}" opacity=".85"/><ellipse cx="126" cy="106" rx="7" ry="4" fill="${a}" opacity=".85"/>
      <circle cx="122" cy="58" r="10" fill="${a}" stroke="${d}" stroke-width="2"/>` };
  },
  cat(c, a) {
    const s = `s${uid++}`, d = mix(c, -.4);
    return { defs: stitch(s, c), body: `
      <path d="M136 160 Q176 150 168 116 Q164 104 156 110" fill="none" stroke="${d}" stroke-width="16" stroke-linecap="round"/><path d="M136 160 Q176 150 168 116 Q164 104 156 110" fill="none" stroke="url(#${s})" stroke-width="11" stroke-linecap="round"/>
      <ellipse cx="100" cy="150" rx="38" ry="32" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <ellipse cx="84" cy="178" rx="13" ry="9" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/><ellipse cx="116" cy="178" rx="13" ry="9" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <path d="M64 76 L66 36 L94 60 Z" fill="url(#${s})" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/><path d="M70 66 L71 46 L86 60Z" fill="${a}"/>
      <path d="M136 76 L134 36 L106 60 Z" fill="url(#${s})" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/><path d="M130 66 L129 46 L114 60Z" fill="${a}"/>
      <ellipse cx="100" cy="94" rx="42" ry="36" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>
      <path d="M80 92 Q86 86 92 92 M108 92 Q114 86 120 92" fill="none" stroke="${EYE}" stroke-width="3" stroke-linecap="round"/>
      <path d="M96 102 L104 102 L100 106Z" fill="${a}"/><path d="M100 106 Q96 111 92 109 M100 106 Q104 111 108 109" fill="none" stroke="${EYE}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M58 100 H80 M58 108 L80 105 M142 100 H120 M142 108 L120 105" stroke="${EYE}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M78 124 Q100 136 122 124" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="134" r="6" fill="#F4D58D" stroke="${d}" stroke-width="2"/>` };
  },
  ring() {
    return `<circle cx="100" cy="34" r="17" fill="none" stroke="${METAL}" stroke-width="4.5"/><circle cx="100" cy="34" r="17" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="6 20" opacity=".7"/>${[56, 66, 76].map(y => `<ellipse cx="100" cy="${y}" rx="4" ry="6" fill="none" stroke="${METAL}" stroke-width="3"/>`).join('')}`;
  },
  heart(c, a) {
    const s = `s${uid++}`, d = mix(c, -.38);
    return { defs: stitch(s, c), body: ART.ring() + `
      <path d="M100 104 C86 82 50 88 52 118 C54 142 100 172 100 172 C100 172 146 142 148 118 C150 88 114 82 100 104Z" fill="url(#${s})" stroke="${d}" stroke-width="3"/>
      <circle cx="86" cy="124" r="4" fill="${EYE}"/><circle cx="114" cy="124" r="4" fill="${EYE}"/><path d="M94 134 Q100 139 106 134" fill="none" stroke="${EYE}" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="78" cy="134" rx="6" ry="3.5" fill="${a}" opacity=".85"/><ellipse cx="122" cy="134" rx="6" ry="3.5" fill="${a}" opacity=".85"/>` };
  },
  berry(c, a) {
    const s = `s${uid++}`, g = `s${uid++}`, d = mix(c, -.38);
    const seeds = [[84, 118], [100, 112], [116, 118], [76, 134], [92, 132], [108, 132], [124, 134], [86, 150], [100, 148], [114, 150], [100, 164]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3.2" fill="#F8E7A8"/>`).join('');
    return { defs: stitch(s, c) + stitch(g, '#7DBF8E'), body: ART.ring() + `
      <path d="M100 176 C70 160 54 128 62 110 C70 92 130 92 138 110 C146 128 130 160 100 176Z" fill="url(#${s})" stroke="${d}" stroke-width="3"/>${seeds}
      <path d="M100 86 L86 100 L72 96 L82 106 L100 102 L118 106 L128 96 L114 100Z" fill="url(#${g})" stroke="#3F7D55" stroke-width="2.5" stroke-linejoin="round"/>` };
  },
  flower(c, a) {
    const s = `s${uid++}`, d = mix(c, -.38);
    return { defs: stitch(s, c), body: ART.ring() + `<g transform="translate(100 132)">${[0, 60, 120, 180, 240, 300].map(r => `<ellipse rx="16" ry="25" cy="-26" transform="rotate(${r})" fill="url(#${s})" stroke="${d}" stroke-width="2.5"/>`).join('')}<circle r="17" fill="${a}" stroke="${mix(a, -.35)}" stroke-width="2.5"/><circle cx="-6" cy="-3" r="2.5" fill="${EYE}"/><circle cx="6" cy="-3" r="2.5" fill="${EYE}"/><path d="M-4 5 Q0 8 4 5" fill="none" stroke="${EYE}" stroke-width="1.6" stroke-linecap="round"/></g>` };
  },
  shroom(c, a) {
    const s = `s${uid++}`, st = `s${uid++}`, d = mix(c, -.38);
    return { defs: stitch(s, c) + stitch(st, '#F6EBDD'), body: ART.ring() + `
      <path d="M82 128 Q78 170 86 176 H114 Q122 170 118 128Z" fill="url(#${st})" stroke="#9C7F6A" stroke-width="2.5"/>
      <circle cx="94" cy="150" r="3.5" fill="${EYE}"/><circle cx="106" cy="150" r="3.5" fill="${EYE}"/>
      <path d="M52 132 Q50 88 100 86 Q150 88 148 132 Q100 140 52 132Z" fill="url(#${s})" stroke="${d}" stroke-width="3"/>
      <circle cx="78" cy="112" r="7" fill="#FBF3EA"/><circle cx="104" cy="102" r="8" fill="#FBF3EA"/><circle cx="126" cy="116" r="6" fill="#FBF3EA"/>` };
  }
};
function art(p, colorIdx = 0) {
  const col = p.colors[colorIdx] || p.colors[0];
  const { defs, body } = ART[p.art](col.hex, p.accent);
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.name)}, ${esc(col.name)} (илюстрация)"><defs>${defs}</defs><rect width="200" height="200" fill="${p.bg}"/><circle cx="160" cy="34" r="46" fill="#fff" opacity=".28"/><ellipse cx="100" cy="186" rx="62" ry="8" fill="#731943" opacity=".09"/>${body}</svg>`;
}

// ---------- продукти ----------
const C = {
  rose: { name: 'Розово', hex: '#E9A6BC' }, wine: { name: 'Винено', hex: '#8E2A4E' }, mint: { name: 'Мента', hex: '#A8E3CC' },
  powder: { name: 'Пудра', hex: '#F0BFCF' }, cream: { name: 'Крем', hex: '#F3E6DA' }, lilac: { name: 'Лила', hex: '#C9A7D9' },
  caramel: { name: 'Карамел', hex: '#C99A73' }, grey: { name: 'Сиво', hex: '#BDB3B8' }, red: { name: 'Ягодово', hex: '#D9415E' },
  butter: { name: 'Жълто', hex: '#F4D58D' }, sky: { name: 'Небесно', hex: '#A9CBEA' }
};
const PRODUCTS = [
  { id: 'roza', cat: 'bags', name: 'Чанта „Роза“', art: 'tote', price: 39.90, stock: 5, badge: 'Ново', colors: [C.rose, C.wine, C.mint], accent: '#FBEFF3', bg: '#F7DCE6', desc: 'Просторна тоут чанта с плетено цвете отпред. Побира лаптоп, книга и всичко за деня.' },
  { id: 'luna', cat: 'bags', name: 'Чанта „Луна“', art: 'moon', price: 44.90, stock: 2, colors: [C.wine, C.powder, C.cream], accent: '#F2C9D8', bg: '#F9E6EC', desc: 'Чанта през рамо във форма на полумесец, с капак и плетено копче.' },
  { id: 'kvadrati', cat: 'bags', name: 'Чанта „Квадрати“', art: 'granny', price: 49.90, old: 59.90, badge: 'Намаление', stock: 3, colors: [C.rose, C.mint, C.lilac], accent: '#8C4667', bg: '#E3F7EF', desc: 'Класически плетени квадрати, съшити на ръка. Всяка чанта е уникална комбинация.' },
  { id: 'bonbon', cat: 'bags', name: 'Мини портмоне „Бонбон“', art: 'pouch', price: 19.90, stock: 0, colors: [C.powder, C.mint, C.sky], accent: '#8E2A4E', bg: '#F7DCE6', desc: 'Малко портмоне с цип и сърчице, за монети, слушалки или червило.' },
  { id: 'ema', cat: 'toys', name: 'Зайчето Ема', art: 'bunny', price: 29.90, stock: 4, badge: 'Ново', colors: [C.powder, C.cream, C.mint], accent: '#E58BA8', bg: '#FBEFF3', desc: 'Меко зайче с панделка. Идеален подарък за бебе.' },
  { id: 'bobi', cat: 'toys', name: 'Мечето Боби', art: 'bear', price: 32.90, stock: 1, colors: [C.caramel, C.rose, C.grey], accent: '#E9A6BC', bg: '#F9E6EC', desc: 'Класическо мече за гушкане с бродирано носле.' },
  { id: 'oli', cat: 'toys', name: 'Октоподчето Оли', art: 'octo', price: 24.90, old: 29.90, badge: 'Намаление', stock: 6, colors: [C.mint, C.rose, C.lilac], accent: '#E58BA8', bg: '#E3F7EF', desc: 'Весело октоподче с къдрави пипала и цвете на главата.' },
  { id: 'mimi', cat: 'toys', name: 'Котето Мими', art: 'cat', price: 27.90, stock: 0, colors: [C.grey, C.rose, C.cream], accent: '#E58BA8', bg: '#F7DCE6', desc: 'Котенце с нашийник и звънче, с дълга опашка.' },
  { id: 'sarce', cat: 'keychains', name: 'Ключодържател „Сърчице“', art: 'heart', price: 9.90, stock: 12, colors: [C.wine, C.rose, C.mint], accent: '#F0BFCF', bg: '#F9E6EC', desc: 'Сърчице с усмивка: за ключове, раница или чанта.' },
  { id: 'yagodka', cat: 'keychains', name: 'Ключодържател „Ягодка“', art: 'berry', price: 11.90, stock: 8, badge: 'Ново', colors: [C.red, C.rose], accent: '#7DBF8E', bg: '#FBEFF3', desc: 'Сочна плетена ягодка със семенца.' },
  { id: 'cvete', cat: 'keychains', name: 'Ключодържател „Цвете“', art: 'flower', price: 9.90, stock: 10, colors: [C.mint, C.powder, C.butter], accent: '#F4D58D', bg: '#F7DCE6', desc: 'Усмихнато цвете с шест листенца.' },
  { id: 'gabka', cat: 'keychains', name: 'Ключодържател „Гъбка“', art: 'shroom', price: 10.90, stock: 0, colors: [C.red, C.wine, C.lilac], accent: '#FBF3EA', bg: '#E3F7EF', desc: 'Горска гъбка на точки.' }
];
const CATS = {
  bags: { name: 'Чанти', sub: 'Тоут чанти, през рамо и мини портмонета' },
  toys: { name: 'Играчки', sub: 'Меки амигуруми приятели за гушкане' },
  keychains: { name: 'Ключодържатели', sub: 'Малки плетени талисмани' }
};
const byId = id => PRODUCTS.find(p => p.id === id);

// продадените бройки се пазят, за да се обновява наличността след поръчка
const sold = store('tricote-sold') || {};
PRODUCTS.forEach(p => { p.stock = Math.max(0, p.stock - (sold[p.id] || 0)); });

// ---------- визии (дрехи + чанта) ----------
const LOOKS = [
  { id: 'park', title: 'Пикник в парка', bag: 'roza', bagColor: 2, bg: '#E3F7EF',
    items: ['Бяла памучна тениска', 'Светли дънки с широк крачол', 'Бели кецове', 'Слънчеви очила', 'Чанта „Роза“ в мента'],
    text: 'Лежерна визия за слънчев следобед: неутрални дрехи и цветна плетена чанта, която събира погледите.' },
  { id: 'city', title: 'Вечер в центъра', bag: 'luna', bagColor: 0, bg: '#F9E6EC',
    items: ['Черна рокля с тънки презрамки', 'Обувки с нисък ток', 'Златни обеци', 'Чанта „Луна“ във винено'],
    text: 'Класика с ръчен акцент: винената чанта през рамо прави черната рокля по-топла.' },
  { id: 'sea', title: 'Уикенд на морето', bag: 'kvadrati', bagColor: 0, bg: '#FBEFF3',
    items: ['Риза на райета', 'Ленени шорти', 'Сандали', 'Сламена шапка', 'Чанта „Квадрати“'],
    text: 'Цветните квадрати и ленът са перфектната двойка за разходка по плажа.' }
];
const LOOK_PARTS = {
  park: `
    <path d="M40 40 L62 30 Q80 40 98 30 L120 40 L132 66 L114 72 L112 128 H48 L46 72 L28 66Z" fill="#FFFFFF" stroke="#D9C9CF" stroke-width="2"/>
    <path d="M150 34 H222 L238 196 H200 L188 96 L178 196 H140Z" fill="#9DB9D8" stroke="#6E8FB4" stroke-width="2"/><path d="M150 50 H222" stroke="#6E8FB4" stroke-width="2"/>
    <g transform="translate(36 166)"><path d="M0 22 Q0 0 22 2 L52 8 Q70 12 70 24 V32 H0Z" fill="#fff" stroke="#CBBBC1" stroke-width="2"/><path d="M0 32 H70" stroke="#CBBBC1" stroke-width="5"/></g>
    <g transform="translate(36 208)"><path d="M0 22 Q0 0 22 2 L52 8 Q70 12 70 24 V32 H0Z" fill="#fff" stroke="#CBBBC1" stroke-width="2"/><path d="M0 32 H70" stroke="#CBBBC1" stroke-width="5"/></g>
    <g transform="translate(252 40)"><circle cx="16" cy="14" r="14" fill="#3B0F1F"/><circle cx="52" cy="14" r="14" fill="#3B0F1F"/><path d="M30 12 H38" stroke="#3B0F1F" stroke-width="3"/></g>`,
  city: `
    <path d="M44 30 L54 30 L60 60 Q80 70 100 60 L106 30 L116 30 L118 78 L140 230 H20 L42 78Z" fill="#2A1A20" stroke="#120A0D" stroke-width="2"/>
    <g transform="translate(160 40)"><path d="M0 30 Q6 6 28 4 L46 6 Q50 14 44 18 L22 26 L18 40 H6Z" fill="#3B0F1F"/><path d="M14 40 L16 52" stroke="#3B0F1F" stroke-width="4"/></g>
    <g transform="translate(220 40)"><path d="M0 30 Q6 6 28 4 L46 6 Q50 14 44 18 L22 26 L18 40 H6Z" fill="#3B0F1F"/><path d="M14 40 L16 52" stroke="#3B0F1F" stroke-width="4"/></g>
    <g transform="translate(180 120)"><circle r="9" fill="none" stroke="#D4A84B" stroke-width="4"/><circle cx="34" r="9" fill="none" stroke="#D4A84B" stroke-width="4"/></g>`,
  sea: `
    <path d="M36 34 L64 28 Q80 36 96 28 L124 34 L136 70 L118 74 L118 130 H42 L42 74 L24 70Z" fill="#FFFFFF" stroke="#9DB9D8" stroke-width="2"/>
    ${[44, 56, 68, 80, 92, 104, 116].map(y => `<path d="M${y < 74 ? 30 : 42} ${y} H${y < 74 ? 130 : 118}" stroke="#7FA3CC" stroke-width="5"/>`).join('')}
    <path d="M80 32 V130" stroke="#9DB9D8" stroke-width="1.5"/>
    <path d="M150 140 H230 L236 210 H196 L190 170 L184 210 H144Z" fill="#E8DCC8" stroke="#BFAF95" stroke-width="2"/>
    <g transform="translate(250 30)"><ellipse cx="40" cy="38" rx="44" ry="20" fill="#E9D7A6" stroke="#BFA266" stroke-width="2"/><ellipse cx="40" cy="30" rx="22" ry="16" fill="#EFDFB4" stroke="#BFA266" stroke-width="2"/><path d="M18 34 Q40 42 62 34" stroke="#731943" stroke-width="5" fill="none"/></g>
    <g transform="translate(36 170)"><rect width="56" height="22" rx="11" fill="#C99A73"/><path d="M6 6 H50 M6 16 H50" stroke="#8B6243" stroke-width="3"/></g>
    <g transform="translate(36 206)"><rect width="56" height="22" rx="11" fill="#C99A73"/><path d="M6 6 H50 M6 16 H50" stroke="#8B6243" stroke-width="3"/></g>`
};
const LOOK_BAG_POS = { park: [232, 110], city: [190, 96], sea: [246, 110] };
function lookArt(L) {
  const p = byId(L.bag), { defs, body } = ART[p.art](p.colors[L.bagColor].hex, p.accent);
  const [x, y] = LOOK_BAG_POS[L.id];
  return `<svg viewBox="0 0 360 260" role="img" aria-label="Визия „${esc(L.title)}“: ${esc(L.items.join(', '))}"><defs>${defs}</defs><rect width="360" height="260" fill="${L.bg}"/><path d="M0 230 Q90 214 180 230 T360 226 V260 H0Z" fill="#fff" opacity=".35"/>${LOOK_PARTS[L.id]}<g transform="translate(${x} ${y}) scale(.68)">${body}</g></svg>`;
}

// ---------- състояние ----------
let cart = (store('tricote-cart') || []).filter(i => byId(i.id) && byId(i.id).colors[i.c]);
const reviews = store('tricote-reviews') || {};
const shop = { cat: 'all', q: '', inStock: false, sort: 'featured' };
let curP = null;
const prodView = { color: 0, qty: 1 };
const SHIP = { econt: { name: 'До офис на Еконт', price: 3.50 }, speedy: { name: 'До офис на Спиди', price: 3.50 }, address: { name: 'До адрес', price: 5.50 } };
const FREE_SHIP = 60;

const inCart = id => cart.filter(i => i.id === id).reduce((s, i) => s + i.qty, 0);
const stockLeft = p => p.stock - inCart(p.id);
const subtotal = () => cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
function saveCart() { store('tricote-cart', cart); renderCart(); }

// ---------- общи части: хедър, футър, количка ----------
const NAV = [
  ['shop.html?cat=bags', 'bags', 'Чанти'], ['shop.html?cat=toys', 'toys', 'Играчки'], ['shop.html?cat=keychains', 'keychains', 'Ключодържатели'],
  ['lookbook.html', 'lookbook', 'Визии'], ['custom.html', 'custom', 'Персонализирана поръчка'], ['about.html', 'about', 'За нас'], ['contact.html', 'contact', 'Контакт']
];
const ICON = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>',
  bag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FDF1F5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  yarn: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M5 9q7-3 14 1M4.5 14q8-4 15 1M9 4.5q-3 7 1 15M15 4.5q3 7-1 15"/></svg>',
  gift: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z"/></svg>',
  truck: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>'
};

function renderChrome() {
  const h = $('#site-header');
  if (h) h.outerHTML = `
    <a class="skip" href="#main">Към съдържанието</a>
    <div class="topbar">Ръчно плетено в България · Безплатна доставка над ${FREE_SHIP} €</div>
    <header class="site"><div class="wrap">
      <a class="logo" href="index.html" aria-label="Tricoté — начало"><img src="logo.jpg" alt="Tricoté" width="77" height="84"></a>
      <nav class="main" id="mainNav" aria-label="Основно меню">${NAV.map(([href, key, label]) => `<a href="${href}" data-nav="${key}">${label}</a>`).join('')}</nav>
      <div class="hdr-actions">
        <button class="icon-btn" data-action="search" aria-label="Търсене">${ICON.search}</button>
        <button class="icon-btn" data-action="open-cart" aria-label="Количка">${ICON.bag}<span class="badge-count" id="cartCount" hidden>0</span></button>
        <button class="icon-btn menu-btn" data-action="menu" aria-label="Меню" aria-expanded="false" aria-controls="mainNav">${ICON.menu}</button>
      </div>
    </div></header>`;
  const f = $('#site-footer');
  if (f) f.outerHTML = `
    <footer class="site"><div class="wrap">
      <div class="cols">
        <div class="col"><span class="brand">TRICOTÉ</span><p>Ръчно плетени аксесоари с български произход. Създаден през 2026 г.</p></div>
        <div class="col"><h4>Магазин</h4><a href="shop.html?cat=bags">Чанти</a><a href="shop.html?cat=toys">Играчки</a><a href="shop.html?cat=keychains">Ключодържатели</a><a href="lookbook.html">Визии</a></div>
        <div class="col"><h4>Помощ</h4><a href="custom.html">Персонализирана поръчка</a><a href="shop.html">Наличност</a><a href="contact.html">Доставка и връщане</a><a href="contact.html">Контакт</a></div>
        <div class="col"><h4>Последвайте ни</h4><span>Instagram: [@ПРОФИЛ]</span><span>Имейл: [ИМЕЙЛ]</span><span>Телефон: [ТЕЛЕФОН]</span></div>
      </div>
      <div class="bottom"><span>© 2026 Tricoté. Изплетено на ръка.</span><span>Учебен прототип: поръчките и формите не се изпращат реално.</span></div>
    </div></footer>`;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay" id="overlay" data-action="close-cart"></div>
    <aside class="drawer" id="drawer" aria-label="Количка" aria-hidden="true">
      <header><h2 style="font-size:26px">Количка</h2><button class="icon-btn" data-action="close-cart" aria-label="Затвори количката">${ICON.close}</button></header>
      <div class="items" id="cartItems"></div>
      <footer id="cartFoot"></footer>
    </aside>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`);
  const key = PAGE === 'shop' ? params.get('cat') : PAGE === 'product' ? (byId(params.get('id')) || {}).cat : PAGE;
  $$('nav.main a').forEach(a => { if (a.dataset.nav === key) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); } });
}

function renderCart() {
  const n = cart.reduce((s, i) => s + i.qty, 0);
  const b = $('#cartCount'); if (b) { b.textContent = n; b.hidden = n === 0; }
  const items = $('#cartItems'), foot = $('#cartFoot');
  if (!items) return;
  if (!cart.length) {
    items.innerHTML = `<div class="empty" style="margin-top:20px"><p>Количката е празна.</p><a class="btn sm" style="margin-top:14px" href="shop.html">Към магазина</a></div>`;
    foot.innerHTML = '';
  } else {
    items.innerHTML = cart.map((i, k) => {
      const p = byId(i.id);
      return `<div class="ci">
        <a class="thumb" href="product.html?id=${p.id}">${art(p, i.c)}</a>
        <div class="stack gap8"><h4>${esc(p.name)}</h4><span class="note">${p.colors[i.c].name} · ${money(p.price)}</span>
          <div class="row gap12"><div class="qty" role="group" aria-label="Количество"><button data-action="cqty" data-k="${k}" data-d="-1" aria-label="По-малко">−</button><span>${i.qty}</span><button data-action="cqty" data-k="${k}" data-d="1" aria-label="Повече" ${stockLeft(p) <= 0 ? 'disabled' : ''}>+</button></div><button class="link-btn" data-action="remove" data-k="${k}">Премахни</button></div>
        </div><strong>${money(p.price * i.qty)}</strong></div>`;
    }).join('');
    const sub = subtotal(), need = FREE_SHIP - sub;
    foot.innerHTML = `
      <p class="note" style="color:var(--wine)">${need > 0 ? `Още ${money(need)} до безплатна доставка` : 'Имате безплатна доставка!'}</p>
      <div class="ship-bar"><span style="width:${Math.min(100, sub / FREE_SHIP * 100)}%"></span></div>
      <div class="sumrow total"><span>Междинна сума</span><span>${money(sub)}</span></div>
      <a class="btn block" href="checkout.html">Към поръчката</a>
      <button class="btn ghost block" data-action="close-cart">Продължи пазаруването</button>`;
  }
  renderSummary();
}
function openCart() { $('#drawer').classList.add('open'); $('#overlay').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); setTimeout(() => $('#drawer .icon-btn').focus(), 50); }
function closeCart() { $('#drawer').classList.remove('open'); $('#overlay').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }

function addToCart(id, c, qty) {
  const p = byId(id), left = stockLeft(p);
  if (left <= 0) { toast(`Няма повече налични бройки от ${p.name}`); return; }
  qty = Math.min(qty, left);
  const ex = cart.find(i => i.id === id && i.c === c);
  if (ex) ex.qty += qty; else cart.push({ id, c, qty });
  saveCart();
  toast(`${p.name} е добавен в количката`, true);
}

let toastTimer;
function toast(msg, withCart) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(msg)}</span>${withCart ? '<button data-action="open-cart">Виж количката</button>' : ''}`;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ---------- карти и блокове ----------
function stockLabel(p) {
  if (p.stock === 0) return `<span class="stock out">Изчерпан</span>`;
  if (p.stock === 1) return `<span class="stock low">Последна бройка</span>`;
  if (p.stock <= 3) return `<span class="stock low">Остават ${p.stock} бр.</span>`;
  return `<span class="stock">В наличност</span>`;
}
const priceHTML = p => `<span class="price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ''}</span>`;
function card(p) {
  return `<article class="card ${p.stock === 0 ? 'soldout' : ''}">
    <a class="pic" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">${art(p)}${p.badge ? `<span class="tag">${p.badge}</span>` : ''}${p.stock === 0 ? `<span class="tag out">Изчерпан</span>` : ''}</a>
    <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
    <div class="meta">${priceHTML(p)}${stockLabel(p)}</div>
    ${p.stock > 0
      ? `<button class="btn sm ghost" data-action="quick-add" data-id="${p.id}">Добави в количката</button>`
      : `<a class="btn sm ghost" href="product.html?id=${p.id}">Попитай за наличност</a>`}
  </article>`;
}
function reviewHTML(r, withProduct) {
  const p = byId(r.id);
  return `<figure class="review"><span class="st" role="img" aria-label="${r.stars} от 5 звезди">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span><blockquote>${esc(r.text)}</blockquote><figcaption style="font-weight:700;font-size:15px" class="muted">${esc(r.name)}${withProduct && p ? ` · <a href="product.html?id=${p.id}">${esc(p.name)}</a>` : ''} · ${new Date(r.t).toLocaleDateString('bg-BG')}</figcaption></figure>`;
}
function fillArt() {
  $$('[data-art]').forEach(el => { const p = byId(el.dataset.art); if (p) el.innerHTML = art(p, +(el.dataset.color || 0)); });
}

// ---------- страници ----------
function initHome() {
  const news = $('[data-products="new"]');
  if (news) news.innerHTML = PRODUCTS.filter(p => p.badge).slice(0, 4).map(card).join('');
  const looks = $('[data-looks="teaser"]');
  if (looks) looks.innerHTML = LOOKS.map(L => `<a href="lookbook.html#${L.id}" class="cat"><div class="art">${lookArt(L)}</div><div class="row"><div><h3 style="font-size:22px">${L.title}</h3><p>${esc(byId(L.bag).name)}</p></div><span class="arrow">${ICON.arrow}</span></div></a>`).join('');
  const rev = $('[data-reviews="latest"]');
  if (rev) {
    const all = Object.entries(reviews).flatMap(([id, list]) => list.map(r => ({ ...r, id }))).sort((a, b) => b.t - a.t).slice(0, 3);
    rev.innerHTML = all.length
      ? `<div class="grid g3">${all.map(r => reviewHTML(r, true)).join('')}</div>`
      : `<div class="empty"><p style="font-size:18px">Все още няма отзиви. Купили сте нещо от нас? Оставете отзив на страницата на продукта.</p><a class="btn sm" style="margin-top:16px" href="shop.html">Към продуктите</a></div>`;
  }
}

function initShop() {
  shop.cat = CATS[params.get('cat')] ? params.get('cat') : 'all';
  const title = shop.cat === 'all' ? 'Всички продукти' : CATS[shop.cat].name;
  $('#shopTitle').textContent = title;
  document.title = `${title} | Tricoté`;
  $$('.pills .pill').forEach(a => { if (a.dataset.cat === shop.cat) a.setAttribute('aria-current', 'page'); });
  if (params.has('search')) setTimeout(() => $('#q').focus(), 50);
  renderShopGrid();
}
function renderShopGrid() {
  let list = PRODUCTS.filter(p => shop.cat === 'all' || p.cat === shop.cat);
  const q = shop.q.trim().toLowerCase();
  if (q) list = list.filter(p => (p.name + ' ' + p.desc + ' ' + CATS[p.cat].name).toLowerCase().includes(q));
  if (shop.inStock) list = list.filter(p => p.stock > 0);
  if (shop.sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
  if (shop.sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
  if (shop.sort === 'new') list = [...list].sort((a, b) => (b.badge === 'Ново') - (a.badge === 'Ново'));
  $('#shopGrid').innerHTML = list.length
    ? `<p class="muted" style="margin-bottom:16px">${list.length} ${list.length === 1 ? 'продукт' : 'продукта'}</p><div class="grid g4">${list.map(card).join('')}</div>`
    : `<div class="empty"><p style="font-size:18px">Няма продукти, които отговарят на търсенето.</p><p class="muted" style="margin-top:6px">Опитайте друга дума или <a href="custom.html">поръчайте по ваш избор</a>.</p></div>`;
}

function initProduct() {
  curP = byId(params.get('id'));
  const main = $('#main');
  if (!curP) {
    main.innerHTML = `<section><div class="wrap"><div class="empty"><h1 style="font-size:32px">Продуктът не е намерен</h1><a class="btn" style="margin-top:16px" href="shop.html">Към магазина</a></div></div></section>`;
    return;
  }
  document.title = `${curP.name} | Tricoté`;
  prodView.color = 0; prodView.qty = 1;
  main.innerHTML = viewProduct(curP);
}
function viewProduct(p) {
  const list = reviews[p.id] || [];
  const avg = list.length ? (list.reduce((s, r) => s + r.stars, 0) / list.length).toFixed(1).replace('.', ',') : null;
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  return `<section class="page-top"><div class="wrap">
    <nav class="crumbs" aria-label="Път"><a href="index.html">Начало</a><span aria-hidden="true">›</span><a href="shop.html?cat=${p.cat}">${CATS[p.cat].name}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(p.name)}</span></nav>
    <div class="pd">
      <div class="main-art" id="pArt">${art(p, prodView.color)}</div>
      <div class="stack gap20">
        <div class="row gap8">${p.badge ? `<span class="tag">${p.badge}</span>` : ''}${stockLabel(p)}</div>
        <h1>${esc(p.name)}</h1>
        <div class="row gap12">${priceHTML(p)}${avg ? `<span class="muted">★ ${avg} (${list.length})</span>` : ''}</div>
        <p style="font-size:18px">${esc(p.desc)}</p>
        <div class="stack gap8"><span style="font-weight:600">Цвят: <span id="colorName">${p.colors[prodView.color].name}</span></span>
          <div class="swatches" role="group" aria-label="Цвят">${p.colors.map((c, i) => `<button class="sw" style="background:${c.hex}" aria-label="${c.name}" aria-pressed="${i === prodView.color}" data-action="color" data-i="${i}"></button>`).join('')}</div>
        </div>
        ${p.stock > 0 ? `
        <div class="row gap12">
          <div class="qty" role="group" aria-label="Количество"><button data-action="pqty" data-d="-1" aria-label="По-малко">−</button><span id="pQty">${prodView.qty}</span><button data-action="pqty" data-d="1" aria-label="Повече">+</button></div>
          <button class="btn" style="flex:1" data-action="add">Добави в количката · <span id="pTotal">${money(p.price * prodView.qty)}</span></button>
        </div>
        <p class="note">Изпращаме до 2 работни дни. Искате друг цвят или размер? <a href="custom.html">Персонализирана поръчка</a></p>` : `
        <div class="box stack gap16">
          <div><span class="tag">Изчерпан продукт</span><h2 style="font-size:26px;margin-top:10px">Запитване за наличност</h2><p class="muted" style="margin-top:6px">Ще ви пишем, когато го изплетем отново.</p></div>
          <form data-form="stock" novalidate>
            <div class="fields">
              <label class="f">Имейл<input class="input" type="email" name="email" required autocomplete="email"><span class="err">Въведете валиден имейл.</span></label>
              <label class="f">Брой<input class="input" type="number" name="qty" min="1" value="1" required><span class="err">Поне 1 брой.</span></label>
              <label class="f">Цвят или бележка (по желание)<input class="input" name="note" type="text"></label>
              <button class="btn" type="submit">Изпрати запитване</button>
            </div>
          </form>
        </div>`}
        <ul class="facts">
          <li>${ICON.yarn}Ръчно плетено в България</li>
          <li>${ICON.gift}Опаковано като подарък</li>
          <li>${ICON.truck}Безплатна доставка над ${FREE_SHIP} €</li>
        </ul>
      </div>
    </div>
  </div></section>
  <section class="band" id="reviews"><div class="wrap">
    <div class="grid g2" style="gap:48px;align-items:start">
      <div class="stack gap16">
        <h2 style="font-size:34px">Отзиви ${list.length ? `<span class="muted" style="font-size:20px">(${list.length})</span>` : ''}</h2>
        <div class="stack gap12">${list.length ? list.slice().reverse().map(r => reviewHTML({ ...r, id: p.id })).join('') : `<p class="muted">Все още няма отзиви за този продукт.</p>`}</div>
      </div>
      <form class="box" data-form="review" novalidate>
        <h3 style="font-size:24px;margin-bottom:14px">Оставете отзив или коментар</h3>
        <div class="fields">
          <label class="f">Име<input class="input" name="name" required maxlength="40" autocomplete="name"><span class="err">Въведете име.</span></label>
          <fieldset><legend>Оценка</legend>
            <div class="stars">${[5, 4, 3, 2, 1].map(n => `<input type="radio" name="stars" id="st${n}" value="${n}" ${n === 5 ? 'checked' : ''}><label for="st${n}" title="${n}"><span class="sr">${n} звезди</span>★</label>`).join('')}</div>
          </fieldset>
          <label class="f">Коментар<textarea class="input" name="text" required maxlength="500"></textarea><span class="err">Напишете няколко думи.</span></label>
          <button class="btn" type="submit">Публикувай</button>
        </div>
      </form>
    </div>
  </div></section>
  <section><div class="wrap">
    <div class="sec-head"><h2>Още ${CATS[p.cat].name.toLowerCase()}</h2></div>
    <div class="grid g4">${related.map(card).join('')}</div>
  </div></section>`;
}

function initLookbook() {
  const el = $('[data-looks="all"]');
  el.innerHTML = LOOKS.map(L => {
    const p = byId(L.bag);
    return `<article class="look" id="${L.id}">
      <div class="art">${lookArt(L)}</div>
      <div class="stack gap16">
        <h2 style="font-size:32px">${L.title}</h2>
        <p style="font-size:18px">${L.text}</p>
        <ul>${L.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
        <div class="row gap12">
          ${p.stock > 0 ? `<button class="btn" data-action="add-look" data-id="${p.id}" data-c="${L.bagColor}">Добави чантата · ${money(p.price)}</button>` : ''}
          <a class="btn ghost" href="product.html?id=${p.id}">Виж ${esc(p.name)}</a>
        </div>
      </div>
    </article>`;
  }).join('');
  if (location.hash) { const t = $(location.hash); if (t) setTimeout(() => t.scrollIntoView(), 50); }
}

function initCheckout() {
  if (!cart.length) {
    $('#checkoutWrap').innerHTML = `<div class="empty"><h2 style="font-size:32px">Количката е празна</h2><p class="muted" style="margin:8px 0 18px">Добавете нещо красиво от магазина.</p><a class="btn" href="shop.html">Към магазина</a></div>`;
  }
  renderSummary();
}
function renderSummary() {
  const el = $('#coSummary'); if (!el) return;
  if (!cart.length) { el.innerHTML = ''; return; }
  const shipKey = ($('input[name="ship"]:checked') || {}).value || 'econt';
  const sub = subtotal(), ship = sub >= FREE_SHIP ? 0 : SHIP[shipKey].price;
  el.innerHTML = `<h2 style="font-size:24px">Вашата поръчка</h2>
    ${cart.map(i => { const p = byId(i.id); return `<div class="ci"><div class="thumb">${art(p, i.c)}</div><div><h4>${esc(p.name)}</h4><span class="note">${p.colors[i.c].name} · ${i.qty} бр.</span></div><strong>${money(p.price * i.qty)}</strong></div>`; }).join('')}
    <div class="stack gap8"><div class="sumrow"><span>Продукти</span><span>${money(sub)}</span></div><div class="sumrow"><span>Доставка</span><span>${ship ? money(ship) : 'Безплатна'}</span></div><div class="sumrow total"><span>Общо</span><span>${money(sub + ship)}</span></div></div>`;
}
function orderDoneHTML(o) {
  return `<div class="success stack gap16" style="padding:40px;max-width:760px;margin:0 auto">
    <h1 style="font-size:40px">Благодарим, ${esc(o.name.split(' ')[0])}!</h1>
    <p style="font-size:18px">Поръчка <strong>${o.no}</strong> е приета. Ще получите потвърждение на <strong>${esc(o.email)}</strong>.</p>
    <div class="stack gap8">${o.items.map(i => `<div class="sumrow"><span>${esc(i.name)} (${i.color}) × ${i.qty}</span><span>${money(i.total)}</span></div>`).join('')}
      <div class="sumrow"><span>${o.ship}</span><span>${o.shipPrice ? money(o.shipPrice) : 'Безплатна'}</span></div>
      <div class="sumrow total"><span>Общо · ${o.pay}</span><span>${money(o.total)}</span></div></div>
    <p class="note">Учебен прототип: поръчката не е изпратена реално.</p>
    <div class="row gap12"><a class="btn" href="shop.html">Продължи пазаруването</a><a class="btn ghost" href="index.html">Към началото</a></div>
  </div>`;
}

// ---------- форми ----------
function validate(form) {
  let ok = true;
  $$('[required]', form).forEach(el => {
    let good = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
    if (good && el.type === 'email') good = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
    if (good && el.type === 'tel') good = /^[+\d][\d\s-]{5,}$/.test(el.value.trim());
    if (good && el.type === 'number') good = +el.value >= 1;
    const wrap = el.closest('label.f');
    if (wrap) wrap.classList.toggle('invalid', !good);
    if (el.name === 'terms') $('#termsErr').classList.toggle('show', !good);
    if (!good && ok) { el.focus(); ok = false; }
  });
  return ok;
}
const firstName = s => esc(s.trim().split(' ')[0]);

document.addEventListener('submit', e => {
  const form = e.target, kind = form.dataset.form;
  if (!kind) return;
  e.preventDefault();
  if (!validate(form)) return;
  const d = Object.fromEntries(new FormData(form));

  if (kind === 'newsletter') {
    $('#nlMsg').textContent = `Благодарим! ${d.email} е добавен в клуба на преждата.`;
    form.reset();
  }
  if (kind === 'review') {
    (reviews[curP.id] = reviews[curP.id] || []).push({ name: d.name.trim(), stars: +d.stars, text: d.text.trim(), t: Date.now() });
    store('tricote-reviews', reviews);
    $('#main').innerHTML = viewProduct(curP);
    $('#reviews').scrollIntoView({ behavior: 'smooth' });
    toast('Благодарим за отзива!');
  }
  if (kind === 'stock') {
    form.outerHTML = `<div class="success"><strong>Запитването е прието.</strong><p style="margin-top:6px">Ще пишем на ${esc(d.email)}, когато продуктът е наличен.</p></div>`;
  }
  if (kind === 'custom') {
    $('#customWrap').innerHTML = `<div class="success stack gap12" style="padding:36px"><h2 style="font-size:32px">Благодарим, ${firstName(d.name)}!</h2><p style="font-size:18px">Получихме идеята ви за ${esc(d.kind.toLowerCase())} (${esc(d.color1)}${d.color2 ? ', ' + esc(d.color2) : ''}, ${esc(d.size.toLowerCase())}, ${esc(d.qty)} бр.). Ще се свържем с вас на ${esc(d.email)} или ${esc(d.phone)} с цена и срок.</p><p class="note">Учебен прототип: запитването не е изпратено реално.</p><div class="row gap12"><a class="btn" href="shop.html">Към магазина</a><a class="btn ghost" href="custom.html">Ново запитване</a></div></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (kind === 'contact') {
    $('#contactWrap').innerHTML = `<div class="success stack gap12"><h2 style="font-size:28px">Благодарим, ${firstName(d.name)}!</h2><p>Ще отговорим на ${esc(d.email)} възможно най-скоро.</p><p class="note">Учебен прототип: съобщението не е изпратено реално.</p></div>`;
  }
  if (kind === 'checkout') {
    const sub = subtotal(), ship = sub >= FREE_SHIP ? 0 : SHIP[d.ship].price;
    const order = {
      no: 'TR-' + String(Math.floor(1000 + Math.random() * 9000)), name: d.name, email: d.email.trim(), pay: d.pay,
      ship: SHIP[d.ship].name, shipPrice: ship, total: sub + ship,
      items: cart.map(i => { const p = byId(i.id); sold[p.id] = (sold[p.id] || 0) + i.qty; return { name: p.name, color: p.colors[i.c].name, qty: i.qty, total: p.price * i.qty }; })
    };
    store('tricote-sold', sold);
    cart = []; saveCart();
    $('#checkoutWrap').innerHTML = orderDoneHTML(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

document.addEventListener('input', e => {
  const w = e.target.closest('label.f.invalid'); if (w) w.classList.remove('invalid');
  if (e.target.dataset.shop === 'q') { shop.q = e.target.value; renderShopGrid(); }
});
document.addEventListener('change', e => {
  const k = e.target.dataset.shop;
  if (k === 'inStock') { shop.inStock = e.target.checked; renderShopGrid(); }
  if (k === 'sort') { shop.sort = e.target.value; renderShopGrid(); }
  if (e.target.name === 'ship') { $('#addrLabel').textContent = e.target.value === 'address' ? 'Адрес' : 'Офис на куриера'; renderSummary(); }
  if (e.target.name === 'terms') $('#termsErr').classList.remove('show');
});

// ---------- бутони ----------
document.addEventListener('click', e => {
  const b = e.target.closest('[data-action]'); if (!b) return;
  const a = b.dataset.action;
  if (a === 'open-cart') openCart();
  if (a === 'close-cart') closeCart();
  if (a === 'menu') { const n = $('#mainNav'); n.classList.toggle('open'); b.setAttribute('aria-expanded', n.classList.contains('open')); }
  if (a === 'search') { if (PAGE === 'shop') $('#q').focus(); else location.href = 'shop.html?search=1'; }
  if (a === 'quick-add') { addToCart(b.dataset.id, 0, 1); if (PAGE === 'shop') renderShopGrid(); }
  if (a === 'add-look') addToCart(b.dataset.id, +b.dataset.c, 1);
  if (a === 'add') addToCart(curP.id, prodView.color, prodView.qty);
  if (a === 'color') {
    prodView.color = +b.dataset.i;
    $('#pArt').innerHTML = art(curP, prodView.color);
    $('#colorName').textContent = curP.colors[prodView.color].name;
    $$('.sw').forEach(s => s.setAttribute('aria-pressed', s === b));
  }
  if (a === 'pqty') {
    prodView.qty = Math.max(1, Math.min(Math.max(1, stockLeft(curP)), prodView.qty + +b.dataset.d));
    $('#pQty').textContent = prodView.qty;
    $('#pTotal').textContent = money(curP.price * prodView.qty);
  }
  if (a === 'cqty') {
    const k = +b.dataset.k, i = cart[k];
    i.qty += +b.dataset.d;
    if (i.qty <= 0) cart.splice(k, 1);
    saveCart();
  }
  if (a === 'remove') { cart.splice(+b.dataset.k, 1); saveCart(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

// ---------- старт ----------
renderChrome();
fillArt();
({ home: initHome, shop: initShop, product: initProduct, lookbook: initLookbook, checkout: initCheckout }[PAGE] || (() => {}))();
renderCart();
