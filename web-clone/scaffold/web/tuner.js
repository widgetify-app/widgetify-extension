(function () {
  var KEYS = ['--glass-bg', '--glass-filter', '--glass-modal-bg', '--glass-modal-filter', '--color-raised', '--glass-sheen', '--glass-edge']
  var NAMES = ['tint', 'modalTint', 'blur', 'modalBlur', 'saturate', 'brightness', 'sheen', 'rimTop', 'rimSide', 'rimBottom', 'shadow', 'raised']
  var RANGES = [
    ['tint', 'Widget tint', 0, 0.9, 0.01],
    ['modalTint', 'Modal tint', 0, 0.95, 0.01],
    ['blur', 'Widget blur (px)', 0, 50, 1],
    ['modalBlur', 'Modal blur (px)', 0, 70, 1],
    ['saturate', 'Saturate (%)', 100, 260, 5],
    ['brightness', 'Brightness (%)', 80, 130, 1],
    ['sheen', 'Sheen (top-left)', 0, 0.5, 0.01],
    ['rimTop', 'Rim top', 0, 0.9, 0.01],
    ['rimSide', 'Rim sides', 0, 0.6, 0.01],
    ['rimBottom', 'Rim bottom', 0, 0.5, 0.01],
    ['shadow', 'Drop shadow', 0, 0.6, 0.01],
    ['raised', 'Raised pill', 0, 0.6, 0.01]
  ]
  var PROFILES = {
    icy: { rgb: '20, 20, 24', mid: 0.25, d: { tint: 0.02, modalTint: 0.12, blur: 5, modalBlur: 11, saturate: 190, brightness: 95, sheen: 0.18, rimTop: 0.2, rimSide: 0, rimBottom: 0.06, shadow: 0, raised: 0.26 } },
    glass: { rgb: '23, 23, 23', mid: 0.2, d: { tint: 0.55, modalTint: 0.72, blur: 22, modalBlur: 36, saturate: 160, brightness: 100, sheen: 0.1, rimTop: 0.28, rimSide: 0.12, rimBottom: 0.06, shadow: 0.2, raised: 0.22 } }
  }
  var root = document.documentElement
  var theme = null
  var v = {}
  var panel = null

  function key() { return 'glass_tuner_' + theme }

  function css() {
    var p = PROFILES[theme]
    var edge = 'inset 0 1px 0 rgba(255, 255, 255, ' + v.rimTop + '), inset 0 -1px 0 rgba(255, 255, 255, ' + v.rimBottom + '), inset 1px 0 0 rgba(255, 255, 255, ' + v.rimSide + '), inset -1px 0 0 rgba(255, 255, 255, ' + v.rimSide + '), 0 8px 24px rgba(0, 0, 0, ' + v.shadow + ')'
    var sheen = 'linear-gradient(135deg, rgba(255, 255, 255, ' + v.sheen + ') 0%, rgba(255, 255, 255, ' + (v.sheen * p.mid).toFixed(3) + ') 35%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, ' + (v.sheen * 0.5).toFixed(3) + ') 100%)'
    return {
      '--glass-bg': 'rgba(' + p.rgb + ', ' + v.tint + ')',
      '--glass-filter': 'blur(' + v.blur + 'px) saturate(' + v.saturate + '%) brightness(' + v.brightness + '%)',
      '--glass-modal-bg': 'rgba(' + p.rgb + ', ' + v.modalTint + ')',
      '--glass-modal-filter': 'blur(' + v.modalBlur + 'px) saturate(' + v.saturate + '%)',
      '--color-raised': 'rgba(255, 255, 255, ' + v.raised + ')',
      '--glass-sheen': sheen,
      '--glass-edge': edge
    }
  }

  function apply() {
    var c = css()
    KEYS.forEach(function (k) { root.style.setProperty(k, c[k]) })
    try { localStorage.setItem(key(), JSON.stringify(v)) } catch (e) {}
  }

  function clear() {
    KEYS.forEach(function (k) { root.style.removeProperty(k) })
  }

  function result() {
    var c = css()
    return '/* theme: ' + theme + ' */\n' + KEYS.map(function (k) { return '\t' + k + ': ' + c[k] + ';' }).join('\n')
  }

  function destroy() {
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel)
    panel = null
  }

  function build() {
    destroy()
    var p = document.createElement('div')
    panel = p
    p.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:2147483647;width:250px;max-height:86vh;overflow:auto;background:rgba(10,10,14,.92);color:#fff;font:12px/1.3 sans-serif;padding:8px;border-radius:10px;direction:ltr;box-shadow:0 4px 20px rgba(0,0,0,.5)'
    var head = document.createElement('div')
    head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-weight:700'
    head.innerHTML = '<span>Glass tuner · ' + theme + '</span>'
    var toggle = document.createElement('button')
    toggle.textContent = '–'
    toggle.style.cssText = 'background:#333;color:#fff;border:0;border-radius:4px;padding:0 8px;cursor:pointer'
    head.appendChild(toggle)
    p.appendChild(head)
    var body = document.createElement('div')
    p.appendChild(body)
    RANGES.forEach(function (d) {
      var row = document.createElement('label')
      row.style.cssText = 'display:block;margin:5px 0'
      var t = document.createElement('div')
      t.style.cssText = 'display:flex;justify-content:space-between'
      var n = document.createElement('span'); n.textContent = d[1]
      var o = document.createElement('span'); o.textContent = v[d[0]]
      t.appendChild(n); t.appendChild(o)
      var r = document.createElement('input')
      r.type = 'range'; r.min = d[2]; r.max = d[3]; r.step = d[4]; r.value = v[d[0]]
      r.style.cssText = 'width:100%'
      r.oninput = function () { v[d[0]] = parseFloat(r.value); o.textContent = r.value; apply() }
      row.appendChild(t); row.appendChild(r)
      body.appendChild(row)
    })
    var btns = document.createElement('div')
    btns.style.cssText = 'display:flex;gap:6px;margin-top:8px'
    var res = document.createElement('button')
    res.textContent = 'Result'
    var reset = document.createElement('button')
    reset.textContent = 'Reset'
    ;[res, reset].forEach(function (b) { b.style.cssText = 'flex:1;background:#536dfe;color:#fff;border:0;border-radius:6px;padding:6px;cursor:pointer;font-weight:700' })
    reset.style.background = '#444'
    btns.appendChild(res); btns.appendChild(reset)
    body.appendChild(btns)
    var ta = document.createElement('textarea')
    ta.readOnly = true
    ta.style.cssText = 'display:none;width:100%;height:170px;margin-top:6px;background:#000;color:#9fe;border:1px solid #444;border-radius:6px;font:10px/1.3 monospace;direction:ltr'
    body.appendChild(ta)
    var note = document.createElement('div')
    note.style.cssText = 'margin-top:4px;color:#aaa'
    body.appendChild(note)
    res.onclick = function () {
      ta.value = result()
      ta.style.display = 'block'
      ta.select()
      var ok = false
      try { ok = document.execCommand('copy') } catch (e) {}
      if (!ok && navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () { note.textContent = 'Copied' })
      note.textContent = ok ? 'Copied to clipboard' : 'Select all and copy'
    }
    reset.onclick = function () {
      try { localStorage.removeItem(key()) } catch (e) {}
      load()
    }
    var open = true
    toggle.onclick = function () { open = !open; body.style.display = open ? 'block' : 'none'; toggle.textContent = open ? '–' : '+' }
    document.body.appendChild(p)
  }

  function load() {
    v = {}
    NAMES.forEach(function (n) { v[n] = PROFILES[theme].d[n] })
    try { Object.assign(v, JSON.parse(localStorage.getItem(key()) || '{}')) } catch (e) {}
    apply()
    build()
  }

  function sync() {
    var next = root.getAttribute('data-theme')
    if (!PROFILES[next]) next = null
    if (next === theme) return
    theme = next
    if (!theme) { clear(); destroy(); return }
    load()
  }

  function start() {
    sync()
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] })
  }

  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start)
})()
