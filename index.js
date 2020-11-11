const express = require('express')
const app = express()
const port = process.env.PORT || 3131
var fs = require('fs');
const pdfer = require('./pdf-from-html')

app.use(express.json())

app.get('/test', (req, res) => {
  (async () => {
    try {
      var data = fs.readFileSync('./test.html', 'utf8');
      const buffer = await pdfer(data.toString())
      res.setHeader('Content-Disposition', `attachment; filename="test.pdf"`)
      res.setHeader('Content-Type', 'application/pdf')
      res.send(buffer)
    } catch (e) {
      console.log('Error:', e.stack);
    }
  })()
})

app.post('/create-pdf', (req, res) => {
  const html = req.body.html
  const filename = req.body.filename
  const pdfOptions = req.body.pdfOptions
  ;(async () => {
    console.log('pdfing', html)
    const buffer = await pdfer(html, pdfOptions)
    console.log('pdfed')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Type', 'application/pdf')
    res.send(buffer)
  })()
})

app.listen(port, () => console.log(`app listening on port ${port}!`))