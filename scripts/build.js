const fs = require('fs')
const path = require('path')

const srcRoot = process.cwd()
const outRoot = path.join(srcRoot, 'dist')

async function rmrf(dir) {
  return fs.promises.rm(dir, { recursive: true, force: true })
}

async function copy(src, dest) {
  const stat = await fs.promises.stat(src)
  if (stat.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true })
    const entries = await fs.promises.readdir(src)
    for (const e of entries) {
      await copy(path.join(src, e), path.join(dest, e))
    }
  } else {
    await fs.promises.mkdir(path.dirname(dest), { recursive: true })
    await fs.promises.copyFile(src, dest)
  }
}

async function main() {
  await rmrf(outRoot)
  await fs.promises.mkdir(outRoot, { recursive: true })

  const items = ['index.html', 'device.html', 'static', 'functions', 'db', 'wrangler.toml']
  for (const item of items) {
    const src = path.join(srcRoot, item)
    if (!fs.existsSync(src)) continue
    const dest = path.join(outRoot, path.basename(item))
    await copy(src, dest)
  }

  console.log('Build complete. Output in', outRoot)
}

main().catch(err => { console.error(err); process.exit(1) })
