const fs = require('fs')
const path = require('path')
const JSzip = require('jszip')

const zip = new JSzip()

const files = fs.readdirSync(path.resolve(__dirname, 'dist'))
for (const file of files) {
  const fileBuffer = fs.readFileSync(path.resolve(__dirname, 'dist', file))
  zip.file(file, fileBuffer)
}

const staticFolder = zip.folder('static')
const staticFiles = fs.readdirSync(path.resolve(__dirname, '../static'))
for (const file of staticFiles) {
  const fileBuffer = fs.readFileSync(
    path.resolve(__dirname, '..', 'static', file)
  )
  staticFolder.file(file, fileBuffer)
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
    console.log('create readydocs.plugin')
  })
