import React from "react"
import allPosts from "../../posts.json"

const AboutPosts = () => {
  const count = allPosts?.count || 0
  const firstPost = allPosts?.posts[count - 1]

  return (
    <div className={"about-posts mx-10 ma-0 pt-100 mb-20"}>
      <h1 className={"ma-0 pa-0 mb-10"}>Posts</h1>
      <p className={"ma-0 pa-0"}>
        I've been writing posts since{" "}
        <strong>{firstPost?.year || "????"}</strong>. Since there are{" "}
        <strong>{count} posts</strong> to read, you could use Search bar and
        Tags to filter out posts.
      </p>
    </div>
  )
}

export default AboutPosts
