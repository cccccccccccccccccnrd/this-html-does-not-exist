const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express()

app.use('/archive', express.static(path.join(__dirname, 'archive')))
app.use('/screenshots', express.static(path.join(__dirname, '../scraper/screenshots')))

app.get('/api', (req, res) => {
  const files = fs
    .readdirSync('../scraper/screenshots', { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((file) => file.name)
    .filter((name) => name.endsWith('.png'))

  res.json({
    screenshots: files,
    length: files.length
  })
})

app.listen(3000, () => console.log(`http://localhost:3000`))