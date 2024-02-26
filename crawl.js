const { JSDOM } = require("jsdom")

async function crawlPage(baseURL, currentURL, pages) {
  const baseUrlObj = new URL(baseURL)
  const currentUrlObj = new URL(currentURL)

  if (baseUrlObj.hostname !== currentUrlObj.hostname) {
    return pages
  }

  const normalizedCurrentUrl = normalizeUrl(currentURL)
  if (pages[normalizedCurrentUrl] > 0) {
    pages[normalizedCurrentUrl]++
    return pages
  }

  pages[normalizedCurrentUrl] = 1

  console.log(`Actively crawling: ${currentURL}`)

  try {
    const resp = await fetch(currentURL)

    if (resp.status > 399) {
      console.log(
        `Error in fetch with status code: ${resp.status}, on page: ${currentURL}`
      )
      return pages
    }

    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content type: ${contentType}, on page: ${currentURL}`
      )
      return pages
    }

    const htmlBody = await resp.text()
    const nextURLs = getUrlsFromHtml(htmlBody, baseURL)

    for (const nextUrl of nextURLs) {
      pages = await crawlPage(baseURL, nextUrl, pages)
    }
  } catch (error) {
    console.log(`Error in fetch: ${error.message}, on page: ${currentURL}`)
  }

  return pages
}

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

function normalizeUrl(urlString) {
  const urlObj = new URL(urlString)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`

  if (hostPath && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1)
  }

  return hostPath
}

module.exports = {
  crawlPage,
  getUrlsFromHtml,
  normalizeUrl
}
