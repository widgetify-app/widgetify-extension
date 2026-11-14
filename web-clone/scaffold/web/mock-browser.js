;(function () {
  var KEY = 'mock_ext_storage_v1'
  var params = new URLSearchParams(location.search)
  if (params.has('reset')) localStorage.removeItem(KEY)
  var data = {}
  try { data = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) {}
  var seeded = data.__seeded
  if (!seeded) {
    var theme = params.get('theme') || 'glass'
    data = {
      __seeded: true,
      theme: theme,
      wallpaper: { id: 'd120b22d-882a-47e9-b3d8-af9620fcdc70', type: 'IMAGE', src: 'https://cdn.widgetify.ir/wallpapers/d120b22d-882a-47e9-b3d8-af9620fcdc70/c6dbc73d-f79f-42e5-8211-d4f923145c59.jpeg', isCustom: true },
      customWallpaper: { id: 'd120b22d-882a-47e9-b3d8-af9620fcdc70', name: 'wp', type: 'IMAGE', src: 'https://cdn.widgetify.ir/wallpapers/d120b22d-882a-47e9-b3d8-af9620fcdc70/c6dbc73d-f79f-42e5-8211-d4f923145c59.jpeg', previewSrc: 'https://cdn.widgetify.ir/wallpapers/d120b22d-882a-47e9-b3d8-af9620fcdc70/c6dbc73d-f79f-42e5-8211-d4f923145c59.jpeg', isCustom: true },
      hasSeenTour: true,
      showWelcomeModal: false,
      hasShownPwaModal: true,
      lastVersion: 'آبنبات چوبی',
    }
    localStorage.setItem(KEY, JSON.stringify(data))
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(data)) } catch (e) {} }
  var listeners = []
  var areaListeners = []
  function area(name) {
    return {
      get: function (keys, cb) {
        var out = {}
        if (keys == null) out = JSON.parse(JSON.stringify(data))
        else {
          var list = typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : Object.keys(keys)
          list.forEach(function (k) {
            if (k in data) out[k] = JSON.parse(JSON.stringify(data[k]))
            else if (keys && typeof keys === 'object' && !Array.isArray(keys)) out[k] = keys[k]
          })
        }
        if (cb) { cb(out); return }
        return Promise.resolve(out)
      },
      set: function (items, cb) {
        var changes = {}
        Object.keys(items).forEach(function (k) {
          changes[k] = { oldValue: data[k], newValue: items[k] }
          data[k] = JSON.parse(JSON.stringify(items[k]))
        })
        persist()
        listeners.forEach(function (l) { l(changes, name) })
        areaListeners.forEach(function (l) { l(changes) })
        if (cb) cb()
        return Promise.resolve()
      },
      remove: function (keys, cb) {
        var list = typeof keys === 'string' ? [keys] : keys
        list.forEach(function (k) { delete data[k] })
        persist()
        if (cb) cb()
        return Promise.resolve()
      },
      clear: function (cb) { data = {}; persist(); if (cb) cb(); return Promise.resolve() },
      getBytesInUse: function () { return Promise.resolve(0) },
      onChanged: { addListener: function (l) { areaListeners.push(l) }, removeListener: function (l) { areaListeners = areaListeners.filter(function (x) { return x !== l }) }, hasListener: function () { return false } },
    }
  }
  function ev() {
    return { addListener: function () {}, removeListener: function () {}, hasListener: function () { return false } }
  }
  var local = area('local')
  var chromeMock = {
    runtime: {
      id: 'mock-widgetify-extension',
      getURL: function (p) { return (p.charAt(0) === '/' ? '' : '/') + p },
      getManifest: function () { return { version: '2.0.19', name: 'Widgetify' } },
      sendMessage: function () { return Promise.resolve(undefined) },
      onMessage: ev(), onInstalled: ev(), onConnect: ev(),
      lastError: undefined,
    },
    storage: {
      local: local, sync: area('sync'), session: area('session'), managed: area('managed'),
      onChanged: { addListener: function (l) { listeners.push(l) }, removeListener: function (l) { listeners = listeners.filter(function (x) { return x !== l }) }, hasListener: function () { return false } },
    },
    permissions: {
      contains: function () { return Promise.resolve(false) },
      request: function () { return Promise.resolve(false) },
      remove: function () { return Promise.resolve(false) },
      onAdded: ev(), onRemoved: ev(),
    },
    tabs: {
      create: function (o) { if (o && o.url) window.open(o.url, '_blank'); return Promise.resolve({}) },
      query: function () { return Promise.resolve([]) },
      update: function () { return Promise.resolve({}) },
      onUpdated: ev(), onRemoved: ev(),
    },
    windows: {
      create: function () { return Promise.resolve({ id: 1 }) },
      update: function () { return Promise.resolve({}) },
      remove: function () { return Promise.resolve() },
      onRemoved: ev(),
    },
    bookmarks: { getTree: function () { return Promise.resolve([]) } },
    search: { query: function () { return Promise.resolve() }, Disposition: { CURRENT_TAB: 'CURRENT_TAB', NEW_TAB: 'NEW_TAB' } },
    identity: { launchWebAuthFlow: function () { return Promise.reject(new Error('mock')) }, getRedirectURL: function () { return location.origin + '/' } },
    i18n: { getMessage: function () { return '' }, getUILanguage: function () { return 'fa' } },
  }
  window.chrome = chromeMock
  window.browser = chromeMock
})()
