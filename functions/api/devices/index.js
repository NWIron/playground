export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const q = url.searchParams.get('q')
  const status = url.searchParams.get('status')
  const location = url.searchParams.get('location')
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '20', 10) || 20)
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0)

  try {
    if (id) {
      const { results } = await env.D1.prepare('SELECT * FROM devices WHERE id = ?').bind(id).all()
      const row = results && results[0] ? results[0] : null
      if (!row) return new Response(JSON.stringify(null), { status: 404, headers: { 'Content-Type': 'application/json' } })
      return new Response(JSON.stringify(row), { headers: { 'Content-Type': 'application/json' } })
    }

    // Build dynamic WHERE clause for filters/search
    const where = []
    const binds = []
    if (q) {
      where.push('(name LIKE ? OR model LIKE ? OR json_extract(metadata, "$.serial") LIKE ?)')
      const like = `%${q}%`
      binds.push(like, like, like)
    }
    if (status) {
      where.push('status = ?')
      binds.push(status)
    }
    if (location) {
      where.push('location = ?')
      binds.push(location)
    }

    const whereClause = where.length ? (' WHERE ' + where.join(' AND ')) : ''

    // total count for pagination
    const countSql = `SELECT COUNT(*) AS total FROM devices${whereClause}`
    const countStmt = env.D1.prepare(countSql)
    const countRes = await (binds.length ? countStmt.bind(...binds).all() : countStmt.all())
    const total = (countRes && countRes.results && countRes.results[0] && countRes.results[0].total) ? countRes.results[0].total : 0

    const listSql = `SELECT * FROM devices${whereClause} ORDER BY name LIMIT ? OFFSET ?`
    const listStmt = env.D1.prepare(listSql)
    const listBinds = binds.slice() // copy
    listBinds.push(limit, offset)
    const listRes = await listStmt.bind(...listBinds).all()
    const items = listRes && listRes.results ? listRes.results : []

    return new Response(JSON.stringify({ items, meta: { total, limit, offset } }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
