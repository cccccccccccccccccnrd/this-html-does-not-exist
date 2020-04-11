const fs = require('fs')
const puppeteer = require('puppeteer')

let browser

async function screenshot (url) {
  console.log(url)
  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 1
    })

    page.on('response', (response) => {
      console.log(response['_url'], response['_status'])
    })
    await page.goto(url)
  
    const name = new URL(url).hostname
    await page.screenshot({ path: `screenshots/${ name }.png` })
  
    await page.close()
  } catch(error) {
    console.log(error)
  }
}

async function getUrls () {
  const text = fs.readFileSync('urls.txt', 'utf8')
  return text.split('\n').slice(0, 4)
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