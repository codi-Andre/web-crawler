const { JSDOM } = require("jsdom")

function getUrlsFromHtml(htmlBody, baseUrl) {
  const urls = []

  const dom = new JSDOM(htmlBody)
  const linkElements = dom.window.document.querySelectorAll("a")

  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      try {
        const urlObj = new URL(`${baseUrl}${linkElement.href}`)
        urls.push(urlObj.href)
      } catch (error) {
        console.log(`error with relative url: ${error.message}`)
      }
    } else {
      try {
        const urlObj = new URL(linkElement.href)
        urls.push(urlObj.href)
      } catch (error) {
        console.log(`error with absolute url: ${error.message}`)
      }
    }
  }

  return urls
}

function urlNormalize(urlString) {
  const urlObj = new URL(urlString)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`

  if (hostPath && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1)
  }

  return hostPath
}

module.exports = {
  getUrlsFromHtml,
  urlNormalize
}
