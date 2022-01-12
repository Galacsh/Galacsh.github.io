import React from "react"
import Seo from "../components/common/seo"

import AppContainer from "../components/common/app-container"
import MainContainer from "../components/common/main-container"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Footer from "../components/common/footer"
import FastScrollButton from "../components/common/fast-scroll-button"
import ToggleThemeButton from "../components/common/toggle-theme-button"
import QuickNavigationButton from "../components/common/quick-navigation-button"
import ScrollIndicator from "../components/common/scroll-indicator"

import PostMeta from "../components/post/post-meta"
import TableOfContents from "../components/post/table-of-contents"
import PrevNextButton from "../components/post/prev-next-button"
import Divider from "../components/common/divider"

const PostLayout = ({ data, pageContext }) => {
  const content = data?.cur
  const prev = data?.prev
  const next = data?.next

  return (
    <>
      <Seo
        title={content?.frontmatter?.title}
        description={content?.excerpt}
      ></Seo>
      <AppContainer>
        <TableOfContents items={content?.tableOfContents?.items} />
        <MainContainer>
          <PostMeta meta={content?.frontmatter} />
          {content?.body && (
            <div className="document">
              <MDXProvider>
                <MDXRenderer>{content.body}</MDXRenderer>
              </MDXProvider>
            </div>
          )}

          <Divider className={"mt-100 mb-10"} />
          <PrevNextButton prev={prev} next={next} />
        </MainContainer>

        <Footer />
        <FastScrollButton />
        <ToggleThemeButton />
        <ScrollIndicator />
        <QuickNavigationButton />
      </AppContainer>
    </>
  )
}

export const data = graphql`
  query getPost($prev: String, $cur: String, $next: String) {
    cur: mdx(slug: { eq: $cur }) {
      slug
      frontmatter {
        title
        date(formatString: "MMM DD, yyyy")
        thumbnail {
          publicURL
        }
        tags
      }
      body
      tableOfContents
      excerpt(truncate: true, pruneLength: 100)
    }
    prev: mdx(slug: { eq: $prev }) {
      slug
      frontmatter {
        title
      }
    }
    next: mdx(slug: { eq: $next }) {
      slug
      frontmatter {
        title
      }
    }
  }
`

export default PostLayout
