const getPlugins = manifestOptions => [
  "gatsby-plugin-sharp",
  "gatsby-transformer-sharp",
  {
    resolve: "gatsby-plugin-manifest",
    options: manifestOptions,
  },
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "images",
      path: "./src/images/",
    },
    __key: "images",
  },
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "pages",
      path: "./src/pages/",
    },
    __key: "pages",
  },
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "content",
      path: "./content/",
    },
    __key: "content",
  },
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      extensions: [`.mdx`, `.md`],
      gatsbyRemarkPlugins: [
        {
          resolve: `gatsby-remark-images`,
          options: {
            // It's important to specify the maxWidth (in pixels) of
            // the content container as this plugin uses this as the
            // base for generating different widths of each image.
            maxWidth: 800,
            backgroundColor: "none",
            disableBgImageOnAlpha: true,
            linkImagesToOriginal: false,
          },
        },
        {
          resolve: `gatsby-remark-autolink-headers`,
          options: {
            icon: `<span>#</span>`,
          },
        },
        {
          resolve: `gatsby-remark-prismjs`,
          options: {
            classPrefix: "language-",
            inlineCodeMarker: "@",
            aliases: {},
            showLineNumbers: false,
            noInlineHighlight: false,
            prompt: {
              user: "hello",
              host: "world",
              global: false,
            },
            escapeEntities: {},
          },
        },
      ],
    },
  },
  "gatsby-plugin-sass",
  "gatsby-plugin-image",
  "gatsby-plugin-react-helmet",
  "gatsby-plugin-sitemap",
]

module.exports = { getPlugins }
