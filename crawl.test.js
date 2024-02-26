const { getUrlsFromHtml, normalizeUrl } = require("./crawl.js")
const { test, expect } = require("@jest/globals")

test("normalizeUrl strip protocol", () => {
  const input = "https://blog.boot.dev/path"
  const actual = normalizeUrl(input)
  const expected = "blog.boot.dev/path"

  expect(actual).toEqual(expected)
})

test("normalizeUrl strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/"
  const actual = normalizeUrl(input)
  const expected = "blog.boot.dev/path"

  expect(actual).toEqual(expected)
})

test("normalizeUrl capitals", () => {
  const input = "https://BLOG.boot.dev/path/"
  const actual = normalizeUrl(input)
  const expected = "blog.boot.dev/path"

  expect(actual).toEqual(expected)
})

test("normalizeUrl strip http", () => {
  const input = "http://blog.boot.dev/path"
  const actual = normalizeUrl(input)
  const expected = "blog.boot.dev/path"

  expect(actual).toEqual(expected)
})

test("getUrlsFromHtml absolute", () => {
  const inputHtmlBody = `
    <html>
      <body>
        <a href="https://blog.boot.dev/path/">
          Boot.dev Blog
        </a>
      </body>
    </html>
  `
  const inputBaseUrl = "https://blog.boot.dev/path/"
  const actual = getUrlsFromHtml(inputHtmlBody, inputBaseUrl)
  const expected = ["https://blog.boot.dev/path/"]

  expect(actual).toEqual(expected)
})

test("getUrlsFromHtml relative", () => {
  const inputHtmlBody = `
    <html>
      <body>
        <a href="/path/">
          Boot.dev Blog
        </a>
      </body>
    </html>
  `
  const inputBaseUrl = "https://blog.boot.dev"
  const actual = getUrlsFromHtml(inputHtmlBody, inputBaseUrl)
  const expected = ["https://blog.boot.dev/path/"]

  expect(actual).toEqual(expected)
})

test("getUrlsFromHtml both", () => {
  const inputHtmlBody = `
    <html>
      <body>
        <a href="https://blog.boot.dev/path1/">
          Boot.dev Blog path one
        </a>
        <a href="/path2/">
          Boot.dev Blog path two
        </a>
      </body>
    </html>
  `
  const inputBaseUrl = "https://blog.boot.dev"
  const actual = getUrlsFromHtml(inputHtmlBody, inputBaseUrl)
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/"
  ]

  expect(actual).toEqual(expected)
})

test("getUrlsFromHtml invalid", () => {
  const inputHtmlBody = `
    <html>
      <body>
        <a href="invalid">
          Invalid URL
        </a>
      </body>
    </html>
  `
  const inputBaseUrl = "https://blog.boot.dev"
  const actual = getUrlsFromHtml(inputHtmlBody, inputBaseUrl)
  const expected = []

  expect(actual).toEqual(expected)
})
