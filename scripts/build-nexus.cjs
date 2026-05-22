const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '../public/nexus')
const dst = path.join(__dirname, '../dist')
const token = process.env.VITE_GITHUB_TOKEN || ''

fs.mkdirSync(dst, { recursive: true })

for (const file of fs.readdirSync(src)) {
  const srcPath = path.join(src, file)
  const content = fs.readFileSync(srcPath, 'utf-8')

  if (file === 'GitHub Nexus.html') {
    const injected = content.replace(
      "window.__GH_TOKEN__ = '';",
      `window.__GH_TOKEN__ = '${token}';`
    )
    fs.writeFileSync(path.join(dst, 'index.html'), injected, 'utf-8')
    console.log('  index.html (token injected)')
  } else {
    fs.writeFileSync(path.join(dst, file), content, 'utf-8')
    console.log(' ', file)
  }
}

console.log('\nBuild complete → dist/')
