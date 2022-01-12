import React from "react"
import PostsList from "../common/posts-list"
import allPosts from "../../posts.json"

const AllPosts = () => {
  return (
    <div className="py-50 mb-65">
      <h1 className="text-15 mx-10 pb-0 ma-0 mb-10 post-list-title">
        All posts
      </h1>
      <PostsList posts={allPosts.posts} />
    </div>
  )
}

export default AllPosts
