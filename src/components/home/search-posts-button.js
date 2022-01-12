import { navigate } from "gatsby"
import React from "react"
import MDIcon from "../common/md-icon"

const SearchPostsButton = () => {
  return (
    <div className="row justify-content-center mb-50 mx-10">
      <div
        className="px-10 py-05 btn btn-round btn-primary font-500 row align-items-center"
        onClick={() => navigate("/search")}
        onKeyDown={() => navigate("/search")}
      >
        Search Posts
        <MDIcon iconName="arrow-right" className="text-15 ml-05" />
      </div>
    </div>
  )
}

export default SearchPostsButton
