import { navigate } from "gatsby"
import React from "react"
import FloatingButton from "./floating-button"
import MDIcon from "./md-icon"

const QuickNavigationButton = ({ isHome = false }) => {
  return (
    <FloatingButton top={"1rem"} left={"1rem"}>
      <div className="row">
        <div
          className={"btn btn-round btn-transparent mr-10"}
          onClick={() => navigate(-1)}
          onKeyDown={() => navigate(-1)}
        >
          <div
            className={
              "nav-back-btn col justify-content-center align-items-center"
            }
          >
            <MDIcon iconName={"chevron-left"} />
          </div>
        </div>
        {!isHome && (
          <div
            className="btn btn-round btn-transparent"
            onClick={() => navigate("/")}
            onKeyDown={() => navigate("/")}
          >
            <div
              className={
                "nav-home-btn col justify-content-center align-items-center"
              }
            >
              <MDIcon iconName={"home-outline"} />
            </div>
          </div>
        )}
      </div>
    </FloatingButton>
  )
}

export default QuickNavigationButton
