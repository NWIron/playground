async function fetchJson(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function initList() {
  const container = document.getElementById('list')
  try {
    const devices = await fetchJson('/api/devices')
    if (!Array.isArray(devices)) { container.textContent = '无设备' ; return }
    const ul = document.createElement('ul')
    devices.forEach(d => {
      const li = document.createElement('li')
      const a = document.createElement('a')
      a.href = `/device.html?id=${encodeURIComponent(d.id)}`
      a.textContent = `${d.name} — ${d.model}`
      li.appendChild(a)
      ul.appendChild(li)
    })
    container.innerHTML = ''
    container.appendChild(ul)
  } catch (e) {
    container.textContent = '加载失败：' + e.message
  }
}

function getQueryParam(name) {
  const u = new URL(location.href)
  return u.searchParams.get(name)
}

async function initDetail() {
  const container = document.getElementById('detail')
  const id = getQueryParam('id')
  if (!id) { container.textContent = '无效的设备 ID'; return }
  try {
    const device = await fetchJson(`/api/devices?id=${encodeURIComponent(id)}`)
    if (!device) { container.textContent = '设备未找到'; return }
    container.innerHTML = `
      <h2>${escapeHtml(device.name)}</h2>
      <p><strong>型号:</strong> ${escapeHtml(device.model)}</p>
      <p><strong>状态:</strong> ${escapeHtml(device.status)}</p>
      <p><strong>位置:</strong> ${escapeHtml(device.location)}</p>
    `
  } catch (e) {
    container.textContent = '加载失败：' + e.message
  }
}

function escapeHtml(s){ if (s==null) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]) }

window.fetchJson = fetchJson
window.initList = initList
window.initDetail = initDetail
