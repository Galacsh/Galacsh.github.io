import React from "react"
import allPosts from "../../posts.json"

const AboutPosts = () => {
  const count = allPosts?.count || 0
  const firstPost = allPosts?.posts[count - 1]

  return (
    <div className={"about-posts mx-10 ma-0 pt-100 mb-20"}>
      <h1 className={"ma-0 pa-0 mb-10"}>글 검색</h1>
      <p className={"ma-0 pa-0"}>
        총 <strong>{count}</strong>개의 글이 있으며,
        <br />
        제목을 기준으로 검색하거나 태그 버튼들을 눌러 해당 태그가 달려있는 글만
        필터링 할 수 있습니다.
      </p>
    </div>
  )
}

export default AboutPosts
