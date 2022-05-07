import React from "react"
import PostsList from "../common/posts-list"

const SearchResult = ({ posts }) => {
  return (
    <div className={"pb-65"}>
      <h2 className="mx-10 post-list-title">검색 결과</h2>
      <PostsList posts={posts} />
    </div>
  )
}

export default SearchResult
