import { useStaticQuery, graphql } from "gatsby";

/**
 * @returns {string} publicURL
 */
export const useSiteIcon = () => {
  const { file } = useStaticQuery(graphql`
    query SiteIcon {
      file(name: { eq: "icon" }) {
        publicURL
      }
    }
  `);

  return file?.publicURL;
};
