import React from "react"
import MDIcon from "../common/md-icon"

const TagItem = ({ tag }) => <span className="post-tag mr-10">{tag}</span>

const TagList = ({ tags }) => {
  return tags.map(tag => <TagItem tag={tag} />)
}

const PostMeta = ({ meta }) => {
  return (
    <div className="post-meta ma-0 mb-100 pt-100">
      <h1 className="post-title mt-0 mb-20 mx-10 text-30">{meta?.title}</h1>
      {meta?.thumbnail && (
        <img
          className="thumbnail-img mb-10"
          src={meta?.thumbnail.publicURL}
          alt={"Thumbnail of this post"}
        />
      )}
      <div className="post-date mx-10 mb-10">
        <MDIcon
          iconName={"calendar-month-outline"}
          className={"mr-05 text-08"}
        />
        <span className={"text-08"}>{meta?.date}</span>
      </div>
      <div className="post-tags mx-10">
        {meta?.tags != null && meta.tags?.length > 0 ? (
          <TagList tags={meta.tags} />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default PostMeta
