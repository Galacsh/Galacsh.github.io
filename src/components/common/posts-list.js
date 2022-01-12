import React from "react"
import { navigate } from "gatsby"

const PostItem = ({ post }) => (
  <div className="post-item row" onClick={() => navigate(post.path)}>
    <div className="pa-10 row justify-content-center align-items-center font-400">
      {post.month} {post.day}
    </div>
    <div className="col justify-content-center flex-1 font-700">
      {post.title}
    </div>
  </div>
)

const PostsList = ({ posts }) => {
  if (posts == null || posts.length === 0)
    return <div className="px-10 ma-0 post-list">No posts yet</div>
  else {
    let year = null

    return (
      <div className="ma-0 post-list">
        {posts.map((post, idx) => {
          if (year === post.year)
            return <PostItem post={post} key={"post-" + idx}></PostItem>
          else {
            year = post.year
            return (
              <div key={"post-" + idx}>
                <h2 className="text-10 font-700 mt-20 mb-10 mx-10 post-year">
                  {post.year}
                </h2>
                <PostItem post={post}></PostItem>
              </div>
            )
          }
        })}
      </div>
    )
  }
}

export default PostsList
