import { useStaticQuery, graphql } from "gatsby"

/**
 * @returns {object} title, author, siteUrl, language, pathPrefix, description
 */
export const useSiteMetadata = () => {
  const { site } = useStaticQuery(graphql`
    query SiteMetadata {
      site {
        siteMetadata {
          title
          author
          siteUrl
          language
          pathPrefix
          description
        }
      }
    }
  `)

  return site?.siteMetadata
}
