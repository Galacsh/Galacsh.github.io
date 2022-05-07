import * as React from "react"

import Seo from "../components/common/seo"

const NotFoundPage = () => (
  <>
    <Seo title="페이지를 찾을 수 없습니다." />
    <h1
      style={{
        color: "#fff",
        textAlign: "center",
      }}
    >
      404
    </h1>
    <p
      style={{
        textAlign: "center",
      }}
    >
      페이지를 찾을 수 없습니다.
    </p>
  </>
)

export default NotFoundPage
