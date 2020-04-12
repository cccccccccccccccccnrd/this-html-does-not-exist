require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer')
const db = require('monk')(`${ process.env.DB_USER }:${ process.env.DB_PASS }@${ process.env.DB_HOST }/this-html-does-not-exist`)
const urls = db.get('urls')

let browser

function store(entry) {
  urls
    .insert(entry)
    .then((docs) => {
      console.log('stored')
    })
    .catch((error) => {
      console.log(error)
    })
}

async function screenshot (url) {
  try {
    const page = await browser.newPage()

    page.setDefaultTimeout(10 * 1000)

    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 1
    })

    const result = await page.goto(url)
    if (result.status() !== 200) {
      await page.close()
      return
    }
  
    const hostname = new URL(url).hostname
    const filename = `${ hostname }-${ Date.now() }`
    await page.screenshot({ path: `screenshots/${ filename }.png` })

    const html = await page.evaluate(() => document.body.innerHTML)

    store({
      url: url,
      html: html,
      screenshot: `${ filename }.png`
    })
  
    await page.close()
  } catch(error) {
    console.log(error)
  }
}

async function getUrls () {
  const text = fs.readFileSync('urls.txt', 'utf8')
  return text.split('\n')
}

async function init () {
  const urls = await getUrls()
  const start = Date.now()
  browser = await puppeteer.launch()

  for (const url of urls) {
    const since = Math.floor((Date.now() - start) / 1000 / 60)
    console.log(since, urls.indexOf(url), url)
    await screenshot(url)
  }

  await browser.close()
}

init()