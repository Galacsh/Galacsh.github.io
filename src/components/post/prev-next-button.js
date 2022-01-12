import { navigate } from "gatsby"
import React from "react"

const PrevNextButton = ({ prev, next }) => {
  return (
    <div className="mx-10 pb-65 row align-items-center justify-content-between">
      {prev != null ? <PrevButton prev={prev} /> : <PlaceHolder />}
      {next != null ? <NextButton next={next} /> : <PlaceHolder />}
    </div>
  )
}

const PrevButton = ({ prev }) => (
  <div className={"mr-05 post-prev-btn"}>
    <div className={"type"}>Previous</div>
    <div>
      <span
        onClick={() => navigate("/post/" + prev.slug)}
        onKeyDown={() => navigate("/post/" + prev.slug)}
        className={"title"}
      >
        {prev.frontmatter?.title}
      </span>
    </div>
  </div>
)
const NextButton = ({ next }) => (
  <div className={"ml-05 post-next-btn"}>
    <div className={"type"}>Next</div>
    <div>
      <span
        onClick={() => navigate("/post/" + next.slug)}
        onKeyDown={() => navigate("/post/" + next.slug)}
        className={"title"}
      >
        {next?.frontmatter?.title}
      </span>
    </div>
  </div>
)
const PlaceHolder = () => <div />

export default PrevNextButton
