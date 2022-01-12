const { meta } = require("./site-meta")
const { getPlugins } = require("./site-plugins")
const { getManifestOptions } = require("./site-manifest")

const manifestOptions = getManifestOptions(meta)
const plugins = getPlugins(manifestOptions)

module.exports = {
  siteMetadata: meta,
  pathPrefix: meta.pathPrefix || "/",
  plugins,
}
