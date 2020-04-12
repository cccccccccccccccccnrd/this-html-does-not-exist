const url = window.location.hostname === 'localhost' ? 'http://localhost:3737' : 'https://thishtmldoesnotexist.com'
const info = document.querySelector('#info')

document.body.addEventListener('mousemove', (event) => {
  const url = event.target.localName === 'img' ? event.target.attributes['data-url'].value : ''

  info.style.top = `${ event.pageY + 10 }px`
  info.style.left = `${ event.pageX + 10 }px`
  info.innerText = url
})

async function screenshots (from, to) {
  const response = await fetch(`${ url }/api/archive/${ from }-${ to }`)
  const json = await response.json()
  return json.screenshots
}

function insert(files) {
  files.forEach((file) => {
    const element = document.createElement('img')
    element.setAttribute('src', `${ url }/screenshots/${ file }`)
    element.setAttribute('data-url', `${ file.replace('.png', '') }`)
    document.body.appendChild(element)
  })
}

async function init () {
  const imgs = await screenshots(0, 100)
  insert(imgs)
}

init()