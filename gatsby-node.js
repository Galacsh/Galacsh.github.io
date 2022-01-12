const path = require("path")
const fs = require("fs")
const { meta } = require("./site-meta")
const { openStdin } = require("process")

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  await createPostsMetaData({ graphql, reporter })

  await createHomePage({ createPage, graphql, reporter })
  await createSearchPage({ createPage, graphql, reporter })
  await createPostPages({ createPage, graphql, reporter })
}

const createHomePage = async ({ createPage, graphql, reporter }) => {
  createPage({
    path: `/`,
    component: path.resolve("src/layouts/home.js"),
  })

  reporter.info("Created home page")
}

const createSearchPage = async ({ createPage, graphql, reporter }) => {
  createPage({
    path: `/search`,
    component: path.resolve("src/layouts/search.js"),
  })

  reporter.info("Created search page")
}

const createPostPages = async ({ createPage, graphql, reporter }) => {
  const { data: retrieved } = await graphql(`
    {
      allMdx(
        sort: { fields: frontmatter___date, order: ASC }
        filter: { frontmatter: { publish: { eq: true } } }
      ) {
        edges {
          node {
            slug
          }
          next {
            slug
          }
          previous {
            slug
          }
        }
      }
    }
  `)

  retrieved.allMdx.edges.forEach(({ node, next, previous }) => {
    createPage({
      path: `/post/${node.slug}`,
      component: path.resolve("src/layouts/post.js"),
      context: {
        prev: previous && previous.slug,
        cur: node && node.slug,
        next: next && next.slug,
      },
    })
  })

  reporter.info("Created post pages")
}

const createPostsMetaData = async ({ graphql, reporter }) => {
  reporter.info("Creating posts meta data")
  reporter.info("Only publishable posts will be collected to posts.json")

  // Fetch all publishable content files.
  const { data: retrieved } = await graphql(`
    {
      allMdx(
        sort: { fields: frontmatter___date, order: DESC }
        filter: { frontmatter: { publish: { eq: true } } }
      ) {
        edges {
          node {
            slug
            frontmatter {
              title
              date(formatString: "MMM DD, YYYY")
              tags
              thumbnail {
                publicURL
              }
            }
          }
        }
      }
    }
  `)

  const posts = retrieved.allMdx.edges.map(({ node }) => {
    let dates = node.frontmatter.date.split(/[\s,]+/)
    return {
      path: `/post/${node.slug}`,
      title: node.frontmatter.title,
      year: dates[2],
      month: dates[0],
      day: dates[1],
      tags: node.frontmatter.tags,
    }
  })
  let allTags = []
  posts.forEach(post => {
    if (post.tags != null && post.tags.length > 0)
      post.tags.forEach(tag => {
        if (tag != null && tag !== "") allTags.push(tag)
      })
  })
  const tags = new Set(allTags)
  const data = {
    count: posts.length,
    posts: posts,
    tags: [...tags],
  }

  fs.writeFileSync(
    path.join(__dirname, "/src/posts.json"),
    JSON.stringify(data),
    err => {
      if (err) {
        console.error(err)
        return
      }
    }
  )

  reporter.info("Created '/src/posts.json' done.")
}
