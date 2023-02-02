const fs = require('fs')
const path = require('path')
const JSzip = require('jszip')

const zip = new JSzip()

const files = fs.readdirSync(path.resolve(__dirname, 'dist'))
for (const file of files) {
  zip.file(path.basename(file), file)
}

const static = zip.folder('static')
const staticFiles = fs.readdirSync(path.resolve(__dirname, '../static'))
for (const file of staticFiles) {
  static.file(path.basename(file), file)
}

const config = fs.readFileSync('../config.json')

zip.file('config.json', config)

zip
  .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
  .pipe(fs.createWriteStream('../readydocs.zip'))
  .on('finish', () => {
    const archive = fs.readFileSync('../readydocs.zip')

    fs.writeFileSync('../readydocs.plugin', archive)
    fs.unlinkSync('../readydocs.zip')
    console.log('\x1b[42m', 'create readydocs.plugin', '\x1b[0m')
  })
