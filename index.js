const fs = require('fs')
const puppeteer = require('puppeteer')

let browser

async function screenshot (url) {
  console.log(url)
  try {
    const page = await browser.newPage()

    page.setDefaultTimeout(10 * 1000)

    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 1
    })

    const result = await page.goto(url)
    if (result.status() === 404) return
  
    const name = new URL(url).hostname
    await page.screenshot({ path: `screenshots/${ name }.png` })
  
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
  console.log(urls.length)

  browser = await puppeteer.launch()

  for (const url of urls) {
    await screenshot(url)
  }

  await browser.close()
}

init()