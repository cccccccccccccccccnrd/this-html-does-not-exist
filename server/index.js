const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express()

app.use('/archive', express.static(path.join(__dirname, 'archive')))
app.use('/screenshots', express.static(path.join(__dirname, '../scraper/screenshots')))

app.get('/api/archive/:from-:to', (req, res) => {
  const from = req.params.from || 0
  const to = req.params.to || 100

  const limit = 100

  if (to - from > limit) {
    return res
      .status(403)
      .json({ 
      code: 403,
      message: `Exceeded range limit. Range limit is ${ limit }.`,
      limit: limit
    })
  }

  const files = fs
    .readdirSync('../scraper/screenshots', { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((file) => file.name)
    .filter((name) => name.endsWith('.png'))
    .slice(from, to)

  res.json({
    screenshots: files,
    length: files.length
  })
})

app.listen(3737, () => console.log(`http://localhost:3737`))
