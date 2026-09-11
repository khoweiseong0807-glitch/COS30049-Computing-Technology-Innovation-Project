/* Run in Figma: Plugins → Development → Import plugin from manifest */
const rgb = (h) => {
  const n = parseInt(h.replace('#', ''), 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}
const paint = (h) => [{ type: 'SOLID', color: rgb(h) }]

const BG = '#07111f'
const PANEL = '#102033'
const LINE = '#24364d'
const TEXT = '#d7e0ea'
const MUTED = '#8ea0b5'
const GOLD = '#d4a017'
const INK = '#f4efe4'
const BLUE = '#3d8bfd'
const RED = '#e4572e'
const TEAL = '#2ec4b6'
const PURPLE = '#c77dff'
const GREY = '#8b9bb4'

const R = { family: 'Inter', style: 'Regular' }
const M = { family: 'Inter', style: 'Medium' }
const SB = { family: 'Inter', style: 'Semi Bold' }

function txt(characters, fontSize, color, fontName, opts) {
  const t = figma.createText()
  t.fontName = fontName || R
  t.fontSize = fontSize
  t.characters = characters
  t.fills = paint(color)
  if (opts && opts.name) t.name = opts.name
  return t
}

function al(name, mode, extra) {
  const f = figma.createFrame()
  f.name = name
  f.layoutMode = mode
  f.primaryAxisSizingMode = 'AUTO'
  f.counterAxisSizingMode = 'AUTO'
  f.fills = []
  f.itemSpacing = 8
  if (!extra) return f
  const w = extra.width
  const h = extra.height
  const rest = Object.assign({}, extra)
  delete rest.width
  delete rest.height
  delete rest.layoutWrap
  delete rest.layoutSizingHorizontal
  delete rest.layoutSizingVertical
  Object.assign(f, rest)
  if (w || h) f.resize(w || f.width || 100, h || f.height || 100)
  return f
}

function fillX(node) {
  try {
    node.layoutSizingHorizontal = 'FILL'
  } catch (e) {}
  return node
}

function pill(label, on) {
  const f = al('Nav / ' + label, 'HORIZONTAL', {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
    cornerRadius: 999,
    fills: paint(on ? GOLD : PANEL),
    strokes: paint(on ? GOLD : LINE),
    strokeWeight: 1,
    itemSpacing: 0,
    counterAxisAlignItems: 'CENTER',
  })
  f.appendChild(txt(label, 13, on ? BG : TEXT, M, { name: 'Label' }))
  return f
}

function btn(label, ghost) {
  const f = al('Button / ' + label, 'HORIZONTAL', {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    cornerRadius: 8,
    fills: paint(ghost ? BG : GOLD),
    strokes: paint(ghost ? LINE : GOLD),
    strokeWeight: 1,
    itemSpacing: 0,
    counterAxisAlignItems: 'CENTER',
  })
  f.appendChild(txt(label, 14, ghost ? INK : BG, SB, { name: 'Label' }))
  return f
}

function header() {
  const row = al('Header', 'HORIZONTAL', {
    primaryAxisAlignItems: 'SPACE_BETWEEN',
    counterAxisAlignItems: 'CENTER',
    paddingTop: 8,
    paddingBottom: 8,
  })
  const brand = al('Brand', 'HORIZONTAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER' })
  const mark = al('Mark', 'HORIZONTAL', {
    fills: paint(GOLD),
    cornerRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 10,
    paddingBottom: 10,
    primaryAxisAlignItems: 'CENTER',
    counterAxisAlignItems: 'CENTER',
  })
  mark.appendChild(txt('JPJ', 11, BG, SB))
  const names = al('Brand text', 'VERTICAL', { itemSpacing: 2 })
  names.appendChild(txt('JPJ Insight', 16, INK, SB))
  names.appendChild(txt('For owners and officers', 11, MUTED, R))
  brand.appendChild(mark)
  brand.appendChild(names)
  const actions = al('Header actions', 'HORIZONTAL', { itemSpacing: 8, counterAxisAlignItems: 'CENTER' })
  actions.appendChild(btn('Dashboard', true))
  actions.appendChild(btn('Log in', true))
  actions.appendChild(btn('Get started', false))
  row.appendChild(brand)
  row.appendChild(actions)
  return row
}

function nav(active) {
  const row = al('Dash nav', 'HORIZONTAL', { itemSpacing: 8, paddingTop: 4, paddingBottom: 8 })
  ;['Home', 'Vehicle types', 'Mix', 'Income', 'States', 'Outlook', 'Energy'].forEach((label) => {
    row.appendChild(pill(label, label === active))
  })
  return row
}

function hero(eyebrow, title, lede) {
  const f = al('Hero', 'VERTICAL', { itemSpacing: 10, paddingTop: 8, paddingBottom: 8 })
  f.appendChild(txt(eyebrow.toUpperCase(), 11, MUTED, M, { name: 'Eyebrow' }))
  const h = txt(title, 36, INK, SB, { name: 'Title' })
  h.name = 'Title'
  f.appendChild(h)
  const p = txt(lede, 15, MUTED, R, { name: 'Lede' })
  p.textAutoResize = 'HEIGHT'
  f.appendChild(p)
  return f
}

function panel(name) {
  return al(name, 'VERTICAL', {
    itemSpacing: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
    paddingBottom: 18,
    cornerRadius: 12,
    fills: paint(PANEL),
    strokes: paint(LINE),
    strokeWeight: 1,
  })
}

function stat(title, value, note) {
  const f = panel('Stat / ' + title)
  f.appendChild(txt(title, 12, MUTED, R, { name: 'Title' }))
  f.appendChild(txt(value, 26, INK, SB, { name: 'Value' }))
  f.appendChild(txt(note, 12, MUTED, R, { name: 'Note' }))
  return f
}

function field(label, value) {
  const f = al('Field / ' + label, 'VERTICAL', { itemSpacing: 6, layoutSizingHorizontal: 'FILL' })
  f.appendChild(txt(label, 12, MUTED, M))
  const box = al('Value', 'HORIZONTAL', {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
    cornerRadius: 8,
    fills: paint(BG),
    strokes: paint(LINE),
    strokeWeight: 1,
    layoutSizingHorizontal: 'FILL',
  })
  box.appendChild(txt(value, 14, INK, R, { name: 'Value' }))
  f.appendChild(box)
  return f
}

function swatch(color, label) {
  const row = al('Legend / ' + label, 'HORIZONTAL', { itemSpacing: 6, counterAxisAlignItems: 'CENTER' })
  const d = figma.createRectangle()
  d.name = 'Swatch'
  d.resize(10, 10)
  d.cornerRadius = 2
  d.fills = paint(color)
  row.appendChild(d)
  row.appendChild(txt(label, 12, TEXT, R))
  return row
}

function bar(label, value, color, max, height) {
  const col = al('Bar / ' + label, 'VERTICAL', { itemSpacing: 6, counterAxisAlignItems: 'CENTER' })
  col.appendChild(txt(value, 11, INK, M))
  const h = Math.max(4, Math.round((parseFloat(value) / max) * height))
  const r = figma.createRectangle()
  r.name = label
  r.resize(40, h)
  r.cornerRadius = 4
  r.fills = paint(color)
  col.appendChild(r)
  col.appendChild(txt(label, 11, MUTED, R))
  return col
}

function lineChart() {
  const svg =
    '<svg width="640" height="240" viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg">' +
    '<line x1="48" y1="24" x2="48" y2="200" stroke="#24364d"/>' +
    '<line x1="48" y1="200" x2="620" y2="200" stroke="#24364d"/>' +
    '<line x1="48" y1="112" x2="620" y2="112" stroke="#24364d" stroke-dasharray="4 4"/>' +
    '<text x="8" y="28" fill="#8ea0b5" font-size="11">862k</text>' +
    '<text x="8" y="116" fill="#8ea0b5" font-size="11">431k</text>' +
    '<text x="20" y="204" fill="#8ea0b5" font-size="11">0</text>' +
    '<text x="40" y="228" fill="#8ea0b5" font-size="11">2023</text>' +
    '<text x="310" y="228" fill="#8ea0b5" font-size="11">2024</text>' +
    '<text x="580" y="228" fill="#8ea0b5" font-size="11">2025</text>' +
    '<polyline fill="none" stroke="#d4a017" stroke-width="3" points="48,52 334,40 612,24"/>' +
    '<polyline fill="none" stroke="#3d8bfd" stroke-width="3" points="48,96 334,90 612,82"/>' +
    '<polyline fill="none" stroke="#e4572e" stroke-width="3" points="48,188 334,190 612,192"/>' +
    '<circle cx="48" cy="52" r="4" fill="#d4a017"/>' +
    '<circle cx="334" cy="40" r="4" fill="#d4a017"/>' +
    '<circle cx="612" cy="24" r="4" fill="#d4a017"/>' +
    '<circle cx="48" cy="96" r="4" fill="#3d8bfd"/>' +
    '<circle cx="334" cy="90" r="4" fill="#3d8bfd"/>' +
    '<circle cx="612" cy="82" r="4" fill="#3d8bfd"/>' +
    '</svg>'
  const node = figma.createNodeFromSvg(svg)
  node.name = 'Line chart'
  return node
}

function mixBars() {
  const row = al('Bar chart', 'HORIZONTAL', {
    itemSpacing: 16,
    counterAxisAlignItems: 'MAX',
    paddingTop: 8,
    paddingBottom: 8,
  })
  ;[
    ['Motorcar', '862k', GOLD, 862],
    ['Motorcycle', '704k', BLUE, 862],
    ['Goods', '35k', RED, 862],
    ['Bus', '1k', TEAL, 862],
    ['Hire', '6k', PURPLE, 862],
    ['Other', '21k', GREY, 862],
  ].forEach((item) => row.appendChild(bar(item[0], item[1], item[2], item[3], 160)))
  return row
}

function donut() {
  const svg =
    '<svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="110" cy="110" r="72" fill="none" stroke="#d4a017" stroke-width="22" stroke-dasharray="239 452" transform="rotate(-90 110 110)"/>' +
    '<circle cx="110" cy="110" r="72" fill="none" stroke="#3d8bfd" stroke-width="22" stroke-dasharray="195 452" stroke-dashoffset="-239" transform="rotate(-90 110 110)"/>' +
    '<circle cx="110" cy="110" r="72" fill="none" stroke="#e4572e" stroke-width="22" stroke-dasharray="10 452" stroke-dashoffset="-434" transform="rotate(-90 110 110)"/>' +
    '</svg>'
  const node = figma.createNodeFromSvg(svg)
  node.name = 'Donut'
  return node
}

function pageFrame(name) {
  const f = al(name, 'VERTICAL', {
    itemSpacing: 16,
    paddingLeft: 72,
    paddingRight: 72,
    paddingTop: 24,
    paddingBottom: 40,
    fills: paint(BG),
  })
  f.resize(1440, 200)
  f.layoutSizingHorizontal = 'FIXED'
  f.primaryAxisSizingMode = 'AUTO'
  f.counterAxisSizingMode = 'AUTO'
  f.clipsContent = false
  return f
}

function footer() {
  return txt('COS30049 prototype · Not an official JPJ website', 11, MUTED, R, { name: 'Footer' })
}

function hub() {
  const page = pageFrame('Hub')
  page.appendChild(header())
  page.appendChild(nav('Home'))
  const h = hero(
    'Dashboard · Malaysian vehicle registration',
    'See the numbers and the charts',
    'Line chart, bars, and donut for MOT 2025. Use the gold buttons for more chart pages and filters.',
  )
  const actions = al('Hero actions', 'HORIZONTAL', { itemSpacing: 10 })
  actions.appendChild(btn('Open vehicle types', false))
  actions.appendChild(btn('Open mix', true))
  h.appendChild(actions)
  page.appendChild(h)
  const stats = al('Stat grid', 'HORIZONTAL', { itemSpacing: 12 })
  ;[
    ['New registrations, 2025', '1,629,389', '+3.8% vs 2024'],
    ['Motorcar', '861,515', '52.9% of 2025'],
    ['Motorcycle', '704,251', '43.2% of 2025'],
    ['Goods', '35,414', '2.2% of 2025'],
  ].forEach((s) => {
    const card = stat(s[0], s[1], s[2])
    fillX(card)
    stats.appendChild(card)
  })
  fillX(stats)
  page.appendChild(stats)

  const charts = al('Charts', 'HORIZONTAL', { itemSpacing: 16 })
  const left = panel('Panel / Vehicle types')
  fillX(left)
  left.appendChild(txt('Vehicle types · 2023–2025', 18, INK, SB))
  left.appendChild(lineChart())
  const legend = al('Legend', 'HORIZONTAL', { itemSpacing: 16 })
  legend.appendChild(swatch(GOLD, 'Motorcar'))
  legend.appendChild(swatch(BLUE, 'Motorcycle'))
  legend.appendChild(swatch(RED, 'Goods vehicle'))
  left.appendChild(legend)
  left.appendChild(btn('Open with filters', true))

  const right = panel('Panel / 2025 mix')
  right.resize(420, 100)
  right.layoutSizingHorizontal = 'FIXED'
  right.primaryAxisSizingMode = 'AUTO'
  right.appendChild(txt('2025 mix', 18, INK, SB))
  right.appendChild(mixBars())
  const donutWrap = al('Donut wrap', 'VERTICAL', { itemSpacing: 8, counterAxisAlignItems: 'CENTER' })
  donutWrap.appendChild(donut())
  donutWrap.appendChild(txt('1,629,389', 20, INK, SB, { name: 'Donut total' }))
  donutWrap.appendChild(txt('Total new units in 2025', 12, MUTED, R))
  right.appendChild(donutWrap)
  right.appendChild(btn('Open mix page', true))

  charts.appendChild(left)
  charts.appendChild(right)
  fillX(charts)
  page.appendChild(charts)

  const grid = al('Portal grid', 'VERTICAL', { itemSpacing: 12 })
  const row1 = al('Portal row 1', 'HORIZONTAL', { itemSpacing: 12 })
  const row2 = al('Portal row 2', 'HORIZONTAL', { itemSpacing: 12 })
  ;[
    ['Line chart', 'Vehicle types over time', 'Multi-line chart of motorcar, motorcycle, and goods. Filter by year and category.'],
    ['Bar + donut', 'Registration mix', 'See the share as bars and a donut. Filter by year and search a class.'],
    ['Income filter', 'Income bands', 'Split MOT counts by B40, M40, and T20 as a prototype sketch.'],
    ['State bars', 'States', 'Motokar vs motosikal by state. Filter Peninsula or East Malaysia.'],
    ['Forecast', 'Outlook', 'Baseline 2026–2028 forecast from the 2023–2025 totals.'],
    ['Energy', 'Energy sketch', 'Litres, kWh, and CO₂ envelope for the new-vehicle mix.'],
  ].forEach((p) => {
    const card = panel('Portal / ' + p[1])
    card.resize(620, 100)
    card.layoutSizingHorizontal = 'FIXED'
    card.primaryAxisSizingMode = 'AUTO'
    card.appendChild(txt(p[0], 12, GOLD, M, { name: 'Kicker' }))
    card.appendChild(txt(p[1], 18, INK, SB, { name: 'Title' }))
    const copy = txt(p[2], 13, MUTED, R, { name: 'Copy' })
    copy.textAutoResize = 'HEIGHT'
    copy.layoutSizingHorizontal = 'FILL'
    card.appendChild(copy)
    card.appendChild(btn('Open this page', false))
    if (row1.children.length < 3) row1.appendChild(card)
    else row2.appendChild(card)
  })
  grid.appendChild(row1)
  grid.appendChild(row2)
  page.appendChild(grid)
  page.appendChild(footer())
  return page
}

function typesPage() {
  const page = pageFrame('Vehicle types')
  page.appendChild(header())
  page.appendChild(nav('Vehicle types'))
  page.appendChild(
    hero(
      'Vehicle types',
      'Registration of vehicle types',
      'Multi-line chart of new MOT registrations, 2023–2025. Pick a category to isolate one class.',
    ),
  )
  const filters = panel('Filters')
  fillX(filters)
  filters.layoutMode = 'HORIZONTAL'
  filters.itemSpacing = 16
  const y = field('Year highlight', 'Show all years')
  const c = field('Vehicle category', 'Motorcar, motorcycle, goods')
  fillX(y)
  fillX(c)
  filters.appendChild(y)
  filters.appendChild(c)
  page.appendChild(filters)
  const chart = panel('Panel / Count by year')
  fillX(chart)
  chart.appendChild(txt('Count by year', 18, INK, SB))
  chart.appendChild(lineChart())
  const legend = al('Legend', 'HORIZONTAL', { itemSpacing: 16 })
  legend.appendChild(swatch(GOLD, 'Motorcar'))
  legend.appendChild(swatch(BLUE, 'Motorcycle'))
  legend.appendChild(swatch(RED, 'Goods vehicle'))
  chart.appendChild(legend)
  page.appendChild(chart)
  page.appendChild(footer())
  return page
}

function mixPage() {
  const page = pageFrame('Mix')
  page.appendChild(header())
  page.appendChild(nav('Mix'))
  page.appendChild(
    hero('Mix', 'Registration mix', 'Bar chart and donut for one year. Search a class name in Malay or English.'),
  )
  const filters = panel('Filters')
  fillX(filters)
  filters.layoutMode = 'HORIZONTAL'
  filters.itemSpacing = 16
  const y = field('Year', '2025')
  const s = field('Search class', 'Motosikal, goods…')
  fillX(y)
  fillX(s)
  filters.appendChild(y)
  filters.appendChild(s)
  page.appendChild(filters)
  const split = al('Charts', 'HORIZONTAL', { itemSpacing: 16 })
  const bars = panel('Panel / Bar chart')
  fillX(bars)
  bars.appendChild(txt('Bar chart · 2025', 18, INK, SB))
  bars.appendChild(mixBars())
  const d = panel('Panel / Donut')
  d.layoutSizingHorizontal = 'FIXED'
  d.resize(420, 100)
  d.primaryAxisSizingMode = 'AUTO'
  d.counterAxisAlignItems = 'CENTER'
  d.appendChild(txt('Donut · share', 18, INK, SB))
  d.appendChild(donut())
  d.appendChild(txt('1,629,389', 22, INK, SB, { name: 'Donut total' }))
  d.appendChild(txt('Total new units in 2025', 12, MUTED, R))
  split.appendChild(bars)
  split.appendChild(d)
  fillX(split)
  page.appendChild(split)
  const result = panel('Result')
  fillX(result)
  result.appendChild(txt('Result', 18, INK, SB))
  ;[
    ['Motorcar · Motokar', '861,515 (52.9%)'],
    ['Motorcycle · Motosikal', '704,251 (43.2%)'],
    ['Goods vehicle · Kenderaan barang', '35,414 (2.2%)'],
    ['Bus · Bas', '1,221 (0.1%)'],
    ['Hire & taxi · Kereta sewa / teksi', '5,998 (0.4%)'],
    ['Other · Lain-lain', '20,990 (1.3%)'],
  ].forEach((row) => {
    const r = al('Row / ' + row[0], 'HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', paddingTop: 8, paddingBottom: 8 })
    fillX(r)
    r.appendChild(txt(row[0], 14, INK, R, { name: 'Class' }))
    r.appendChild(txt(row[1], 14, TEXT, M, { name: 'Count' }))
    result.appendChild(r)
  })
  page.appendChild(result)
  page.appendChild(footer())
  return page
}

function incomePage() {
  const page = pageFrame('Income')
  page.appendChild(header())
  page.appendChild(nav('Income'))
  page.appendChild(
    hero(
      'Income',
      'Income band filter',
      'B40 / M40 / T20 splits MOT class counts as a sketch so you can compare bands. This is not official household-income data from JPJ.',
    ),
  )
  const filters = panel('Filters')
  fillX(filters)
  filters.layoutMode = 'HORIZONTAL'
  filters.itemSpacing = 16
  const y = field('Year', '2025')
  const i = field('Income', 'All bands')
  fillX(y)
  fillX(i)
  filters.appendChild(y)
  filters.appendChild(i)
  page.appendChild(filters)
  const chart = panel('Panel / 2025 all bands')
  fillX(chart)
  chart.appendChild(txt('2025 · All bands · 1,629,389 units', 18, INK, SB))
  const row = al('Bars', 'HORIZONTAL', { itemSpacing: 28, counterAxisAlignItems: 'MAX' })
  ;[
    ['Motorcar', '862k', GOLD],
    ['Motorcycle', '704k', BLUE],
    ['Goods', '35k', RED],
    ['Bus', '1k', TEAL],
  ].forEach((b) => row.appendChild(bar(b[0], b[1], b[2], 862, 220)))
  chart.appendChild(row)
  page.appendChild(chart)
  page.appendChild(footer())
  return page
}

function statesPage() {
  const page = pageFrame('States')
  page.appendChild(header())
  page.appendChild(nav('States'))
  page.appendChild(
    hero(
      'States',
      'Motokar and motosikal by state',
      'Illustrative state split. Filter Peninsula vs East Malaysia, then focus on cars, motorcycles, or both.',
    ),
  )
  const filters = panel('Filters')
  fillX(filters)
  filters.layoutMode = 'HORIZONTAL'
  filters.itemSpacing = 16
  const r = field('Region', 'All states')
  const s = field('Show', 'Cars and motorcycles')
  fillX(r)
  fillX(s)
  filters.appendChild(r)
  filters.appendChild(s)
  page.appendChild(filters)
  const chart = panel('State bars')
  fillX(chart)
  chart.appendChild(txt('State bars', 18, INK, SB))
  const data = [
    ['Selangor', 198400, 142200],
    ['W.P. Kuala Lumpur', 96800, 48100],
    ['Johor', 112600, 98400],
    ['Pulau Pinang', 64200, 71800],
    ['Perak', 58100, 67300],
    ['Sarawak', 51400, 44900],
    ['Sabah', 47200, 52600],
    ['Kedah', 41800, 58700],
    ['Negeri Sembilan', 32400, 29100],
    ['Pahang', 31900, 33400],
    ['Melaka', 28700, 24800],
    ['Kelantan', 24100, 41200],
    ['Terengganu', 21600, 32900],
    ['Perlis', 6400, 8100],
    ['W.P. Labuan', 3200, 2400],
    ['W.P. Putrajaya', 4800, 1100],
  ]
  const max = 198400 + 142200
  data.forEach((d) => {
    const row = al('State / ' + d[0], 'HORIZONTAL', { itemSpacing: 12, counterAxisAlignItems: 'CENTER' })
    fillX(row)
    const name = txt(d[0], 12, TEXT, R, { name: 'State' })
    name.resize(160, 16)
    name.textAutoResize = 'NONE'
    row.appendChild(name)
    const track = al('Bar', 'HORIZONTAL', { itemSpacing: 0, counterAxisAlignItems: 'CENTER' })
    const car = figma.createRectangle()
    car.name = 'Motokar'
    car.resize(Math.max(4, (d[1] / max) * 520), 14)
    car.fills = paint(GOLD)
    const bike = figma.createRectangle()
    bike.name = 'Motosikal'
    bike.resize(Math.max(4, (d[2] / max) * 520), 14)
    bike.fills = paint(BLUE)
    track.appendChild(car)
    track.appendChild(bike)
    row.appendChild(track)
    row.appendChild(txt(d[1].toLocaleString('en-MY') + ' / ' + d[2].toLocaleString('en-MY'), 12, MUTED, M, { name: 'Counts' }))
    chart.appendChild(row)
  })
  const legend = al('Legend', 'HORIZONTAL', { itemSpacing: 16, paddingTop: 8 })
  legend.appendChild(swatch(GOLD, 'Motokar'))
  legend.appendChild(swatch(BLUE, 'Motosikal'))
  chart.appendChild(legend)
  page.appendChild(chart)
  page.appendChild(footer())
  return page
}

function outlookPage() {
  const page = pageFrame('Outlook')
  page.appendChild(header())
  page.appendChild(nav('Outlook'))
  page.appendChild(
    hero(
      'Outlook',
      'Where registrations are heading',
      'Linear regression on 2023–2025 MOT totals. A prototype baseline — not a causal forecast.',
    ),
  )
  const chart = panel('National new registrations')
  fillX(chart)
  chart.appendChild(txt('National new registrations', 18, INK, SB))
  const svg =
    '<svg width="1100" height="220" viewBox="0 0 1100 220" xmlns="http://www.w3.org/2000/svg">' +
    '<polyline fill="none" stroke="#d4a017" stroke-width="3" points="80,90 360,70 640,48"/>' +
    '<circle cx="80" cy="90" r="5" fill="#d4a017"/>' +
    '<circle cx="360" cy="70" r="5" fill="#d4a017"/>' +
    '<circle cx="640" cy="48" r="5" fill="#d4a017"/>' +
    '</svg>'
  chart.appendChild(figma.createNodeFromSvg(svg))
  const bars = al('Forecast bars', 'HORIZONTAL', { itemSpacing: 24, counterAxisAlignItems: 'MAX', paddingTop: 12 })
  ;[
    ['2023', '1.53M', GOLD, false],
    ['2024', '1.57M', GOLD, false],
    ['2025', '1.63M', GOLD, false],
    ['2026*', '1.67M', BLUE, true],
    ['2027*', '1.72M', BLUE, true],
    ['2028*', '1.77M', BLUE, true],
  ].forEach((b) => {
    const col = al('Year / ' + b[0], 'VERTICAL', { itemSpacing: 6, counterAxisAlignItems: 'CENTER' })
    col.appendChild(txt(b[1], 12, INK, M))
    const r = figma.createRectangle()
    r.name = b[0]
    r.resize(56, 40 + (parseFloat(b[1]) - 1.5) * 280)
    r.cornerRadius = 4
    r.fills = paint(b[2])
    if (b[3]) r.opacity = 0.7
    col.appendChild(r)
    col.appendChild(txt(b[0], 12, MUTED, R))
    bars.appendChild(col)
  })
  chart.appendChild(bars)
  chart.appendChild(txt('* Predicted · ordinary least squares on three annual points.', 12, MUTED, R))
  page.appendChild(chart)
  page.appendChild(footer())
  return page
}

function energyPage() {
  const page = pageFrame('Energy')
  page.appendChild(header())
  page.appendChild(nav('Energy'))
  page.appendChild(
    hero(
      'Energy',
      'Energy sketch for the new-vehicle mix',
      'Count × default kilometres × intensity. Filter the year and which energy measure to plot.',
    ),
  )
  const filters = panel('Filters')
  fillX(filters)
  filters.layoutMode = 'HORIZONTAL'
  filters.itemSpacing = 16
  const y = field('Year', '2025')
  const m = field('Chart measure', 'Million litres')
  fillX(y)
  fillX(m)
  filters.appendChild(y)
  filters.appendChild(m)
  page.appendChild(filters)
  const chart = panel('Million litres · 2025')
  fillX(chart)
  chart.appendChild(txt('Million litres · 2025', 18, INK, SB))
  const row = al('Bars', 'HORIZONTAL', { itemSpacing: 18, counterAxisAlignItems: 'MAX' })
  ;[
    ['Motorcycle', '133', BLUE],
    ['Motorcar petrol', '960', GOLD],
    ['Motorcar hybrid', '57', '#e6c35c'],
    ['Motorcar EV', '0', GREY],
    ['Goods diesel', '133', RED],
    ['Bus diesel', '19', TEAL],
    ['Hire petrol', '19', PURPLE],
    ['Other diesel', '32', GREY],
  ].forEach((b) => row.appendChild(bar(b[0], b[1], b[2], 960, 200)))
  chart.appendChild(row)
  page.appendChild(chart)
  page.appendChild(footer())
  return page
}

async function run() {
  await figma.loadFontAsync(R)
  await figma.loadFontAsync(M)
  await figma.loadFontAsync(SB)
  figma.currentPage.name = 'Dashboard · Editable'
  const screens = [hub(), typesPage(), mixPage(), incomePage(), statesPage(), outlookPage(), energyPage()]
  screens.forEach((s, i) => {
    s.x = i * 1600
    s.y = 0
  })
  figma.currentPage.selection = [screens[0]]
  figma.viewport.scrollAndZoomIntoView([screens[0]])
  figma.closePlugin('Done. Double-click any word or number to edit. This is not a photo.')
}

figma.showUI(__html__, { width: 340, height: 180 })
figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'build') return
  try {
    await run()
  } catch (err) {
    figma.ui.postMessage({ type: 'error', text: String(err && err.message ? err.message : err) })
  }
}
