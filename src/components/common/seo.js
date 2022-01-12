import * as React from "react"
import { Helmet } from "react-helmet"
import { useSiteMetadata, useSiteIcon, useTheme } from "../../hooks"

const Seo = ({ title, description, image }) => {
  const {
    description: siteDescription,
    pathPrefix,
    title: siteTitle,
    siteUrl,
    language,
  } = useSiteMetadata()
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const iconURL = useSiteIcon()

  const canonicalURL = (siteUrl + pathPrefix).replace(/\/$/, "")
  const representingImageURL = image || iconURL
  const { isDarkMode } = useTheme()

  return (
    <Helmet
      htmlAttributes={{
        lang: language,
      }}
      bodyAttributes={{
        class: isDarkMode ? "dark" : "",
      }}
      title={title || siteTitle}
      titleTemplate={title ? `%s | ${siteTitle}` : "%s"}
      meta={[
        {
          name: `description`,
          content: description || siteDescription,
        },
        {
          property: `og:url`,
          content: canonicalURL + pathname,
        },
        {
          property: `og:title`,
          content: title || siteTitle,
        },
        {
          property: `og:description`,
          content: description || siteDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: canonicalURL + representingImageURL,
        },
      ]}
    />
  )
}

export default Seo
