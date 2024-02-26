/**
 *
 * @param {string} urlString
 * @returns {string}
 */
function urlNormalize(urlString) {
  const urlObj = new URL(urlString)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`

  if (hostPath && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1)
  }

  return hostPath
}

module.exports = {
  urlNormalize
}
